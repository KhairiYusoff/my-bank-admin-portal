import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  size = 40,
  color = 'primary',
}) => {
  const spinner = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.default"
        zIndex={1400}
      >
        {spinner}
      </Box>
    );
  }

  return spinner;
};

export default LoadingSpinner;
