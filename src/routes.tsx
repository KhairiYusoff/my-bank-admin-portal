import React, { lazy } from "react";
import { RouteObject, useNavigate } from "react-router-dom";

// Lazy load route components
const Dashboard = lazy(
  () => import("@/features/dashboard/components/Dashboard")
);
const UsersList = lazy(() => import("@/features/users/pages/UsersList"));
const PendingApplications = lazy(
  () => import("@/features/admin/components/PendingApplications")
);
const TransactionsList = lazy(
  () => import("@/features/transactions/pages/TransactionsList")
);
const AccountsList = lazy(
  () => import("@/features/accounts/pages/AccountsList")
);
const Airdrop = lazy(() => import("@/features/admin/components/Airdrop"));
const StaffPage = lazy(() => import("@/features/staff/pages/StaffPage"));
const NotFoundPage = lazy(() => import("@/components/shared/NotFoundPage"));

// Extend RouteObject to include requiresAuth
interface AppRoute extends Omit<RouteObject, "children"> {
  requiresAuth?: boolean;
  children?: AppRoute[];
}

// Helper function to create route config with proper typing
const createRoute = (
  path: string,
  element: React.ReactNode,
  requiresAuth = true
): AppRoute => ({
  path,
  element,
  requiresAuth,
});

// Define routes configuration
export const routes: AppRoute[] = [
  createRoute("/dashboard", <Dashboard />),
  createRoute("/users", <UsersList />),
  createRoute("/pending-applications", <PendingApplications />),
  createRoute("/transactions", <TransactionsList />),
  createRoute("/accounts", <AccountsList />),
  createRoute("/airdrop", <Airdrop />),
  createRoute("/staff", <StaffPage />),
  createRoute("*", <NotFoundPage />, false),
];

export default routes;
