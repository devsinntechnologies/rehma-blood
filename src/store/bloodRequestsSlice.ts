import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import type { RootState } from "@/store/store";

export type ActiveBloodRequest = {
  id: number;
  requesterUserId: number | null;
  requesterName: string;
  requesterContact: string | null;
  bloodGroup: string;
  requiredUnits: number;
  urgency: string;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  acceptedByDonorId: number | null;
  acceptedByDonorName: string | null;
  acceptedAt: string | null;
  completedAt: string | null;
  fulfilledByDonorId: number | null;
  fulfilledByDonorName: string | null;
  createdAt: string;
  updatedAt: string;
};

type BloodRequestsState = {
  allItems: ActiveBloodRequest[];
  activeItems: ActiveBloodRequest[];
  urgentItems: ActiveBloodRequest[];
  allStatus: "idle" | "loading" | "succeeded" | "failed";
  activeStatus: "idle" | "loading" | "succeeded" | "failed";
  urgentStatus: "idle" | "loading" | "succeeded" | "failed";
  allError: string | null;
  activeError: string | null;
  urgentError: string | null;
};

type ApiError = {
  message?: string;
};

const initialState: BloodRequestsState = {
  allItems: [],
  activeItems: [],
  urgentItems: [],
  allStatus: "idle",
  activeStatus: "idle",
  urgentStatus: "idle",
  allError: null,
  activeError: null,
  urgentError: null,
};

const fetchBloodRequestsByPath = async (
  path: string,
  token: string,
  fallbackError: string,
  rejectWithValue: (value: string) => any
) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const raw: any = await response.json();
    const payload = (raw && (raw.data ?? raw)) as ActiveBloodRequest[] | ApiError;

    if (!response.ok) {
      const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? fallbackError;
      return rejectWithValue(errMessage);
    }

    return payload as ActiveBloodRequest[];
  } catch {
    return rejectWithValue("Unable to reach the blood requests service.");
  }
};

export const fetchAllBloodRequests = createAsyncThunk<
  ActiveBloodRequest[],
  void,
  { state: RootState; rejectValue: string }
>("bloodRequests/fetchAllBloodRequests", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;

  if (!token) {
    return rejectWithValue("Please sign in to view blood requests.");
  }

  return fetchBloodRequestsByPath(
    "/blood-requests",
    token,
    "Unable to load blood requests.",
    rejectWithValue
  );
});

export const fetchActiveBloodRequests = createAsyncThunk<
  ActiveBloodRequest[],
  void,
  { state: RootState; rejectValue: string }
>("bloodRequests/fetchActiveBloodRequests", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;

  if (!token) {
    return rejectWithValue("Please sign in to view blood requests.");
  }

  return fetchBloodRequestsByPath(
    "/blood-requests/active",
    token,
    "Unable to load blood requests.",
    rejectWithValue
  );
});

export const fetchUrgentBloodRequests = createAsyncThunk<
  ActiveBloodRequest[],
  void,
  { state: RootState; rejectValue: string }
>("bloodRequests/fetchUrgentBloodRequests", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;

  if (!token) {
    return rejectWithValue("Please sign in to view blood requests.");
  }

  return fetchBloodRequestsByPath(
    "/blood-requests/urgent",
    token,
    "Unable to load urgent blood requests.",
    rejectWithValue
  );
});

const bloodRequestsSlice = createSlice({
  name: "bloodRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBloodRequests.pending, (state) => {
        state.allStatus = "loading";
        state.allError = null;
      })
      .addCase(fetchAllBloodRequests.fulfilled, (state, action) => {
        state.allStatus = "succeeded";
        state.allItems = action.payload;
        state.allError = null;
      })
      .addCase(fetchAllBloodRequests.rejected, (state, action) => {
        state.allStatus = "failed";
        state.allError = action.payload ?? "Unable to load blood requests.";
      })
      .addCase(fetchActiveBloodRequests.pending, (state) => {
        state.activeStatus = "loading";
        state.activeError = null;
      })
      .addCase(fetchActiveBloodRequests.fulfilled, (state, action) => {
        state.activeStatus = "succeeded";
        state.activeItems = action.payload;
        state.activeError = null;
      })
      .addCase(fetchActiveBloodRequests.rejected, (state, action) => {
        state.activeStatus = "failed";
        state.activeError = action.payload ?? "Unable to load blood requests.";
      })
      .addCase(fetchUrgentBloodRequests.pending, (state) => {
        state.urgentStatus = "loading";
        state.urgentError = null;
      })
      .addCase(fetchUrgentBloodRequests.fulfilled, (state, action) => {
        state.urgentStatus = "succeeded";
        state.urgentItems = action.payload;
        state.urgentError = null;
      })
      .addCase(fetchUrgentBloodRequests.rejected, (state, action) => {
        state.urgentStatus = "failed";
        state.urgentError = action.payload ?? "Unable to load urgent blood requests.";
      });
  },
});

export default bloodRequestsSlice.reducer;
