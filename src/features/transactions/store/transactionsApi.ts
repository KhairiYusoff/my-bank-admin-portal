import { api } from '@/app/store/apiSlice';
import type {
  TransactionsResponse,
  TransactionsQueryParams
} from '@/features/admin/store/adminApi';

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query<TransactionsResponse, TransactionsQueryParams>({
      query: (params: TransactionsQueryParams) => ({
        url: '/transactions/all',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          sort: params.sort || 'desc',
          ...(params.status && { status: params.status }),
          ...(params.type && { type: params.type }),
        },
      }),
      providesTags: ['Transactions'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllTransactionsQuery } = transactionsApi;
