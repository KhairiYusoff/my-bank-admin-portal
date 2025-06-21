import React from 'react';

import { useGetAllCustomersQuery, User } from '@/features/admin/store/adminApi';
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
  Button
} from '@mui/material';
import { tableContainerStyles, tableStyles, paperWrapperStyles } from '@/components/shared/TableStyles';
import UserActivityModal from '@/features/admin/components/UserActivityModal';
import StatusChip from '@/components/shared/StatusChip';

const UsersList: React.FC = () => {
  const [isActivityModalOpen, setActivityModalOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleOpenActivityModal = (userId: string) => {
    setSelectedUserId(userId);
    setActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setActivityModalOpen(false);
    setSelectedUserId(null);
  };

  const { data, error, isLoading } = useGetAllCustomersQuery({
    page: page + 1, // API is 1-based, MUI is 0-based
    limit: rowsPerPage,
    sort: 'desc'
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <Box sx={{ width: '100%'}}>
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
          {error instanceof Error ? error.message : 'Failed to load users'}
        </Alert>
      )}
      
      {data && data.success && data.data && data.data.length > 0 ? (
        <Paper sx={paperWrapperStyles}>
        <TableContainer sx={tableContainerStyles}>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell width="20%">Name</TableCell>
                <TableCell width="25%">Email</TableCell>
                <TableCell width="15%">Role</TableCell>
                <TableCell width="15%">Status</TableCell>
                <TableCell width="10%">Verified</TableCell>
                <TableCell width="15%">Created At</TableCell>
                <TableCell width="10%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <StatusChip status={user.applicationStatus} />
                  </TableCell>
                  <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleOpenActivityModal(user._id)}
                    >
                      View Activity
                    </Button>
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
            labelDisplayedRows={({ from, to, count }) => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                {`${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
              </Box>
            )}
          />
        </Paper>
      ) : (
        !isLoading && !error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No users found
          </Alert>
        )
      )}\n      <UserActivityModal 
        open={isActivityModalOpen} 
        onClose={handleCloseActivityModal} 
        userId={selectedUserId} 
      />
    </Box>
  );
};

export default UsersList;
