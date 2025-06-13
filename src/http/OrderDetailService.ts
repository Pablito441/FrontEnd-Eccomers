import axios from "axios";
import { authService } from "./AuthService";

export interface IOrderDetail {
  id: number;
  orderId: number;
  productId: number;
  sizeId: number;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface ICreateOrderDetail {
  orderId: number;
  productId: number;
  sizeId: number;
  quantity: number;
  unitPrice: number;
}

export interface IProductStock {
  productId: number;
  sizeId: number;
  stock: number;
}

export interface ICartItem {
  productId: number;
  productName: string;
  sizeId: number;
  sizeName: string;
  quantity: number;
  price: number;
}

class OrderDetailService {
  private apiUrl = "http://localhost:9000/api/v1";

  // Crear detalle de orden
  async createDetail(data: ICreateOrderDetail): Promise<IOrderDetail | null> {
    try {
      const token = authService.getToken();
      const response = await axios.post(`${this.apiUrl}/details`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear detalle de orden:", error);
      throw error;
    }
  }

  // Eliminar detalle de orden (devuelve stock)
  async deleteDetail(detailId: number): Promise<boolean> {
    try {
      const token = authService.getToken();
      await axios.delete(`${this.apiUrl}/details/${detailId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      console.error("Error al eliminar detalle de orden:", error);
      return false;
    }
  }

  // Consultar stock actual
  async getProductStock(sizeId: number, productId: number): Promise<number> {
    try {
      const response = await axios.get(`${this.apiUrl}/product-sizes/${sizeId}/${productId}`);
      return response.data.stock || 0;
    } catch (error) {
      console.error("Error al consultar stock:", error);
      return 0;
    }
  }

  // Crear múltiples detalles para una orden
  async createOrderDetails(cartItems: ICartItem[], purchaseOrderId: number): Promise<{
    success: boolean;
    createdDetails: IOrderDetail[];
    errors: string[];
  }> {
    const createdDetails: IOrderDetail[] = [];
    const errors: string[] = [];

    for (const item of cartItems) {
      try {
        // Verificar stock antes de crear el detalle
        const currentStock = await this.getProductStock(item.sizeId, item.productId);
        
        if (currentStock < item.quantity) {
          errors.push(`Stock insuficiente para ${item.productName} talla ${item.sizeName}. Stock disponible: ${currentStock}`);
          continue;
        }

        const detailData: ICreateOrderDetail = {
          orderId: purchaseOrderId,
          productId: item.productId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          unitPrice: item.price
        };

        console.log("Creando detalle con datos:", detailData);
        const createdDetail = await this.createDetail(detailData);
        if (createdDetail) {
          createdDetails.push(createdDetail);
          console.log("Detalle creado exitosamente:", createdDetail);
        }
      } catch (error) {
        console.error("Error al crear detalle:", error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        errors.push(`Error al procesar ${item.productName}: ${errorMessage}`);
      }
    }

    console.log(`Resultado: ${createdDetails.length} detalles creados, ${errors.length} errores`);
    return {
      success: errors.length === 0,
      createdDetails,
      errors
    };
  }

  // Cancelar orden completa (elimina todos los detalles y devuelve stock)
  async cancelOrder(orderDetails: IOrderDetail[]): Promise<{
    success: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    for (const detail of orderDetails) {
      try {
        const success = await this.deleteDetail(detail.id);
        if (!success) {
          errors.push(`Error al cancelar detalle ID: ${detail.id}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        errors.push(`Error al cancelar detalle ID: ${detail.id} - ${errorMessage}`);
      }
    }

    return {
      success: errors.length === 0,
      errors
    };
  }
}

export const orderDetailService = new OrderDetailService(); 