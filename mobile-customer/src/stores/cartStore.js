import { create } from "zustand";
import { cartService } from "../services/cart-order.service";

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,

  // Initialize cart from backend
  initializeCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cartData = await cartService.getCart();
      set({
        items: cartData.items || [],
        total: cartData.total || 0,
        itemCount: (cartData.items || []).length,
      });
    } catch (error) {
      console.error("Error loading cart:", error);
      // Fail silently - cart might be empty
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity, selectedOptions = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.addToCart(
        productId,
        quantity,
        selectedOptions,
      );
      set({
        items: response.items || [],
        total: response.total || 0,
        itemCount: (response.items || []).length,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add item to cart";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (cartItemId, quantity, selectedOptions = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.updateCartItem(
        cartItemId,
        quantity,
        selectedOptions,
      );
      set({
        items: response.items || [],
        total: response.total || 0,
        itemCount: (response.items || []).length,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart item";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (cartItemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.removeFromCart(cartItemId);
      set({
        items: response.items || [],
        total: response.total || 0,
        itemCount: (response.items || []).length,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove item";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({
        items: [],
        total: 0,
        itemCount: 0,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to clear cart";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
