import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  Typography,
  IconButton,
  AlertColor,
  FormHelperText,
  Divider,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateProfileMutation } from '@/features/auth/authApi';

// Helper function to get error message
const getErrorHelperText = (error: any): string | undefined => {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if (error?.message && typeof error.message === 'string') return error.message;
  if (Array.isArray(error)) return error[0];
  return 'This field is required';
};

// Define validation schema
const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phoneNumber: yup
    .string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 
      'Please enter a valid phone number'
    )
    .optional(),
  address: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  postalCode: yup
    .string()
    .matches(
      /^[0-9]{5}(?:-[0-9]{4})?|^$/, 
      'Please enter a valid postal code (e.g., 12345 or 12345-6789)'
    )
    .optional(),
  country: yup.string().optional(),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

export interface ProfileEditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: {
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  open, 
  onClose, 
  initialData,
  onSuccess 
}) => {
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors, isDirty },
    setError
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      phoneNumber: initialData.phoneNumber || '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      postalCode: initialData.postalCode || '',
      country: initialData.country || '',
    },
    mode: 'onChange'
  });

  // Reset form when initialData changes or dialog is opened
  useEffect(() => {
    if (open) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postalCode || '',
        country: initialData.country || '',
      } as ProfileFormData);
    }
  }, [open, initialData, reset]);

  const handleCloseDialog = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      await updateProfile(data).unwrap();
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update profile';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
      
      // Set form-level errors if available
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, message]) => {
          setError(field as keyof ProfileFormData, {
            type: 'manual',
            message: Array.isArray(message) ? message[0] : String(message)
          });
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFormClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Edit Profile</Typography>
              <IconButton 
                edge="end" 
onClick={handleCloseDialog} 
                aria-label="close"
                disabled={isLoading}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Full Name"
                        margin="normal"
                        required
                        error={!!errors.name}
                        helperText={getErrorHelperText(errors.name)}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        required
                        error={!!errors.email}
                        helperText={getErrorHelperText(errors.email)}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        margin="normal"
                        error={!!errors.phoneNumber}
                        helperText={getErrorHelperText(errors.phoneNumber)}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Address"
                        margin="normal"
                        multiline
                        rows={2}
                        error={!!errors.address}
                        helperText={getErrorHelperText(errors.address)}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                        margin="normal"
                        error={!!errors.city}
                        helperText={getErrorHelperText(errors.city)}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="State/Province"
                        margin="normal"
                        error={!!errors.state}
                        helperText={getErrorHelperText(errors.state)}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Postal Code"
                        margin="normal"
                        error={!!errors.postalCode}
                        helperText={getErrorHelperText(errors.postalCode) || 'e.g., 12345 or 12345-6789'}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Country"
                        margin="normal"
                        error={!!errors.country}
                        helperText={getErrorHelperText(errors.country)}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleCloseDialog} 
              disabled={isLoading}
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={isLoading || !isDirty}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default ProfileEditForm;
