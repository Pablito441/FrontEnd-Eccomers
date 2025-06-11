import { useState } from "react";
import { Input } from "../Input/Input";
import s from "./PurchaseOrderData.module.css";

export const PurchaseOrderData = () => {
  const [formData, setFormData] = useState({
    shippingMethod: "domicilio",
    name: "",
    lastName: "",
    dni: "",
    gender: "",
    address: "",
    street: "",
    number: "",
    floor: "",
    apartment: "",
    postalCode: "",
    city: "",
    province: "",
    observations: "",
    useDeliveryForBilling: false,
    paymentMethod: "mercadopago",
    discountCode: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
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
            />
            <Input
              name="lastName"
              type="text"
              placeholder="Apellido"
              value={formData.lastName}
              handleChange={handleChange}
            />
          </div>

          <div className={s.inputGroup}>
            <Input
              name="dni"
              type="text"
              placeholder="Número de DNI"
              value={formData.dni}
              handleChange={handleChange}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={s.select}
            >
              <option className={s.optionSelect} value="seleccioneunaopción">
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
              name="address"
              type="text"
              placeholder="Ingresa una ubicación"
              value={formData.address}
              handleChange={handleChange}
            />
          </div>

          <div className={s.inputGroup}>
            <Input
              name="street"
              type="text"
              placeholder="Calle"
              value={formData.street}
              handleChange={handleChange}
            />
            <Input
              name="number"
              type="text"
              placeholder="Número"
              value={formData.number}
              handleChange={handleChange}
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
            />
            <Input
              name="city"
              type="text"
              placeholder="Ciudad"
              value={formData.city}
              handleChange={handleChange}
            />
          </div>

          <div className={s.inputGroup}>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={s.select}
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
