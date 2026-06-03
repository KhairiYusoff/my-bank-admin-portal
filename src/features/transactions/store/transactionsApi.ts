import { api } from "@/app/store/apiSlice";
import type {
  TransactionsResponse,
  TransactionsQueryParams,
  TransactionDetailResponse,
} from "@/features/transactions/types";

export interface AccountTransactionsQueryParams {
  accountNumber: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query<
      TransactionsResponse,
      TransactionsQueryParams
    >({
      query: (params: TransactionsQueryParams) => ({
        url: "/transactions/all",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          sort: params.sort || "desc",
          ...(params.status && { status: params.status }),
          ...(params.type && { type: params.type }),
        },
      }),
      providesTags: ["Transactions"],
    }),
    getAccountTransactions: builder.query<
      TransactionsResponse,
      AccountTransactionsQueryParams
    >({
      query: ({ accountNumber, page = 1, limit = 10, sort = "desc" }) => ({
        url: `/transactions/account/${accountNumber}`,
        method: "GET",
        params: { page, limit, sort },
      }),
      providesTags: (_result, _error, { accountNumber }) => [
        { type: "Transactions", id: accountNumber },
      ],
    }),
    getTransactionDetails: builder.query<TransactionDetailResponse, string>({
      query: (transactionId: string) => ({
        url: `/transactions/${transactionId}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTransactionsQuery,
  useGetAccountTransactionsQuery,
  useGetTransactionDetailsQuery,
} = transactionsApi;
