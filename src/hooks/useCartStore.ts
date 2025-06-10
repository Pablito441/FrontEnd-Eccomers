import { create } from "zustand";
import type { IProduct } from "../types/IProduct";

interface CartItem {
  product: IProduct;
  quantity: number;
  size: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: IProduct, size: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (product, size) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity: 1, size }],
      };
    }),

  removeItem: (productId, size) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.size === size)
      ),
    })),

  updateQuantity: (productId, size, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
