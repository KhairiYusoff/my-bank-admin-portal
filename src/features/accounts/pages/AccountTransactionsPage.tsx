import React, { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { useGetAccountTransactionsQuery } from "@/features/transactions/store/transactionsApi";
import { AppBreadcrumbs, StatusChip } from "@/components/shared";
import type { Account } from "@/features/accounts/types";
import type { Transaction } from "@/features/transactions/types";
import { formatDateTime, formatCurrency } from "@/utils/formatters";

const DASH = "—";

const AccountTransactionsPage: React.FC = () => {
  const { accountNumber } = useParams<{ accountNumber: string }>();
  const location = useLocation();
  const routerStateAccount = (location.state as { account?: Account } | null)
    ?.account;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useGetAccountTransactionsQuery(
    { accountNumber: accountNumber!, page: page + 1, limit: rowsPerPage },
    { skip: !accountNumber },
  );

  const transactions = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const currency = routerStateAccount?.currency ?? "MYR";

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const isCredit = (tx: Transaction) =>
    tx.direction === "credit" || tx.type === "deposit" || tx.type === "airdrop";

  return (
    <Box sx={{ width: "calc(100vw - 288px)" }}>
      <AppBreadcrumbs
        items={[
          { label: "Accounts", to: "/accounts" },
          {
            label: accountNumber ?? DASH,
            to: `/accounts/${accountNumber}`,
            state: { account: routerStateAccount },
          },
          { label: "Transactions" },
        ]}
      />

      {/* Page title + sub-header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Transactions — {accountNumber ?? DASH}
        </Typography>
        {routerStateAccount && (
          <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {routerStateAccount.user?.name ?? DASH}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ·
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
              {routerStateAccount.accountType ?? DASH}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ·
            </Typography>
            <StatusChip status={routerStateAccount.status} />
          </Box>
        )}
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && (
        <Alert severity="error">Failed to load transactions.</Alert>
      )}

      {!isLoading && !error && transactions.length === 0 && (
        <Alert severity="info">No transactions found for this account.</Alert>
      )}

      {!isLoading && !error && transactions.length > 0 && (
        <Paper variant="outlined">
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Balance After</TableCell>
                  <TableCell>Performed By</TableCell>
                  <TableCell>Channel</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => {
                  const credit = isCredit(tx);
                  return (
                    <TableRow key={tx._id} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {tx.date ? formatDateTime(tx.date) : DASH}
                      </TableCell>
                      <TableCell>{tx.description || tx.memo || DASH}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {tx.type ?? DASH}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tx.reference ?? DASH}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 600,
                          color: credit ? "success.main" : "error.main",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {credit ? "+" : "-"}
                        {formatCurrency(tx.amount, currency)}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {tx.balanceAfter != null
                          ? formatCurrency(tx.balanceAfter, currency)
                          : DASH}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {tx.performedBy?.name ?? DASH}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {tx.channel ?? DASH}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={tx.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AccountTransactionsPage;
