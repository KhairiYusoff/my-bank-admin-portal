import { api } from '@/app/store/apiSlice';
import type {
  AccountsResponse,
  AccountsQueryParams,
  AirdropResponse,
  AirdropRequest
} from '@/features/admin/store/adminApi';

export const accountsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllAccounts: builder.query<AccountsResponse, AccountsQueryParams>({
      query: (params: AccountsQueryParams) => ({
        url: '/accounts/all',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          sort: params.sort || 'desc',
          ...(params.status && { status: params.status }),
          ...(params.type && { type: params.type }),
        },
      }),
      providesTags: ['Account'],
    }),
    airdrop: builder.mutation<AirdropResponse, AirdropRequest>({
      query: (airdropData: AirdropRequest) => ({
        url: '/accounts/airdrop',
        method: 'POST',
        body: airdropData,
      }),
      invalidatesTags: ['Account', 'Transactions'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllAccountsQuery,
  useAirdropMutation,
} = accountsApi;
