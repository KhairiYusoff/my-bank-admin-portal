import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

// TODO: Integrate the /admin/pending-applications API later
const PendingApplications: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      Pending Applications
    </Typography>
    <Alert severity="info">Table coming soon — integrate /admin/pending-applications API here.</Alert>
  </Box>
);

export default PendingApplications;
