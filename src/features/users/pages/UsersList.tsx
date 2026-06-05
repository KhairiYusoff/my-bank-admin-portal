import React from "react";
import { useNavigate } from "react-router-dom";

import { useGetAllCustomersQuery } from "@/features/users/store/usersApi";
import { formatDate } from "@/utils/formatters";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  tableContainerStyles,
  tableStyles,
  paperWrapperStyles,
} from "@/components/shared/TableStyles";
import StatusChip from "@/components/shared/StatusChip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { data, error, isLoading } = useGetAllCustomersQuery({
    page: page + 1,
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

  return (
    <Box sx={{ width: "100%" }}>
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
          {error instanceof Error ? error.message : "Failed to load users"}
        </Alert>
      )}
      {data && data.success && data.data && data.data.length > 0 ? (
        <Paper sx={paperWrapperStyles}>
          <TableContainer sx={tableContainerStyles}>
            <Table sx={tableStyles}>
              <TableHead>
                <TableRow>
                  <TableCell width="18%">Name</TableCell>
                  <TableCell width="22%">Email</TableCell>
                  <TableCell width="12%">Application Status</TableCell>
                  <TableCell width="12%">Account Status</TableCell>
                  <TableCell width="8%">Verified</TableCell>
                  <TableCell width="10%">Created At</TableCell>
                  <TableCell width="15%">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <StatusChip status={user.applicationStatus} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={user.status} />
                    </TableCell>
                    <TableCell>
                      {user.isVerified ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(`/users/${user._id}`, {
                            state: { user },
                          })
                        }
                      >
                        View →
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
            page={data.meta.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </Paper>
      ) : (
        !isLoading &&
        !error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No users found
          </Alert>
        )
      )}
    </Box>
  );
};

export default UsersList;
