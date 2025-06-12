import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TestPayment.module.css';

const TestPayment: React.FC = () => {
  const navigate = useNavigate();

  const simulatePaymentSuccess = () => {
    const params = new URLSearchParams({
      orderId: '10',
      collection_id: '114828835720',
      collection_status: 'approved',
      payment_id: '114828835720',
      status: 'approved',
      external_reference: '10',
      payment_type: 'account_money',
      merchant_order_id: '31681257328',
      preference_id: '2490561018-5eacbfd0-17aa-4bf8-b731-87076badc6b8',
      site_id: 'MLA',
      processing_mode: 'aggregator',
      merchant_account_id: 'null'
    });
    
    navigate(`/paymentSuccess?${params.toString()}`);
  };

  const simulatePaymentPending = () => {
    const params = new URLSearchParams({
      orderId: '11',
      collection_id: '114828835721',
      collection_status: 'pending',
      payment_id: '114828835721',
      status: 'pending',
      external_reference: '11',
      payment_type: 'bank_transfer',
      merchant_order_id: '31681257329',
      preference_id: '2490561018-5eacbfd0-17aa-4bf8-b731-87076badc6b9',
      site_id: 'MLA',
      processing_mode: 'aggregator'
    });
    
    navigate(`/paymentPending?${params.toString()}`);
  };

  const simulatePaymentFailure = () => {
    const params = new URLSearchParams({
      orderId: '12',
      collection_id: '114828835722',
      collection_status: 'rejected',
      payment_id: '114828835722',
      status: 'rejected',
      external_reference: '12',
      payment_type: 'credit_card',
      merchant_order_id: '31681257330',
      preference_id: '2490561018-5eacbfd0-17aa-4bf8-b731-87076badc6c0',
      site_id: 'MLA',
      processing_mode: 'aggregator'
    });
    
    navigate(`/paymentFailure?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Prueba de Estados de Pago</h1>
        <p className={styles.description}>
          Simula los diferentes estados de retorno de MercadoPago para probar el componente OrderStatus
        </p>

        <div className={styles.buttonGrid}>
          <button 
            className={`${styles.testButton} ${styles.successButton}`}
            onClick={simulatePaymentSuccess}
          >
            <div className={styles.buttonContent}>
              <h3>Pago Exitoso</h3>
              <p>Simula un pago aprobado</p>
            </div>
          </button>

          <button 
            className={`${styles.testButton} ${styles.pendingButton}`}
            onClick={simulatePaymentPending}
          >
            <div className={styles.buttonContent}>
              <h3>Pago Pendiente</h3>
              <p>Simula un pago en proceso</p>
            </div>
          </button>

          <button 
            className={`${styles.testButton} ${styles.failureButton}`}
            onClick={simulatePaymentFailure}
          >
            <div className={styles.buttonContent}>
              <h3>Pago Fallido</h3>
              <p>Simula un pago rechazado</p>
            </div>
          </button>
        </div>

        <div className={styles.info}>
          <h3>Información de Prueba</h3>
          <p>
            Este componente simula las URLs de retorno que MercadoPago envía después de un pago.
            Cada botón redirige con parámetros reales que recibirías de MercadoPago.
          </p>
          
          <div className={styles.urlExamples}>
            <h4>URLs de ejemplo:</h4>
            <div className={styles.urlExample}>
              <strong>Éxito:</strong>
              <code>https://localhost:5173/paymentSuccess?orderId=10&collection_status=approved...</code>
            </div>
            <div className={styles.urlExample}>
              <strong>Pendiente:</strong>
              <code>https://localhost:5173/paymentPending?orderId=11&collection_status=pending...</code>
            </div>
            <div className={styles.urlExample}>
              <strong>Fallo:</strong>
              <code>https://localhost:5173/paymentFailure?orderId=12&collection_status=rejected...</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPayment; 