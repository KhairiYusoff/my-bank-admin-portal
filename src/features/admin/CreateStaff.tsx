import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

// TODO: Integrate the create-staff API later
const CreateStaff: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      Create Staff
    </Typography>
    <Alert severity="info">Form coming soon — integrate /admin/create-staff API here.</Alert>
  </Box>
);

export default CreateStaff;
