import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import { apiRequest } from "@/lib/api";
import type { RootState } from "@/store/store";

export type Donor = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  userId: number | null;
  bloodGroup: string;
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
  createdByUserId: number | null;
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

export const AVAILABILITY_STATUSES = ["Available", "Not Available", "Emergency Only", "Recently Donated"] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

type DonorAction =
  | { type: "setActive"; isActive: boolean }
  | { type: "setAvailability"; availabilityStatus: AvailabilityStatus }
  | { type: "regeneratePromo" }
  | { type: "disablePromo" };

/** Runs one admin action on a donor and resolves with the updated donor record. */
export const updateDonorAsAdmin = createAsyncThunk<
  Donor,
  { donorId: number; action: DonorAction },
  { state: RootState; rejectValue: string }
>("donors/updateDonorAsAdmin", async ({ donorId, action }, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;
  if (!token) return rejectWithValue("Please sign in again.");

  try {
    switch (action.type) {
      case "setActive":
        return await apiRequest<Donor>(`/donors/${donorId}`, token, { method: "PATCH", body: { isActive: action.isActive } });
      case "setAvailability":
        return (
          await apiRequest<{ donor: Donor }>(`/donors/${donorId}/availability-status`, token, {
            method: "PATCH",
            body: { availabilityStatus: action.availabilityStatus },
          })
        ).donor;
      case "regeneratePromo":
        return (await apiRequest<{ donor: Donor }>(`/donors/${donorId}/regenerate-promo`, token, { method: "PATCH" })).donor;
      case "disablePromo":
        return (await apiRequest<{ donor: Donor }>(`/donors/${donorId}/disable-promo`, token, { method: "PATCH" })).donor;
    }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Unable to update donor.");
  }
});

export const deleteDonorAsAdmin = createAsyncThunk<number, number, { state: RootState; rejectValue: string }>(
  "donors/deleteDonorAsAdmin",
  async (donorId, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    if (!token) return rejectWithValue("Please sign in again.");

    try {
      await apiRequest(`/donors/${donorId}`, token, { method: "DELETE" });
      return donorId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unable to delete donor.");
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
        // Keep showing the current list while a background refresh runs.
        if (state.items.length === 0) state.status = "loading";
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
      })
      .addCase(updateDonorAsAdmin.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((donor) => (donor.id === updated.id ? { ...donor, ...updated } : donor));
        if (state.selectedDonor?.id === updated.id) {
          state.selectedDonor = { ...state.selectedDonor, ...updated };
        }
      })
      .addCase(deleteDonorAsAdmin.fulfilled, (state, action) => {
        state.items = state.items.filter((donor) => donor.id !== action.payload);
        if (state.selectedDonor?.id === action.payload) {
          state.selectedDonor = null;
          state.selectedStatus = "idle";
        }
      });
  },
});

export const { clearSelectedDonorDetails } = donorsSlice.actions;
export default donorsSlice.reducer;