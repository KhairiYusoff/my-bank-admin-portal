import React, { useState } from 'react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreateStaffMutation } from './adminApi';
import { CreateStaffForm } from '@/components/admin/CreateStaffForm';

const CreateStaff: React.FC = () => {
  const navigate = useNavigate();
  const [createStaff, { isLoading, error }] = useCreateStaffMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: { name: string; email: string; password: string; role: 'admin' | 'banker' }) => {
    try {
      await createStaff(data).unwrap();
      setSuccessMessage('Staff member created successfully!');
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      // Error is handled by the error state from the mutation
      console.error('Failed to create staff:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Staff Member
      </Typography>
      
      <Box mt={4} maxWidth="md">
        <CreateStaffForm
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error ? 'Failed to create staff member. Please try again.' : undefined}
        />
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateStaff;
