import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser } from "@/features/auth/store/authSlice";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const user = useAppSelector(selectCurrentUser);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
