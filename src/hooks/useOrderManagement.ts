import { useState } from 'react';
import { orderDetailService, type IOrderDetail, type ICartItem } from '../http/OrderDetailService';
import { authService } from '../http/AuthService';

interface UseOrderManagementReturn {
  loading: boolean;
  error: string | null;
  confirmPurchase: (cartItems: ICartItem[], purchaseOrderId: number) => Promise<{
    success: boolean;
    createdDetails: IOrderDetail[];
    errors: string[];
  }>;
  cancelOrder: (orderDetails: IOrderDetail[]) => Promise<{
    success: boolean;
    errors: string[];
  }>;
  checkStock: (sizeId: number, productId: number) => Promise<number>;
  clearError: () => void;
}

export const useOrderManagement = (): UseOrderManagementReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Confirmar compra - crear detalles de orden
  const confirmPurchase = async (
    cartItems: ICartItem[], 
    purchaseOrderId: number
  ): Promise<{
    success: boolean;
    createdDetails: IOrderDetail[];
    errors: string[];
  }> => {
    setLoading(true);
    setError(null);

    try {
      // Verificar que el usuario esté autenticado (no necesariamente admin)
      const token = authService.getToken();
      if (!token || !authService.isTokenValid()) {
        setError('Debe iniciar sesión para procesar la orden');
        return {
          success: false,
          createdDetails: [],
          errors: ['Debe iniciar sesión para procesar la orden']
        };
      }

      console.log(`Iniciando creación de detalles para orden ${purchaseOrderId}`);
      console.log('Items del carrito:', cartItems);

      // Crear detalles de orden
      const result = await orderDetailService.createOrderDetails(cartItems, purchaseOrderId);
      
      if (!result.success) {
        setError(`Errores al procesar la orden: ${result.errors.join(', ')}`);
      }

      console.log('Resultado de confirmPurchase:', result);
      return result;
    } catch (error) {
      console.error('Error en confirmPurchase:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al confirmar compra';
      setError(errorMessage);
      return {
        success: false,
        createdDetails: [],
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  };

  // Cancelar orden - devolver stock
  const cancelOrder = async (orderDetails: IOrderDetail[]): Promise<{
    success: boolean;
    errors: string[];
  }> => {
    setLoading(true);
    setError(null);

    try {
      // Verificar que el usuario esté autenticado
      const token = authService.getToken();
      if (!token || !authService.isTokenValid()) {
        setError('Debe iniciar sesión para cancelar la orden');
        return {
          success: false,
          errors: ['Debe iniciar sesión para cancelar la orden']
        };
      }

      const errors: string[] = [];

      // Eliminar cada detalle (esto devuelve el stock automáticamente)
      for (const detail of orderDetails) {
        try {
          const success = await orderDetailService.deleteDetail(detail.id);
          if (!success) {
            errors.push(`Error al cancelar producto: ${detail.id}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          errors.push(`Error al cancelar producto ${detail.id}: ${errorMessage}`);
        }
      }

      if (errors.length > 0) {
        setError(`Errores al cancelar la orden: ${errors.join(', ')}`);
      }

      return {
        success: errors.length === 0,
        errors
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cancelar orden';
      setError(errorMessage);
      return {
        success: false,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  };

  // Verificar stock disponible
  const checkStock = async (sizeId: number, productId: number): Promise<number> => {
    try {
      return await orderDetailService.getProductStock(sizeId, productId);
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return 0;
    }
  };

  return {
    loading,
    error,
    confirmPurchase,
    cancelOrder,
    checkStock,
    clearError
  };
}; 