import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useLogoutMutation } from './authApi';
import { useAppDispatch } from '@/app/store';
import { logout as logoutAction } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

interface LogoutButtonProps extends ButtonProps {}

const LogoutButton: React.FC<LogoutButtonProps> = ({ children, ...props }) => {
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
    <Button
      variant="text"
      color="inherit"
      onClick={handleLogout}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Logging out...' : (children || 'Logout')}
    </Button>
  );
};

export default LogoutButton;
