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
            id: `${item.productId}-${item.sizeId || "no-size"}`,
            cartId: item.id,
            productId: item.productId,
            sizeId: item.sizeId,
            size: item.sizeName,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            images: item.url ? [{ url: item.url }] : [],
            category: item.category,
            cuisine: item.cuisine,
            kitchen: item.kitchen,
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
          const sizeId = data.sizeId || null;
          const itemId = `${data.id}-${sizeId || "no-size"}`;
          const existing = currentItems.find((item) => item.id === itemId);

          if (existing) {
            // Update quantity via API
            await apiClient.put(`/cart/${existing.cartId}`, {
              quantity: existing.qty + (data.qty || 1),
            });
            set({
              items: currentItems.map((item) =>
                item.id === itemId
                  ? { ...item, qty: item.qty + (data.qty || 1) }
                  : item,
              ),
            });
            toast.error("Item already in cart, quantity updated");
          } else {
            // Add new item via API
            const response = await apiClient.post("/cart", {
              productId: data.id,
              sizeId: sizeId,
              quantity: data.qty || 1,
            });

            // Backend returns full cart items array
            const newItem = response.data.items?.[0] || response.data.item;
            if (newItem) {
              set({
                items: [
                  ...currentItems,
                  {
                    id: itemId,
                    cartId: newItem.id,
                    productId: data.id,
                    sizeId: sizeId,
                    size: data.sizeName,
                    name: data.name,
                    price: data.price,
                    qty: data.qty || 1,
                    images: newItem.url
                      ? [{ url: newItem.url }]
                      : data.images || [],
                    category: data.category,
                    cuisine: data.cuisine,
                    kitchen: data.kitchen,
                  },
                ],
              });
              toast.success("Item added to cart");
            }
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
            const response = await apiClient.delete(`/cart/${item.cartId}`);
            // Use response items if available, otherwise filter locally
            if (response.data?.items) {
              const mappedItems = response.data.items.map((backendItem) => {
                const sizeId = backendItem.sizeId;
                return {
                  id: `${backendItem.productId}-${sizeId || "no-size"}`,
                  cartId: backendItem.id,
                  productId: backendItem.productId,
                  sizeId: sizeId,
                  size: backendItem.sizeName,
                  name: backendItem.name,
                  price: backendItem.price,
                  qty: backendItem.quantity,
                  images: backendItem.url ? [{ url: backendItem.url }] : [],
                  category: backendItem.category,
                  cuisine: backendItem.cuisine,
                  kitchen: backendItem.kitchen,
                };
              });
              set({ items: mappedItems });
            } else {
              set({ items: get().items.filter((item) => item.id !== id) });
            }
          }
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
            const response = await apiClient.put(`/cart/${item.cartId}`, {
              quantity: qty,
            });
            // Use response items if available, otherwise update locally
            if (response.data?.items) {
              const mappedItems = response.data.items.map((backendItem) => {
                const sizeId = backendItem.sizeId;
                return {
                  id: `${backendItem.productId}-${sizeId || "no-size"}`,
                  cartId: backendItem.id,
                  productId: backendItem.productId,
                  sizeId: sizeId,
                  size: backendItem.sizeName,
                  name: backendItem.name,
                  price: backendItem.price,
                  qty: backendItem.quantity,
                  images: backendItem.url ? [{ url: backendItem.url }] : [],
                  category: backendItem.category,
                  cuisine: backendItem.cuisine,
                  kitchen: backendItem.kitchen,
                };
              });
              set({ items: mappedItems });
            } else {
              const updatedItems = get().items.map((item) =>
                item.id === id ? { ...item, qty } : item,
              );
              set({ items: updatedItems });
            }
          }
        } catch (err) {
          toast.error("Failed to update quantity");
        }
      },
    }),
    { name: "cart-storage", storage: createJSONStorage(() => localStorage) },
  ),
);

export default useCart;
