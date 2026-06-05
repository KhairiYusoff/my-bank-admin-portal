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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CreateStaffModal from "@/features/staff/components/CreateStaff";
import { useGetStaffMembersQuery } from "@/features/staff/store/staffApi";
import type { StaffMember } from "@/features/staff/types";
import {
  tableContainerStyles,
  tableStyles,
  paperWrapperStyles,
} from "@/components/shared/TableStyles";
import StatusChip from "@/components/shared/StatusChip";
import { formatDate } from "@/utils/formatters";

const StaffPage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const {
    data: staffResponse,
    error,
    isLoading,
    refetch,
  } = useGetStaffMembersQuery({ page: page + 1, limit: rowsPerPage });
  const staff = staffResponse?.data;
  const meta = staffResponse?.meta;

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSuccess = () => refetch();

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
                  <TableCell width="14%">Account Status</TableCell>
                  <TableCell width="10%">Created At</TableCell>
                  <TableCell width="8%">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((member: StaffMember) => (
                  <TableRow key={member._id} hover>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <StatusChip status={member.status} />
                    </TableCell>
                    <TableCell>{formatDate(member.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          navigate(`/staff/${member._id}`, {
                            state: { staff: member },
                          })
                        }
                      >
                        View →
                      </Button>
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
    </Box>
  );
};

export default StaffPage;
