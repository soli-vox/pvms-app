import apiService from "./apiService";
import notify from "../utils/notify";
import errorHandler from "../utils/errorHandler";

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiService.post("/login", { email, password });
      const { status, message, data } = response.data;

      if (status === "success") {
        const { user, token } = data;
        return { success: true, data: user, message, token };
      } else {
        notify.error(message);
        return { success: false, message };
      }
    } catch (error) {
      return errorHandler(error);
    }
  },

  logout: () => {
    apiService.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    notify.success("Logged out successfully");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getRole: () => {
    return localStorage.getItem("role");
  },

  resetPassword: async ({
    email,
    temporary_password,
    token,
    new_password,
    new_password_confirmation,
  }) => {
    try {
      const response = await apiService.post("/reset-password", {
        email,
        temporary_password,
        token,
        new_password,
        new_password_confirmation,
      });
      const { status, message, data } = response.data;
      if (status === "success") {
        return { success: true, message, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      const handledError = errorHandler(error);
      notify.error(handledError.message);
      return handledError;
    }
  },
};

export default authService;
