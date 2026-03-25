import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import apiClient from "@/lib/api-client";

const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      loaded: false,

      // Fetch cart from server
      fetchCart: async () => {
        try {
          const response = await apiClient.get("/cart");
          const items = response.data.items.map((item) => ({
            id: item.productId,
            cartId: item.id,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            images: item.url ? [{ url: item.url }] : [],
          }));
          set({ items, loaded: true });
        } catch (err) {
          // If fetch fails, keep localStorage items
          set({ loaded: true });
        }
      },

      // Add item to cart
      addItem: async (data) => {
        try {
          const currentItems = get().items;
          const existing = currentItems.find((item) => item.id === data.id);

          if (existing) {
            // Update quantity via API
            await apiClient.put(`/cart/${existing.cartId}`, {
              quantity: existing.qty + (data.qty || 1),
            });
            set({
              items: currentItems.map((item) =>
                item.id === data.id
                  ? { ...item, qty: item.qty + (data.qty || 1) }
                  : item,
              ),
            });
            toast.error("Item already in cart, quantity updated");
          } else {
            // Add new item via API
            const response = await apiClient.post("/cart", {
              productId: data.id,
              quantity: data.qty || 1,
            });
            set({
              items: [
                ...currentItems,
                {
                  id: data.id,
                  cartId: response.data.item.id,
                  name: data.name,
                  price: data.price,
                  qty: data.qty || 1,
                  images: data.images || [],
                },
              ],
            });
            toast.success("Item added to cart");
          }
        } catch (err) {
          toast.error("Failed to add item to cart");
        }
      },

      // Remove item from cart
      removeItem: async (id) => {
        try {
          const item = get().items.find((item) => item.id === id);
          if (item && item.cartId) {
            await apiClient.delete(`/cart/${item.cartId}`);
          }
          set({ items: get().items.filter((item) => item.id !== id) });
          toast.success("Item removed from cart");
        } catch (err) {
          toast.error("Failed to remove item");
        }
      },

      // Clear entire cart
      removeAll: async () => {
        try {
          await apiClient.delete("/cart");
          set({ items: [] });
        } catch (err) {
          // Fail silently for logout scenario
          set({ items: [] });
        }
      },

      // Update item quantity
      updateItemQuantity: async (id, qty) => {
        if (qty < 1) return;
        try {
          const item = get().items.find((item) => item.id === id);
          if (item && item.cartId) {
            await apiClient.put(`/cart/${item.cartId}`, { quantity: qty });
          }
          const updatedItems = get().items.map((item) =>
            item.id === id ? { ...item, qty } : item,
          );
          set({ items: updatedItems });
        } catch (err) {
          toast.error("Failed to update quantity");
        }
      },
    }),
    { name: "cart-storage", storage: createJSONStorage(() => localStorage) },
  ),
);

export default useCart;
