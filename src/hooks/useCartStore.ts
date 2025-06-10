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

// Función para cargar el carrito desde localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    return [];
  }
};

// Función para guardar el carrito en localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
  }
};

export const useCartStore = create<CartStore>((set) => ({
  items: loadCartFromStorage(),

  addItem: (product, size) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id && item.size === size
      );

      let newItems;
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity: 1, size }];
      }

      saveCartToStorage(newItems);
      return { items: newItems };
    }),

  removeItem: (productId, size) =>
    set((state) => {
      const newItems = state.items.filter(
        (item) => !(item.product.id === productId && item.size === size)
      );
      saveCartToStorage(newItems);
      return { items: newItems };
    }),

  updateQuantity: (productId, size, quantity) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      );
      saveCartToStorage(newItems);
      return { items: newItems };
    }),

  clearCart: () => {
    saveCartToStorage([]);
    set({ items: [] });
  },
}));
