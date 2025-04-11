import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FormContainer from "../../components/ui/FormContainer";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import LinkText from "../../components/ui/LinkText";
import authService from "../../services/authService";
import notify from "../../utils/notify";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token] = useState(searchParams.get("token") || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      setError(
        "Invalid reset link. Please use the link provided in your email."
      );
      notify.error("Invalid reset link.");
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      notify.error("Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword({
        email,
        temporary_password: temporaryPassword,
        token,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      if (response.success) {
        notify.success(response.message);
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
      } else {
        setError(response.message);
        // notify.error(response.message); // Already handled in authService
      }
    } catch (err) {
      // Error already handled in authService, but log for debugging
      console.error("Reset Password Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer
      title="Update Password"
      subtitle="Reset your PVMS account password"
    >
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            label="Email address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            disabled={!!searchParams.get("email")}
          />
          <InputField
            label="Temporary Password"
            id="temporaryPassword"
            name="temporaryPassword"
            type="password"
            value={temporaryPassword}
            onChange={(e) => setTemporaryPassword(e.target.value)}
            placeholder="Enter Temporary Password"
            required
          />
          <InputField
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <InputField
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </div>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Back to <LinkText to="/login">Login</LinkText>
      </p>
    </FormContainer>
  );
};

export default ResetPasswordPage;
