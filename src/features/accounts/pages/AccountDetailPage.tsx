import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import {
  useGetAccountByNumberQuery,
  useUpdateAccountStatusMutation,
} from "@/features/accounts/store/accountsApi";
import type { Account } from "@/features/accounts/types";
import StatusChip from "@/components/shared/StatusChip";
import { DetailSection } from "@/components/shared";
import ChangeStatusModal from "@/features/users/components/ChangeStatusModal";
import type { UserStatus, User } from "@/features/users/types";
import { formatDate, formatCurrency } from "@/utils/formatters";

const AccountDetailPage: React.FC = () => {
  const { accountNumber } = useParams<{ accountNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const routerStateAccount = (location.state as { account?: Account } | null)
    ?.account;

  const { data, isLoading, error } = useGetAccountByNumberQuery(
    accountNumber!,
    { skip: !accountNumber },
  );

  const account: Account | undefined = data?.data ?? routerStateAccount;

  const currentUserRole = useAppSelector((state) => state.auth.user?.role);

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAccountStatusMutation();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !account) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/accounts")}
            >
              Back to Accounts
            </Button>
          }
        >
          Account not found or failed to load.
        </Alert>
      </Box>
    );
  }

  const safeFormatDate = (val?: string) => (val ? formatDate(val) : undefined);

  const handleStatusConfirm = async (newStatus: UserStatus) => {
    try {
      await updateStatus({
        accountNumber: account.accountNumber,
        status: newStatus,
      }).unwrap();
      setStatusModalOpen(false);
      setSnackbar({
        open: true,
        message: "Account status updated successfully.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update account status.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ width: "calc(100vw - 288px)" }}>
      {/* Back link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/accounts")}
        sx={{ mb: 1, pl: 0 }}
      >
        Back to Accounts
      </Button>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {account.accountNumber}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
            <StatusChip status={account.status} />
            <Typography
              variant="caption"
              sx={{
                alignSelf: "center",
                color: "text.secondary",
                textTransform: "capitalize",
              }}
            >
              {account.accountType}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignSelf: "center",
          }}
        >
          {(currentUserRole === "admin" || currentUserRole === "banker") && (
            <Button
              variant="contained"
              size="small"
              disabled={account.status === "Closed"}
              onClick={() => setStatusModalOpen(true)}
            >
              Manage Status
            </Button>
          )}
        </Box>
      </Box>

      {/* 2-column section grid */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        {/* Column 1 */}
        <Box
          sx={{
            flex: 1,
            flexBasis: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DetailSection
            title="Account Info"
            rows={[
              { label: "Account Number", value: account.accountNumber },
              { label: "Account Type", value: account.accountType },
              {
                label: "Status",
                value: <StatusChip status={account.status} />,
              },
              { label: "Currency", value: account.currency },
              { label: "Branch", value: account.branch },
              {
                label: "Date Opened",
                value: safeFormatDate(account.dateOpened),
              },
              {
                label: "Date Closed",
                value: safeFormatDate(account.dateClosed),
              },
            ]}
          />

          <DetailSection
            title="Financials"
            rows={[
              {
                label: "Balance",
                value: formatCurrency(account.balance, account.currency),
              },
              {
                label: "Minimum Balance",
                value: formatCurrency(account.minimumBalance, account.currency),
              },
              {
                label: "Overdraft Limit",
                value: formatCurrency(account.overdraftLimit, account.currency),
              },
              {
                label: "Interest Rate",
                value:
                  account.interestRate != null
                    ? `${account.interestRate}%`
                    : undefined,
              },
            ]}
          />
        </Box>

        {/* Column 2 */}
        <Box
          sx={{
            flex: 1,
            flexBasis: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DetailSection
            title="Account Holder"
            rows={[
              { label: "Name", value: account.user?.name },
              { label: "Email", value: account.user?.email },
              { label: "Phone", value: account.user?.phoneNumber },
              { label: "Role", value: account.user?.role },
              ...(account.user
                ? [
                    {
                      label: "Profile",
                      value: (
                        <Button
                          component={Link}
                          to={`/users/${account.user._id}`}
                          state={{
                            from: {
                              path: `/accounts/${account.accountNumber}`,
                              label: "Back to Account Detail",
                            },
                          }}
                          variant="text"
                          size="small"
                          sx={{ p: 0, minWidth: 0 }}
                        >
                          View Full Profile →
                        </Button>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </Box>
      </Box>

      {/* Manage Status Modal */}
      <ChangeStatusModal
        open={statusModalOpen}
        user={account as unknown as User}
        isLoading={isUpdating}
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusModalOpen(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountDetailPage;
