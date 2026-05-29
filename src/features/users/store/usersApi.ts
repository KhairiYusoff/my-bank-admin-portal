import { api } from "@/app/store/apiSlice";
import type {
  UsersResponse,
  UsersQueryParams,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  DeleteCustomerResponse,
} from "@/features/users/types";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<UsersResponse, UsersQueryParams>({
      query: (params: UsersQueryParams) => ({
        url: "/users/customers",
        method: "GET",
        params: {
          page: params.page,
          limit: params.limit,
          sort: params.sort,
        },
      }),
      providesTags: ["User"],
    }),
    updateCustomer: builder.mutation<
      UpdateCustomerResponse,
      { customerId: string; body: UpdateCustomerRequest }
    >({
      query: ({ customerId, body }) => ({
        url: `/admin/customer/${customerId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteCustomer: builder.mutation<DeleteCustomerResponse, string>({
      query: (customerId: string) => ({
        url: `/admin/customer/${customerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCustomersQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = usersApi;
