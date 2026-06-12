import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import type { Account, AccountStatus } from "@/features/accounts/types";

interface ChangeAccountStatusModalProps {
  open: boolean;
  account: Account | null;
  isLoading: boolean;
  onConfirm: (newStatus: AccountStatus) => Promise<void>;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  AccountStatus,
  { label: string; description: string; severity: "info" | "warning" | "error" }
> = {
  active: {
    label: "Active",
    description:
      "Account is fully operational. Customer can deposit, withdraw, and transfer.",
    severity: "info",
  },
  dormant: {
    label: "Dormant",
    description:
      "Account is inactive due to prolonged inactivity. All transactions are blocked until reactivated.",
    severity: "warning",
  },
  suspended: {
    label: "Suspended",
    description:
      "Account is temporarily frozen by staff. All transactions are blocked until reactivated.",
    severity: "warning",
  },
  closed: {
    label: "Closed",
    description:
      "Account is permanently closed. It will be hidden from the customer portal. This cannot be reversed.",
    severity: "error",
  },
};

const ChangeAccountStatusModal: React.FC<ChangeAccountStatusModalProps> = ({
  open,
  account,
  isLoading,
  onConfirm,
  onClose,
}) => {
  const rawStatus = account?.status ?? "active";
  const isMutableCurrent = rawStatus in STATUS_CONFIG;
  const currentStatus = isMutableCurrent
    ? (rawStatus as AccountStatus)
    : null;
  const selectableStatuses = Object.keys(STATUS_CONFIG) as AccountStatus[];

  const [selectedStatus, setSelectedStatus] =
    React.useState<AccountStatus>("active");

  React.useEffect(() => {
    if (open) {
      setSelectedStatus(isMutableCurrent ? (rawStatus as AccountStatus) : "active");
    }
  }, [open, rawStatus, isMutableCurrent]);

  const hasChanged = selectedStatus !== rawStatus;
  const config = STATUS_CONFIG[selectedStatus];

  const handleConfirm = async () => {
    if (!hasChanged) return;
    await onConfirm(selectedStatus);
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>Change Account Status</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Account
          </Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            {account?.accountNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {account?.user?.name ?? "—"}
            {account?.accountType ? ` · ${account.accountType.replace(/_/g, " ")}` : ""}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {!isMutableCurrent && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Current status:{" "}
            <strong>
              {rawStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </strong>
            . Select a new status below.
          </Alert>
        )}

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
            Account Status
          </FormLabel>
          <RadioGroup
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as AccountStatus)}
          >
            {selectableStatuses.map((statusKey) => (
              <FormControlLabel
                key={statusKey}
                value={statusKey}
                disabled={statusKey === currentStatus && isMutableCurrent}
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {STATUS_CONFIG[statusKey].label}
                      {statusKey === currentStatus && isMutableCurrent && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          (current)
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {STATUS_CONFIG[statusKey].description}
                    </Typography>
                  </Box>
                }
                sx={{ mb: 1, alignItems: "flex-start", mt: 0.5 }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {hasChanged && (
          <Alert
            severity={config.severity}
            icon={<WarningAmberIcon />}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" fontWeight={600}>
              You are about to set this account to{" "}
              <strong>{config.label}</strong>.
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {config.description}
            </Typography>
            {selectedStatus === "closed" && (
              <Typography variant="body2" sx={{ mt: 1 }} fontWeight={700}>
                This cannot be undone. Please confirm you have the necessary
                authorisation.
              </Typography>
            )}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color={
            selectedStatus === "closed"
              ? "error"
              : selectedStatus === "dormant" || selectedStatus === "suspended"
                ? "warning"
                : "primary"
          }
          loading={isLoading}
          disabled={!hasChanged}
          onClick={handleConfirm}
        >
          Confirm Change
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeAccountStatusModal;
