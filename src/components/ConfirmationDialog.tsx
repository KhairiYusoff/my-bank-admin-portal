import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  ButtonProps,
  DialogProps,
} from '@mui/material';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';

export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
  severity?: 'error' | 'warning' | 'info' | 'success';
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
  confirmButtonProps?: Partial<LoadingButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
  dialogProps?: Partial<DialogProps>;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  loading = false,
  severity = 'warning',
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  confirmButtonProps = {},
  cancelButtonProps = {},
  dialogProps = {},
}) => {
  const getColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      case 'warning':
      default:
        return 'warning';
    }
  };

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (disableBackdropClick && reason === 'backdropClick') return;
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return;
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={disableEscapeKeyDown}
      {...dialogProps}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {typeof message === 'string' ? (
          <DialogContentText>{message}</DialogContentText>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
        <LoadingButton
          onClick={onConfirm}
          color={getColor()}
          variant="contained"
          loading={loading}
          autoFocus
          {...confirmButtonProps}
          sx={{
            minWidth: 100,
            ...(confirmButtonProps.sx || {}),
          }}
        >
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
