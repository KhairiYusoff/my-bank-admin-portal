import React from "react";

import {
  useGetAllCustomersQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "@/features/users/store/usersApi";
import type { User, UserStatus } from "@/features/users/types";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  Alert,
  TablePagination,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  tableContainerStyles,
  tableStyles,
  paperWrapperStyles,
} from "@/components/shared/TableStyles";
import UserActivityModal from "@/features/admin/components/UserActivityModal";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import ChangeStatusModal from "@/features/users/components/ChangeStatusModal";
import StatusChip from "@/components/shared/StatusChip";
import DeleteIcon from "@mui/icons-material/Delete";

const UsersList: React.FC = () => {
  const [isActivityModalOpen, setActivityModalOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null,
  );
  const [statusTarget, setStatusTarget] = React.useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [updateCustomer, { isLoading: isUpdatingStatus }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const handleOpenActivityModal = (userId: string) => {
    setSelectedUserId(userId);
    setActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setActivityModalOpen(false);
    setSelectedUserId(null);
  };

  const handleStatusConfirm = async (newStatus: UserStatus) => {
    if (!statusTarget) return;
    await updateCustomer({
      customerId: statusTarget._id,
      body: { status: newStatus },
    });
    setStatusTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteCustomer(deleteTarget._id);
    setDeleteTarget(null);
  };

  const { data, error, isLoading } = useGetAllCustomersQuery({
    page: page + 1, // API is 1-based, MUI is 0-based
    limit: rowsPerPage,
    sort: "desc",
  });

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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        All Users
      </Typography>
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error instanceof Error ? error.message : "Failed to load users"}
        </Alert>
      )}
      {data && data.success && data.data && data.data.length > 0 ? (
        <Paper sx={paperWrapperStyles}>
          <TableContainer sx={tableContainerStyles}>
            <Table sx={tableStyles}>
              <TableHead>
                <TableRow>
                  <TableCell width="18%">Name</TableCell>
                  <TableCell width="22%">Email</TableCell>
                  <TableCell width="8%">Role</TableCell>
                  <TableCell width="12%">Application Status</TableCell>
                  <TableCell width="12%">Account Status</TableCell>
                  <TableCell width="8%">Verified</TableCell>
                  <TableCell width="10%">Created At</TableCell>
                  <TableCell width="10%">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <StatusChip status={user.applicationStatus} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={user.status} />
                    </TableCell>
                    <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setStatusTarget(user)}
                        >
                          Manage
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenActivityModal(user._id)}
                        >
                          Activity
                        </Button>
                        <Tooltip title="Delete customer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={data.meta.total}
            rowsPerPage={data.meta.limit}
            page={data.meta.page - 1} // Convert to 0-based for MUI
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </Paper>
      ) : (
        !isLoading &&
        !error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No users found
          </Alert>
        )
      )}{" "}
      <UserActivityModal
        open={isActivityModalOpen}
        onClose={handleCloseActivityModal}
        userId={selectedUserId}
      />
      <ChangeStatusModal
        open={!!statusTarget}
        user={statusTarget}
        isLoading={isUpdatingStatus}
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusTarget(null)}
      />
      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete Customer"
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

export default UsersList;
