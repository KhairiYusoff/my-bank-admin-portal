import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGetUserActivityQuery, Activity } from '../store/adminApi';
import EmptyState from '@/components/shared/EmptyState';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';

interface UserActivityModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
}

const UserActivityModal: React.FC<UserActivityModalProps> = ({ open, onClose, userId }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    data: activityResponse,
    error,
    isLoading,
  } = useGetUserActivityQuery({
    userId: userId!,
    page: page + 1,
    limit: rowsPerPage,
  }, { skip: !userId || !open });

  const activities = activityResponse?.data;
  const meta = activityResponse?.meta;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset pagination when modal is closed or userId changes
  React.useEffect(() => {
    if (!open) {
      setPage(0);
      setRowsPerPage(10);
    }
  }, [open]);

  const renderContent = () => {
    if (isLoading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Failed to load user activity.</Alert>;
    if (!activities || activities.length === 0) return (
      <EmptyState
        icon={<HistoryEduOutlinedIcon />}
        title="No Activity Found"
        message="There are no activity records for this user yet."
      />
    );

    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity: Activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{new Date(activity.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.status}</TableCell>
                  <TableCell>{activity.severity}</TableCell>
                  <TableCell>{activity.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {meta && meta.total > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={meta.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        User Activity Log
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserActivityModal;
