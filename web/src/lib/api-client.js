import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the JWT token from persisted auth store on every request
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem("auth-storage");
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch {
      // ignore JSON parse errors
    }
  }
  return config;
});

export default apiClient;
