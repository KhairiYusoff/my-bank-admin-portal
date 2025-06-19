import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginForm from '@/features/auth/LoginForm';
import Dashboard from '@/features/dashboard/Dashboard';
import UsersList from '@/features/users/UsersList';
import CreateStaff from '@/features/admin/CreateStaff';
import PendingApplications from '@/features/admin/PendingApplications';
import AdminLayout from 'components/AdminLayout';
import TransactionsList from '@/features/transactions/TransactionsList';
import AccountsList from '@/features/accounts/AccountsList';
import Airdrop from '@/features/admin/Airdrop';
import Profile from '@/features/common/Profile';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import { useAppDispatch } from '@/app/hooks';
import { updateActivity } from '@/features/auth/authSlice';

// Component to track user activity
const ActivityTracker = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  React.useEffect(() => {
    const handleActivity = () => {
      dispatch(updateActivity());
    };

    // Track mouse movements, clicks, and key presses
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Update activity on route change
    handleActivity();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [dispatch, location]);

  return null;
};

const AppRoutes = () => (
  <>
    <ActivityTracker />
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/unauthorized" element={<div>Unauthorized access</div>} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="create-staff" element={<CreateStaff />} />
        <Route path="pending-applications" element={<PendingApplications />} />
        <Route path="transactions" element={<TransactionsList />} />
        <Route path="accounts" element={<AccountsList />} />
        <Route path="airdrop" element={<Airdrop />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default AppRoutes;
