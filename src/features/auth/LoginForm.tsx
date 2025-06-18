import React, { useState } from 'react';
import { useLoginMutation } from './authApi';
import { useAppDispatch } from '../../app/store';
import { setCredentials } from './authSlice';
import styles from './LoginForm.module.css';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login({ email, password }).unwrap();
      console.log(result);
      dispatch(setCredentials({ token: result.token, user: result.user }));
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
