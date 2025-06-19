import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { refreshAccessToken } from './sessionUtils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  lastActivity: number | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  lastActivity: null,
};

// Async thunk for refreshing token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const success = await refreshAccessToken();
      if (!success) {
        return rejectWithValue('Failed to refresh token');
      }
      return { success: true };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.lastActivity = Date.now();
    },
    updateActivity: (state) => {
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.lastActivity = null;
      // Clear all cookies
      document.cookie.split(';').forEach(c => {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      });
      // Redirect to login
      window.location.href = '/login';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.fulfilled, (state) => {
        state.lastActivity = Date.now();
      })
      .addCase(refreshToken.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.lastActivity = null;
        window.location.href = '/login';
      });
  },
});

export const { setCredentials, logout, updateActivity } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

export default authSlice.reducer;
