import React from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectIsAuthenticated } from './authSlice';
import SessionTimeout from './SessionTimeout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

interface LocationState {
  from?: Location;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin role if required
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
  };

  return (
    <>
      {children}
      <SessionTimeout onLogout={handleLogout} />
    </>
  );
};

export default ProtectedRoute;
