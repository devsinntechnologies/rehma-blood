import { combineReducers, configureStore, type UnknownAction } from "@reduxjs/toolkit";
import authReducer, { sessionExpired, signOut } from "@/store/authSlice";
import activityLogsReducer from "@/store/activityLogsSlice";
import bloodRequestsReducer from "@/store/bloodRequestsSlice";
import donorsReducer from "@/store/donorsSlice";
import notificationsReducer from "@/store/notificationsSlice";
import statsReducer from "@/store/statsSlice";
import donationsReducer from "@/store/donationsSlice";
import mapReducer from "@/store/mapSlice";

const appReducer = combineReducers({
  auth: authReducer,
  activityLogs: activityLogsReducer,
  bloodRequests: bloodRequestsReducer,
  donors: donorsReducer,
  notifications: notificationsReducer,
  stats: statsReducer,
  donations: donationsReducer,
  map: mapReducer,
});

export type RootState = ReturnType<typeof appReducer>;

// Signing out wipes every slice so the next admin on this browser never sees the previous session's data.
const rootReducer = (state: RootState | undefined, action: UnknownAction) =>
  appReducer(signOut.match(action) || sessionExpired.match(action) ? undefined : state, action);

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];