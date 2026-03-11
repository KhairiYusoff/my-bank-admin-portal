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
      <Box className={styles.decorativeBackground} />
      <Box className={styles.loginCard}>
        <Box className={styles.logoSection}>
          <Box className={styles.logoContainer}>
            <img
              src="/bank-logo.svg"
              alt="My Bank Admin"
              className={styles.logo}
            />
          </Box>
          <Typography component="h1" className={styles.title}>
            Welcome Back
          </Typography>
          <Typography className={styles.subtitle}>Sign in to your admin account</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Box className={styles.inputGroup}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                  className={styles.textField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon 
                          sx={{ 
                            color: errors.email ? '#d32f2f' : '#1976d2',
                            fontSize: '1.2rem'
                          }} 
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(15px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3)'
                      }
                    }
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
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                  className={styles.textField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon 
                          sx={{ 
                            color: errors.password ? '#d32f2f' : '#1976d2',
                            fontSize: '1.2rem'
                          }} 
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                          sx={{
                            color: '#1976d2',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(15px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3)'
                      }
                    }
                  }}
                />
              )}
            />
          </Box>
          <Collapse in={!!apiError}>
            <Alert 
              severity={apiError?.isServerError ? 'warning' : 'error'}
              className={styles.errorAlert}
              sx={{
                borderRadius: '12px',
                backgroundColor: apiError?.isServerError ? 'rgba(255, 152, 0, 0.08)' : 'rgba(211, 47, 47, 0.08)',
                backdropFilter: 'blur(15px)',
                border: `1px solid ${apiError?.isServerError ? 'rgba(255, 152, 0, 0.3)' : 'rgba(211, 47, 47, 0.3)'}`,
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
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
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
                  sx={{ 
                    whiteSpace: 'nowrap',
                    borderRadius: '8px'
                  }}
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
            className={styles.loginButton}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginForm;
