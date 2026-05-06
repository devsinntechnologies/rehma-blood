import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "@/contant";
import type { RootState } from "@/store/store";

export type NotificationMetadata = Record<string, unknown>;

export type NotificationItem = {
  id: number;
  recipientRole: string;
  recipientUserId: number;
  type: string;
  title: string;
  message: string;
  entityType: string | null;
  entityId: number | null;
  metadata: NotificationMetadata | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type NotificationsState = {
  items: NotificationItem[];
  unreadCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  countStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  countError: string | null;
};

type ApiError = {
  message?: string;
};

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  status: "idle",
  countStatus: "idle",
  error: null,
  countError: null,
};

const getAuthToken = (state: RootState) => state.auth.accessToken;

const unwrapResponse = <T,>(raw: any): T => (raw && (raw.data ?? raw)) as T;

export const fetchNotifications = createAsyncThunk<NotificationItem[], void, { state: RootState; rejectValue: string }>(
  "notifications/fetchNotifications",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());

    if (!token) {
      return rejectWithValue("Please sign in to view notifications.");
    }

    try {
      const response = await fetch(`${BASE_URL}/notifications`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = unwrapResponse<NotificationItem[] | ApiError>(raw);

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load notifications.";
        return rejectWithValue(errMessage);
      }

      return payload as NotificationItem[];
    } catch {
      return rejectWithValue("Unable to reach the notifications service.");
    }
  }
);

export const fetchUnreadCount = createAsyncThunk<number, void, { state: RootState; rejectValue: string }>(
  "notifications/fetchUnreadCount",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());

    if (!token) {
      return rejectWithValue("Please sign in to view notifications.");
    }

    try {
      const response = await fetch(`${BASE_URL}/notifications/unread-count`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = unwrapResponse<{ unreadCount: number } | ApiError>(raw);

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to load unread notification count.";
        return rejectWithValue(errMessage);
      }

      return (payload as { unreadCount: number }).unreadCount ?? 0;
    } catch {
      return rejectWithValue("Unable to reach the notifications service.");
    }
  }
);

export const markNotificationRead = createAsyncThunk<NotificationItem, number, { state: RootState; rejectValue: string }>(
  "notifications/markNotificationRead",
  async (notificationId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());

    if (!token) {
      return rejectWithValue("Please sign in to update notifications.");
    }

    try {
      const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = unwrapResponse<NotificationItem | ApiError>(raw);

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to mark notification as read.";
        return rejectWithValue(errMessage);
      }

      return payload as NotificationItem;
    } catch {
      return rejectWithValue("Unable to reach the notifications service.");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk<number, void, { state: RootState; rejectValue: string }>(
  "notifications/markAllNotificationsRead",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());

    if (!token) {
      return rejectWithValue("Please sign in to update notifications.");
    }

    try {
      const response = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw: any = await response.json();
      const payload = unwrapResponse<{ updatedCount: number } | ApiError>(raw);

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && (payload as ApiError).message) ?? "Unable to mark notifications as read.";
        return rejectWithValue(errMessage);
      }

      return (payload as { updatedCount: number }).updatedCount ?? 0;
    } catch {
      return rejectWithValue("Unable to reach the notifications service.");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    upsertNotification(state, action: PayloadAction<NotificationItem>) {
      const incoming = action.payload;
      const index = state.items.findIndex((item) => item.id === incoming.id);

      if (index >= 0) {
        const wasUnread = !state.items[index].isRead;
        state.items[index] = incoming;
        if (wasUnread && incoming.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      } else {
        state.items.unshift(incoming);
        if (!incoming.isRead) {
          state.unreadCount += 1;
        }
      }
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
      state.countStatus = "succeeded";
      state.countError = null;
    },
    clearNotificationErrors(state) {
      state.error = null;
      state.countError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load notifications.";
      })
      .addCase(fetchUnreadCount.pending, (state) => {
        state.countStatus = "loading";
        state.countError = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.countStatus = "succeeded";
        state.unreadCount = action.payload;
        state.countError = null;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.countStatus = "failed";
        state.countError = action.payload ?? "Unable to load unread notification count.";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);

        if (index >= 0) {
          const wasUnread = !state.items[index].isRead;
          state.items[index] = action.payload;
          if (wasUnread && action.payload.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt ?? new Date().toISOString(),
        }));
        state.unreadCount = 0;
      });
  },
});

export const { upsertNotification, setUnreadCount, clearNotificationErrors } = notificationsSlice.actions;
export default notificationsSlice.reducer;
