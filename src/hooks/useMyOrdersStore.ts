import { create } from "zustand";
import { purchaseOrderService } from "../http/PurchaseOrderService";
import type { IPurchaseOrder } from "../types/IPurchaseOrder";

interface MyOrdersStore {
  orders: IPurchaseOrder[];
  loading: boolean;
  error: string | null;
  
  fetchMyOrders: () => Promise<void>;
  clearOrders: () => void;
}

export const useMyOrdersStore = create<MyOrdersStore>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await purchaseOrderService.getMyOrders();
      set({ orders, loading: false });
    } catch (error) {
      set({ 
        error: `Error al cargar las órdenes: ${error}`, 
        loading: false 
      });
    }
  },

  clearOrders: () => {
    set({ orders: [], error: null });
  },
})); 