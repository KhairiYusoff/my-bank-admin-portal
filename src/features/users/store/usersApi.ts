import { api } from '@/app/store/apiSlice';
import type {
  UsersResponse,
  UsersQueryParams
} from '@/features/admin/store/adminApi';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<UsersResponse, UsersQueryParams>({
      query: (params: UsersQueryParams) => ({
        url: '/users/customers',
        method: 'GET',
        params: {
          page: params.page,
          limit: params.limit,
          sort: params.sort,
        },
      }),
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllCustomersQuery } = usersApi;
