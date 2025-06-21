import React from 'react';
import { Chip } from '@mui/material';
import { ChipProps } from '@mui/material/Chip';

interface StatusChipProps {
  status: string;
}

const getStatusColor = (status: string): ChipProps['color'] => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'approved':
    case 'success':
      return 'success';
    case 'inactive':
    case 'pending':
      return 'warning';
    case 'suspended':
    case 'rejected':
    case 'failed':
    case 'error':
      return 'error';
    case 'processing':
    case 'info':
      return 'info';
    default:
      return 'default';
  }
};

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  return (
    <Chip
      label={status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
      color={getStatusColor(status)}
      size="small"
      sx={{ minWidth: '80px', textTransform: 'capitalize' }}
    />
  );
};

export default StatusChip;
