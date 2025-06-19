import { api } from '@/features/api/apiSlice';

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
    login: builder.mutation<{ success: boolean; message: string; data: { user: any }; errors?: any; meta?: any }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/users/me',
      providesTags: ['UserProfile'],
    }),
    updateProfile: builder.mutation<ApiResponse<UserProfile>, UpdateProfileRequest>({
      query: (profileData) => ({
        url: '/users/me',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    updatePreferences: builder.mutation<ApiResponse<UserProfile>, UpdatePreferencesRequest>({
      query: (preferences) => ({
        url: '/users/me/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['UserProfile'],
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
      providesTags: ['UserActivity'],
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
