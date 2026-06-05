import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedIcon from "@mui/icons-material/Verified";

import { useAppSelector } from "@/app/hooks";
import { DetailSection } from "@/components/shared";
import { ConfirmationDialog } from "@/components/shared";
import { StatusChip } from "@/components/shared";
import UserActivityModal from "@/features/admin/components/UserActivityModal";
import ChangeStatusModal from "@/features/users/components/ChangeStatusModal";
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "@/features/users/store/usersApi";
import type { User, UserStatus } from "@/features/users/types";
import { formatDate } from "@/utils/formatters";

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerStateUser = (
    location.state as {
      user?: User;
      from?: { path: string; label: string };
    } | null
  )?.user;
  const backNav = (
    location.state as { from?: { path: string; label: string } } | null
  )?.from ?? { path: "/users", label: "Back to Users" };

  const currentUserRole = useAppSelector((state) => state.auth.user?.role);

  const [isStatusModalOpen, setStatusModalOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [isActivityModalOpen, setActivityModalOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const {
    data: fetchedData,
    isLoading,
    error: fetchError,
  } = useGetCustomerByIdQuery(id!, {
    skip: !id,
  });

  const [updateCustomer, { isLoading: isUpdatingStatus }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const customer: User | undefined = fetchedData?.data ?? routerStateUser;

  const handleStatusConfirm = async (newStatus: UserStatus) => {
    if (!customer) return;
    try {
      await updateCustomer({
        customerId: customer._id,
        body: { status: newStatus },
      }).unwrap();
      setStatusModalOpen(false);
      setSnackbar({
        open: true,
        message: "Customer status updated.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update status.",
        severity: "error",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!customer) return;
    try {
      await deleteCustomer(customer._id).unwrap();
      setDeleteConfirmOpen(false);
      setSnackbar({
        open: true,
        message: "Customer deleted.",
        severity: "success",
      });
      navigate(backNav.path);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete customer.",
        severity: "error",
      });
    }
  };

  if (isLoading && !customer) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError && !customer) {
    const status = (fetchError as any)?.status;
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(backNav.path)}
          sx={{ mb: 2 }}
        >
          {backNav.label}
        </Button>
        {status === 404 ? (
          <Alert severity="warning">Customer not found.</Alert>
        ) : (
          <Alert severity="error">Failed to load customer.</Alert>
        )}
      </Box>
    );
  }

  if (!customer) return null;

  const boolToYesNo = (val?: boolean) =>
    val === true ? "Yes" : val === false ? "No" : undefined;

  const safeFormatDate = (val?: string) => (val ? formatDate(val) : undefined);

  return (
    <Box sx={{ width: "calc(100vw - 288px)" }}>
      {/* Back link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(backNav.path)}
        sx={{ mb: 1, pl: 0 }}
      >
        {backNav.label}
      </Button>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {customer.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <StatusChip status={customer.status} />
            <StatusChip status={customer.applicationStatus} />
            {customer.isVerified && (
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                label="Verified"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600, borderWidth: 2 }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                alignSelf: "center",
                color: "text.secondary",
                textTransform: "capitalize",
              }}
            >
              {customer.role}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setActivityModalOpen(true)}
          >
            View Full Activity Log
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setStatusModalOpen(true)}
          >
            Manage Status
          </Button>
          {currentUserRole === "admin" && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      {/* 3-column section grid */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {/* Column 1: Account Info + Preferences */}
        <Box sx={{ flex: 1, flexBasis: 0, minWidth: 0 }}>
          <DetailSection
            title="Account Info"
            rows={[
              { label: "Account Type", value: customer.accountType },
              { label: "Account Status", value: customer.status },
              {
                label: "Application Status",
                value: customer.applicationStatus,
              },
              { label: "Purpose of Acct", value: customer.purposeOfAccount },
              { label: "Verified", value: boolToYesNo(customer.isVerified) },
              {
                label: "Profile Complete",
                value: boolToYesNo(customer.isProfileComplete),
              },
              {
                label: "First Time Login",
                value: boolToYesNo(customer.isFirstTime),
              },
              {
                label: "Member Since",
                value: safeFormatDate(customer.createdAt),
              },
            ]}
          />
          <DetailSection
            title="Preferences"
            rows={[
              { label: "Theme", value: customer.preferences?.theme },
              { label: "Language", value: customer.preferences?.language },
              {
                label: "Notifications",
                value: boolToYesNo(customer.preferences?.notifications),
              },
            ]}
          />
        </Box>

        {/* Column 2: Personal Info + Next of Kin */}
        <Box sx={{ flex: 1, flexBasis: 0, minWidth: 0 }}>
          <DetailSection
            title="Personal Info"
            rows={[
              { label: "Full Name", value: customer.name },
              { label: "Email", value: customer.email },
              { label: "Phone", value: customer.phoneNumber },
              { label: "Identity No.", value: customer.identityNumber },
              {
                label: "Date of Birth",
                value: safeFormatDate(customer.dateOfBirth),
              },
              { label: "Age", value: customer.age },
              { label: "Nationality", value: customer.nationality },
              { label: "Residency", value: customer.residencyStatus },
              { label: "Marital Status", value: customer.maritalStatus },
            ]}
          />
          <DetailSection
            title="Next of Kin"
            rows={[
              { label: "Name", value: customer.nextOfKin?.name },
              { label: "Phone", value: customer.nextOfKin?.phone },
              {
                label: "Relationship",
                value: customer.nextOfKin?.relationship,
              },
            ]}
          />
        </Box>

        {/* Column 3: Employment + Address */}
        <Box sx={{ flex: 1, flexBasis: 0, minWidth: 0 }}>
          <DetailSection
            title="Employment"
            rows={[
              { label: "Job Title", value: customer.job },
              { label: "Employer", value: customer.employerName },
              { label: "Employment Type", value: customer.employmentType },
              { label: "Education Level", value: customer.educationLevel },
              { label: "Salary Range", value: customer.salary },
            ]}
          />
          <DetailSection
            title="Address"
            rows={[
              { label: "Street", value: customer.address?.street },
              { label: "City", value: customer.address?.city },
              { label: "State", value: customer.address?.state },
              { label: "Postal Code", value: customer.address?.postalCode },
            ]}
          />
        </Box>
      </Box>

      {/* Modals */}
      <ChangeStatusModal
        open={isStatusModalOpen}
        user={customer}
        isLoading={isUpdatingStatus}
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusModalOpen(false)}
      />

      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        title="Delete Customer"
        message={`Are you sure you want to permanently delete ${customer.name}? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteConfirmOpen(false)}
      />

      <UserActivityModal
        open={isActivityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        userId={customer._id}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDetailPage;
