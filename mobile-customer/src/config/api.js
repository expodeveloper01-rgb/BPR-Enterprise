// API Configuration
export const API_CONFIG = {
  // Development: localhost:5000
  // Production: Your deployed backend URL
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://10.18.100.4:8000",
  API_VERSION: "/api/v1",
  TIMEOUT: 30000,
};

export const API_BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;

export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_VERIFY_EMAIL: "/auth/verify-email",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  AUTH_GOOGLE: "/auth/google",
  AUTH_ME: "/auth/me",

  // Products
  PRODUCTS_LIST: "/products",
  PRODUCTS_GET: (id) => `/products/${id}`,

  // Categories
  CATEGORIES_LIST: "/categories",

  // Kitchens
  KITCHENS_LIST: "/kitchens",
  KITCHENS_GET: (id) => `/kitchens/${id}`,

  // Cart
  CART_GET: "/cart",
  CART_ADD: "/cart/add",
  CART_UPDATE: (id) => `/cart/${id}`,
  CART_REMOVE: (id) => `/cart/${id}`,
  CART_CLEAR: "/cart/clear",

  // Orders
  ORDERS_LIST: "/orders",
  ORDERS_GET: (id) => `/orders/${id}`,
  ORDERS_CREATE: "/orders",
  ORDERS_CANCEL: (id) => `/orders/${id}/cancel`,
  ORDERS_TRACK: (id) => `/orders/${id}/track`,

  // Checkout
  CHECKOUT_CREATE_PAYMENT: "/checkout/create-payment",
  CHECKOUT_VERIFY: "/checkout/verify",

  // Cuisines
  CUISINES_LIST: "/cuisines",

  // Sizes
  SIZES_LIST: "/sizes",

  // Upload
  UPLOAD_IMAGE: "/upload",
};
