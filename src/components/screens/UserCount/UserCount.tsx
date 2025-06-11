import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../hooks/useUserStore";
import { usePurchaseOrderStore } from "../../../hooks/usePurchaseOrderStore";
import { useAddressStore } from "../../../hooks/useAddressStore";
import { useUserAddressStore } from "../../../hooks/useUserAddressStore";
import { Input } from "../../ui/Input/Input";
import styles from "./UserCount.module.css";
import type { IAdress } from "../../../types/IAdress";
import type { IUsersAdress } from "../../../types/IUsersAdress";

export const UserCount = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserStore();
  const {
    items: orders,
    loading: loadingOrders,
    error: errorOrders,
    fetchAll: fetchOrders,
  } = usePurchaseOrderStore();
  const {
    items: addresses,
    loading: loadingAddresses,
    error: errorAddresses,
    fetchAll: fetchAddresses,
    create: createAddress,
    update: updateAddress,
  } = useAddressStore();
  const {
    items: userAddresses,
    loading: loadingUserAddresses,
    error: errorUserAddresses,
    fetchAll: fetchUserAddresses,
    create: createUserAddress,
    update: updateUserAddress,
  } = useUserAddressStore();

  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<IAdress>>({
    street: "",
    town: "",
    state: "",
    cpi: "",
    country: "Argentina",
    isActive: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/loginRegister");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrders();
      fetchAddresses();
      fetchUserAddresses();
    }
  }, [currentUser?.id, fetchOrders, fetchAddresses, fetchUserAddresses]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = async () => {
    if (!currentUser?.id) return;

    try {
      // Crear o actualizar la dirección
      const addressData: Partial<IAdress> = {
        ...currentAddress,
        isActive: true,
      };

      let addressId: number;

      if (isEditing && currentAddress.id) {
        await updateAddress(currentAddress.id, addressData);
        addressId = currentAddress.id;
      } else {
        const newAddress = await createAddress(addressData);
        if (!newAddress || !("id" in newAddress)) {
          throw new Error("No se pudo crear la dirección");
        }
        addressId = newAddress.id;
      }

      // Crear o actualizar la relación usuario-dirección
      const userAddressData: Partial<IUsersAdress> = {
        userId: currentUser.id,
        addressId: addressId,
      };

      const existingUserAddress = userAddresses.find(
        (ua) => ua.userId === currentUser.id && ua.addressId === addressId
      );

      if (existingUserAddress) {
        await updateUserAddress(
          { userId: currentUser.id, addressId },
          userAddressData
        );
      } else {
        await createUserAddress(userAddressData);
      }

      // Recargar datos
      await Promise.all([fetchAddresses(), fetchUserAddresses()]);

      // Limpiar formulario
      setIsEditing(false);
      setCurrentAddress({
        street: "",
        town: "",
        state: "",
        cpi: "",
        country: "Argentina",
        isActive: true,
      });

      alert("Dirección guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la dirección:", error);
      alert("Error al guardar la dirección. Por favor, intente nuevamente.");
    }
  };

  const handleEditAddress = (address: IAdress) => {
    setCurrentAddress(address);
    setIsEditing(true);
  };

  if (!currentUser) {
    return null;
  }

  // Filtrar órdenes del usuario actual
  const userOrders = orders.filter((order) => order.userId === currentUser.id);

  // Obtener la dirección del usuario actual (solo una)
  const userAddress = userAddresses
    .filter((ua) => ua.userId === currentUser.id)
    .map((ua) => addresses.find((a) => a.id === ua.addressId))
    .filter((address): address is IAdress => address !== undefined)[0];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mi Cuenta</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Información Personal</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Nombre:</span>
            <span className={styles.value}>{currentUser.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Apellido:</span>
            <span className={styles.value}>{currentUser.lastName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Usuario:</span>
            <span className={styles.value}>{currentUser.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{currentUser.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Rol:</span>
            <span className={styles.value}>{currentUser.role}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Fecha de Registro:</span>
            <span className={styles.value}>
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mi Dirección</h2>
        {loadingAddresses || loadingUserAddresses ? (
          <p>Cargando dirección...</p>
        ) : errorAddresses || errorUserAddresses ? (
          <p className={styles.error}>{errorAddresses || errorUserAddresses}</p>
        ) : (
          <>
            {!userAddress && !isEditing && (
              <div className={styles.addressForm}>
                <h3>Agregar Dirección</h3>
                <div className={styles.formGrid}>
                  <Input
                    name="street"
                    type="text"
                    placeholder="Calle"
                    value={currentAddress.street || ""}
                    handleChange={handleAddressChange}
                  />
                  <Input
                    name="town"
                    type="text"
                    placeholder="Ciudad"
                    value={currentAddress.town || ""}
                    handleChange={handleAddressChange}
                  />
                  <Input
                    name="state"
                    type="text"
                    placeholder="Provincia"
                    value={currentAddress.state || ""}
                    handleChange={handleAddressChange}
                  />
                  <Input
                    name="cpi"
                    type="text"
                    placeholder="Código Postal"
                    value={currentAddress.cpi || ""}
                    handleChange={handleAddressChange}
                  />
                  <select
                    name="country"
                    value={currentAddress.country || "Argentina"}
                    onChange={handleAddressChange}
                    className={styles.select}
                  >
                    <option value="Argentina">Argentina</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button
                    onClick={handleSaveAddress}
                    className={styles.saveButton}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {isEditing && (
              <div className={styles.addressForm}>
                <h3>Editar Dirección</h3>
                <div className={styles.formGrid}>
                  <Input
                    name="street"
                    type="text"
                    placeholder="Calle"
                    value={currentAddress.street || ""}
                    handleChange={handleAddressChange}
                  />
                  <Input
                    name="town"
                    type="text"
                    placeholder="Ciudad"
                    value={currentAddress.town || ""}
                    handleChange={handleAddressChange}
                  />
                  <Input
                    name="state"
                    type="text"
                    placeholder="Provincia"
                    value={currentAddress.state || ""}
                    handleChange={handleAddressChange}
                  />
                  <Input
                    name="cpi"
                    type="text"
                    placeholder="Código Postal"
                    value={currentAddress.cpi || ""}
                    handleChange={handleAddressChange}
                  />
                  <select
                    name="country"
                    value={currentAddress.country || "Argentina"}
                    onChange={handleAddressChange}
                    className={styles.select}
                  >
                    <option value="Argentina">Argentina</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button
                    onClick={handleSaveAddress}
                    className={styles.saveButton}
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentAddress({
                        street: "",
                        town: "",
                        state: "",
                        cpi: "",
                        country: "Argentina",
                        isActive: true,
                      });
                    }}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {userAddress && !isEditing && (
              <div className={styles.addressCard}>
                <div className={styles.addressInfo}>
                  <p>{userAddress.street}</p>
                  <p>
                    {userAddress.town}, {userAddress.state}
                  </p>
                  <p>{userAddress.cpi}</p>
                  <p>{userAddress.country}</p>
                </div>
                <button
                  onClick={() => handleEditAddress(userAddress)}
                  className={styles.editButton}
                >
                  Editar
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mis Pedidos</h2>
        {loadingOrders ? (
          <p>Cargando pedidos...</p>
        ) : errorOrders ? (
          <p className={styles.error}>{errorOrders}</p>
        ) : userOrders.length === 0 ? (
          <p>No tienes pedidos realizados</p>
        ) : (
          <div className={styles.ordersList}>
            {userOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderNumber}>Pedido #{order.id}</span>
                  <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <div className={styles.orderStatus}>
                    Estado:{" "}
                    <span className={styles[order.status.toLowerCase()]}>
                      {order.status}
                    </span>
                  </div>
                  <div className={styles.orderTotal}>
                    Total: ${order.total.toLocaleString()}
                  </div>
                  <div className={styles.orderPayment}>
                    Método de pago: {order.paymentMethod}
                  </div>
                  {order.usersAdress && (
                    <div className={styles.orderAddress}>
                      <h4>Dirección de entrega:</h4>
                      <p>{order.usersAdress.adress?.street}</p>
                      <p>
                        {order.usersAdress.adress?.town},{" "}
                        {order.usersAdress.adress?.state}
                      </p>
                      <p>{order.usersAdress.adress?.cpi}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
