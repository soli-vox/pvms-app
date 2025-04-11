import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import notify from "../utils/notify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in on mount
    const token = localStorage.getItem("token");
    if (token) {
      const storedRole = localStorage.getItem("role");
      setUser({ token, role: { slug: storedRole } });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      const { data: userData, token, message } = result;

      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role.slug);

      notify.success(message);
      const dashboardUrl = getDashboardUrl(userData.role.slug);
      navigate(dashboardUrl);
      return { success: true, data: userData, message, token };
    } else {
      notify.error(result.message);
      return { success: false, message: result.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  const getDashboardUrl = (roleSlug) => {
    switch (roleSlug) {
      case "admin":
        return "/admin/dashboard";
      case "bank":
        return `/bank/${user?.slug || "default"}/dashboard`;
      default:
        return "/login";
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getDashboardUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
