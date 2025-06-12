import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { purchaseOrderService } from "../../../http/PurchaseOrderService";
import styles from "./PaymentInstructions.module.css";

interface IMercadoPagoResponse {
  preferenceId: string;
  paymentUrl: string;
  orderId: number;
  orderTotal: number;
}

export const PaymentInstructions = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<IMercadoPagoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!orderId) {
        setError("ID de orden no válido");
        setLoading(false);
        return;
      }

      try {
        const data = await purchaseOrderService.getMercadoPagoPayment(parseInt(orderId));
        if (data) {
          setPaymentData(data);
        } else {
          setError("No se pudo obtener la información de pago");
        }
      } catch (err) {
        console.error("Error al obtener datos de pago:", err);
        setError("Error al cargar la información de pago");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [orderId]);

  const handlePayNow = () => {
    if (paymentData?.paymentUrl) {
      window.open(paymentData.paymentUrl, '_blank');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <h2>Cargando información de pago...</h2>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error || "No se pudo cargar la información de pago"}</p>
          <button 
            onClick={() => navigate("/userCount")} 
            className={styles.backButton}
          >
            VOLVER A MIS PEDIDOS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>¡Orden Creada Exitosamente!</h1>
          <p className={styles.subtitle}>
            Tu pedido #{paymentData.orderId} ha sido registrado correctamente
          </p>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            <div className={styles.orderInfo}>
              <div className={styles.orderDetail}>
                <span className={styles.label}>Número de Orden:</span>
                <span className={styles.value}>#{paymentData.orderId}</span>
              </div>
              <div className={styles.orderDetail}>
                <span className={styles.label}>Total a Pagar:</span>
                <span className={styles.value}>{formatPrice(paymentData.orderTotal)}</span>
              </div>
            </div>

            <div className={styles.paymentSection}>
              <h2 className={styles.sectionTitle}>Realizar Pago</h2>
              <p className={styles.paymentText}>
                Para completar tu compra, debes realizar el pago a través del siguiente enlace:
              </p>
              
              <button 
                onClick={handlePayNow}
                className={styles.payButton}
              >
                PAGAR CON MERCADO PAGO
              </button>
              
              <p className={styles.paymentNote}>
                Se abrirá una nueva ventana con el formulario de pago seguro de Mercado Pago
              </p>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.contactSection}>
              <h2 className={styles.sectionTitle}>Informar Pago</h2>
              <p className={styles.contactText}>
                Una vez realizado el pago, puedes informarlo contactándote con nosotros:
              </p>
              
              <div className={styles.contactOptions}>
                <div className={styles.contactOption}>
                  <div className={styles.contactInfo}>
                    <span className={styles.contactLabel}>Email:</span>
                    <a 
                      href="mailto:ventas@vans.com.ar" 
                      className={styles.contactLink}
                    >
                      ventas@vans.com.ar
                    </a>
                  </div>
                </div>
                
                <div className={styles.contactOption}>
                  <div className={styles.contactInfo}>
                    <span className={styles.contactLabel}>WhatsApp:</span>
                    <a 
                      href="https://wa.me/5491123456789" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                    >
                      +54 9 11 2345-6789
                    </a>
                  </div>
                </div>
              </div>
              
              <div className={styles.importantNote}>
                <strong>Importante:</strong> Al contactarte, menciona tu número de orden #{paymentData.orderId} 
                para un procesamiento más rápido.
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={() => navigate("/userCount")} 
            className={styles.viewOrdersButton}
          >
            VER MIS PEDIDOS
          </button>
          <button 
            onClick={() => navigate("/")} 
            className={styles.continueShoppingButton}
          >
            SEGUIR COMPRANDO
          </button>
        </div>
      </div>
    </div>
  );
}; 