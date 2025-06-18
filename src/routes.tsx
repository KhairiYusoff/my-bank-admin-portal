import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '@/features/auth/LoginForm';
import Dashboard from '@/features/dashboard/Dashboard';
import UsersList from '@/features/users/UsersList';
import CreateStaff from '@/features/admin/CreateStaff';
import PendingApplications from '@/features/admin/PendingApplications';
import AdminLayout from 'components/AdminLayout';
import Transactions from '@/features/admin/Transactions';
import Accounts from '@/features/admin/Accounts';
import ActivityPage from '@/features/common/ActivityPage';
import Airdrop from '@/features/admin/Airdrop';
import Profile from '@/features/common/Profile';
import UpdateProfile from '@/features/common/UpdateProfile';
import { useAppSelector } from '@/app/store';

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
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="users" element={<UsersList />} />
      <Route path="create-staff" element={<CreateStaff />} />
      <Route path="pending-applications" element={<PendingApplications />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="activity" element={<ActivityPage />} />
      <Route path="airdrop" element={<Airdrop />} />
      <Route path="profile" element={<Profile />} />
      <Route path="update-profile" element={<UpdateProfile />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
