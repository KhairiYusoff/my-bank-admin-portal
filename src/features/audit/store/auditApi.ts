import { api } from "@/app/store/apiSlice";
import { AuditLogResponse, AuditLogParams } from "../types";

export const auditApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get current user activity
    getOwnAuditLogs: builder.query<AuditLogResponse, { limit?: number }>({
      query: (params) => ({
        url: "/audit/me",
        method: "GET",
        params,
      }),
      providesTags: ["UserActivity"],
    }),

    // Get specific user audit logs (Admin/Banker)
    getUserAuditLogs: builder.query<AuditLogResponse, AuditLogParams & { userId: string }>({
      query: ({ userId, ...params }) => ({
        url: `/audit/user/${userId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { userId }) => [
        { type: "UserActivity", id: userId },
      ],
    }),

    // Get all audit logs (Admin only)
    getAllAuditLogs: builder.query<AuditLogResponse, AuditLogParams>({
      query: (params) => ({
        url: "/audit/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "UserActivity" as const, id: _id })),
              { type: "UserActivity", id: "LIST" },
            ]
          : [{ type: "UserActivity", id: "LIST" }],
    }),
  }),
});

export const {
  useGetOwnAuditLogsQuery,
  useGetUserAuditLogsQuery,
  useGetAllAuditLogsQuery,
} = auditApi;
