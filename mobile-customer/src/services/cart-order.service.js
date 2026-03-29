import { ENDPOINTS } from "../config/api";
import { apiService } from "./api";

export const cartService = {
  async getCart() {
    try {
      return await apiService.get(ENDPOINTS.CART_GET);
    } catch (error) {
      throw error;
    }
  },

  async addToCart(productId, quantity, selectedOptions = {}) {
    try {
      return await apiService.post(ENDPOINTS.CART_ADD, {
        productId,
        quantity,
        selectedOptions,
      });
    } catch (error) {
      throw error;
    }
  },

  async updateCartItem(cartItemId, quantity, selectedOptions = {}) {
    try {
      return await apiService.put(ENDPOINTS.CART_UPDATE(cartItemId), {
        quantity,
        selectedOptions,
      });
    } catch (error) {
      throw error;
    }
  },

  async removeFromCart(cartItemId) {
    try {
      return await apiService.delete(ENDPOINTS.CART_REMOVE(cartItemId));
    } catch (error) {
      throw error;
    }
  },

  async clearCart() {
    try {
      return await apiService.post(ENDPOINTS.CART_CLEAR);
    } catch (error) {
      throw error;
    }
  },
};

export const orderService = {
  async getOrders(params = {}) {
    try {
      return await apiService.get(ENDPOINTS.ORDERS_LIST, { params });
    } catch (error) {
      throw error;
    }
  },

  async getOrder(id) {
    try {
      return await apiService.get(ENDPOINTS.ORDERS_GET(id));
    } catch (error) {
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      return await apiService.post(ENDPOINTS.ORDERS_CREATE, orderData);
    } catch (error) {
      throw error;
    }
  },

  async cancelOrder(id, reason = "") {
    try {
      return await apiService.post(ENDPOINTS.ORDERS_CANCEL(id), {
        reason,
      });
    } catch (error) {
      throw error;
    }
  },

  async trackOrder(id) {
    try {
      return await apiService.get(ENDPOINTS.ORDERS_TRACK(id));
    } catch (error) {
      throw error;
    }
  },
};

export const checkoutService = {
  async createPayment(orderData) {
    try {
      return await apiService.post(
        ENDPOINTS.CHECKOUT_CREATE_PAYMENT,
        orderData,
      );
    } catch (error) {
      throw error;
    }
  },

  async verifyPayment(paymentId, stripeToken) {
    try {
      return await apiService.post(ENDPOINTS.CHECKOUT_VERIFY, {
        paymentId,
        stripeToken,
      });
    } catch (error) {
      throw error;
    }
  },
};
