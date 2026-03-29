import { ENDPOINTS } from "../config/api";
import { apiService } from "./api";

export const authService = {
  async login(credentials) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH_LOGIN, credentials);
      if (response.token) {
        await apiService.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  async register(data) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH_REGISTER, data);
      if (response.token) {
        await apiService.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      // Try to notify backend, but don't fail if endpoint doesn't exist
      try {
        await apiService.post(ENDPOINTS.AUTH_LOGOUT);
      } catch (err) {
        // Log but don't throw - clearing token is what matters
        console.log("Backend logout failed (optional):", err.message);
      }
      await apiService.clearToken();
    } catch (error) {
      // Error shouldn't happen now, but clear token anyway
      await apiService.clearToken();
      throw error;
    }
  },

  async googleLogin(idToken) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH_GOOGLE, {
        idToken,
      });
      if (response.token) {
        await apiService.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(email, token, newPassword) {
    try {
      await apiService.post(ENDPOINTS.AUTH_RESET_PASSWORD, {
        email,
        token,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  },

  async verifyEmail(email, code) {
    try {
      await apiService.post(ENDPOINTS.AUTH_VERIFY_EMAIL, {
        email,
        code,
      });
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiService.get(ENDPOINTS.AUTH_ME);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
