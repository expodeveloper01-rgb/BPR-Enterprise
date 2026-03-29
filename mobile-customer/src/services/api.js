import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG, API_BASE } from "../config/api";

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.token = null;

    // Request interceptor to add token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - token expired or invalid
          await this.clearToken();
          // Trigger logout in main app
        }
        return Promise.reject(error);
      },
    );
  }

  async getToken() {
    try {
      const token = await AsyncStorage.getItem("authToken");
      this.token = token;
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  async setToken(token) {
    try {
      this.token = token;
      await AsyncStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  }

  async clearToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  }

  // Generic methods
  async get(url, config) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch(url, data, config) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
