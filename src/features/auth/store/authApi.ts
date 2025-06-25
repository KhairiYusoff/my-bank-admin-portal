import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/app/store';
import type { Activity } from '@/features/admin/types/activity';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ChangePasswordRequest,
  UserProfile,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  ApiResponse,
} from '../types';

// Create base query with credentials for cookie-based auth
const baseQuery = fetchBaseQuery({
  baseUrl: '/api', // Using Vite proxy
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // No need to set Authorization header for login request
    // as we're using HTTP-only cookies
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['Auth', 'UserProfile', 'UserActivity'],
});

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      })
    }),

    // Logout user
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Get current user profile
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/users/me',
      providesTags: (result) => 
        result ? [{ type: 'UserProfile', id: 'CURRENT' }] : [],
    }),

    // Update user profile
    updateProfile: builder.mutation<ApiResponse<UserProfile>, UpdateProfileRequest>({
      query: (profileData) => ({
        url: '/users/me',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'CURRENT' }],
    }),

    // Update user preferences
    updatePreferences: builder.mutation<ApiResponse<UserProfile>, UpdatePreferencesRequest>({
      query: (preferences) => ({
        url: '/users/me/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'CURRENT' }],
    }),

    // Change user password
    changePassword: builder.mutation<ApiResponse<{ success: boolean }>, Omit<ChangePasswordRequest, 'confirmNewPassword'>>({
      query: (passwords) => ({
        url: '/users/me/password',
        method: 'PUT',
        body: {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
      }),
    }),

    // Get recent user activity
    getRecentActivity: builder.query<ApiResponse<Activity[]>, { limit?: number }>({
      query: ({ limit = 1 }) => ({
        url: '/users/me/activity',
        params: { limit },
      }),
      providesTags: (result) => 
        result?.data?.map(({ _id }) => ({ type: 'UserActivity' as const, id: _id })) || [],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useLoginMutation, 
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePreferencesMutation,
  useChangePasswordMutation,
  useGetRecentActivityQuery,
} = authApi;
