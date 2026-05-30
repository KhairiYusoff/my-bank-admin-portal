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
import type { User, UserStatus } from "@/features/users/types";

interface ChangeStatusModalProps {
  open: boolean;
  user: User | null;
  isLoading: boolean;
  onConfirm: (newStatus: UserStatus) => Promise<void>;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; description: string; severity: "info" | "warning" | "error" }
> = {
  active: {
    label: "Active",
    description: "Customer can log in and perform all banking transactions.",
    severity: "info",
  },
  suspended: {
    label: "Suspended",
    description:
      "Customer is temporarily blocked from logging in and all transactions are frozen. This can be reversed.",
    severity: "warning",
  },
  terminated: {
    label: "Terminated",
    description:
      "Customer account is permanently closed. All access is revoked. This action is irreversible.",
    severity: "error",
  },
};

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  open,
  user,
  isLoading,
  onConfirm,
  onClose,
}) => {
  const currentStatus: UserStatus = user?.status ?? "active";
  const [selectedStatus, setSelectedStatus] =
    React.useState<UserStatus>(currentStatus);

  // Reset selection whenever the modal opens for a (potentially different) user
  React.useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const hasChanged = selectedStatus !== currentStatus;
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
            Customer
          </Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
            Account Status
          </FormLabel>
          <RadioGroup
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as UserStatus)}
          >
            {(Object.keys(STATUS_CONFIG) as UserStatus[]).map((statusKey) => (
              <FormControlLabel
                key={statusKey}
                value={statusKey}
                disabled={statusKey === currentStatus}
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {STATUS_CONFIG[statusKey].label}
                      {statusKey === currentStatus && (
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
            {selectedStatus === "terminated" && (
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
            selectedStatus === "terminated"
              ? "error"
              : selectedStatus === "suspended"
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

export default ChangeStatusModal;
