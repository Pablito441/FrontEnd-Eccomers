import type { IPurchaseOrder } from "../types/IPurchaseOrder";
import { ApiService } from "./ApiService";

export const purchaseOrderService = new ApiService<IPurchaseOrder>(
  "http://localhost:9000/api/v1/purchase-orders"
);
