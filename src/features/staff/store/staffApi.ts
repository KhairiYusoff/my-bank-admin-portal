import { api } from "@/app/store/apiSlice";
import type {
  StaffListResponse,
  CreateStaffRequest,
  CreateStaffResponse,
  UpdateStaffRequest,
  UpdateStaffResponse,
  DeleteStaffResponse,
  GetStaffByIdResponse,
} from "@/features/staff/types";

export const staffApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStaffMembers: builder.query<
      StaffListResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "/users/staff",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Staff"],
    }),
    createStaff: builder.mutation<CreateStaffResponse, CreateStaffRequest>({
      query: (staffData: CreateStaffRequest) => ({
        url: "/admin/create-staff",
        method: "POST",
        body: staffData,
      }),
      invalidatesTags: ["Staff"],
    }),
    updateStaff: builder.mutation<
      UpdateStaffResponse,
      { staffId: string; body: UpdateStaffRequest }
    >({
      query: ({ staffId, body }) => ({
        url: `/admin/staff/${staffId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
    deleteStaff: builder.mutation<DeleteStaffResponse, string>({
      query: (staffId: string) => ({
        url: `/admin/staff/${staffId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
    getStaffById: builder.query<GetStaffByIdResponse, string>({
      query: (id) => ({ url: `/admin/staff/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Staff", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStaffMembersQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffByIdQuery,
} = staffApi;
