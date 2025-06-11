import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../hooks/useUserStore";
import styles from "./UserCount.module.css";

export const UserCount = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/loginRegister");
    }
  }, [isAuthenticated, navigate]);

  if (!currentUser) {
    return null;
  }

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

      {/* <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Direcciones</h2>
        <div className={styles.addressesList}>
          {currentUser.addresses?.map((address) => (
            <div key={address.id} className={styles.addressCard}>
              <h3 className={styles.addressTitle}>{address.name}</h3>
              <p className={styles.addressInfo}>
                {address.street} {address.number}
              </p>
              <p className={styles.addressInfo}>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className={styles.addressInfo}>{address.country}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Pedidos Recientes</h2>
        <div className={styles.ordersList}>
          {currentUser.orders?.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderNumber}>Pedido #{order.id}</span>
                <span className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.orderStatus}>Estado: {order.status}</div>
              <div className={styles.orderTotal}>Total: ${order.total}</div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};
