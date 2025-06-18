import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Transactions: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      All Transactions
    </Typography>
    <Alert severity="info">Table coming soon — integrate /transactions endpoint here.</Alert>
  </Box>
);

export default Transactions;
