import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./public/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import JoinUsPage from "./pages/auth/JoinUsPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/common/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BankTypePage from "./pages/admin/BankTypePage";
import RolePage from "./pages/admin/RolePage";
import StatusPage from "./pages/admin/StatusPage";
import MembershipRequestPage from "./pages/admin/MembershipRequestPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/join-us" element={<JoinUsPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/dashboard/bank-types"
            element={<BankTypePage />}
          />
          <Route path="/admin/dashboard/roles" element={<RolePage />} />
          <Route path="/admin/dashboard/status" element={<StatusPage />} />
          <Route
            path="/admin/dashboard/memberships"
            element={<MembershipRequestPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
