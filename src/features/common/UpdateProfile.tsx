import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const UpdateProfile: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      Update Profile
    </Typography>
    <Alert severity="info">Form coming soon — integrate /users/me (PUT) endpoint here.</Alert>
  </Box>
);

export default UpdateProfile;
