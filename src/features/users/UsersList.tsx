import React from 'react';
import { useGetAllCustomersQuery, User } from '../admin/adminApi';
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
  Chip,
  TablePagination
} from '@mui/material';

const UsersList: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
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

  const getStatusColor = (status: string) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'success';
      case 'inactive':
      case 'pending':
        return 'warning';
      case 'suspended':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box p={2}>
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
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    {user.accountType ? user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.applicationStatus || 'N/A'} 
                      color={getStatusColor(user.applicationStatus) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        </TableContainer>
      ) : (
        !isLoading && !error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No users found
          </Alert>
        )
      )}
    </Box>
  );
};

export default UsersList;
