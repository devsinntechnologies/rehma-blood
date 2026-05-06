import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AUTH_STORAGE_KEY, BASE_URL } from "@/contant";

export type SuperAdmin = {
  id: number;
  email: string;
  fullName: string;
};

type AuthState = {
  accessToken: string | null;
  superAdmin: SuperAdmin | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken?: string;
  token?: string;
  superAdmin?: Partial<SuperAdmin> | null;
  user?: Partial<SuperAdmin> | null;
  message?: string;
};

type StoredAuth = Pick<AuthState, "accessToken" | "superAdmin">;

const initialStoredAuth = (): StoredAuth => {
  if (typeof window === "undefined") {
    return { accessToken: null, superAdmin: null };
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawValue) {
      return { accessToken: null, superAdmin: null };
    }

    const parsedValue = JSON.parse(rawValue) as StoredAuth;
    return {
      accessToken: parsedValue.accessToken ?? null,
      superAdmin: parsedValue.superAdmin ?? null,
    };
  } catch {
    return { accessToken: null, superAdmin: null };
  }
};

const persistAuth = (auth: StoredAuth) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

const clearPersistedAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const normalizeLoginResponse = (payload: LoginResponse): StoredAuth => {
  const accessToken = payload.accessToken ?? payload.token ?? null;
  const superAdminPayload = payload.superAdmin ?? payload.user ?? null;

  if (!accessToken || !superAdminPayload?.email) {
    throw new Error("Login response is missing the access token or user details.");
  }

  return {
    accessToken,
    superAdmin: {
      id: superAdminPayload.id ?? 0,
      email: superAdminPayload.email,
      fullName: superAdminPayload.fullName ?? "Super Admin",
    },
  };
};

export const loginAdmin = createAsyncThunk<StoredAuth, LoginCredentials, { rejectValue: string }>(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const raw: any = await response.json();
      const payload = (raw && (raw.data ?? raw)) as LoginResponse;

      if (!response.ok) {
        const errMessage = (raw && raw.message) ?? (payload && payload.message) ?? "Unable to sign in. Please check your credentials.";
        return rejectWithValue(errMessage);
      }

      return normalizeLoginResponse(payload);
    } catch {
      return rejectWithValue("Unable to reach the authentication server.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: (): AuthState => ({
    ...initialStoredAuth(),
    status: "idle",
    error: null,
  }),
  reducers: {
    signOut(state) {
      state.accessToken = null;
      state.superAdmin = null;
      state.status = "idle";
      state.error = null;
      clearPersistedAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.superAdmin = action.payload.superAdmin;
        state.error = null;
        persistAuth(action.payload);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed.";
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;