import { BaseResponse } from '@/features/users/types';

export interface AccountUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Account {
  _id: string;
  user: AccountUser | null;
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
  createdAt?: string;
  updatedAt?: string;
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
  sort?: 'asc' | 'desc';
  status?: string;
  type?: string;
}

export interface AirdropRequest {
  accountNumber: string;
  amount: number;
  description?: string;
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
