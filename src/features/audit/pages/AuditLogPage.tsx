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
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useGetAllAuditLogsQuery } from "../store/auditApi";
import StatusChip from "@/components/shared/StatusChip";
import { format } from "date-fns";
import { StyledTableCell, StyledTableRow } from "@/components/shared/TableStyles";

const AuditLogPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    action: "",
    severity: "",
    status: "",
  });

  const { data, isLoading, error, refetch, isFetching } = useGetAllAuditLogsQuery({
    page: page + 1,
    limit: rowsPerPage,
    ...filters,
  });

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      default:
        return "default";
    }
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load audit logs. Please try again later.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          System Audit Logs
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={() => refetch()} disabled={isFetching}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Action"
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Severity"
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="">All Severities</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="CRITICAL">Critical</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="SUCCESS">Success</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="WARNING">Warning</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ position: "relative" }}>
        {isFetching && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Timestamp</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Severity</StyledTableCell>
              <StyledTableCell>IP Address</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((log) => (
                <StyledTableRow key={log._id}>
                  <TableCell>{format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {log.user?.name || "System"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.user?.email || "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{log.action.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <StatusChip status={log.status} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={log.severity} color={getSeverityColor(log.severity)} />
                  </TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data?.meta.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Box>
  );
};

export default AuditLogPage;
