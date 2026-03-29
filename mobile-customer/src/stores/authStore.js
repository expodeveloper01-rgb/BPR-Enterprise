import { create } from "zustand";
import { authService } from "../services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Initialize auth state from storage
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token) {
        // Token exists, restore user data
        let user = userData ? JSON.parse(userData) : null;

        // If no cached user data, try to fetch from API
        if (!user) {
          try {
            user = await authService.getCurrentUser();
            if (user) {
              await AsyncStorage.setItem("userData", JSON.stringify(user));
            }
          } catch (err) {
            console.log("Could not fetch user profile:", err);
          }
        }

        set({
          token,
          user: user || null,
          isAuthenticated: true,
        });
      } else {
        // No token found
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      await AsyncStorage.setItem("authToken", response.token);

      let user = response.user || null;

      // If no user in response, try to fetch it
      if (!user) {
        try {
          user = await authService.getCurrentUser();
        } catch (err) {
          console.log("Could not fetch user profile:", err);
        }
      }

      // Save user data if we have it
      if (user) {
        await AsyncStorage.setItem("userData", JSON.stringify(user));
      }

      set({
        user: user || null,
        token: response.token,
        isAuthenticated: true,
        error: null,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      set({ error: errorMessage, isAuthenticated: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (firstName, lastName, email, password, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
      });
      await AsyncStorage.setItem("authToken", response.token);

      let user = response.user || null;

      // If no user in response, try to fetch it
      if (!user) {
        try {
          user = await authService.getCurrentUser();
        } catch (err) {
          console.log("Could not fetch user profile:", err);
        }
      }

      // Save user data if we have it
      if (user) {
        await AsyncStorage.setItem("userData", JSON.stringify(user));
      }

      set({
        user: user || null,
        token: response.token,
        isAuthenticated: true,
        error: null,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      set({ error: errorMessage, isAuthenticated: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  googleLogin: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.googleLogin(idToken);
      await AsyncStorage.setItem("authToken", response.token);

      let user = response.user || null;

      // If no user in response, try to fetch it
      if (!user) {
        try {
          user = await authService.getCurrentUser();
        } catch (err) {
          console.log("Could not fetch user profile:", err);
        }
      }

      // Save user data if we have it
      if (user) {
        await AsyncStorage.setItem("userData", JSON.stringify(user));
      }

      set({
        user: user || null,
        token: response.token,
        isAuthenticated: true,
        error: null,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      set({ error: errorMessage, isAuthenticated: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email, token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email, token, newPassword);
      set({ error: null });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      await authService.verifyEmail(email, code);
      set({ error: null });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Email verification failed";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
