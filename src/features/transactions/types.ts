import { BaseResponse } from "@/features/users/types";

export interface TransactionAccount {
  _id: string;
  accountNumber: string;
}

export interface TransactionUser {
  _id: string;
  name: string;
  role: string;
}

export interface TransactionDeviceInfo {
  ip?: string;
  userAgent?: string;
}

export interface TransactionProcessingTime {
  submittedAt?: string;
  completedAt?: string;
}

export interface Transaction {
  _id: string;
  account: TransactionAccount;
  type: string;
  direction?: "debit" | "credit";
  amount: number;
  description?: string;
  memo?: string;
  status: string;
  reference?: string;
  fee?: number;
  balanceBefore?: number;
  balanceAfter?: number;
  currency?: string;
  channel?: string;
  deviceInfo?: TransactionDeviceInfo;
  processingTime?: TransactionProcessingTime;
  counterpartAccount?: string;
  counterpartName?: string;
  counterpartNameRaw?: string;
  isNewRecipient?: boolean | null;
  twoFactorVerified?: boolean | null;
  riskFlags?: string[];
  isReversed?: boolean;
  reversalOf?: string | null;
  performedBy: TransactionUser;
  date: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface TransactionDetailResponse extends BaseResponse {
  data: Transaction;
}

export interface TransactionsQueryParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}
