import React from 'react';
import { Button } from '@mui/material';
import { useLogoutMutation } from './authApi';
import { useAppDispatch } from '@/app/store';
import { logout as logoutAction } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      // Ignore errors for now
    }
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleLogout} disabled={isLoading} sx={{ mt: 2 }}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  );
};

export default LogoutButton;
