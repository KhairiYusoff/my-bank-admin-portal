import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TablePagination,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateStaffModal from "@/features/staff/components/CreateStaff";
import {
  useGetStaffMembersQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/features/staff/store/staffApi";
import type {
  StaffMember,
  StaffRole,
  StaffStatus,
} from "@/features/staff/types";
import {
  tableContainerStyles,
  tableStyles,
  paperWrapperStyles,
} from "@/components/shared/TableStyles";
import StatusChip from "@/components/shared/StatusChip";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { formatDate } from "@/utils/formatters";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const StaffPage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  const {
    data: staffResponse,
    error,
    isLoading,
    refetch,
  } = useGetStaffMembersQuery({ page: page + 1, limit: rowsPerPage });
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const staff = staffResponse?.data;
  const meta = staffResponse?.meta;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSuccess = () => {
    refetch();
  };

  const handleStatusChange = async (
    member: StaffMember,
    status: StaffStatus,
  ) => {
    await updateStaff({ staffId: member._id, body: { status } });
  };

  const handleRoleChange = async (member: StaffMember, role: StaffRole) => {
    await updateStaff({ staffId: member._id, body: { role } });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteStaff(deleteTarget._id);
    setDeleteTarget(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h1">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          startIcon={<AddIcon />}
        >
          Create Staff
        </Button>
      </Box>

      {isLoading && <CircularProgress />}
      {error && (
        <Alert severity="error">
          Failed to load staff members. The API might be down.
        </Alert>
      )}
      {staff && (
        <Paper sx={paperWrapperStyles}>
          <TableContainer sx={tableContainerStyles}>
            <Table sx={tableStyles} aria-label="staff table">
              <TableHead>
                <TableRow>
                  <TableCell width="18%">Name</TableCell>
                  <TableCell width="22%">Email</TableCell>
                  <TableCell width="12%">Role</TableCell>
                  <TableCell width="14%">Status</TableCell>
                  <TableCell width="8%">Verified</TableCell>
                  <TableCell width="8%">Profile</TableCell>
                  <TableCell width="10%">Created At</TableCell>
                  <TableCell width="8%">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((member: StaffMember) => (
                  <TableRow key={member._id} hover>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Box>{member.email}</Box>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member, e.target.value as StaffRole)
                        }
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <MenuItem value="banker">banker</MenuItem>
                        <MenuItem value="admin">admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={member.applicationStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            member,
                            e.target.value as StaffStatus,
                          )
                        }
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <MenuItem value="active">active</MenuItem>
                        <MenuItem value="suspended">suspended</MenuItem>
                        <MenuItem value="terminated">terminated</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {member.isVerified ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      {member.isProfileComplete ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(member.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete staff">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(member)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {meta && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={meta.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      )}

      <CreateStaffModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This cannot be undone.`}
        confirmText="Delete"
        severity="error"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default StaffPage;
