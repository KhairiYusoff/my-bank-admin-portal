import { api } from '@/app/store/apiSlice';
import type { StaffListResponse, CreateStaffRequest, CreateStaffResponse } from '@/features/admin/store/adminApi';

export const staffApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStaffMembers: builder.query<StaffListResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: '/users/staff',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Staff'],
    }),
    createStaff: builder.mutation<CreateStaffResponse, CreateStaffRequest>({
      query: (staffData: CreateStaffRequest) => ({
        url: '/admin/create-staff',
        method: 'POST',
        body: staffData,
      }),
      invalidatesTags: ['Staff'],
    }),
    // Future endpoints (updateStaff, deleteStaff, etc.) can be added here
  }),
  overrideExisting: false,
});

export const { useGetStaffMembersQuery, useCreateStaffMutation } = staffApi;
