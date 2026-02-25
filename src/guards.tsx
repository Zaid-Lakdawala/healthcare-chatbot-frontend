import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser, isTokenValid } from "@/lib/isTokenValid.ts";

export const UserProtectedRoute = () => {
  const isValid = isTokenValid();
  const user = getAuthUser();

  if (!isValid || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AdminProtectedRoute = () => {
  const isValid = isTokenValid();
  const user = getAuthUser();

  if (!isValid || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
