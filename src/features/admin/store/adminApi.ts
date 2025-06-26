import { api } from "@/app/store/apiSlice";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

// Import types from their respective feature modules
import type { BaseResponse } from "@/features/users/types";
import type {
  ActivityLogResponse,
  ActivityLogParams,
  PendingApplicationsResponse,
  PendingApplicationsQueryParams,
  ApplicationActionResponse,
} from "../types";

// Define tag types for cache invalidation
export const adminApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Activity Log
    getUserActivity: builder.query<ActivityLogResponse, ActivityLogParams>({
      query: ({ userId, ...params }) => ({
        url: `/users/activity/${userId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { userId }) => [
        { type: "UserActivity", id: userId },
      ],
    }),

    // Pending Applications
    getPendingApplications: builder.query<
      PendingApplicationsResponse,
      PendingApplicationsQueryParams
    >({
      query: (params) => ({
        url: "/admin/pending-applications",
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
        url: `/v2/admin/approve-application/${userId}`,
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
        url: `/v2/admin/verify-customer/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["PendingApplications"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUserActivityQuery,
  useGetPendingApplicationsQuery,
  useApproveApplicationMutation,
  useVerifyCustomerMutation,
} = adminApi;
