import { api } from "@/app/store/apiSlice";
import { BaseResponse } from "@/features/users/types";
import type {
  AccountsResponse,
  AccountsQueryParams,
  AirdropResponse,
  AirdropRequest,
  GetAccountByNumberResponse,
  UpdateAccountStatusRequest,
  UpdateAccountStatusResponse,
  Account,
} from "@/features/accounts/types";

export interface ApproveAccountRequestParams {
  accountId: string;
}

export interface RejectAccountRequestParams {
  accountId: string;
  reason?: string;
}

export interface AccountRequestResponse extends BaseResponse {
  data: Account;
}

export const accountsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllAccounts: builder.query<AccountsResponse, AccountsQueryParams>({
      query: (params: AccountsQueryParams) => ({
        url: "/accounts/all",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          sort: params.sort || "desc",
          ...(params.status && { status: params.status }),
          ...(params.type && { type: params.type }),
        },
      }),
      providesTags: ["Account"],
    }),
    airdrop: builder.mutation<AirdropResponse, AirdropRequest>({
      query: (airdropData: AirdropRequest) => ({
        url: "/accounts/airdrop",
        method: "POST",
        body: airdropData,
      }),
      invalidatesTags: ["Account", "Transactions"],
    }),
    getAccountByNumber: builder.query<GetAccountByNumberResponse, string>({
      query: (accountNumber) => ({
        url: `/accounts/${accountNumber}/detail`,
        method: "GET",
      }),
      providesTags: (_result, _error, accountNumber) => [
        { type: "Account", id: accountNumber },
      ],
    }),
    updateAccountStatus: builder.mutation<
      UpdateAccountStatusResponse,
      { accountNumber: string } & UpdateAccountStatusRequest
    >({
      query: ({ accountNumber, status }) => ({
        url: `/accounts/${accountNumber}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { accountNumber }) => [
        { type: "Account", id: accountNumber },
        "Account",
      ],
    }),
    setOverdraftLimit: builder.mutation<
      { success: boolean; message: string; data: { accountNumber: string; overdraftLimit: number } },
      { accountNumber: string; overdraftLimit: number }
    >({
      query: ({ accountNumber, overdraftLimit }) => ({
        url: `/accounts/${accountNumber}/overdraft-limit`,
        method: "PATCH",
        body: { overdraftLimit },
      }),
      invalidatesTags: (_result, _error, { accountNumber }) => [
        { type: "Account", id: accountNumber },
        "Account",
      ],
    }),
    getPendingAccountRequests: builder.query<AccountsResponse, AccountsQueryParams>({
      query: (params: AccountsQueryParams) => ({
        url: "/accounts/account-requests",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          sort: params.sort || "desc",
        },
      }),
      providesTags: ["Account"],
    }),
    approveAccountRequest: builder.mutation<AccountRequestResponse, ApproveAccountRequestParams>({
      query: ({ accountId }) => ({
        url: `/accounts/account-requests/${accountId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Account"],
    }),
    rejectAccountRequest: builder.mutation<AccountRequestResponse, RejectAccountRequestParams>({
      query: ({ accountId, reason }) => ({
        url: `/accounts/account-requests/${accountId}/reject`,
        method: "POST",
        body: reason ? { reason } : {},
      }),
      invalidatesTags: ["Account"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllAccountsQuery,
  useAirdropMutation,
  useGetAccountByNumberQuery,
  useUpdateAccountStatusMutation,
  useSetOverdraftLimitMutation,
  useGetPendingAccountRequestsQuery,
  useApproveAccountRequestMutation,
  useRejectAccountRequestMutation,
} = accountsApi;
