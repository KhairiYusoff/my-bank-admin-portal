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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import type { StaffMember, StaffRole } from "@/features/staff/types";

interface ChangeRoleModalProps {
  open: boolean;
  staff: StaffMember | null;
  isLoading: boolean;
  onConfirm: (newRole: StaffRole) => Promise<void>;
  onClose: () => void;
}

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  open,
  staff,
  isLoading,
  onConfirm,
  onClose,
}) => {
  const currentRole: StaffRole = staff?.role ?? "banker";
  const [selectedRole, setSelectedRole] =
    React.useState<StaffRole>(currentRole);

  React.useEffect(() => {
    if (open) {
      setSelectedRole(currentRole);
    }
  }, [open, currentRole]);

  const hasChanged = selectedRole !== currentRole;

  const handleConfirm = async () => {
    if (!hasChanged) return;
    await onConfirm(selectedRole);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Role</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Changing role for <strong>{staff?.name}</strong>. Current role:{" "}
          <strong>{currentRole}</strong>.
        </Typography>

        <FormControl component="fieldset">
          <FormLabel component="legend">Select new role</FormLabel>
          <RadioGroup
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as StaffRole)}
          >
            <FormControlLabel
              value="banker"
              control={<Radio />}
              label="Banker"
              disabled={currentRole === "banker"}
            />
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label="Admin"
              disabled={currentRole === "admin"}
            />
            <FormControlLabel
              value="auditor"
              control={<Radio />}
              label="Auditor"
              disabled={currentRole === "auditor"}
            />
          </RadioGroup>
        </FormControl>

        {selectedRole === "admin" && hasChanged && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This grants full system access including staff management.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={isLoading}
          disabled={!hasChanged}
          onClick={handleConfirm}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeRoleModal;
