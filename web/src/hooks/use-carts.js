import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";

const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data) => {
        const currentItems = get().items;
        const existing = currentItems.find((item) => item.id === data.id);

        if (existing) {
          return toast.error("Item already in the cart");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to cart");
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Item removed from the cart");
      },

      removeAll: () => set({ items: [] }),

      updateItemQuantity: (id, qty) => {
        const updatedItems = get().items.map((item) =>
          item.id === id ? { ...item, qty } : item,
        );
        set({ items: updatedItems });
      },
    }),
    { name: "cart-storage", storage: createJSONStorage(() => localStorage) },
  ),
);

export default useCart;
