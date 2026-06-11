import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/features/staff/store/staffApi";
import type { StaffMember, StaffRole } from "@/features/staff/types";
import StatusChip from "@/components/shared/StatusChip";
import { DetailSection } from "@/components/shared";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { formatDate } from "@/utils/formatters";
import ChangeRoleModal from "@/features/staff/components/ChangeRoleModal";
import ChangeStatusModal from "@/features/users/components/ChangeStatusModal";
import UserActivityModal from "@/features/admin/components/UserActivityModal";
import type { UserStatus, User } from "@/features/users/types";

const StaffDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const routerStateStaff = (location.state as { staff?: StaffMember } | null)
    ?.staff;

  const { data, isLoading, error } = useGetStaffByIdQuery(id!, {
    skip: !id,
  });

  const staff: StaffMember | undefined = data?.data ?? routerStateStaff;

  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const currentUserRole = useAppSelector((state) => state.auth.user?.role);

  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  if (isLoading && !staff) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !staff) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/staff")}
            >
              Back to Staff
            </Button>
          }
        >
          Staff member not found or failed to load.
        </Alert>
      </Box>
    );
  }

  const isSelf = staff._id === currentUserId;

  const boolToYesNo = (val?: boolean) =>
    val === true ? "Yes" : val === false ? "No" : undefined;

  const safeFormatDate = (val?: string) => (val ? formatDate(val) : undefined);

  const handleRoleConfirm = async (newRole: StaffRole) => {
    try {
      await updateStaff({
        staffId: staff._id,
        body: { role: newRole },
      }).unwrap();
      setRoleModalOpen(false);
      setSnackbar({
        open: true,
        message: "Role updated successfully.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update role.",
        severity: "error",
      });
    }
  };

  const handleStatusConfirm = async (newStatus: UserStatus) => {
    try {
      await updateStaff({
        staffId: staff._id,
        body: { status: newStatus },
      }).unwrap();
      setStatusModalOpen(false);
      setSnackbar({
        open: true,
        message: "Status updated successfully.",
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
    try {
      await deleteStaff(staff._id).unwrap();
      navigate("/staff");
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete staff member.",
        severity: "error",
      });
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ width: "calc(100vw - 288px)" }}>
      {/* Back link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/staff")}
        sx={{ mb: 1, pl: 0 }}
      >
        Back to Staff
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
            {staff.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
            <StatusChip status={staff.status} />
            <Typography
              variant="caption"
              sx={{
                alignSelf: "center",
                color: "text.secondary",
                textTransform: "capitalize",
              }}
            >
              {staff.role}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignSelf: "center",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setActivityModalOpen(true)}
          >
            View Full Activity Log
          </Button>
          {currentUserRole === "admin" && !isSelf && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setRoleModalOpen(true)}
            >
              Change Role
            </Button>
          )}
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
              disabled={isSelf}
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      {/* 2-column section grid */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        {/* Column 1 */}
        <Box
          sx={{
            flex: 1,
            flexBasis: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DetailSection
            title="Account Info"
            rows={[
              { label: "Email", value: staff.email },
              { label: "Role", value: staff.role },
              { label: "Account Status", value: staff.status },
              { label: "Verified", value: boolToYesNo(staff.isVerified) },
              { label: "Member Since", value: safeFormatDate(staff.createdAt) },
              { label: "Last Updated", value: safeFormatDate(staff.updatedAt) },
              {
                label: "Password Changed",
                value: safeFormatDate(staff.passwordChangedAt),
              },
            ]}
          />
        </Box>

        {/* Column 2 */}
        <Box
          sx={{
            flex: 1,
            flexBasis: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DetailSection
            title="Preferences"
            rows={[
              { label: "Language", value: staff.preferences?.language },
              {
                label: "Notifications",
                value: boolToYesNo(staff.preferences?.notifications),
              },
            ]}
          />
        </Box>
      </Box>

      {/* Modals */}
      <ChangeRoleModal
        open={roleModalOpen}
        staff={staff}
        isLoading={isUpdating}
        onConfirm={handleRoleConfirm}
        onClose={() => setRoleModalOpen(false)}
      />

      <ChangeStatusModal
        open={statusModalOpen}
        user={staff as unknown as User}
        isLoading={isUpdating}
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusModalOpen(false)}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${staff.name}? This cannot be undone.`}
        confirmText="Delete"
        severity="error"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteConfirmOpen(false)}
      />

      <UserActivityModal
        open={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        userId={staff._id}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffDetailPage;
