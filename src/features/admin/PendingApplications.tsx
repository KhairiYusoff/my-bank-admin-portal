import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { useGetPendingApplicationsQuery } from './adminApi';

const PendingApplications: React.FC = () => {
  const { data, error, isLoading } = useGetPendingApplicationsQuery();

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Pending Applications
      </Typography>
      
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error instanceof Error ? error.message : 'Failed to load pending applications'}
        </Alert>
      )}
      
      {data && data.success && data.data && data.data.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((application: any) => (
                <TableRow key={application.id}>
                  <TableCell>{application.id}</TableCell>
                  <TableCell>{application.name || 'N/A'}</TableCell>
                  <TableCell>{application.email || 'N/A'}</TableCell>
                  <TableCell>{application.status || 'Pending'}</TableCell>
                  <TableCell>
                    {application.created_at 
                      ? new Date(application.created_at).toLocaleString() 
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : !isLoading && !error ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No pending applications found.
        </Alert>
      ) : null}
    </Box>
  );
};

export default PendingApplications;
