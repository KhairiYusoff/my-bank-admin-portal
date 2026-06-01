import { api } from "@/app/store/apiSlice";
import type {
  UsersResponse,
  UsersQueryParams,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  DeleteCustomerResponse,
  GetCustomerByIdResponse,
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
      invalidatesTags: (result, error, { customerId }) => [
        "User",
        { type: "User", id: customerId },
      ],
    }),
    deleteCustomer: builder.mutation<DeleteCustomerResponse, string>({
      query: (customerId: string) => ({
        url: `/admin/customer/${customerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getCustomerById: builder.query<GetCustomerByIdResponse, string>({
      query: (id) => ({ url: `/admin/customer/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCustomersQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerByIdQuery,
} = usersApi;
