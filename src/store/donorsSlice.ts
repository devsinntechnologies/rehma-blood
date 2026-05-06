import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import type { RootState } from "@/store/store";

export type Donor = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  userId: number | null;
  bloodGroup: string;
  passwordHash: string | null;
  isActive: boolean;
  isAvailable: boolean;
  availabilityStatus: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  cnic: string | null;
  profileImage: string | null;
  lastDonationDate: string | null;
  medicalNotes: string | null;
  totalDonations: number;
  promoCode: string | null;
  isClaimed: boolean;
  isVerifiedAccount: boolean;
  createdByUserId: number;
  claimedByUserId: number | null;
  linkedUserId: number | null;
  promoCodeExpiresAt: string | null;
  claimStatus: string;
  createdAt: string;
  updatedAt: string;
};

type DonorsState = {
  items: Donor[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedDonor: Donor | null;
  selectedStatus: "idle" | "loading" | "succeeded" | "failed";
  selectedError: string | null;
};

type ApiError = {
  message?: string;
};

const initialState: DonorsState = {
  items: [],
  status: "idle",
  error: null,
  selectedDonor: null,
  selectedStatus: "idle",
  selectedError: null,
};

export const fetchDonors = createAsyncThunk<Donor[], void, { state: RootState; rejectValue: string }>(
  "donors/fetchDonors",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;

    if (!token) {
      return rejectWithValue("Please sign in to view donors.");
    }

    try {
      const response = await fetch(`${BASE_URL}/donors`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = (raw && (raw.data ?? raw)) as Donor[] | ApiError;

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load donors.";
        return rejectWithValue(errMessage);
      }

      return payload as Donor[];
    } catch {
      return rejectWithValue("Unable to reach the donor service.");
    }
  }
);

export const fetchDonorById = createAsyncThunk<Donor, number, { state: RootState; rejectValue: string }>(
  "donors/fetchDonorById",
  async (donorId, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;

    if (!token) {
      return rejectWithValue("Please sign in to view donor details.");
    }

    try {
      const response = await fetch(`${BASE_URL}/donors/${donorId}`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = (raw && (raw.data ?? raw)) as Donor | ApiError;

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load donor details.";
        return rejectWithValue(errMessage);
      }

      return payload as Donor;
    } catch {
      return rejectWithValue("Unable to reach the donor details service.");
    }
  }
);

const donorsSlice = createSlice({
  name: "donors",
  initialState,
  reducers: {
    clearSelectedDonorDetails(state) {
      state.selectedDonor = null;
      state.selectedStatus = "idle";
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonors.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchDonors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load donors.";
      })
      .addCase(fetchDonorById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchDonorById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selectedDonor = action.payload;
        state.selectedError = null;
      })
      .addCase(fetchDonorById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload ?? "Unable to load donor details.";
      });
  },
});

export const { clearSelectedDonorDetails } = donorsSlice.actions;
export default donorsSlice.reducer;