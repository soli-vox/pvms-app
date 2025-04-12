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
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentAuthUser();
        if (response.success) {
          setUser(response.data);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    if (authService.isAuthenticated()) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        const { data: userData, token, message } = result;
        setUser(userData);
        localStorage.setItem("token", token);
        notify.success(message);

        // Redirect based on role and slug
        const dashboardUrl = getDashboardUrl(userData);
        navigate(dashboardUrl);
        return { success: true, data: userData, message, token };
      } else {
        notify.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      notify.error(error.message || "Login failed");
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      notify.error("Logout failed");
    }
  };

  const getDashboardUrl = (userData) => {
    if (!userData?.role?.slug) {
      return "/login";
    }
    switch (userData.role.slug) {
      case "admin":
        return "/admin/dashboard";
      case "bank":
        return `/bank/${userData.slug || "default"}/dashboard`;
      case "valuer":
        return "/valuer/dashboard";
      default:
        return "/dashboard";
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
