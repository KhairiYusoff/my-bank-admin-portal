import { api } from "@/app/store/apiSlice";
import type { DashboardSummaryResponse } from "@/features/dashboard/types";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummaryResponse, void>({
      query: () => ({ url: "/dashboard", method: "GET" }),
      providesTags: ["Dashboard"],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
