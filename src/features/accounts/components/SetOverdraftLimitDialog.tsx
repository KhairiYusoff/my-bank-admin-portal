import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useSetOverdraftLimitMutation } from "@/features/accounts/store/accountsApi";
import type { Account } from "@/features/accounts/types";

interface SetOverdraftLimitDialogProps {
  open: boolean;
  onClose: () => void;
  account: Account;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const SetOverdraftLimitDialog: React.FC<SetOverdraftLimitDialogProps> = ({
  open,
  onClose,
  account,
  onSuccess,
  onError,
}) => {
  const [value, setValue] = useState<string>(
    String(account.overdraftLimit ?? 0),
  );
  const [validationError, setValidationError] = useState<string>("");

  const [setOverdraftLimit, { isLoading }] = useSetOverdraftLimitMutation();

  const handleSave = async () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) {
      setValidationError("Must be 0 or greater");
      return;
    }
    setValidationError("");
    try {
      await setOverdraftLimit({
        accountNumber: account.accountNumber,
        overdraftLimit: parsed,
      }).unwrap();
      onSuccess("Overdraft limit updated");
      onClose();
    } catch {
      onError("Failed to update overdraft limit");
    }
  };

  const handleClose = () => {
    setValidationError("");
    setValue(String(account.overdraftLimit ?? 0));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Set Overdraft Limit</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Account: {account.accountNumber}
        </Typography>
        <TextField
          label="Overdraft Limit (RM)"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth
          error={!!validationError}
        />
        {validationError && (
          <FormHelperText error>{validationError}</FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isLoading}
        >
          Save Limit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetOverdraftLimitDialog;
