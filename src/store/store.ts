import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/authSlice";
import activityLogsReducer from "@/store/activityLogsSlice";
import bloodRequestsReducer from "@/store/bloodRequestsSlice";
import donorsReducer from "@/store/donorsSlice";
import notificationsReducer from "@/store/notificationsSlice";
import statsReducer from "@/store/statsSlice";
import donationsReducer from "@/store/donationsSlice";
import mapReducer from "@/store/mapSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      activityLogs: activityLogsReducer,
      bloodRequests: bloodRequestsReducer,
      donors: donorsReducer,
      notifications: notificationsReducer,
      stats: statsReducer,
      donations: donationsReducer,
      map: mapReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];