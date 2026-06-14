import React, { lazy } from "react";
import { RouteObject } from "react-router-dom";
import RoleGuard from "@/features/auth/components/RoleGuard";

// Lazy load route components
const Dashboard = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);
const UsersList = lazy(() => import("@/features/users/pages/UsersList"));
const UserDetailPage = lazy(
  () => import("@/features/users/pages/UserDetailPage"),
);
const ApprovalHub = lazy(
  () => import("@/features/accounts/pages/ApprovalHub"),
);
const AuditLogPage = lazy(() => import("@/features/audit/pages/AuditLogPage"));
const TransactionsList = lazy(
  () => import("@/features/transactions/pages/TransactionsList"),
);
const AccountsList = lazy(
  () => import("@/features/accounts/pages/AccountsList"),
);
const AccountDetailPage = lazy(
  () => import("@/features/accounts/pages/AccountDetailPage"),
);
const AccountTransactionsPage = lazy(
  () => import("@/features/accounts/pages/AccountTransactionsPage"),
);
const Airdrop = lazy(() => import("@/features/admin/components/Airdrop"));
const StaffPage = lazy(() => import("@/features/staff/pages/StaffPage"));
const StaffDetailPage = lazy(
  () => import("@/features/staff/pages/StaffDetailPage"),
);
const NotFoundPage = lazy(() => import("@/components/shared/NotFoundPage"));
const ForbiddenPage = lazy(() => import("@/components/shared/ForbiddenPage"));

// Extend RouteObject to include requiresAuth
interface AppRoute extends Omit<RouteObject, "children"> {
  requiresAuth?: boolean;
  allowedRoles?: string[];
  children?: AppRoute[];
}

// Helper function to create route config with proper typing
const createRoute = (
  path: string,
  element: React.ReactNode,
  requiresAuth = true,
  allowedRoles?: string[],
): AppRoute => ({
  path,
  element: allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{element}</RoleGuard>
  ) : (
    element
  ),
  requiresAuth,
});

// Define routes configuration
export const routes: AppRoute[] = [
  createRoute("/dashboard", <Dashboard />),
  createRoute("/users", <UsersList />, true, ["admin", "banker", "auditor"]),
  createRoute("/users/:id", <UserDetailPage />, true, [
    "admin",
    "banker",
    "auditor",
  ]),
  createRoute("/approvals", <ApprovalHub />, true, [
    "admin",
    "banker",
    "auditor",
  ]),
  createRoute("/audit", <AuditLogPage />, true, ["admin", "auditor"]),
  createRoute("/transactions", <TransactionsList />, true, [
    "admin",
    "banker",
    "auditor",
  ]),
  createRoute("/accounts", <AccountsList />, true, [
    "admin",
    "banker",
    "auditor",
  ]),
  createRoute("/accounts/:accountNumber", <AccountDetailPage />, true, [
    "admin",
    "banker",
    "auditor",
  ]),
  createRoute(
    "/accounts/:accountNumber/transactions",
    <AccountTransactionsPage />,
    true,
    ["admin", "banker", "auditor"],
  ),
  createRoute("/airdrop", <Airdrop />, true, ["admin"]),
  createRoute("/staff", <StaffPage />, true, ["admin"]),
  createRoute("/staff/:id", <StaffDetailPage />, true, ["admin"]),
  createRoute("/forbidden", <ForbiddenPage />, false),
  createRoute("*", <NotFoundPage />, false),
];

export default routes;
