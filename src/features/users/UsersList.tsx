import React from 'react';
import { useGetAllCustomersQuery } from './usersApi';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert } from '@mui/material';

const UsersList: React.FC = () => {
  const { data, error, isLoading } = useGetAllCustomersQuery();

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>All Users</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load users</Alert>}
      {data && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Verified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user: any) => (
              <TableRow key={user.id || user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default UsersList;
