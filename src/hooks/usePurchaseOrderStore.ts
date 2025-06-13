import { createStore } from "./useStore";
import { purchaseOrderService } from "../http/PurchaseOrderService";
import type { IPurchaseOrder } from "../types/IPurchaseOrder";

export const usePurchaseOrderStore = createStore<IPurchaseOrder>(
  purchaseOrderService,
  {
    filterActive: true, // Solo mostrar órdenes activas
  }
);
