import { create } from "zustand";
import {
  productService,
  categoryService,
  kitchenService,
  cuisineService,
  sizeService,
} from "../services/products.service";

export const useProductStore = create((set) => ({
  products: [],
  categories: [],
  kitchens: [],
  cuisines: [],
  sizes: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  selectedCuisine: null,

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await productService.getProducts(params);
      set({ products: data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch products";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  searchProducts: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const data = await productService.searchProducts(query);
      set({ products: data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Search failed";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const data = await categoryService.getCategories();
      set({ categories: data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  fetchKitchens: async (params = {}) => {
    try {
      const data = await kitchenService.getKitchens(params);
      set({ kitchens: data });
    } catch (error) {
      console.error("Failed to fetch kitchens:", error);
    }
  },

  fetchCuisines: async () => {
    try {
      const data = await cuisineService.getCuisines();
      set({ cuisines: data });
    } catch (error) {
      console.error("Failed to fetch cuisines:", error);
    }
  },

  fetchSizes: async () => {
    try {
      const data = await sizeService.getSizes();
      set({ sizes: data });
    } catch (error) {
      console.error("Failed to fetch sizes:", error);
    }
  },

  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSelectedCuisine: (cuisineId) => set({ selectedCuisine: cuisineId }),
  clearFilters: () => set({ selectedCategory: null, selectedCuisine: null }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
