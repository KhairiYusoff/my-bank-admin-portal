import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './features/auth/LoginForm';
import Dashboard from './features/dashboard/Dashboard';
import UsersList from './features/users/UsersList';
import { useAppSelector } from './app/store';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/users"
      element={
        <PrivateRoute>
          <UsersList />
        </PrivateRoute>
      }
    />
    {/* Add more protected routes here as needed */}
  </Routes>
);

export default AppRoutes;
