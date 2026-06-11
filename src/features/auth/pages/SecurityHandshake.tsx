import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useChangePasswordMutation } from '@/features/auth/store/authApi';
import { useAppDispatch } from '@/app/hooks';
import { setPasswordChanged, logout } from '@/features/auth/store/authSlice';
import styles from '@/features/auth/pages/LoginForm.module.css';
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress, 
  IconButton, 
  InputAdornment, 
  TextField, 
  Typography, 
  Collapse
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

// Define validation schema
const handshakeSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password')
});

type HandshakeFormData = yup.InferType<typeof handshakeSchema>;

const SecurityHandshake: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<{message: string; isServerError?: boolean} | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<HandshakeFormData>({
    resolver: yupResolver(handshakeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: HandshakeFormData) => {
    try {
      setApiError(null);
      const result = await changePassword({ 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      }).unwrap();
      
      if (result?.success) {
        dispatch(setPasswordChanged());
        navigate('/dashboard');
        return;
      }
      
      setApiError({ message: result?.message || 'Password change failed. Please try again.' });
    } catch (err: any) {
      if (err.status === 'FETCH_ERROR' || err.originalStatus === 0) {
        setApiError({
          message: 'Unable to connect to the server. Please check your internet connection.',
          isServerError: true
        });
      } else {
        const errorMessage = err?.data?.message || 'An unexpected error occurred. Please try again.';
        setApiError({ message: errorMessage });
        
        if (err?.data?.errors) {
          Object.entries(err.data.errors).forEach(([field, message]) => {
            setFormError(field as keyof HandshakeFormData, {
              type: 'manual',
              message: Array.isArray(message) ? message[0] : String(message)
            });
          });
        }
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box className={styles.loginContainer}>
      <Box className={styles.decorativeBackground} />
      <Box className={styles.loginCard}>
        <Box className={styles.logoSection}>
          <Box className={styles.logoContainer}>
            <SecurityIcon 
              sx={{ 
                fontSize: '2.5rem', 
                color: '#fff',
                zIndex: 1
              }} 
            />
          </Box>
          <Typography component="h1" className={styles.title}>
            Secure Your Account
          </Typography>
          <Typography className={styles.subtitle}>
            Please change your temporary password to continue.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Box className={styles.inputGroup}>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current Temporary Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Collapse in={!!apiError}>
            <Alert 
              severity="error"
              sx={{ mb: 3, borderRadius: '12px' }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setApiError(null)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {apiError?.message}
            </Alert>
          </Collapse>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            className={styles.loginButton}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>

          <Button
            fullWidth
            onClick={handleLogout}
            disabled={isLoading}
            sx={{ 
              color: '#666',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
            }}
          >
            Cancel and Logout
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SecurityHandshake;
