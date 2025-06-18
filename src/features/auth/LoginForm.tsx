import React, { useState, useEffect } from 'react';
import { useLoginMutation } from './authApi';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCredentials } from '@/features/auth/authSlice';
import styles from './LoginForm.module.css';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState<string | null>(null);
  const token = useAppSelector(state => state.auth.token);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login({ email, password }).unwrap();
      console.log(result);
      if (result?.success) {
        const user = result.data?.user || null;
        dispatch(setCredentials({ token: 'session', user }));
      } else {
        setError(result?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Login failed');
    }
  };

  return (
    <Box className={styles.loginContainer}>
      <Typography variant="h5" gutterBottom>Admin Login</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
