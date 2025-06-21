import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { refreshAccessToken } from '@/features/auth/store/sessionUtils';

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
    setCredentials: (state, action: PayloadAction<{ token?: string; user: any }>) => {
      if (action.payload.token) {
        state.token = action.payload.token;
      }
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
      
      // Clear any stored tokens (even though we use cookies, clean up just in case)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        // Clear all cookies (this will clear all cookies for the current domain)
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.split('=');
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
      }
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
