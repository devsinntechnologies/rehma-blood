import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import type { RootState } from "@/store/store";

export type ActivityLog = {
  id: number;
  method: string;
  endpoint: string;
  userId: number | null;
  userEmail: string | null;
  userRole: string | null;
  requestBody: string | null;
  responseBody: string | null;
  statusCode: number;
  ipAddress: string | null;
  userAgent: string | null;
  duration: number;
  errorMessage: string | null;
  createdAt: string;
};

export type ActivityLogsPagination = {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
};

export type ActivityLogsQuery = {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  method?: string;
  endpoint?: string;
  statusCode?: string;
};

export type ActivityLogsStatisticsMethod = {
  method: string;
  count: number;
};

export type ActivityLogsStatisticsStatus = {
  statusCode: number;
  count: number;
};

export type ActivityLogsStatisticsEndpoint = {
  endpoint: string;
  count: number;
};

export type ActivityLogsStatistics = {
  totalRequests: number;
  requestsByMethod: ActivityLogsStatisticsMethod[];
  requestsByStatus: ActivityLogsStatisticsStatus[];
  topEndpoints: ActivityLogsStatisticsEndpoint[];
  avgResponseTime: number;
};

export type ActivityLogDetail = ActivityLog;

type ActivityLogsState = {
  items: ActivityLog[];
  pagination: ActivityLogsPagination;
  statistics: ActivityLogsStatistics | null;
  selectedLog: ActivityLogDetail | null;
  selectedLogId: number | null;
  selectedLogOpen: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  statisticsStatus: "idle" | "loading" | "succeeded" | "failed";
  selectedLogStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  statisticsError: string | null;
  selectedLogError: string | null;
};

type ActivityLogsResponse = {
  data: ActivityLog[];
  pagination: ActivityLogsPagination;
};

type ApiError = {
  message?: string;
};

const initialState: ActivityLogsState = {
  items: [],
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    page: 1,
    totalPages: 0,
  },
  statistics: null,
  selectedLog: null,
  selectedLogId: null,
  selectedLogOpen: false,
  status: "idle",
  statisticsStatus: "idle",
  selectedLogStatus: "idle",
  error: null,
  statisticsError: null,
  selectedLogError: null,
};

const unwrapResponse = <T,>(raw: any): T => (raw && (raw.data ?? raw)) as T;

export const fetchActivityLogs = createAsyncThunk<
  ActivityLogsResponse,
  Partial<ActivityLogsQuery> | void,
  { state: RootState; rejectValue: string }
>("activityLogs/fetchActivityLogs", async (query = {}, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;

  if (!token) {
    return rejectWithValue("Please sign in to view activity logs.");
  }

  const filters = (query ?? {}) as Partial<ActivityLogsQuery>;
  const page = Math.max(1, Number(filters.page ?? 1) || 1);
  const limit = Math.max(1, Number(filters.limit ?? 20) || 20);
  const startDate = filters.startDate?.trim();
  const endDate = filters.endDate?.trim();
  const method = filters.method?.trim();
  const endpoint = filters.endpoint?.trim();
  const statusCode = filters.statusCode?.trim();

  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    if (method) {
      params.set("method", method);
    }

    if (endpoint) {
      params.set("endpoint", endpoint);
    }

    if (statusCode) {
      params.set("statusCode", statusCode);
    }

    const response = await fetch(`${BASE_URL}/activity-logs?${params.toString()}`, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const raw: any = await response.json();
    const payload = unwrapResponse<ActivityLogsResponse | ApiError>(raw);

    if (!response.ok) {
      const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load activity logs.";
      return rejectWithValue(errMessage);
    }

    return payload as ActivityLogsResponse;
  } catch {
    return rejectWithValue("Unable to reach the activity logs service.");
  }
});

export const fetchActivityLogsStatistics = createAsyncThunk<
  ActivityLogsStatistics,
  void,
  { state: RootState; rejectValue: string }
>("activityLogs/fetchActivityLogsStatistics", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;

  if (!token) {
    return rejectWithValue("Please sign in to view activity log statistics.");
  }

  try {
    const response = await fetch(`${BASE_URL}/activity-logs/statistics`, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const raw: any = await response.json();
    const payload = unwrapResponse<ActivityLogsStatistics | ApiError>(raw);

    if (!response.ok) {
      const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load activity log statistics.";
      return rejectWithValue(errMessage);
    }

    return payload as ActivityLogsStatistics;
  } catch {
    return rejectWithValue("Unable to reach the activity log statistics service.");
  }
});

export const fetchActivityLogById = createAsyncThunk<
  ActivityLogDetail,
  number,
  { state: RootState; rejectValue: string }
>("activityLogs/fetchActivityLogById", async (logId, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;

  if (!token) {
    return rejectWithValue("Please sign in to view activity log details.");
  }

  try {
    const response = await fetch(`${BASE_URL}/activity-logs/${logId}`, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const raw: any = await response.json();
    const payload = unwrapResponse<ActivityLogDetail | ApiError>(raw);

    if (!response.ok) {
      const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load activity log details.";
      return rejectWithValue(errMessage);
    }

    return payload as ActivityLogDetail;
  } catch {
    return rejectWithValue("Unable to reach the activity log details service.");
  }
});

const activityLogsSlice = createSlice({
  name: "activityLogs",
  initialState,
  reducers: {
    openSelectedActivityLog(state, action: { payload: number }) {
      state.selectedLogId = action.payload;
      state.selectedLogOpen = true;
      state.selectedLogStatus = "loading";
      state.selectedLogError = null;
      state.selectedLog = null;
    },
    clearSelectedActivityLog(state) {
      state.selectedLog = null;
      state.selectedLogId = null;
      state.selectedLogStatus = "idle";
      state.selectedLogError = null;
      state.selectedLogOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load activity logs.";
      })
      .addCase(fetchActivityLogsStatistics.pending, (state) => {
        state.statisticsStatus = "loading";
        state.statisticsError = null;
      })
      .addCase(fetchActivityLogsStatistics.fulfilled, (state, action) => {
        state.statisticsStatus = "succeeded";
        state.statistics = action.payload;
        state.statisticsError = null;
      })
      .addCase(fetchActivityLogsStatistics.rejected, (state, action) => {
        state.statisticsStatus = "failed";
        state.statisticsError = action.payload ?? "Unable to load activity log statistics.";
      })
      .addCase(fetchActivityLogById.pending, (state, action) => {
        state.selectedLogOpen = true;
        state.selectedLogId = action.meta.arg;
        state.selectedLogStatus = "loading";
        state.selectedLogError = null;
        state.selectedLog = null;
      })
      .addCase(fetchActivityLogById.fulfilled, (state, action) => {
        state.selectedLogStatus = "succeeded";
        state.selectedLogId = action.payload.id;
        state.selectedLog = action.payload;
        state.selectedLogError = null;
      })
      .addCase(fetchActivityLogById.rejected, (state, action) => {
        state.selectedLogStatus = "failed";
        state.selectedLogError = action.payload ?? "Unable to load activity log details.";
      });
  },
});

export const { openSelectedActivityLog, clearSelectedActivityLog } = activityLogsSlice.actions;
export default activityLogsSlice.reducer;
