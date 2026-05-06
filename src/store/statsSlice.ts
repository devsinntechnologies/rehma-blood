import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import type { RootState } from "@/store/store";

export type Stats = {
  donors: number;
  bloodRequests: number;
  donations: number;
  activeRequests: number;
  urgentRequests: number;
  availableDonors: number;
};

type StatsState = {
  stats: Stats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

type ApiError = {
  message?: string;
};

const initialState: StatsState = {
  stats: null,
  status: "idle",
  error: null,
};

export const fetchStats = createAsyncThunk<Stats, void, { state: RootState; rejectValue: string }>(
  "stats/fetchStats",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;

    if (!token) {
      return rejectWithValue("Please sign in to view dashboard stats.");
    }

    try {
      const response = await fetch(`${BASE_URL}/superadmin/stats`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = (raw && (raw.data ?? raw)) as Stats | ApiError;

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load stats.";
        return rejectWithValue(errMessage);
      }

      return payload as Stats;
    } catch {
      return rejectWithValue("Unable to reach the stats service.");
    }
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load stats.";
      });
  },
});

export default statsSlice.reducer;
