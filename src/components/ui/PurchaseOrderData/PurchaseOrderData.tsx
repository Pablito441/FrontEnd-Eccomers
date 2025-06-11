import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../Input/Input";
import { useUserStore } from "../../../hooks/useUserStore";
import { useAddressStore } from "../../../hooks/useAddressStore";
import { useUserAddressStore } from "../../../hooks/useUserAddressStore";
import { useCartStore } from "../../../hooks/useCartStore";
import { usePurchaseOrderStore } from "../../../hooks/usePurchaseOrderStore";
import { useDetailStore } from "../../../hooks/useDetailStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import type { IPurchaseOrder } from "../../../types/IPurchaseOrder";
import type { IDetail } from "../../../types/IDetail";
import s from "./PurchaseOrderData.module.css";

export const PurchaseOrderData = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const {
    items: addresses,
    create: createAddress,
    update: updateAddress,
  } = useAddressStore();
  const { items: userAddresses, create: createUserAddress } =
    useUserAddressStore();
  const { items: cartItems, clearCart } = useCartStore();
  const { create: createPurchaseOrder } = usePurchaseOrderStore();
  const { create: createDetail } = useDetailStore();
  const { items: sizes } = useSizeStore();

  const [formData, setFormData] = useState({
    shippingMethod: "domicilio",
    name: "",
    lastName: "",
    email: "",
    dni: "",
    gender: "",
    street: "",
    number: "",
    floor: "",
    apartment: "",
    postalCode: "",
    city: "",
    province: "",
    country: "Argentina",
    observations: "",
    useDeliveryForBilling: false,
    paymentMethod: "mercadopago",
    discountCode: "",
  });

  // Cargar datos del usuario y dirección al montar el componente
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
        lastName: currentUser.lastName,
        email: currentUser.email,
      }));

      // Buscar la dirección del usuario
      const userAddress = userAddresses
        .filter((ua) => ua.userId === currentUser.id)
        .map((ua) => addresses.find((a) => a.id === ua.addressId))
        .filter(Boolean)[0];

      if (userAddress) {
        setFormData((prev) => ({
          ...prev,
          street: userAddress.street,
          city: userAddress.town,
          province: userAddress.state,
          postalCode: userAddress.cpi,
          country: userAddress.country,
        }));
      }
    }
  }, [currentUser, addresses, userAddresses]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.id) {
      alert("Debe iniciar sesión para continuar");
      return;
    }

    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      // Crear o actualizar la dirección
      const addressData = {
        street: formData.street,
        town: formData.city,
        state: formData.province,
        cpi: formData.postalCode,
        country: formData.country,
        isActive: true,
      };

      // Buscar si el usuario ya tiene una dirección
      const existingUserAddress = userAddresses.find(
        (ua) => ua.userId === currentUser.id
      );

      let addressId: number;

      if (existingUserAddress) {
        // Actualizar dirección existente
        const updatedAddress = await updateAddress(
          existingUserAddress.addressId,
          addressData
        );
        if (!updatedAddress)
          throw new Error("Error al actualizar la dirección");
        addressId = updatedAddress.id;
      } else {
        // Crear nueva dirección
        const newAddress = await createAddress(addressData);
        if (!newAddress) throw new Error("Error al crear la dirección");
        addressId = newAddress.id;

        // Crear relación usuario-dirección
        await createUserAddress({
          userId: currentUser.id,
          addressId: newAddress.id,
        });
      }

      // Calcular totales
      const subtotal = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      const shippingCost = 0; // Envío gratis
      const total = subtotal + shippingCost;

      // Crear la orden de compra
      const purchaseOrderData: Partial<IPurchaseOrder> = {
        userId: currentUser.id,
        userAddressId: addressId,
        status: "PENDING" as const,
        total: total,
        paymentMethod: formData.paymentMethod,
        isActive: true,
      };

      const newPurchaseOrder = await createPurchaseOrder(purchaseOrderData);

      if (newPurchaseOrder) {
        // Crear los detalles de la orden de compra
        const detailPromises = cartItems.map((item) => {
          // Buscar el talle en la base de datos
          const size = sizes.find((s) => s.number === item.size);

          if (!size) {
            throw new Error(`No se encontró el talle ${item.size}`);
          }

          const detailData: Partial<IDetail> = {
            quantity: item.quantity,
            productId: item.product.id,
            orderId: newPurchaseOrder.id,
            sizeId: size.id,
            isActive: true,
          };

          console.log("Creando detalle:", detailData);
          return createDetail(detailData);
        });

        try {
          const createdDetails = await Promise.all(detailPromises);
          console.log("Detalles creados:", createdDetails);

          if (createdDetails.length === 0) {
            throw new Error("No se crearon los detalles");
          }

          // Limpiar el carrito
          clearCart();

          // Mostrar mensaje de éxito
          alert("¡Orden de compra creada exitosamente!");

          // Redirigir a la página de cuenta del usuario
          navigate("/userCount");
        } catch (error) {
          console.error("Error al crear los detalles:", error);
          alert(
            "Error al crear los detalles de la orden. Por favor, intente nuevamente."
          );
        }
      } else {
        throw new Error("Error al crear la orden de compra");
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      alert("Error al procesar el formulario. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className={s.container}>
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
            <label className={`${s.radioLabel} ${s.disabled}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                disabled
                checked={formData.paymentMethod === "credit"}
                onChange={handleChange}
              />
              Tarjeta de Crédito (No disponible)
            </label>
            <label className={`${s.radioLabel} ${s.disabled}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="debit"
                disabled
                checked={formData.paymentMethod === "debit"}
                onChange={handleChange}
              />
              Tarjeta de Débito (No disponible)
            </label>
          </div>
        </div>

        <div className={s.section}>
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
        </div>

        <div className={s.section}>
          <h2 className={s.title}>DATOS DE ENTREGA</h2>

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
            <Input
              name="street"
              type="text"
              placeholder="Calle"
              value={formData.street}
              handleChange={handleChange}
              required
            />
            <Input
              name="number"
              type="text"
              placeholder="Número"
              value={formData.number}
              handleChange={handleChange}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <Input
              name="floor"
              type="text"
              placeholder="Piso"
              value={formData.floor}
              handleChange={handleChange}
            />
            <Input
              name="apartment"
              type="text"
              placeholder="Departamento"
              value={formData.apartment}
              handleChange={handleChange}
            />
          </div>

          <div className={s.inputGroup}>
            <Input
              name="postalCode"
              type="text"
              placeholder="Código Postal"
              value={formData.postalCode}
              handleChange={handleChange}
              required
            />
            <Input
              name="city"
              type="text"
              placeholder="Ciudad"
              value={formData.city}
              handleChange={handleChange}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={s.select}
              required
            >
              <option value="">Seleccione una provincia</option>
              <option value="buenosAires">Buenos Aires</option>
              <option value="catamarca">Catamarca</option>
              <option value="chaco">Chaco</option>
              <option value="chubut">Chubut</option>
              <option value="cordoba">Córdoba</option>
              <option value="corrientes">Corrientes</option>
              <option value="entreRios">Entre Ríos</option>
              <option value="formosa">Formosa</option>
              <option value="jujuy">Jujuy</option>
              <option value="laPampa">La Pampa</option>
              <option value="laRioja">La Rioja</option>
              <option value="mendoza">Mendoza</option>
              <option value="misiones">Misiones</option>
              <option value="neuquen">Neuquén</option>
              <option value="rioNegro">Río Negro</option>
              <option value="salta">Salta</option>
              <option value="sanJuan">San Juan</option>
              <option value="sanLuis">San Luis</option>
              <option value="santaCruz">Santa Cruz</option>
              <option value="santaFe">Santa Fe</option>
              <option value="santiagoDelEstero">Santiago del Estero</option>
              <option value="tucuman">Tucumán</option>
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

          <label className={s.checkboxLabel}>
            <input
              type="checkbox"
              name="useDeliveryForBilling"
              checked={formData.useDeliveryForBilling}
              onChange={handleChange}
            />
            Usar datos de entrega para la facturación
          </label>

          <button type="submit" className={s.submitButton}>
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};
