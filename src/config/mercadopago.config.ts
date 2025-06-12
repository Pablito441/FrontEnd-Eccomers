export const MERCADOPAGO_CONFIG = {
  // URLs de retorno para MercadoPago
  SUCCESS_URL: "https://localhost:5173/paymentSuccess",
  PENDING_URL: "https://localhost:5173/paymentPending", 
  FAILURE_URL: "https://localhost:5173/paymentFailure",
  
  // URL base del frontend
  FRONTEND_BASE_URL: "https://localhost:5173",
  
  // Configuración de desarrollo vs producción
  isDevelopment: process.env.NODE_ENV !== 'production',
  
  // Función para obtener las URLs según el entorno
  getUrls: () => {
    const baseUrl = MERCADOPAGO_CONFIG.isDevelopment 
      ? "https://localhost:5173" 
      : "https://tu-dominio.com";
      
    return {
      success: `${baseUrl}/paymentSuccess`,
      pending: `${baseUrl}/paymentPending`,
      failure: `${baseUrl}/paymentFailure`,
    };
  }
}; 