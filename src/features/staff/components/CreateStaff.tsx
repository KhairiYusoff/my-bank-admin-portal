import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateStaffMutation } from "@/features/staff/store/staffApi";
import type { CreateStaffRequest } from "@/features/admin/store/adminApi";
import { CreateStaffForm } from '@/components/admin/CreateStaffForm';

interface CreateStaffModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateStaffModal: React.FC<CreateStaffModalProps> = ({ open, onClose, onSuccess }) => {
  const [createStaff, { isLoading, error, isSuccess, reset }] = useCreateStaffMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage('Staff member created successfully!');
      onSuccess();
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }, [isSuccess, onSuccess]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (data: Omit<CreateStaffRequest, 'confirmPassword'>) => {
    try {
      await createStaff(data).unwrap();
    } catch (err) {
      console.error('Failed to create staff:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Create New Staff Member
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <CreateStaffForm
            onSubmit={handleSubmit}
            loading={isLoading}
            error={error ? 'Failed to create staff member. Please try again.' : undefined}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateStaffModal;
