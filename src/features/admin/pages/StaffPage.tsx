import React, { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateStaffModal from '../components/CreateStaff';
import { useGetStaffMembersQuery, StaffMember } from '../store/adminApi';

const StaffPage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: staffResponse, error, isLoading, refetch } = useGetStaffMembersQuery({ page: page + 1, limit: rowsPerPage });
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
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
      {error && <Alert severity="error">Failed to load staff members. The API might be down.</Alert>}
      {staff && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((member: StaffMember) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
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
