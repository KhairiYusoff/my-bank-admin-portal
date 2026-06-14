import { BaseResponse } from "@/features/users/types";

/** Statuses bankers may set via PATCH /accounts/:accountNumber/status */
export type AccountStatus = "active" | "dormant" | "suspended" | "closed";

export interface AccountUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

export interface Account {
  _id: string;
  user: AccountUser | null;
  accountNumber: string;
  accountType: string;
  branch: string;
  balance: number;
  interestRate?: number;
  currency: string;
  status: string;
  dateOpened: string;
  dateClosed?: string;
  overdraftLimit: number;
  minimumBalance: number;
  __v: number;
  createdAt?: string;
  updatedAt?: string;
  // Fixed Deposit fields
  lockPeriod?: number;
  maturityDate?: string;
  linkedAccount?: string;
  principal?: number;
  autoRenew?: boolean;
  // Business field
  companyRegistrationDoc?: string;
}

export interface AccountDetail extends Account {
  user: AccountUser | null;
}

export interface GetAccountByNumberResponse extends BaseResponse {
  data: AccountDetail;
}

export interface UpdateAccountStatusRequest {
  status: AccountStatus;
}

export interface UpdateAccountStatusResponse extends BaseResponse {
  data: AccountDetail;
}

export interface AccountsResponse extends BaseResponse {
  data: Account[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AccountsQueryParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  status?: string;
  type?: string;
}

export interface AirdropRequest {
  accountNumber: string;
  amount: number;
  memo?: string;
}

export interface AirdropResponse extends BaseResponse {
  data: {
    account: {
      _id: string;
      user: string;
      accountNumber: string;
      accountType: string;
      branch: string;
      balance: number;
      interestRate: number;
      currency: string;
      status: string;
      dateOpened: string;
      overdraftLimit: number;
      minimumBalance: number;
      __v: number;
    };
    transaction: {
      account: string;
      type: string;
      amount: number;
      description: string;
      status: string;
      performedBy: string;
      _id: string;
      date: string;
      __v: number;
    };
  };
}
