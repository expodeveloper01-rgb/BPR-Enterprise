import { ENDPOINTS } from "../config/api";
import { apiService } from "./api";

export const productService = {
  async getProducts(params = {}) {
    try {
      return await apiService.get(ENDPOINTS.PRODUCTS_LIST, { params });
    } catch (error) {
      throw error;
    }
  },

  async getProduct(id) {
    try {
      return await apiService.get(ENDPOINTS.PRODUCTS_GET(id));
    } catch (error) {
      throw error;
    }
  },

  async searchProducts(query) {
    try {
      return await apiService.get(ENDPOINTS.PRODUCTS_LIST, {
        params: { search: query },
      });
    } catch (error) {
      throw error;
    }
  },
};

export const categoryService = {
  async getCategories() {
    try {
      return await apiService.get(ENDPOINTS.CATEGORIES_LIST);
    } catch (error) {
      throw error;
    }
  },
};

export const kitchenService = {
  async getKitchens(params = {}) {
    try {
      return await apiService.get(ENDPOINTS.KITCHENS_LIST, { params });
    } catch (error) {
      throw error;
    }
  },

  async getKitchen(id) {
    try {
      return await apiService.get(ENDPOINTS.KITCHENS_GET(id));
    } catch (error) {
      throw error;
    }
  },
};

export const cuisineService = {
  async getCuisines() {
    try {
      return await apiService.get(ENDPOINTS.CUISINES_LIST);
    } catch (error) {
      throw error;
    }
  },
};

export const sizeService = {
  async getSizes() {
    try {
      return await apiService.get(ENDPOINTS.SIZES_LIST);
    } catch (error) {
      throw error;
    }
  },
};
