import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import type { RootState } from "@/store/store";

export type Donation = {
  id: number;
  donorName: string;
  bloodGroup: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type DonationsState = {
  items: Donation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

type ApiError = {
  message?: string;
};

const initialState: DonationsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchDonations = createAsyncThunk<Donation[], void, { state: RootState; rejectValue: string }>(
  "donations/fetchDonations",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;

    if (!token) {
      return rejectWithValue("Please sign in to view donations.");
    }

    try {
      const response = await fetch(`${BASE_URL}/blood-donations`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = (raw && (raw.data ?? raw)) as Donation[] | ApiError;

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load donations.";
        return rejectWithValue(errMessage);
      }

      return payload as Donation[];
    } catch {
      return rejectWithValue("Unable to reach the donations service.");
    }
  }
);

const donationsSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load donations.";
      });
  },
});

export default donationsSlice.reducer;
