import React, { useState } from "react";
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
  Chip,
  Tooltip,
} from "@mui/material";
import {
  tableContainerStyles,
  tableStyles,
  paperWrapperStyles,
} from "@/components/shared/TableStyles";
import {
  useGetPendingAccountRequestsQuery,
  useApproveAccountRequestMutation,
  useRejectAccountRequestMutation,
} from "@/features/accounts/store/accountsApi";
import type { Account } from "@/features/accounts/types";
import AccountRequestActions from "./AccountRequestActions";

type Order = "asc" | "desc";

const AccountRequests: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>("desc");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data,
    error: fetchError,
    isLoading,
    refetch,
  } = useGetPendingAccountRequestsQuery({
    page: page + 1,
    limit: rowsPerPage,
    sort: order,
  });

  const [approveRequest] = useApproveAccountRequestMutation();
  const [rejectRequest] = useRejectAccountRequestMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleApprove = async (accountId: string) => {
    try {
      await approveRequest({ accountId }).unwrap();
      setSuccessMessage("Account request approved successfully");
      refetch();
    } catch (err: any) {
      setError(err.data?.message || "Failed to approve request");
    }
  };

  const handleReject = async (accountId: string, reason: string) => {
    try {
      await rejectRequest({ accountId, reason }).unwrap();
      setSuccessMessage("Account request rejected");
      refetch();
    } catch (err: any) {
      setError(err.data?.message || "Failed to reject request");
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : fetchError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load account requests.
        </Alert>
      ) : (
        <Paper sx={paperWrapperStyles}>
          <TableContainer sx={tableContainerStyles}>
            <Table sx={tableStyles}>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Initial Deposit</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={true}
                      direction={order}
                      onClick={handleRequestSort}
                    >
                      Requested At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((request: Account) => (
                    <TableRow key={request._id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {request.user?.name || "Unknown"}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.user?.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.accountType.replace("_", " ").toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        RM {request.principal || 0}
                      </TableCell>
                      <TableCell>
                        {request.accountType === "fixed_deposit" && (
                          <Typography variant="caption" display="block">
                            Lock Period: {request.lockPeriod} months
                          </Typography>
                        )}
                        {request.accountType === "business" && (
                          <Tooltip title="View Doc">
                            <Chip
                              label="Doc Attached"
                              size="small"
                              variant="outlined"
                              onClick={() => {}}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        <AccountRequestActions
                          onApprove={() => handleApprove(request._id)}
                          onReject={(reason) => handleReject(request._id, reason)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No pending account requests found
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountRequests;
