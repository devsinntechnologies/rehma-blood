import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import type { RootState } from "@/store/store";
import type { Donor } from "@/store/donorsSlice";
import type { ActiveBloodRequest } from "@/store/bloodRequestsSlice";

export type MapDonor = Donor & {
  distanceKm: number;
};

export type MapOverviewFilters = {
  bloodGroup: string | null;
  radiusKm: number | null;
};

type MapState = {
  currentLocation: {
    latitude: number | null;
    longitude: number | null;
  };
  donors: MapDonor[];
  requests: ActiveBloodRequest[];
  filters: MapOverviewFilters;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  geolocationError: string | null;
};

type ApiError = {
  message?: string;
};

const initialState: MapState = {
  currentLocation: {
    latitude: null,
    longitude: null,
  },
  donors: [],
  requests: [],
  filters: {
    bloodGroup: null,
    radiusKm: 25,
  },
  status: "idle",
  error: null,
  geolocationError: null,
};

export const fetchMapOverview = createAsyncThunk<
  {
    currentLocation: { latitude: number; longitude: number };
    donors: MapDonor[];
    requests: ActiveBloodRequest[];
  },
  { latitude: number; longitude: number; bloodGroup?: string | null; radiusKm?: number | null },
  { state: RootState; rejectValue: string }
>(
  "map/fetchMapOverview",
  async (
    { latitude, longitude, bloodGroup, radiusKm },
    { getState, rejectWithValue }
  ) => {
    const { auth } = getState();
    const accessToken = auth.accessToken;

    if (!accessToken) {
      return rejectWithValue("Not authenticated");
    }

    try {
      const params = new URLSearchParams();
      params.append("latitude", latitude.toString());
      params.append("longitude", longitude.toString());
      if (bloodGroup) {
        params.append("bloodGroup", bloodGroup);
      }
      if (radiusKm) {
        params.append("radiusKm", radiusKm.toString());
      }

      const response = await fetch(
        `${BASE_URL}/map/overview?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle 304 Not Modified - return cached data from state
      if (response.status === 304) {
        const { map } = getState();
        return {
          currentLocation: map.currentLocation,
          donors: map.donors,
          requests: map.requests,
        };
      }

      if (!response.ok) {
        throw new Error("Failed to fetch map overview");
      }

      const raw: any = await response.json();
      const payload = raw && (raw.data ?? raw);

      return {
        currentLocation: payload.currentLocation,
        donors: payload.donors,
        requests: payload.requests,
      };
    } catch (error) {
      const message = (error as ApiError).message || "Failed to fetch map overview";
      return rejectWithValue(message);
    }
  }
);

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setBloodGroupFilter(state, action) {
      state.filters.bloodGroup = action.payload;
    },
    setRadiusFilter(state, action) {
      state.filters.radiusKm = action.payload;
    },
    clearFilters(state) {
      state.filters = {
        bloodGroup: null,
        radiusKm: 25,
      };
    },
    setGeolocationError(state, action) {
      state.geolocationError = action.payload;
    },
    setCurrentLocation(state, action) {
      state.currentLocation = action.payload;
      state.geolocationError = null;
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
        state.currentLocation = action.payload.currentLocation;
        state.donors = action.payload.donors;
        state.requests = action.payload.requests;
        state.error = null;
      })
      .addCase(fetchMapOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch map overview";
      });
  },
});

export const {
  setBloodGroupFilter,
  setRadiusFilter,
  clearFilters,
  setGeolocationError,
  setCurrentLocation,
} = mapSlice.actions;

export const selectMapDonors = (state: RootState) => state.map.donors;
export const selectMapRequests = (state: RootState) => state.map.requests;
export const selectMapCurrentLocation = (state: RootState) => state.map.currentLocation;
export const selectMapFilters = (state: RootState) => state.map.filters;
export const selectMapStatus = (state: RootState) => state.map.status;
export const selectMapError = (state: RootState) => state.map.error;
export const selectGeolocationError = (state: RootState) => state.map.geolocationError;

export default mapSlice.reducer;
