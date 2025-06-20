import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from './authApi';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCredentials } from '@/features/auth/authSlice';
import styles from './LoginForm.module.css';
import { 
  Button, 
  Alert, 
  CircularProgress, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  InputAdornment, 
  IconButton
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
  const [apiError, setApiError] = React.useState<string | null>(null);

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
    setApiError(null);
    try {
      const result = await login({ 
        email: data.email, 
        password: data.password 
      }).unwrap();
      
      if (result?.success) {
        const user = result.data?.user || null;
        dispatch(setCredentials({ token: 'session', user }));
        reset();
      } else {
        setApiError(result?.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Login failed';
      setApiError(errorMessage);
      
      // Set form-level error
      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, message]) => {
          setFormError(field as keyof LoginFormData, {
            type: 'manual',
            message: Array.isArray(message) ? message[0] : String(message)
          });
        });
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
        {apiError && (
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '500px', borderRadius: 2 }}>
            <Alert severity="error">{apiError}</Alert>
          </Paper>
        )}
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
