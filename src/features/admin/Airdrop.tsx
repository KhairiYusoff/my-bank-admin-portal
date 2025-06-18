import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Airdrop: React.FC = () => (
  <Box p={2}>
    <Typography variant="h5" gutterBottom>
      Airdrop Tokens
    </Typography>
    <Alert severity="info">Form coming soon — integrate /admin/airdrop endpoint here.</Alert>
  </Box>
);

export default Airdrop;
