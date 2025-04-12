import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ role, expectedSlug }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if a specific role is required
  if (role && user.role.slug !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If a slug is expected (e.g., for banks), verify it matches the user's slug
  if (expectedSlug && user.slug !== expectedSlug) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
