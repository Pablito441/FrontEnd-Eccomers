import type { IPurchaseOrder } from "../types/IPurchaseOrder";
import { ApiService } from "./ApiService";
import axios from "axios";
import { authService } from "./AuthService";

interface ICreateOrderRequest {
  userId: number;
  userAddressId: number;
  total: number;
  paymentMethod: string;
  status: string;
  details: {
    productId: number;
    sizeId: number;
    quantity: number;
  }[];
}

interface IMercadoPagoResponse {
  preferenceId: string;
  paymentUrl: string;
  orderId: number;
  orderTotal: number;
}

class PurchaseOrderService extends ApiService<IPurchaseOrder> {
  constructor() {
    super("http://localhost:9000/api/v1/purchase-orders");
  }

  async createOrderWithDetails(
    orderData: ICreateOrderRequest
  ): Promise<IPurchaseOrder | null> {
    try {
      const token = authService.getToken();
      if (!token || !authService.isTokenValid()) {
        throw new Error("No hay token válido");
      }

      // Paso 1: Crear la orden sin detalles
      const orderPayload = {
        userId: orderData.userId,
        userAddressId: orderData.userAddressId,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        status: "PENDING",
      };

      console.log("Creando orden:", orderPayload);
      const orderResponse = await axios.post(
        "http://localhost:9000/api/v1/purchase-orders",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const createdOrder = orderResponse.data;
      console.log("Orden creada:", createdOrder);

      // Paso 2: Crear los detalles de la orden
      const detailPromises = orderData.details.map((detail) =>
        axios.post(
          "http://localhost:9000/api/v1/details",
          {
            quantity: detail.quantity,
            productId: detail.productId,
            sizeId: detail.sizeId,
            orderId: createdOrder.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      await Promise.all(detailPromises);
      console.log("Detalles de la orden creados exitosamente");

      return createdOrder;
    } catch (error) {
      console.error("Error al crear la orden con detalles:", error);
      return null;
    }
  }

  async getMercadoPagoPayment(
    orderId: number
  ): Promise<IMercadoPagoResponse | null> {
    try {
      const response = await axios.post(
        `http://localhost:9000/pay/order/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener el enlace de pago:", error);
      return null;
    }
  }

  async getMyOrders(): Promise<IPurchaseOrder[]> {
    try {
      const token = authService.getToken();
      if (!token || !authService.isTokenValid()) {
        throw new Error("No hay token válido");
      }

      const response = await axios.get(
        "http://localhost:9000/api/v1/purchase-orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis órdenes:", error);
      return [];
    }
  }

  async approveOrder(
    orderId: number,
    paymentId: string
  ): Promise<IPurchaseOrder | null> {
    try {
      const token = authService.getToken();
      if (!token || !authService.isTokenValid()) {
        throw new Error("No hay token válido");
      }

      const response = await axios.put(
        `http://localhost:9000/api/v1/purchase-orders/${orderId}/approve`,
        { paymentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al aprobar la orden:", error);
      return null;
    }
  }

  async softDelete(orderId: number): Promise<IPurchaseOrder | null> {
    try {
      const token = authService.getToken();
      if (!token || !authService.isTokenValid()) {
        throw new Error("No hay token válido");
      }

      const response = await axios.put(
        `http://localhost:9000/api/v1/purchase-orders/${orderId}/soft-delete`,
        {
          isActive: false,
          deletedAt: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      return null;
    }
  }
}

export const purchaseOrderService = new PurchaseOrderService();
