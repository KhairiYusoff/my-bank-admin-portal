import { api } from '@/features/api/apiSlice';

// Define response types for better type safety
interface PendingApplication {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  created_at?: string;
}

interface PendingApplicationsResponse {
  success: boolean;
  message?: string;
  data?: PendingApplication[];
  errors?: any;
  meta?: any;
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPendingApplications: builder.query<PendingApplicationsResponse, void>({
      query: () => ({
        url: '/admin/pending-applications',
        method: 'GET',
        // The Authorization header is already being set in the baseQuery's prepareHeaders
      }),
    }),
    // Add other admin-related endpoints here as needed
  }),
});

export const { useGetPendingApplicationsQuery } = adminApi;
