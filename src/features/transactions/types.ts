import { BaseResponse } from '@/features/users/types';

export interface TransactionAccount {
  _id: string;
  accountNumber: string;
}

export interface TransactionUser {
  _id: string;
  name: string;
  role: string;
}

export interface Transaction {
  _id: string;
  account: TransactionAccount;
  type: string;
  amount: number;
  description: string;
  status: string;
  performedBy: TransactionUser;
  date: string;
  __v: number;
  createdAt?: string;
  updatedAt?: string;
  reference?: string;
}

export interface TransactionsResponse extends BaseResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TransactionsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}
