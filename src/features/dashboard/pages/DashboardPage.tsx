import React from "react";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import {
  PeopleAlt as PeopleIcon,
  AccountBalance as AccountIcon,
  BadgeOutlined as StaffIcon,
  ReceiptLong as TxnIcon,
  TrendingUp as DepositIcon,
  TrendingDown as WithdrawIcon,
  Savings as PortfolioIcon,
  AssignmentLate as PendingIcon,
  ErrorOutline as FailedIcon,
  HourglassEmpty as DormantIcon,
} from "@mui/icons-material";
import { useAppSelector } from "@/app/store";
import { useGetDashboardSummaryQuery } from "@/features/dashboard/store/dashboardApi";
import KpiCard from "@/features/dashboard/components/KpiCard";
import FinancialCard from "@/features/dashboard/components/FinancialCard";
import AttentionCard from "@/features/dashboard/components/AttentionCard";

function getGreeting(name: string): string {
  const h = new Date().getHours();
  const prefix =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${prefix}, ${name}.`;
}

function formatCurrentDate(): string {
  return new Date().toLocaleDateString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const DashboardPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useGetDashboardSummaryQuery();

  const summary = data?.data;
  const { counts, attention, financials } = summary ?? {};

  const netFlow =
    financials != null
      ? financials.depositsToday - financials.withdrawalsToday
      : undefined;

  return (
    <Box sx={{ width: "calc(100vw - 288px)", pb: 8 }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* ── Header ── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 8,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {getGreeting(user?.name ?? "Admin")}
              </Typography>
              <Chip
                label={user?.role ?? "admin"}
                size="small"
                color="primary"
                sx={{ textTransform: "capitalize", fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatCurrentDate()}
            </Typography>
          </Box>

          {/* ── Row 1: KPI Cards ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(5, 1fr)",
              },
              gap: 3,
              mb: 5,
              height: 200,
            }}
          >
            <KpiCard
              label="Total Customers"
              count={counts?.customers}
              sublabel="Registered accounts"
              icon={<PeopleIcon />}
              iconColor="#1976d2"
              to="/users"
            />
            <KpiCard
              label="Pending Applications"
              count={attention?.pendingApplications}
              sublabel="Awaiting review"
              icon={<PendingIcon />}
              iconColor="#ed6c02"
              to="/pending-applications"
            />
            <KpiCard
              label="Total Accounts"
              count={counts?.accounts}
              sublabel="All account types"
              icon={<AccountIcon />}
              iconColor="#2e7d32"
              to="/accounts"
            />
            {user?.role !== "banker" && (
              <KpiCard
                label="Staff Members"
                count={counts?.staff}
                sublabel="Admins, bankers & auditors"
                icon={<StaffIcon />}
                iconColor="#ed6c02"
                to="/staff"
              />
            )}
            <KpiCard
              label="Transactions Today"
              count={counts?.transactionsToday}
              sublabel="All statuses"
              icon={<TxnIcon />}
              iconColor="#7b1fa2"
              to="/transactions"
            />
          </Box>

          {/* ── Row 2: Financial Snapshot ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
              gap: 3,
              mb: 3,
              height: 180,
            }}
          >
            <FinancialCard
              label="Deposits Today"
              value={financials?.depositsToday}
              sublabel="Completed deposits"
              icon={<DepositIcon />}
              accentColor="#2e7d32"
            />
            <FinancialCard
              label="Withdrawals Today"
              value={financials?.withdrawalsToday}
              sublabel="Completed withdrawals"
              icon={<WithdrawIcon />}
              accentColor="#c62828"
            />
            <FinancialCard
              label="Net Cash Flow Today"
              value={netFlow !== undefined ? Math.abs(netFlow) : undefined}
              sublabel={
                netFlow === undefined
                  ? undefined
                  : netFlow >= 0
                    ? "Net inflow"
                    : "Net outflow"
              }
              icon={
                netFlow !== undefined && netFlow < 0 ? (
                  <WithdrawIcon />
                ) : (
                  <DepositIcon />
                )
              }
              accentColor={
                netFlow !== undefined && netFlow < 0 ? "#c62828" : "#1565c0"
              }
            />
            <FinancialCard
              label="Total Portfolio (AUM)"
              value={financials?.totalPortfolioBalance}
              sublabel="Active accounts only"
              icon={<PortfolioIcon />}
              accentColor="#1565c0"
            />
          </Box>

          {/* ── Row 3: Portfolio + Attention ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 3,
              width: "50%",
              height: 180,
            }}
          >
            <AttentionCard
              label="Failed Txns Today"
              count={attention?.failedTransactionsToday}
              icon={<FailedIcon />}
              accentColor="#c62828"
              to="/transactions?status=failed"
            />
            <AttentionCard
              label="Dormant Accounts"
              count={attention?.dormantAccounts}
              icon={<DormantIcon />}
              accentColor="#546e7a"
              to="/accounts?status=dormant"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardPage;
