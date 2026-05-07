import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginJelyfin } from "../services/jellyfin/auth";
import { clearSession, loadSession, saveSession } from "../utils/session";
import { createJellyfinClient } from "../services/jellyfin/client";

export const login = createAsyncThunk(
  "auth/login",
  async (params: any) => {
    const data = await loginJelyfin(params);

    // MMKV is synchronous now
    saveSession(data);

    createJellyfinClient(data.serverUrl, data.token);

    return data;
  }
);

export const restoreSession = createAsyncThunk(
  "auth/restore",
  async () => {
    // No await needed
    const session = loadSession();

    if (!session) return null;

    createJellyfinClient(session.serverUrl, session.token);

    return session;
  }
);

interface AuthState {
  token: string | null;
  userid: string | null;
  serverUrl: string | null;
  status: "idle" | "loading" | "error";
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  userid: null,
  serverUrl: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.userid = action.payload.userid;
      state.serverUrl = action.payload.serverUrl;
      state.status = "idle";
      state.error = null;

      // Also persist manually if setCredentials used directly
      saveSession(action.payload);
    },
    logout(state) {
      state.token = null;
      state.userid = null;
      state.serverUrl = null;
      state.status = "idle";
      state.error = null;

      clearSession(); // sync now
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.token = action.payload.token;
        state.userid = action.payload.userid;
        state.serverUrl = action.payload.serverUrl;
        state.status = "idle";
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed to login";
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.userid = action.payload.userid;
          state.serverUrl = action.payload.serverUrl;
        }
        state.status = "idle";
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;