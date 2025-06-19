import React from 'react';
import { useGetAllTransactionsQuery, Transaction } from '../admin/adminApi';
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
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import VisibilityIcon from '@mui/icons-material/Visibility';

const TransactionsList: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { data, error, isLoading } = useGetAllTransactionsQuery({
    page: page + 1, // API is 1-based, MUI is 0-based
    limit: rowsPerPage,
    sort: 'desc'
  });
  console.log(data);

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
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    if (!type) return 'default';
    switch (type.toLowerCase()) {
      case 'transfer':
        return 'primary';
      case 'deposit':
      case 'airdrop':
        return 'success';
      case 'withdrawal':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading transactions. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Transactions
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((transaction) => (
                <TableRow key={transaction._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {transaction.account?.accountNumber || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.type?.toUpperCase() || 'UNKNOWN'} 
                      color={getTypeColor(transaction.type) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      color={transaction.amount < 0 ? 'error' : 'success'}
                      fontWeight="medium"
                    >
                      {transaction.amount < 0 ? '' : '+'}{formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status?.toUpperCase() || 'UNKNOWN'} 
                      color={getStatusColor(transaction.status) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {formatDateTime(transaction.date)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {transaction.performedBy?.name || 'System'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {data && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={data.meta.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
};

export default TransactionsList;
