import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Accounts: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      All Accounts
    </Typography>
    <Alert severity="info">Table coming soon — integrate /accounts endpoint here.</Alert>
  </Box>
);

export default Accounts;
