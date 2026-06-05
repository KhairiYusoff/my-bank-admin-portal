import React from "react";
import { useGetAllTransactionsQuery } from "@/features/transactions/store/transactionsApi";
import type { Transaction } from "@/features/transactions/types";
import { TransactionDetailDrawer } from "@/features/transactions/components";
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
} from "@mui/material";
import {
  tableContainerStyles,
  tableStyles,
  paperWrapperStyles,
} from "@/components/shared/TableStyles";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StatusChip from "@/components/shared/StatusChip";
import {
  getTransactionTypeColor,
  getTransactionTypeLabel,
} from "@/features/transactions/utils/transactionColors";

const TransactionsList: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);

  const { data, error, isLoading } = useGetAllTransactionsQuery({
    page: page + 1, // API is 1-based, MUI is 0-based
    limit: rowsPerPage,
    sort: "desc",
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Transactions
      </Typography>

      <Paper sx={paperWrapperStyles}>
        <TableContainer sx={tableContainerStyles}>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((transaction) => (
                <TableRow key={transaction._id} hover>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      fontFamily="monospace"
                    >
                      {transaction.reference ?? "—"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {transaction.account?.accountNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTransactionTypeLabel(
                        transaction.type,
                        transaction.direction,
                      )}
                      color={
                        getTransactionTypeColor(
                          transaction.type,
                          transaction.direction,
                        ) as any
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={transaction.amount < 0 ? "error" : "success"}
                      fontWeight="medium"
                    >
                      {transaction.amount < 0 ? "" : "+"}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={transaction.status} />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {formatDateTime(transaction.date)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {transaction.performedBy?.name || "System"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
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

      <TransactionDetailDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </Box>
  );
};

export default TransactionsList;
