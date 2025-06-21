import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load route components
const Dashboard = lazy(() => import('@/features/dashboard/components/Dashboard'));
const UsersList = lazy(() => import('@/features/users/components/UsersList'));
const CreateStaff = lazy(() => import('@/features/admin/components/CreateStaff'));
const PendingApplications = lazy(() => import('@/features/admin/components/PendingApplications'));
const TransactionsList = lazy(() => import('@/features/transactions/components/TransactionsList'));
const AccountsList = lazy(() => import('@/features/accounts/components/AccountsList'));
const Airdrop = lazy(() => import('@/features/admin/components/Airdrop'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));

// Extend RouteObject to include requiresAuth
interface AppRoute extends Omit<RouteObject, 'children'> {
  requiresAuth?: boolean;
  children?: AppRoute[];
}

// Helper function to create route config with proper typing
const createRoute = (path: string, element: React.ReactNode, requiresAuth = true): AppRoute => ({
  path,
  element,
  requiresAuth,
});

// Define routes configuration
export const routes: AppRoute[] = [
  createRoute('/dashboard', <Dashboard />),
  createRoute('/users', <UsersList />),
  createRoute('/create-staff', <CreateStaff />),
  createRoute('/pending-applications', <PendingApplications />),
  createRoute('/transactions', <TransactionsList />),
  createRoute('/accounts', <AccountsList />),
  createRoute('/airdrop', <Airdrop />),
  createRoute('/profile', <ProfilePage />),
];

// Export default for backward compatibility
export default routes;
