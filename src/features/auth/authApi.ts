import { api } from '@/features/api/apiSlice';

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
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
