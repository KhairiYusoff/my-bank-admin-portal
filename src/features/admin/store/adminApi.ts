import { api } from "@/app/store/apiSlice";

// Import types from their respective feature modules
import type {
  PendingApplicationsResponse,
  PendingApplicationsQueryParams,
  ApplicationActionResponse,
} from "../types";

// Define tag types for cache invalidation
export const adminApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Pending Applications
    getPendingApplications: builder.query<
      PendingApplicationsResponse,
      PendingApplicationsQueryParams
    >({
      query: (params) => ({
        url: "/onboarding/pending",
        method: "GET",
        params: {
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          order: params.order,
        },
      }),
      providesTags: ["PendingApplications"],
    }),

    // Approve Application
    approveApplication: builder.mutation<
      ApplicationActionResponse,
      { userId: string }
    >({
      query: ({ userId }: { userId: string }) => ({
        url: `/onboarding/approve/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["PendingApplications"],
    }),

    // Verify Customer
    verifyCustomer: builder.mutation<
      ApplicationActionResponse,
      { userId: string }
    >({
      query: ({ userId }: { userId: string }) => ({
        url: `/onboarding/verify/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["PendingApplications"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPendingApplicationsQuery,
  useApproveApplicationMutation,
  useVerifyCustomerMutation,
} = adminApi;
