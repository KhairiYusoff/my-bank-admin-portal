import React from 'react';
import { useGetAllAccountsQuery, Account } from '../admin/adminApi';
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
  Tooltip,
  Avatar
} from '@mui/material';
import { formatCurrency, formatDate } from '@/utils/formatters';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AccountsList: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { data, error, isLoading } = useGetAllAccountsQuery({
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

  const getStatusColor = (status: Account['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
      case 'dormant':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'savings':
        return 'primary';
      case 'checking':
        return 'success';
      case 'business':
        return 'secondary';
      case 'fixed':
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
        Error loading accounts. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Accounts
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Holder</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Opened</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((account) => (
                <TableRow key={account._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                        <AccountBalanceIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {account.accountNumber}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {account.currency}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {account?.user?.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {account?.user?.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={account.accountType || 'Unknown'}
                      color={getAccountTypeColor(account.accountType) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">
                      {formatCurrency(account.balance)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={account.status ? account.status.charAt(0).toUpperCase() + account.status.slice(1) : 'Unknown'}
                      color={getStatusColor(account.status) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {formatDate(account.dateOpened, 'MMM d, yyyy')}
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
            count={data?.meta?.total || 0}
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

export default AccountsList;
