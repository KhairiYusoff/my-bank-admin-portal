import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Profile: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      My Profile
    </Typography>
    <Alert severity="info">Profile details coming soon — integrate /users/me endpoint here.</Alert>
  </Box>
);

export default Profile;
