import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../hooks/useUserStore";
import { useMyOrdersStore } from "../../../hooks/useMyOrdersStore";
import { usePurchaseOrderStore } from "../../../hooks/usePurchaseOrderStore";
import { useAddressStore } from "../../../hooks/useAddressStore";
import { userAddressService } from "../../../http/UserAddressService";
import { purchaseOrderService } from "../../../http/PurchaseOrderService";
import { Input } from "../../ui/Input/Input";
import styles from "./UserCount.module.css";
import type { IAdress } from "../../../types/IAdress";
import Swal from "sweetalert2";
import axios from "axios";

// Interfaz para las direcciones del usuario
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

export const UserCount = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserStore();

  // Hook para órdenes del usuario (clientes)
  const {
    orders: myOrders,
    loading: loadingMyOrders,
    error: errorMyOrders,
    fetchMyOrders,
  } = useMyOrdersStore();

  // Hook para todas las órdenes (administradores)
  const {
    items: allOrders,
    loading: loadingAllOrders,
    error: errorAllOrders,
    fetchAll: fetchAllOrders,
  } = usePurchaseOrderStore();

  const {
    loading: loadingAddresses,
    error: errorAddresses,
    fetchAll: fetchAddresses,
    create: createAddress,
    update: updateAddress,
  } = useAddressStore();

  // Estado local para las direcciones del usuario
  const [userAddresses, setUserAddresses] = useState<IMyAddressResponse[]>([]);
  const [loadingUserAddresses, setLoadingUserAddresses] = useState(false);
  const [errorUserAddresses, setErrorUserAddresses] = useState<string | null>(
    null
  );

  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<IAdress>>({
    street: "",
    town: "",
    state: "",
    cpi: "",
    country: "Argentina",
    isActive: true,
  });

  const [approvingOrder, setApprovingOrder] = useState<number | null>(null);

  const isAdmin = currentUser?.role === "ADMIN";

  // Función para cargar las direcciones del usuario
  const loadUserAddresses = useCallback(async () => {
    if (!currentUser?.id) return;

    setLoadingUserAddresses(true);
    setErrorUserAddresses(null);

    try {
      const addresses = await userAddressService.getMyAddresses();
      console.log("Direcciones cargadas:", addresses);
      setUserAddresses(addresses);
    } catch (error) {
      console.error("Error al cargar direcciones:", error);
      setErrorUserAddresses("Error al cargar las direcciones");
    } finally {
      setLoadingUserAddresses(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/loginRegister");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchAddresses();
      loadUserAddresses();

      // Si es admin, cargar todas las órdenes, si es cliente, solo las suyas
      if (isAdmin) {
        fetchAllOrders();
      } else {
        fetchMyOrders();
      }
    }
  }, [
    currentUser?.id,
    isAdmin,
    fetchAddresses,
    fetchAllOrders,
    fetchMyOrders,
    loadUserAddresses,
  ]);

  const handleApproveOrder = async (orderId: number) => {
    const { value: paymentId } = await Swal.fire({
      title: "Aprobar Orden",
      text: "Ingresa el ID de pago para confirmar la transacción:",
      input: "text",
      inputPlaceholder: "ID de pago (ej: PAY-123456789)",
      showCancelButton: true,
      confirmButtonText: "Aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar un ID de pago";
        }
        if (value.length < 5) {
          return "El ID de pago debe tener al menos 5 caracteres";
        }
      },
    });

    if (paymentId) {
      setApprovingOrder(orderId);
      try {
        const updatedOrder = await purchaseOrderService.approveOrder(
          orderId,
          paymentId
        );

        if (updatedOrder) {
          await Swal.fire({
            title: "¡Orden Aprobada!",
            text: `La orden #${orderId} ha sido aprobada exitosamente con el ID de pago: ${paymentId}`,
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#28a745",
          });

          // Recargar las órdenes para mostrar el estado actualizado
          await fetchAllOrders();
        } else {
          await Swal.fire({
            title: "Error",
            text: "No se pudo aprobar la orden. Por favor, intenta nuevamente.",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (error) {
        console.error("Error al aprobar orden:", error);
        await Swal.fire({
          title: "Error",
          text: "Ocurrió un error al aprobar la orden. Por favor, intenta nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#dc3545",
        });
      } finally {
        setApprovingOrder(null);
      }
    }
  };

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
      if (isEditing && currentAddress.id) {
        // Editar dirección existente
        const addressData: Partial<IAdress> = {
          ...currentAddress,
          isActive: true,
        };
        await updateAddress(currentAddress.id, addressData);
        alert("Dirección actualizada exitosamente");
      } else {
        // Crear nueva dirección
        const addressData = {
          street: currentAddress.street || "",
          town: currentAddress.town || "",
          state: currentAddress.state || "",
          cpi: currentAddress.cpi || "",
          country: currentAddress.country || "Argentina",
        };

        // Primero crear la dirección
        const newAddress = await createAddress(addressData);
        if (!newAddress || !("id" in newAddress)) {
          throw new Error("No se pudo crear la dirección");
        }

        // Luego asociar la dirección al usuario
        const userAddressData = {
          userId: currentUser.id,
          addressId: newAddress.id,
        };
        await userAddressService.create(userAddressData);
        alert("Dirección creada exitosamente");
      }

      // Recargar solo las direcciones del usuario
      await loadUserAddresses();

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
    } catch (error) {
      console.error("Error al guardar la dirección:", error);
      alert("Error al guardar la dirección. Por favor, intente nuevamente.");
    }
  };

  const handleEditAddress = (address: IAdress) => {
    setCurrentAddress(address);
    setIsEditing(true);
  };

  // Función para eliminar dirección (soft delete)
  const handleDeleteAddress = async (addressId: number) => {
    if (!currentUser?.id) return;

    try {
      // Soft delete de la dirección
      await updateAddress(addressId, { 
        isActive: false,
        deletedAt: new Date().toISOString()
      });

      // Recargar datos
      await Promise.all([fetchAddresses(), loadUserAddresses()]);
      
      alert("Dirección eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar la dirección:", error);
      alert("Error al eliminar la dirección. Por favor, intente nuevamente.");
    }
  };

  if (!currentUser) {
    return null;
  }

  // Determinar qué órdenes mostrar y estados de carga
  const ordersToShow = isAdmin ? allOrders : myOrders;
  const loadingOrders = isAdmin ? loadingAllOrders : loadingMyOrders;
  const errorOrders = isAdmin ? errorAllOrders : errorMyOrders;

  // Obtener las direcciones del usuario actual (todas las activas)
  const currentUserAddresses = userAddresses
    .filter((ua) => ua.adress && ua.adress.isActive)
    .map((ua) => ua.adress)
    .filter((address): address is IAdress => address !== undefined);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#f39c12";
      case "PAID":
        return "#27ae60";
      case "CANCELLED":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "PAID":
        return "Pagado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
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

      {!isAdmin && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Mi Dirección</h2>
          {loadingAddresses || loadingUserAddresses ? (
            <p>Cargando dirección...</p>
          ) : errorAddresses || errorUserAddresses ? (
            <p className={styles.error}>
              {errorAddresses || errorUserAddresses}
            </p>
          ) : (
            <>
              {!currentUserAddresses.length && !isEditing && (
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
                      GUARDAR
                    </button>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className={styles.addressForm}>
                  <h3>
                    {currentAddress.id
                      ? "Editar Dirección"
                      : "Agregar Dirección"}
                  </h3>
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
                      GUARDAR
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
                      CANCELAR
                    </button>
                  </div>
                </div>
              )}

              {currentUserAddresses.length > 0 && !isEditing && (
                <div className={styles.addressesList}>
                  <div className={styles.addAddressSection}>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={styles.addAddressButton}
                    >
                      + AGREGAR NUEVA DIRECCIÓN
                    </button>
                  </div>
                  {currentUserAddresses.map((address) => (
                    <div key={address.id} className={styles.addressCard}>
                      <div className={styles.addressInfo}>
                        <p>{address.street}</p>
                        <p>
                          {address.town}, {address.state}
                        </p>
                        <p>{address.cpi}</p>
                        <p>{address.country}</p>
                      </div>
                      <div className={styles.addressActions}>
                        <button
                          onClick={() => handleEditAddress(address)}
                          className={styles.editButton}
                        >
                          EDITAR
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className={styles.deleteButton}
                        >
                          ELIMINAR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {isAdmin ? "Todas las Órdenes" : "Mis Pedidos"}
        </h2>
        {loadingOrders ? (
          <p>Cargando pedidos...</p>
        ) : errorOrders ? (
          <p className={styles.error}>{errorOrders}</p>
        ) : ordersToShow.length === 0 ? (
          <p>
            {isAdmin
              ? "No hay órdenes en el sistema"
              : "No tienes pedidos realizados"}
          </p>
        ) : (
          <div className={styles.ordersList}>
            {ordersToShow.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderHeaderLeft}>
                    <span className={styles.orderNumber}>
                      Pedido #{order.id}
                    </span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  <div className={styles.orderHeaderRight}>
                    <span
                      className={styles.orderStatus}
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                    {isAdmin && order.status === "PENDING" && (
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        disabled={approvingOrder === order.id}
                        className={styles.approveButton}
                      >
                        {approvingOrder === order.id
                          ? "APROBANDO..."
                          : "APROBAR"}
                      </button>
                    )}
                    {!isAdmin && order.status === "PENDING" && (
                      <button
                        onClick={() =>
                          navigate(`/payment-instructions/${order.id}`)
                        }
                        className={styles.payButton}
                      >
                        PAGAR
                      </button>
                    )}
                  </div>
                </div>

                {isAdmin && order.user && (
                  <div className={styles.customerInfo}>
                    <h4>Cliente:</h4>
                    <p>
                      {order.user.name} {order.user.lastName}
                    </p>
                    <p>{order.user.email}</p>
                  </div>
                )}

                <div className={styles.orderDetails}>
                  <div className={styles.orderTotal}>
                    <strong>Total: {formatPrice(order.total)}</strong>
                  </div>
                  <div className={styles.orderPayment}>
                    Método de pago: {order.paymentMethod}
                    {order.paymentId && (
                      <span className={styles.paymentId}>
                        {" "}
                        | ID de pago: {order.paymentId}
                      </span>
                    )}
                  </div>

                  {order.usersAdress?.adress && (
                    <div className={styles.orderAddress}>
                      <h4>Dirección de entrega:</h4>
                      <p>{order.usersAdress.adress.street}</p>
                      <p>
                        {order.usersAdress.adress.town},{" "}
                        {order.usersAdress.adress.state}
                      </p>
                      <p>CP: {order.usersAdress.adress.cpi}</p>
                      <p>{order.usersAdress.adress.country}</p>
                    </div>
                  )}

                  {order.details && order.details.length > 0 && (
                    <div className={styles.orderItems}>
                      <h4>Productos:</h4>
                      {order.details.map((detail) => (
                        <div key={detail.id} className={styles.orderItem}>
                          <div className={styles.itemImage}>
                            <img
                              src={detail.product.image}
                              alt={detail.product.name}
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-image.jpg";
                              }}
                            />
                          </div>
                          <div className={styles.itemDetails}>
                            <h5>{detail.product.name}</h5>
                            <p>Talle: {detail.size.number}</p>
                            <p>Cantidad: {detail.quantity}</p>
                            <p>
                              Precio unitario:{" "}
                              {formatPrice(detail.product.price)}
                            </p>
                            <p>
                              <strong>
                                Subtotal:{" "}
                                {formatPrice(
                                  detail.product.price * detail.quantity
                                )}
                              </strong>
                            </p>
                          </div>
                        </div>
                      ))}
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
