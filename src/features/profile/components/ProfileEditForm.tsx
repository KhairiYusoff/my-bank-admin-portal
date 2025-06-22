import React, { useState, useCallback, useEffect } from 'react';
import { 
  useForm, 
  Controller, 
  SubmitHandler, 
  FormProvider, 
  useFormContext,
  FieldValues,
  Resolver
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateProfileMutation } from '@/features/auth/store/authApi';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  useTheme,
  styled,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';

// Styled components
// Removed StyledGrid as it's no longer needed

const MainGrid = styled('div')(({ theme }) => ({
  width: '100%',
  margin: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '& > *': {
    width: '100%',
    boxSizing: 'border-box'
  }
}));

// Form field type
type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

// Validation schema
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
    .required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State/Province is required'),
  postalCode: yup
    .string()
    .matches(
      /^[0-9]{5}(?:-[0-9]{4})?|^$/, 
      'Please enter a valid postal code (e.g., 12345 or 12345-6789)'
    )
    .required('Postal code is required'),
  country: yup.string().required('Country is required'),
});

// Infer the form data type from the schema
type ProfileFormData = yup.InferType<typeof profileSchema>;

// Component props
export interface ProfileEditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: FormData;
}

// Reusable form field component
const FormTextField: React.FC<{
  name: keyof ProfileFormData;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
}> = ({ name, label, type = 'text', multiline = false, rows = 1 }) => {
  const { control, formState: { errors } } = useFormContext<ProfileFormData>();
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          fullWidth
          margin="normal"
          multiline={multiline}
          rows={rows}
          error={!!errors[name]}
          helperText={errors[name]?.message as string}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiFormHelperText-root': {
              ml: 0,
              mt: 0.5,
            },
          }}
        />
      )}
    />
  );
};

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  open, 
  onClose, 
  initialData,
  onSuccess 
}) => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const methods = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as Resolver<ProfileFormData>,
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
    mode: 'onChange',
    criteriaMode: 'all'
  });

  const { 
    handleSubmit, 
    formState: { isSubmitting, isDirty },
    reset,
    control
  } = methods;

  const onSubmit: SubmitHandler<ProfileFormData> = async (data: ProfileFormData) => {
    try {
      const updateData = {
        ...data,
        // Ensure we only send defined values
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        postalCode: data.postalCode || undefined,
        country: data.country || undefined
      };
      
      await updateProfile(updateData).unwrap();
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update profile';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

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
      });
    }
  }, [open, initialData, reset]);

  const handleCloseDialog = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);



  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseDialog} 
      maxWidth="md" 
      fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>
            Edit Profile
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, p: 2 }}>
              <MainGrid>
                <div>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Full Name"
                        error={!!error}
                        helperText={error?.message}
                        margin="normal"
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        error={!!error}
                        helperText={error?.message}
                        margin="normal"
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        error={!!error}
                        helperText={error?.message}
                        margin="normal"
                      />
                    )}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Address"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                        error={!!error}
                        helperText={error?.message}
                        margin="normal"
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="State/Province"
                        error={!!error}
                        helperText={error?.message}
                        margin="normal"
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Postal Code"
                        error={!!error}
                        helperText={error?.message}
                        margin="normal"
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Country"
                        error={!!error}
                        helperText={error?.message}
                        margin="normal"
                      />
                    )}
                  />
                </div>
              </MainGrid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={onClose}
              variant="outlined"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={!isDirty || isSubmitting}
              sx={{ ml: 2 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: theme.shadows[3],
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

// Memoize the component to prevent unnecessary re-renders
const MemoizedProfileEditForm = React.memo(ProfileEditForm);

export { ProfileEditForm };
export default MemoizedProfileEditForm;
