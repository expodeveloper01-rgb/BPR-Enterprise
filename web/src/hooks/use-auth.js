import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const useAuth = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Returns { pendingEmail } — does NOT sign in yet
      register: async (name, email, password) => {
        const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
        return data; // { pendingEmail }
      },

      // Verifies OTP code — signs in on success
      verifyEmail: async (email, code) => {
        const { data } = await axios.post(`${API}/auth/verify-email`, { email, code });
        set({ user: data.user, token: data.token });
      },

      resendCode: async (email) => {
        await axios.post(`${API}/auth/resend-code`, { email });
      },

      login: async (email, password) => {
        const { data } = await axios.post(`${API}/auth/login`, { email, password });
        set({ user: data.user, token: data.token });
      },

      loginWithGoogle: async (credential) => {
        const { data } = await axios.post(`${API}/auth/google`, { credential });
        set({ user: data.user, token: data.token });
      },

      // Refresh user from server (picks up role changes made in DB)
      refreshUser: async (token) => {
        const { data } = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: data.user });
        return data.user;
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);

export default useAuth;
