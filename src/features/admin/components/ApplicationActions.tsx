import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, Chip } from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Verified as VerifyIcon,
} from '@mui/icons-material';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';

interface ActionButtonProps {
  applicationStatus: "pending" | "approved" | "completed";
  isProfileComplete: boolean;
  onApprove: () => Promise<void>;
  onVerify: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  actionInProgress?: 'approve' | 'verify' | null;
}

export const ApplicationActions: React.FC<ActionButtonProps> = ({
  applicationStatus,
  isProfileComplete,
  onApprove,
  onVerify,
  loading = false,
  disabled = false,
  actionInProgress = null,
}) => {
  const [actionType, setActionType] = useState<'approve' | 'verify' | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActionClick = (type: 'approve' | 'verify') => {
    setActionType(type);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!actionType) return;
    
    setIsSubmitting(true);
    try {
      if (actionType === 'approve') {
        await onApprove();
      } else if (actionType === 'verify') {
        await onVerify();
      }
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setActionType(null);
    }
  };

  const getActionText = () => {
    switch (actionType) {
      case 'approve':
        return 'approve this application';
      case 'verify':
        return 'verify this customer';
      default:
        return 'perform this action';
    }
  };

  if (applicationStatus === 'completed') {
    return (
      <Box>
        <Chip label="Verified" color="success" size="small" icon={<VerifyIcon />} />
      </Box>
    );
  }

  if (applicationStatus === 'approved' && !isProfileComplete) {
    return (
      <Box>
        <Chip label="Awaiting Profile" color="warning" size="small" />
      </Box>
    );
  }

  const isApprove = applicationStatus === 'pending';
  const isActionDisabled = disabled || loading || isSubmitting;
  const isActionInProgress = isApprove
    ? actionInProgress === 'approve'
    : actionInProgress === 'verify';

  return (
    <Box>
      <LoadingButton
        size="small"
        variant="contained"
        color={isApprove ? 'success' : 'primary'}
        loading={isSubmitting || isActionInProgress}
        disabled={isActionDisabled}
        onClick={() => handleActionClick(isApprove ? 'approve' : 'verify')}
        startIcon={isApprove ? <ApproveIcon /> : <VerifyIcon />}
      >
        {isApprove ? 'Approve' : 'Verify'}
      </LoadingButton>

      <ConfirmationDialog
        open={isConfirmOpen}
        title={`Confirm ${actionType}`}
        message={`Are you sure you want to ${getActionText()}?`}
        onClose={() => {
          if (!isSubmitting) {
            setIsConfirmOpen(false);
            setActionType(null);
          }
        }}
        onConfirm={handleConfirm}
        loading={isSubmitting}
        confirmText={actionType === 'approve' ? 'Approve' : 'Verify'}
        confirmButtonProps={{
          startIcon: actionType === 'approve' ? <ApproveIcon /> : <VerifyIcon />,
        }}
        severity={actionType === 'approve' ? 'success' : 'info'}
        disableEscapeKeyDown={isSubmitting}
        disableBackdropClick={isSubmitting}
      />
    </Box>
  );
};

export default ApplicationActions;
