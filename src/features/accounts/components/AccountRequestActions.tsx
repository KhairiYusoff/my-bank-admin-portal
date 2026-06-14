import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';

interface AccountRequestActionsProps {
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  disabled?: boolean;
}

export const AccountRequestActions: React.FC<AccountRequestActionsProps> = ({
  onApprove,
  onReject,
  disabled = false,
}) => {
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove();
      setIsApproveConfirmOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsSubmitting(true);
    try {
      await onReject(rejectReason);
      setIsRejectDialogOpen(false);
      setRejectReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <LoadingButton
        size="small"
        variant="contained"
        color="success"
        loading={isSubmitting}
        disabled={disabled}
        onClick={() => setIsApproveConfirmOpen(true)}
        startIcon={<ApproveIcon />}
      >
        Approve
      </LoadingButton>

      <LoadingButton
        size="small"
        variant="outlined"
        color="error"
        loading={isSubmitting}
        disabled={disabled}
        onClick={() => setIsRejectDialogOpen(true)}
        startIcon={<RejectIcon />}
      >
        Reject
      </LoadingButton>

      <ConfirmationDialog
        open={isApproveConfirmOpen}
        title="Confirm Approval"
        message="Are you sure you want to approve this account request? This will activate the account and notify the customer."
        onClose={() => !isSubmitting && setIsApproveConfirmOpen(false)}
        onConfirm={handleApprove}
        loading={isSubmitting}
        confirmText="Approve"
        severity="success"
      />

      <Dialog
        open={isRejectDialogOpen}
        onClose={() => !isSubmitting && setIsRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Account Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Insufficient documentation, eligibility criteria not met..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRejectDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleReject}
            color="error"
            variant="contained"
            loading={isSubmitting}
            disabled={!rejectReason.trim()}
          >
            Confirm Rejection
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountRequestActions;
