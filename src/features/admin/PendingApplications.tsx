import React, { useState } from 'react';
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
  TablePagination,
  CircularProgress, 
  Alert,
  TableSortLabel,
  Snackbar,
} from '@mui/material';
import { tableContainerStyles, tableStyles, paperWrapperStyles } from '@/components/shared/TableStyles';
import { 
  useGetPendingApplicationsQuery,
  PendingApplication,
  useApproveApplicationMutation,
  useVerifyCustomerMutation,
} from './adminApi';
import { ApplicationActions } from '@/components/admin/ApplicationActions';

type Order = 'asc' | 'desc';

const PendingApplications: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof PendingApplication>('createdAt');
  const [order, setOrder] = useState<Order>('desc');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, error: fetchError, isLoading, refetch } = useGetPendingApplicationsQuery({
    page: page + 1, // Convert to 1-based for API
    limit: rowsPerPage,
    sortBy: orderBy,
    order
  });

  const [approveApplication, { isLoading: isApproving }] = useApproveApplicationMutation();
  const [verifyCustomer, { isLoading: isVerifying }] = useVerifyCustomerMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof PendingApplication) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property: keyof PendingApplication) => () => {
    handleRequestSort(property);
  };

  const handleApproveApplication = async (userId: string) => {
    try {
      await approveApplication({ userId }).unwrap();
      setSuccessMessage('Application approved successfully');
      refetch();
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to approve application';
      setError(errorMessage);
      console.error('Approve application error:', errorMessage, err);
    }
  };

  const handleVerifyCustomer = async (userId: string) => {
    try {
      await verifyCustomer({ userId }).unwrap();
      setSuccessMessage('Customer verified successfully');
      refetch();
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to verify customer';
      setError(errorMessage);
      console.error('Verify customer error:', errorMessage, err);
    }
  };

  const isActionLoading = isApproving || isVerifying;

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Pending Applications
        </Typography>
      </Box>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : fetchError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load pending applications. Please try again later.
        </Alert>
      ) : (
        <Paper sx={paperWrapperStyles}>
          <TableContainer sx={tableContainerStyles}>
            <Table sx={tableStyles}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={createSortHandler('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>ID Number</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'desc'}
                      onClick={createSortHandler('createdAt')}
                    >
                      Submitted At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((application) => (
                    <TableRow key={application._id} hover>
                      <TableCell>{application.name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>{application.identityNumber || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(application.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <ApplicationActions
                          onApprove={() => handleApproveApplication(application._id)}
                          onVerify={() => handleVerifyCustomer(application._id)}
                          actionInProgress={isApproving ? 'approve' : isVerifying ? 'verify' : null}
                          disabled={isApproving || isVerifying}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No pending applications found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {data?.meta && data.meta.total > 0 && (
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]} 
              component="div"
              count={data.meta.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingApplications;
