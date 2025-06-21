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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateStaffModal from "../components/CreateStaff";
import { useGetStaffMembersQuery, StaffMember } from "../store/adminApi";
import {
  tableContainerStyles,
  tableStyles,
  paperWrapperStyles,
} from "@/components/shared/TableStyles";
import StatusChip from "@/components/shared/StatusChip";
import { formatDate } from "@/utils/formatters";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const StaffPage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: staffResponse,
    error,
    isLoading,
    refetch,
  } = useGetStaffMembersQuery({ page: page + 1, limit: rowsPerPage });
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
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
                  <TableCell width="20%">Name</TableCell>
                  <TableCell width="25%">Email</TableCell>
                  <TableCell width="15%">Role</TableCell>
                  <TableCell width="15%">Status</TableCell>
                  <TableCell width="10%">Verified</TableCell>
                  <TableCell width="10%">Profile</TableCell>
                  <TableCell width="15%">Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((member: StaffMember) => (
                  <TableRow key={member._id} hover>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Box>{member.email}</Box>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <StatusChip status={member.applicationStatus} />
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
