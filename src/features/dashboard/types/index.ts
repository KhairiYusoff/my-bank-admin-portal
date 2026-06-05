export interface DashboardCounts {
  customers: number;
  accounts: number;
  staff: number;
  transactionsToday: number;
}

export interface DashboardAttention {
  pendingApplications: number;
  failedTransactionsToday: number;
  dormantAccounts: number;
}

export interface DashboardFinancials {
  depositsToday: number;
  withdrawalsToday: number;
  totalPortfolioBalance: number;
}

export interface DashboardRecentApplication {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface DashboardRecentTransaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  direction?: "debit" | "credit";
  account?: { accountNumber: string };
}

export interface DashboardSummary {
  counts: DashboardCounts;
  attention: DashboardAttention;
  financials: DashboardFinancials;
  recentPendingApplications: DashboardRecentApplication[];
  recentTransactions: DashboardRecentTransaction[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
}
