import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Tooltip,
  Box,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Verified as VerifyIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

interface ActionButtonProps {
  onApprove: () => Promise<void>;
  onVerify: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  actionInProgress?: 'approve' | 'verify' | null;
}

export const ApplicationActions: React.FC<ActionButtonProps> = ({
  onApprove,
  onVerify,
  loading = false,
  disabled = false,
  actionInProgress = null,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionType, setActionType] = useState<'approve' | 'verify' | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!loading && !disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    if (!isSubmitting) {
      setAnchorEl(null);
    }
  };

  const handleActionClick = (type: 'approve' | 'verify') => {
    setActionType(type);
    setIsConfirmOpen(true);
    handleMenuClose();
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

  const isActionDisabled = disabled || loading || isSubmitting;
  const isApproveInProgress = actionInProgress === 'approve' || (isSubmitting && actionType === 'approve');
  const isVerifyInProgress = actionInProgress === 'verify' || (isSubmitting && actionType === 'verify');

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title={disabled ? 'No actions available' : ''}>
        <span>
          <Button
            aria-label="application actions"
            aria-controls="application-actions-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            disabled={isActionDisabled}
            endIcon={<MoreIcon />}
            variant="outlined"
            size="small"
            sx={{
              minWidth: '100px',
              opacity: isActionDisabled ? 0.7 : 1,
            }}
          >
            {isApproveInProgress || isVerifyInProgress ? 'Processing...' : 'Actions'}
          </Button>
        </span>
      </Tooltip>

      <Menu
        id="application-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl) && !isSubmitting}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => handleActionClick('approve')} 
          disabled={isApproveInProgress}
        >
          <ListItemIcon>
            <ApproveIcon fontSize="small" color={isApproveInProgress ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>Approve Application</span>
                {isApproveInProgress && (
                  <Box component="span" sx={{ ml: 1 }}>
                    <CircularProgress size={16} color="primary" />
                  </Box>
                )}
              </Box>
            }
          />
        </MenuItem>
        <MenuItem 
          onClick={() => handleActionClick('verify')} 
          disabled={isVerifyInProgress}
        >
          <ListItemIcon>
            <VerifyIcon fontSize="small" color={isVerifyInProgress ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>Verify Customer</span>
                {isVerifyInProgress && (
                  <Box component="span" sx={{ ml: 1 }}>
                    <CircularProgress size={16} color="primary" />
                  </Box>
                )}
              </Box>
            }
          />
        </MenuItem>
      </Menu>

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
