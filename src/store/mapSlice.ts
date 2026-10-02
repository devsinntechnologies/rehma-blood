import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";
import type { RootState } from "@/store/store";
import type { Donor } from "@/store/donorsSlice";

export type MapDonor = Donor & {
  distanceKm: number;
};

export type MapRequest = {
  id: number;
  requesterName: string | null;
  bloodGroup: string;
  urgency: string;
  requiredUnits: number;
  latitude: number;
  longitude: number;
  status: string;
  notes: string | null;
  createdAt?: string;
};

export type MapLayer = "all" | "donors" | "requests";

/** Geographic centre of Pakistan; with ALL_AREAS_RADIUS_KM it covers the whole country. */
export const PAKISTAN_CENTER = { latitude: 30.3753, longitude: 69.3451 };
export const ALL_AREAS_RADIUS_KM = 1500;

export type MapOverviewFilters = {
  bloodGroup: string | null;
  radiusKm: number;
  layer: MapLayer;
};

type MapState = {
  center: { latitude: number; longitude: number };
  centeredOnAdmin: boolean;
  donors: MapDonor[];
  requests: MapRequest[];
  filters: MapOverviewFilters;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  geolocationError: string | null;
};

const initialState: MapState = {
  center: PAKISTAN_CENTER,
  centeredOnAdmin: false,
  donors: [],
  requests: [],
  filters: {
    bloodGroup: null,
    radiusKm: ALL_AREAS_RADIUS_KM,
    layer: "all",
  },
  status: "idle",
  error: null,
  geolocationError: null,
};

export const fetchMapOverview = createAsyncThunk<
  { donors: MapDonor[]; requests: MapRequest[] },
  void,
  { state: RootState; rejectValue: string }
>("map/fetchMapOverview", async (_, { getState, rejectWithValue }) => {
  const { auth, map } = getState();
  if (!auth.accessToken) {
    return rejectWithValue("Not authenticated");
  }

  const params = new URLSearchParams({
    latitude: String(map.center.latitude),
    longitude: String(map.center.longitude),
    radiusKm: String(map.filters.radiusKm),
  });
  if (map.filters.bloodGroup) {
    params.append("bloodGroup", map.filters.bloodGroup);
  }

  try {
    const payload = await apiRequest<{ donors?: MapDonor[]; requests?: MapRequest[] }>(
      `/map/overview?${params.toString()}`,
      auth.accessToken
    );
    return { donors: payload.donors ?? [], requests: payload.requests ?? [] };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to load the map.");
  }
});

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setBloodGroupFilter(state, action: PayloadAction<string | null>) {
      state.filters.bloodGroup = action.payload;
    },
    setRadiusFilter(state, action: PayloadAction<number>) {
      state.filters.radiusKm = action.payload;
    },
    setLayerFilter(state, action: PayloadAction<MapLayer>) {
      state.filters.layer = action.payload;
    },
    setGeolocationError(state, action: PayloadAction<string | null>) {
      state.geolocationError = action.payload;
    },
    centerOnAdmin(state, action: PayloadAction<{ latitude: number; longitude: number }>) {
      state.center = action.payload;
      state.centeredOnAdmin = true;
      state.geolocationError = null;
      if (state.filters.radiusKm === ALL_AREAS_RADIUS_KM) {
        state.filters.radiusKm = 25;
      }
    },
    resetToAllAreas(state) {
      state.center = PAKISTAN_CENTER;
      state.centeredOnAdmin = false;
      state.filters.radiusKm = ALL_AREAS_RADIUS_KM;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapOverview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMapOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.donors = action.payload.donors;
        state.requests = action.payload.requests;
      })
      .addCase(fetchMapOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load the map.";
      });
  },
});

export const { setBloodGroupFilter, setRadiusFilter, setLayerFilter, setGeolocationError, centerOnAdmin, resetToAllAreas } =
  mapSlice.actions;

export default mapSlice.reducer;
