import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '@/features/auth/store/authApi';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCredentials } from '@/features/auth/store/authSlice';
import styles from '@/features/auth/LoginForm.module.css';
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress, 
  IconButton, 
  InputAdornment, 
  Paper, 
  TextField, 
  Typography, 
  Collapse
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Define validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const token = useAppSelector(state => state.auth.token);
  const [apiError, setApiError] = React.useState<{message: string; isServerError?: boolean} | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    reset
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'Admin123!'
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);
      const result = await login({ 
        email: data.email, 
        password: data.password 
      }).unwrap();
      if (result?.success && result.data?.user) {
        dispatch(setCredentials({ user: result.data.user }));
        navigate('/');
        return;
      }
      
      setApiError({ message: result?.message || 'Login failed. Please try again.' });
    } catch (err: any) {
      // Handle network/server errors
      if (err.status === 'FETCH_ERROR' || err.originalStatus === 0) {
        setApiError({
          message: 'Unable to connect to the server. Please check your internet connection or try again later.',
          isServerError: true
        });
      } else {
        const errorMessage = err?.data?.message || 'An unexpected error occurred. Please try again.';
        setApiError({ message: errorMessage });
        
        // Set form-level error for validation errors
        if (err?.data?.errors) {
          Object.entries(err.data.errors).forEach(([field, message]) => {
            setFormError(field as keyof LoginFormData, {
              type: 'manual',
              message: Array.isArray(message) ? message[0] : String(message)
            });
          });
        }
      }
    }
  };

  return (
    <Box className={styles.loginContainer}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/bank-logo.svg"
          alt="My Bank Admin"
          style={{ width: 60, height: 60, marginBottom: 16 }}
        />
        <Typography component="h1" variant="h5" sx={{ color: '#1976d2', fontWeight: 500 }}>
          Welcome Back
        </Typography>
      </Box>
      <Typography className={styles.subtitle}>Sign in to your admin account</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon color={errors.email ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color={errors.password ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Collapse in={!!apiError}>
          <Alert 
            severity={apiError?.isServerError ? 'warning' : 'error'}
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiAlert-message': {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2
              }
            }}
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
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {apiError?.isServerError ? 'Connection Error' : 'Login Failed'}
              </Typography>
              <Typography variant="body2">
                {apiError?.message}
              </Typography>
            </Box>
            {apiError?.isServerError && (
              <Button 
                variant="outlined" 
                size="small" 
                color="inherit"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Retry
              </Button>
            )}
          </Alert>
        </Collapse>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 500,
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#115293'
            }
          }}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
