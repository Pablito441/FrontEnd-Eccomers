import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../Input/Input";
import { useUserStore } from "../../../hooks/useUserStore";
import { useCartStore } from "../../../hooks/useCartStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useOrderManagement } from "../../../hooks/useOrderManagement";
import { purchaseOrderService } from "../../../http/PurchaseOrderService";
import { userAddressService } from "../../../http/UserAddressService";
import type { ICartItem } from "../../../http/OrderDetailService";
import s from "./PurchaseOrderData.module.css";
import Swal from "sweetalert2";

// Interfaz corregida para coincidir con la estructura real del backend
interface IMyAddressResponse {
  id: number;
  userId: number;
  addressId: number;
  adress: {
    id: number;
    street: string;
    town: string;
    state: string;
    cpi: string;
    country: string;
    isActive: boolean;
  };
}

export const PurchaseOrderData = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { items: cartItems, clearCart } = useCartStore();
  const { items: sizes } = useSizeStore();
  
  // Hook para gestión de órdenes
  const {
    confirmPurchase,
    checkStock,
    clearError
  } = useOrderManagement();

  const [userAddresses, setUserAddresses] = useState<IMyAddressResponse[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    shippingMethod: "domicilio",
    name: "",
    lastName: "",
    email: "",
    dni: "",
    gender: "",
    observations: "",
    useDeliveryForBilling: false,
    paymentMethod: "mercadopago",
    discountCode: "",
  });

  // Cargar datos del usuario y direcciones al montar el componente
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
        lastName: currentUser.lastName,
        email: currentUser.email,
      }));

      // Cargar direcciones del usuario
      loadUserAddresses();
    }
  }, [currentUser]);

  // Verificar stock cuando cambie el carrito
  useEffect(() => {
    const verifyStock = async () => {
      if (cartItems.length === 0) return;
      
      const warnings: string[] = [];
      
      for (const item of cartItems) {
        // Buscar el sizeId correspondiente al talle del item
        const sizeObj = sizes.find((s) => s.number === item.size);
        if (!sizeObj) continue;
        
        const currentStock = await checkStock(sizeObj.id, item.product.id);
        if (currentStock < item.quantity) {
          warnings.push(
            `${item.product.name} (Talla ${item.size}): Stock disponible ${currentStock}, en carrito ${item.quantity}`
          );
        }
      }
      
      setStockWarnings(warnings);
    };

    verifyStock();
  }, [cartItems, sizes, checkStock]);

  const loadUserAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const addresses = await userAddressService.getMyAddresses();
      console.log("Direcciones cargadas:", addresses);
      setUserAddresses(addresses);

      // Seleccionar la primera dirección por defecto si existe
      if (addresses.length > 0) {
        setSelectedAddressId(addresses[0].addressId);
      }
    } catch (error) {
      console.error("Error al cargar direcciones:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddressId(parseInt(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.id) {
      await Swal.fire({
        title: 'Error',
        text: 'Debe iniciar sesión para continuar',
        icon: 'error'
      });
      return;
    }

    if (cartItems.length === 0) {
      await Swal.fire({
        title: 'Carrito Vacío',
        text: 'El carrito está vacío',
        icon: 'warning'
      });
      return;
    }

    if (!selectedAddressId) {
      await Swal.fire({
        title: 'Dirección Requerida',
        text: 'Debe seleccionar una dirección de entrega',
        icon: 'warning'
      });
      return;
    }

    if (stockWarnings.length > 0) {
      const result = await Swal.fire({
        title: 'Advertencias de Stock',
        html: `
          <div style="text-align: left;">
            <p>Se detectaron problemas de stock:</p>
            <ul style="margin: 10px 0;">
              ${stockWarnings.map(warning => `<li>${warning}</li>`).join('')}
            </ul>
            <p>¿Desea continuar de todas formas?</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;
    }

    setIsProcessing(true);
    clearError();

    try {
      // Calcular totales
      const subtotal = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      const shippingCost = 0; // Envío gratis
      const total = subtotal + shippingCost;

      // Crear la orden de compra
      const orderData = {
        userId: currentUser.id,
        userAddressId: selectedAddressId,
        total: total,
        paymentMethod: formData.paymentMethod,
        status: "PENDING" as const
      };

      console.log("Creando orden:", orderData);
      const newPurchaseOrder = await purchaseOrderService.create(orderData);

      if (!newPurchaseOrder) {
        throw new Error("Error al crear la orden de compra");
      }

      // Preparar items del carrito para el servicio de detalles
      const orderItems: ICartItem[] = cartItems.map((item) => {
        const sizeObj = sizes.find((s) => s.number === item.size);
        if (!sizeObj) {
          throw new Error(`No se encontró el talle ${item.size}`);
        }

        return {
          productId: item.product.id,
          productName: item.product.name,
          sizeId: sizeObj.id,
          sizeName: item.size.toString(),
          quantity: item.quantity,
          price: item.product.price
        };
      });

      // Crear detalles de orden y restar stock
      console.log("Creando detalles de orden:", orderItems);
      const result = await confirmPurchase(orderItems, newPurchaseOrder.id);

      if (result.success) {
        console.log("Orden procesada exitosamente:", result.createdDetails);

        // Limpiar el carrito
        clearCart();

        // Redirigir directamente a la página de instrucciones de pago
        navigate(`/payment-instructions/${newPurchaseOrder.id}`);
      } else {
        // Si hay errores, mostrarlos y eliminar la orden creada
        await purchaseOrderService.softDelete(newPurchaseOrder.id);
        
        await Swal.fire({
          title: 'Error al Procesar Orden',
          html: `
            <div style="text-align: left;">
              <p>Errores encontrados:</p>
              <ul style="margin: 10px 0;">
                ${result.errors.map(error => `<li>${error}</li>`).join('')}
              </ul>
            </div>
          `,
          icon: 'error'
        });
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al procesar el formulario. Por favor, intente nuevamente.',
        icon: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getSelectedAddress = () => {
    return userAddresses.find((ua) => ua.addressId === selectedAddressId)
      ?.adress;
  };

  return (
    <div className={s.container}>
      {/* Advertencias de stock */}
      {stockWarnings.length > 0 && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '5px' 
        }}>
          <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>⚠️ Advertencias de Stock:</h4>
          <ul style={{ color: '#856404', margin: 0, paddingLeft: '20px' }}>
            {stockWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.section}>
          <h2 className={s.title}>MÉTODO DE ENVÍO</h2>
          <p className={s.description}>
            Puede recibir su compra y su factura en el domicilio que usted
            indique.
          </p>

          <div className={s.shippingOptions}>
            <label className={s.radioLabel}>
              <input
                type="radio"
                name="shippingMethod"
                value="domicilio"
                checked={formData.shippingMethod === "domicilio"}
                onChange={handleChange}
                disabled={isProcessing}
              />
              Envío a domicilio
            </label>
          </div>

          <p className={s.shippingInfo}>
            TIEMPO DE ENTREGA: AMBA hasta 6 días hábiles. / Interior del país:
            hasta 9 días hábiles. No realizamos envíos a tierra del fuego.
          </p>
        </div>

        <div className={s.section}>
          <h2 className={s.title}>DIRECCIÓN DE ENTREGA</h2>
          {loadingAddresses ? (
            <p>Cargando direcciones...</p>
          ) : userAddresses.length === 0 ? (
            <div className={s.noAddresses}>
              <p>No tienes direcciones registradas.</p>
              <p>
                Por favor, ve a tu perfil para agregar una dirección antes de
                continuar.
              </p>
              <button
                type="button"
                onClick={() => navigate("/userCount")}
                className={s.goToProfileButton}
              >
                Ir a Mi Perfil
              </button>
            </div>
          ) : (
            <>
              <div className={s.addressSelector}>
                <label htmlFor="addressSelect" className={s.addressLabel}>
                  Selecciona tu dirección de entrega:
                </label>
                <select
                  id="addressSelect"
                  value={selectedAddressId || ""}
                  onChange={handleAddressChange}
                  className={s.addressSelect}
                  required
                >
                  <option value="">Selecciona una dirección</option>
                  {userAddresses.map((userAddress) => (
                    <option key={userAddress.id} value={userAddress.addressId}>
                      {userAddress.adress?.street}, {userAddress.adress?.town},{" "}
                      {userAddress.adress?.state} - CP:{" "}
                      {userAddress.adress?.cpi}
                    </option>
                  ))}
                </select>
              </div>

              {getSelectedAddress() && (
                <div className={s.selectedAddressPreview}>
                  <h4>Dirección seleccionada:</h4>
                  <div className={s.addressPreview}>
                    <p>
                      <strong>{getSelectedAddress()?.street}</strong>
                    </p>
                    <p>
                      {getSelectedAddress()?.town},{" "}
                      {getSelectedAddress()?.state}
                    </p>
                    <p>CP: {getSelectedAddress()?.cpi}</p>
                    <p>{getSelectedAddress()?.country}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className={s.section}>
          <h2 className={s.title}>MÉTODO DE PAGO</h2>
          <div className={s.paymentOptions}>
            <label className={s.radioLabel}>
              <input
                type="radio"
                name="paymentMethod"
                value="mercadopago"
                checked={formData.paymentMethod === "mercadopago"}
                onChange={handleChange}
              />
              Mercado Pago
            </label>
            {/* <label className={`${s.radioLabel} ${s.disabled}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                disabled
                checked={formData.paymentMethod === "credit"}
                onChange={handleChange}
              />
              Tarjeta de Crédito (No disponible)
            </label> */}
            {/* <label className={`${s.radioLabel} ${s.disabled}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="debit"
                disabled
                checked={formData.paymentMethod === "debit"}
                onChange={handleChange}
              />
              Tarjeta de Débito (No disponible)
            </label> */}
          </div>
        </div>

        {/* <div className={s.section}>
          <h2 className={s.title}>CUPÓN DE DESCUENTO</h2>
          <div className={s.inputGroup}>
            <Input
              name="discountCode"
              type="text"
              placeholder="Ingrese su código de descuento"
              value={formData.discountCode}
              handleChange={handleChange}
            />
          </div>
        </div> */}

        <div className={s.section_mod}>
          <h2 className={s.title}>DATOS PERSONALES</h2>

          <div className={s.inputGroup}>
            <Input
              name="name"
              type="text"
              placeholder="Nombre"
              value={formData.name}
              handleChange={handleChange}
              required
            />
            <Input
              name="lastName"
              type="text"
              placeholder="Apellido"
              value={formData.lastName}
              handleChange={handleChange}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              handleChange={handleChange}
              required
            />
            <Input
              name="dni"
              type="text"
              placeholder="Número de DNI"
              value={formData.dni}
              handleChange={handleChange}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={s.select}
              required
            >
              <option className={s.optionSelect} value="">
                Seleccione una opción
              </option>
              <option className={s.optionSelect} value="masculino">
                Masculino
              </option>
              <option className={s.optionSelect} value="femenino">
                Femenino
              </option>
            </select>
          </div>

          <div className={s.inputGroup}>
            <textarea
              name="observations"
              placeholder="Observaciones"
              value={formData.observations}
              onChange={handleChange}
              className={s.textarea}
            />
          </div>

          {/* <label className={s.checkboxLabel}>
            <input
              type="checkbox"
              name="useDeliveryForBilling"
              checked={formData.useDeliveryForBilling}
              onChange={handleChange}
            />
            Usar datos de entrega para la facturación
          </label> */}

          <button 
            type="submit" 
            className={s.submitButton}
            disabled={isProcessing || stockWarnings.length > 0}
          >
            {isProcessing ? 'Procesando...' : 'FINALIZAR COMPRA'}
          </button>
        </div>
      </form>
    </div>
  );
};
