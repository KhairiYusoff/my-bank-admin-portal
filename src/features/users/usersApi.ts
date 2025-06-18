import { api } from '../api/apiSlice';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<any[], void>({
      query: () => ({
        url: '/users/customers',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllCustomersQuery } = usersApi;
