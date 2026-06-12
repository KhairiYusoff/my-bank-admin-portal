import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateStaffMutation } from "@/features/staff/store/staffApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { CreateStaffRequest } from "@/features/staff/types";
import { CreateStaffForm } from "@/components/admin/CreateStaffForm";

interface CreateStaffModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [createStaff, { isLoading, error, isSuccess, reset }] =
    useCreateStaffMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage("Staff member created successfully!");
      onSuccess();
      handleClose();
    }
  }, [isSuccess, onSuccess]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (
    data: Omit<CreateStaffRequest, "confirmPassword">,
  ) => {
    try {
      await createStaff(data).unwrap();
    } catch (err: any) {
      console.error("Failed to create staff:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  const getErrorMessage = () => {
    if (!error) return undefined;

    // Narrowing to FetchBaseQueryError (which has 'data')
    if ("data" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        return (fetchError.data as { message: string }).message;
      }
    }

    // Narrowing to SerializedError (which has 'message')
    if ("message" in error) {
      return error.message;
    }

    return "Failed to create staff member. Please try again.";
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
              position: "absolute",
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
            error={getErrorMessage()}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateStaffModal;
