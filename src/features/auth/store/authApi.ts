import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/app/store';

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

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
  isProfileComplete: boolean;
  applicationStatus: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  details: string;
  status: string;
  severity: string;
  ipAddress: string;
  userAgent: string;
  metadata: {
    method: string;
    path: string;
    statusCode: number;
    responseTime: number;
  };
  location: Record<string, unknown>;
  deviceInfo: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
    [key: string]: any;
  };
}

// Types for update requests
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UpdatePreferencesRequest {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  timezone?: string;
  dateFormat?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{
      success: boolean;
      message: string;
      data: {
        user: UserProfile;
      };
      errors?: any;
    }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      })
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/users/me',
      providesTags: (result) => 
        result ? [{ type: 'UserProfile', id: 'CURRENT' }] : [],
    }),
    updateProfile: builder.mutation<ApiResponse<UserProfile>, UpdateProfileRequest>({
      query: (profileData) => ({
        url: '/users/me',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'CURRENT' }],
    }),
    updatePreferences: builder.mutation<ApiResponse<UserProfile>, UpdatePreferencesRequest>({
      query: (preferences) => ({
        url: '/users/me/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'CURRENT' }],
    }),
    changePassword: builder.mutation<ApiResponse<{ success: boolean }>, ChangePasswordRequest>({
      query: (passwords) => ({
        url: '/users/me/password',
        method: 'PUT',
        body: {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
      }),
    }),
    getRecentActivity: builder.query<ApiResponse<Activity[]>, { limit?: number }>({
      query: ({ limit = 1 }) => ({
        url: '/users/me/activity',
        params: { limit },
      }),
      providesTags: (result) => 
        result?.data?.map(({ id }) => ({ type: 'UserActivity' as const, id })) || [],
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
