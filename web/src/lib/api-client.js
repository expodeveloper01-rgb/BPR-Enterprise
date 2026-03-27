import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the JWT token from persisted auth store on every request
apiClient.interceptors.request.use((config) => {
  // Only set auth if Authorization header hasn't been set already
  if (!config.headers.Authorization) {
    // Determine which token to use based on current page context
    const isRiderPage = window.location.pathname.includes("/rider");

    if (isRiderPage) {
      // On rider pages, use rider token
      const riderToken = localStorage.getItem("rider-token");
      if (riderToken) {
        config.headers.Authorization = `Bearer ${riderToken}`;
        return config;
      }
    }

    // For non-rider pages (seller, customer), use the regular auth token
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
  }
  return config;
});

export default apiClient;
