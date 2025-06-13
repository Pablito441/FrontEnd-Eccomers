import React, { useState, useEffect } from 'react';
import { useOrderManagement } from '../../hooks/useOrderManagement';
import { authService } from '../../http/AuthService';
import type { ICartItem, IOrderDetail } from '../../http/OrderDetailService';

interface CheckoutExampleProps {
  cartItems: ICartItem[];
  purchaseOrderId: number;
  onOrderComplete: (orderDetails: IOrderDetail[]) => void;
  onOrderCancel: () => void;
}

export const CheckoutExample: React.FC<CheckoutExampleProps> = ({
  cartItems,
  purchaseOrderId,
  onOrderComplete,
  onOrderCancel
}) => {
  const {
    loading,
    error,
    confirmPurchase,
    cancelOrder,
    checkStock,
    ensureAdminAuth,
    clearError
  } = useOrderManagement();

  const [orderDetails, setOrderDetails] = useState<IOrderDetail[]>([]);
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Verificar stock al cargar el componente
  useEffect(() => {
    const verifyStock = async () => {
      const warnings: string[] = [];
      
      for (const item of cartItems) {
        const currentStock = await checkStock(item.sizeId, item.productId);
        if (currentStock < item.quantity) {
          warnings.push(
            `${item.productName} (Talla ${item.sizeName}): Stock disponible ${currentStock}, solicitado ${item.quantity}`
          );
        }
      }
      
      setStockWarnings(warnings);
    };

    if (cartItems.length > 0) {
      verifyStock();
    }
  }, [cartItems, checkStock]);

  // Manejar confirmación de compra
  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    clearError();

    try {
      // Verificar autenticación de admin
      const isAuthenticated = await ensureAdminAuth();
      if (!isAuthenticated) {
        alert('Error: Se requiere autenticación de administrador');
        return;
      }

      // Confirmar compra
      const result = await confirmPurchase(cartItems, purchaseOrderId);
      
      if (result.success) {
        setOrderDetails(result.createdDetails);
        onOrderComplete(result.createdDetails);
        alert('¡Orden procesada exitosamente!');
      } else {
        alert(`Errores al procesar la orden:\n${result.errors.join('\n')}`);
      }
    } catch (error) {
      console.error('Error al confirmar compra:', error);
      alert('Error inesperado al procesar la orden');
    } finally {
      setIsProcessing(false);
    }
  };

  // Manejar cancelación de orden
  const handleCancelOrder = async () => {
    if (orderDetails.length === 0) {
      onOrderCancel();
      return;
    }

    const confirmCancel = window.confirm(
      '¿Estás seguro de que deseas cancelar esta orden? Se devolverá el stock.'
    );

    if (!confirmCancel) return;

    setIsProcessing(true);
    clearError();

    try {
      const result = await cancelOrder(orderDetails);
      
      if (result.success) {
        setOrderDetails([]);
        onOrderCancel();
        alert('Orden cancelada exitosamente. Stock devuelto.');
      } else {
        alert(`Errores al cancelar la orden:\n${result.errors.join('\n')}`);
      }
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      alert('Error inesperado al cancelar la orden');
    } finally {
      setIsProcessing(false);
    }
  };

  // Manejar login de admin si no está autenticado
  const handleAdminLogin = async () => {
    const email = prompt('Email de administrador:');
    const password = prompt('Contraseña:');
    
    if (!email || !password) return;

    try {
      const token = await authService.loginAdmin(email, password);
      if (token) {
        alert('Autenticación exitosa');
        clearError();
      } else {
        alert('Error en la autenticación');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Checkout - Gestión de Orden</h2>
      
      {/* Información de la orden */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Resumen de la Orden #{purchaseOrderId}</h3>
        <p><strong>Items:</strong> {cartItems.length}</p>
        <p><strong>Total:</strong> ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
      </div>

      {/* Advertencias de stock */}
      {stockWarnings.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
          <h4 style={{ color: '#856404' }}>⚠️ Advertencias de Stock:</h4>
          <ul style={{ color: '#856404' }}>
            {stockWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Errores */}
      {error && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
          <p style={{ color: '#721c24', margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {/* Estado de autenticación */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '5px' }}>
        <p style={{ margin: 0 }}>
          <strong>Estado de Autenticación:</strong> {' '}
          {authService.isAdminAuthenticated() ? (
            <span style={{ color: '#155724' }}>✅ Autenticado como Admin</span>
          ) : (
            <span style={{ color: '#721c24' }}>❌ No autenticado</span>
          )}
        </p>
        {!authService.isAdminAuthenticated() && (
          <button 
            onClick={handleAdminLogin}
            style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
          >
            Iniciar Sesión como Admin
          </button>
        )}
      </div>

      {/* Detalles de orden creados */}
      {orderDetails.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '5px' }}>
          <h4 style={{ color: '#155724' }}>✅ Orden Procesada</h4>
          <p style={{ color: '#155724' }}>Se crearon {orderDetails.length} detalles de orden</p>
          <ul style={{ color: '#155724' }}>
            {orderDetails.map((detail) => (
              <li key={detail.id}>
                Detalle #{detail.id} - Producto: {detail.productId}, Cantidad: {detail.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {orderDetails.length === 0 ? (
          <button
            onClick={handleConfirmPurchase}
            disabled={loading || isProcessing || stockWarnings.length > 0}
            style={{
              padding: '12px 24px',
              backgroundColor: stockWarnings.length > 0 ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: stockWarnings.length > 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading || isProcessing ? 'Procesando...' : 'Confirmar Compra'}
          </button>
        ) : (
          <button
            onClick={handleCancelOrder}
            disabled={loading || isProcessing}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {loading || isProcessing ? 'Procesando...' : 'Cancelar Orden'}
          </button>
        )}
      </div>

      {/* Items del carrito */}
      <div style={{ marginTop: '30px' }}>
        <h3>Items en el Carrito:</h3>
        {cartItems.map((item, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #eee', marginBottom: '5px', borderRadius: '3px' }}>
            <p><strong>{item.productName}</strong> - Talla: {item.sizeName}</p>
            <p>Cantidad: {item.quantity} | Precio: ${item.price} | Total: ${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 