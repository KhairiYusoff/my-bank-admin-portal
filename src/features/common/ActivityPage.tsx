import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const ActivityPage: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      My Activity
    </Typography>
    <Alert severity="info">Timeline coming soon — integrate /users/me/activity and /users/activity endpoints here.</Alert>
  </Box>
);

export default ActivityPage;
