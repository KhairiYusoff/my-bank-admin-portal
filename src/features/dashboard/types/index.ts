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

export interface DashboardSummary {
  counts: DashboardCounts;
  attention: DashboardAttention;
  financials: DashboardFinancials;
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
}
