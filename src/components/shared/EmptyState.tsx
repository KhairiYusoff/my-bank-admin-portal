import React from 'react';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactElement;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={10}
      sx={{
        color: 'text.secondary',
        textAlign: 'center',
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 80, mb: 2 } })}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
