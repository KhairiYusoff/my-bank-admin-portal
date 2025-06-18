import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAppSelector } from '../../app/store';
import LogoutButton from '../auth/LogoutButton';

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'Admin'}!
      </Typography>
      <Typography variant="subtitle1">Role: {user?.role}</Typography>
      <LogoutButton />
      {/* More dashboard content coming soon */}
    </Box>
  );
};

export default Dashboard;
