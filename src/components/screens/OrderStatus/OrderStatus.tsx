import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderStatus.module.css";

interface PaymentParams {
  orderId: string;
  collection_id?: string;
  collection_status?: string;
  payment_id?: string;
  status?: string;
  external_reference?: string;
  payment_type?: string;
  merchant_order_id?: string;
  preference_id?: string;
  site_id?: string;
  processing_mode?: string;
  merchant_account_id?: string;
}

const OrderStatus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentParams | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "pending" | "failure" | null
  >(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationError, setConfirmationError] = useState<string | null>(
    null
  );
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Ref para evitar múltiples confirmaciones
  const confirmationAttempted = useRef(false);

  useEffect(() => {
    // Extraer parámetros de la URL
    const searchParams = new URLSearchParams(location.search);
    const params: PaymentParams = {
      orderId: searchParams.get("orderId") || "",
      collection_id: searchParams.get("collection_id") || undefined,
      collection_status: searchParams.get("collection_status") || undefined,
      payment_id: searchParams.get("payment_id") || undefined,
      status: searchParams.get("status") || undefined,
      external_reference: searchParams.get("external_reference") || undefined,
      payment_type: searchParams.get("payment_type") || undefined,
      merchant_order_id: searchParams.get("merchant_order_id") || undefined,
      preference_id: searchParams.get("preference_id") || undefined,
      site_id: searchParams.get("site_id") || undefined,
      processing_mode: searchParams.get("processing_mode") || undefined,
      merchant_account_id: searchParams.get("merchant_account_id") || undefined,
    };

    setPaymentData(params);

    // Determinar el estado del pago basado en la ruta
    const path = location.pathname;
    if (path.includes("paymentSuccess")) {
      setPaymentStatus("success");
    } else if (path.includes("paymentPending")) {
      setPaymentStatus("pending");
    } else if (path.includes("paymentFailure")) {
      setPaymentStatus("failure");
    }
  }, [location.search, location.pathname]);

  // Confirmar el pago con el backend cuando sea exitoso - SOLO UNA VEZ
  useEffect(() => {
    // Evitar múltiples confirmaciones
    if (confirmationAttempted.current || paymentConfirmed) {
      return;
    }

    if (paymentData && paymentStatus === "success" && !isConfirming) {
      const { orderId, payment_id, status, collection_status } = paymentData;

      // Verificar que tenemos los datos necesarios y que el pago fue aprobado
      if (
        orderId &&
        payment_id &&
        (status === "approved" || collection_status === "approved")
      ) {
        confirmationAttempted.current = true; // Marcar que ya se intentó la confirmación
        setIsConfirming(true);
        setConfirmationError(null);

        console.log("🔄 Iniciando confirmación de pago...", {
          orderId,
          payment_id,
        });

        // Confirmar el pago con el backend
        fetch("http://localhost:9000/pay/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderId,
            payment_id: payment_id,
            status: status,
            collection_status: collection_status,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data.success) {
              console.log("✅ Pago confirmado exitosamente!", data);
              setPaymentConfirmed(true);
            } else {
              throw new Error(data.message || "Error al confirmar el pago");
            }
          })
          .catch((error) => {
            console.error("❌ Error al confirmar el pago:", error);
            setConfirmationError("Error al confirmar el pago con el servidor");
          })
          .finally(() => {
            setIsConfirming(false);
          });
      }
    }
  }, [paymentData, paymentStatus]); // Removemos isConfirming y paymentConfirmed de las dependencias

  const handleViewOrders = () => {
    navigate("/userCount");
  };

  const handleContinueShopping = () => {
    navigate("/catalog");
  };

  const handleRetryPayment = () => {
    navigate("/purchaseOrder");
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return (
          <div className={styles.iconSuccess}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#4caf50"
                strokeWidth="2"
                fill="#e8f5e8"
              />
              <path
                d="m9 12 2 2 4-4"
                stroke="#4caf50"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case "pending":
        return (
          <div className={styles.iconPending}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#ff9800"
                strokeWidth="2"
                fill="#fff8e1"
              />
              <path
                d="M12 6v6l4 2"
                stroke="#ff9800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case "failure":
        return (
          <div className={styles.iconFailure}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#f44336"
                strokeWidth="2"
                fill="#ffebee"
              />
              <path
                d="m15 9-6 6"
                stroke="#f44336"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m9 9 6 6"
                stroke="#f44336"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className={styles.iconDefault}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#666"
                strokeWidth="2"
                fill="#f5f5f5"
              />
              <path
                d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17h.01"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case "success":
        return "¡Pago Exitoso!";
      case "pending":
        return "Pago Pendiente";
      case "failure":
        return "Pago Fallido";
      default:
        return "Estado del Pago";
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "success":
        if (isConfirming) {
          return "Tu pago ha sido procesado exitosamente. Confirmando tu pedido...";
        }
        if (confirmationError) {
          return "Tu pago ha sido procesado exitosamente, pero hubo un problema al confirmar tu pedido. Por favor, contacta con soporte.";
        }
        if (paymentConfirmed) {
          return "Tu pago ha sido procesado exitosamente y tu pedido ha sido confirmado. Recibirás un email de confirmación con los detalles.";
        }
        return "Tu pago ha sido procesado exitosamente. Confirmando tu pedido...";
      case "pending":
        return "Tu pago está siendo procesado. Te notificaremos cuando se complete la transacción.";
      case "failure":
        return "Hubo un problema con tu pago. Por favor, intenta nuevamente o usa otro método de pago.";
      default:
        return "Verificando el estado de tu pago...";
    }
  };

  if (!paymentData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>{getStatusIcon()}</div>

          <h1 className={styles.title}>{getStatusTitle()}</h1>
          <p className={styles.message}>{getStatusMessage()}</p>

          {/* Mostrar indicador de confirmación */}
          {isConfirming && (
            <div className={styles.confirmingPayment}>
              <div className={styles.spinner}></div>
              <p>Confirmando tu pedido...</p>
            </div>
          )}

          {/* Mostrar confirmación exitosa */}
          {paymentConfirmed && (
            <div className={styles.successMessage}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginRight: "8px", display: "inline-block" }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#4caf50"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="#4caf50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Tu pedido ha sido confirmado exitosamente</span>
            </div>
          )}

          {/* Mostrar error de confirmación */}
          {confirmationError && (
            <div className={styles.errorMessage}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginRight: "8px", display: "inline-block" }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#f44336"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M12 8v4"
                  stroke="#f44336"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16h.01"
                  stroke="#f44336"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{confirmationError}</span>
            </div>
          )}

          <div className={styles.orderInfo}>
            <h3>Información del Pedido</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>ID del Pedido:</span>
                <span className={styles.value}>#{paymentData.orderId}</span>
              </div>

              {paymentData.payment_id && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>ID de Pago:</span>
                  <span className={styles.value}>{paymentData.payment_id}</span>
                </div>
              )}

              {paymentData.status && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Estado:</span>
                  <span className={styles.value}>{paymentData.status}</span>
                </div>
              )}

              {paymentData.payment_type && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Método de Pago:</span>
                  <span className={styles.value}>
                    {paymentData.payment_type}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            {paymentStatus === "success" && (
              <>
                <button
                  className={styles.primaryButton}
                  onClick={handleViewOrders}
                  disabled={isConfirming}
                >
                  Ver Mis Pedidos
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={handleContinueShopping}
                  disabled={isConfirming}
                >
                  Seguir Comprando
                </button>
              </>
            )}

            {paymentStatus === "pending" && (
              <>
                <button
                  className={styles.primaryButton}
                  onClick={handleViewOrders}
                >
                  Ver Estado del Pedido
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={handleContinueShopping}
                >
                  Seguir Comprando
                </button>
              </>
            )}

            {paymentStatus === "failure" && (
              <>
                <button
                  className={styles.primaryButton}
                  onClick={handleRetryPayment}
                >
                  Reintentar Pago
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={handleContinueShopping}
                >
                  Seguir Comprando
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
