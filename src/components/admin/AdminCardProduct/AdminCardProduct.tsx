import { useNavigate } from "react-router-dom";
import s from "./AdminCardProduct.module.css";
import type { IProduct } from "../../../types/IProduct";
import type { FC } from "react";
import { useProductStore } from "../../../hooks/useProductStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";
import { useProductImageStore } from "../../../hooks/useProductImage";
import { AddProductModal } from "../AddProductModal/AddProductModal";
import { useState } from "react";
import axios from "axios";

type ViewMode = "list" | "grid4";

type AdminCardProductProps = {
  product: IProduct;
  viewMode?: ViewMode;
  fetchList: () => Promise<void>;
};

export const AdminCardProduct: FC<AdminCardProductProps> = ({
  product,
  viewMode = "grid4",
  fetchList,
}) => {
  const navigate = useNavigate();
  const {
    update: updateProduct,
    delete: deleteProduct,
    activate,
    deactivate,
    softDelete,
  } = useProductStore();
  const { items: productSizes, delete: deleteProductSize } =
    useProductSizeStore();
  const { items: productImages, delete: deleteProductImage } =
    useProductImageStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleView = () => {
    navigate("/productDetail", { state: { product } });
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleActivate = async () => {
    try {
      await activate(product.id);
      await fetchList();
    } catch (error) {
      console.error("Error al activar el producto:", error);
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivate(product.id);
      await fetchList();
    } catch (error) {
      console.error("Error al desactivar el producto:", error);
    }
  };

  const handleSoftDelete = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este producto? Esta acción se puede revertir."
      )
    ) {
      try {
        await softDelete(product.id);
        await fetchList();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleRestore = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres restaurar este producto?")
    ) {
      try {
        await axios.put(
          `http://localhost:9000/api/v1/products/${product.id}/restore`
        );
        await fetchList();
      } catch (error) {
        console.error("Error al restaurar el producto:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar permanentemente este producto? Esta acción NO se puede revertir."
      )
    ) {
      try {
        // Paso 1: Actualizar el producto para establecer las relaciones como NULL
        await updateProduct(product.id, {
          brandId: undefined,
          categoryId: undefined,
          colourId: undefined,
        });

        // Paso 2: Eliminar todas las imágenes asociadas
        const imagesToDelete = productImages.filter(
          (img) => img.productId === product.id
        );

        for (const image of imagesToDelete) {
          await deleteProductImage(image.id);
        }

        // Paso 3: Eliminar todos los product_sizes asociados
        const productSizesToDelete = productSizes.filter(
          (ps) => ps.idProduct === product.id
        );

        for (const ps of productSizesToDelete) {
          await deleteProductSize({
            idProduct: product.id,
            idSize: ps.idSize,
          });
        }

        // Paso 4: Eliminar el producto
        await deleteProduct(product.id);
        await fetchList();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  // Determinar el estado del producto
  const getProductStatus = () => {
    if (product.deletedAt) return "deleted";
    if (!product.isActive) return "inactive";
    return "active";
  };

  const productStatus = getProductStatus();

  return (
    <>
      <div className={`${s.container} ${s[productStatus]} ${s[viewMode]}`}>
        <div className={s.statusBadge}>
          {productStatus === "active" && (
            <span className={`${s.badge} ${s.activeBadge}`}>
              <span className="material-symbols-outlined">check_circle</span>
            </span>
          )}
          {productStatus === "inactive" && (
            <span className={`${s.badge} ${s.inactiveBadge}`}>
              <span className="material-symbols-outlined">cancel</span>
            </span>
          )}
          {productStatus === "deleted" && (
            <span className={`${s.badge} ${s.deletedBadge}`}>
              <span className="material-symbols-outlined">delete</span>
            </span>
          )}
        </div>

        <div className={s.containerImg}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className={s.containerContent}>
          <div className={s.productInfo}>
            <h1>{product.brand?.name}</h1>
            <h2>Zapatillas {product.name}</h2>
            <h2>$ {product.price}</h2>
          </div>
          <div className={s.actions}>
            <button onClick={handleView} className={s.viewButton} title="Ver">
              <span className="material-symbols-outlined">visibility</span>
            </button>

            {productStatus !== "deleted" && (
              <button
                onClick={handleEdit}
                className={s.editButton}
                title="Editar"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
            )}

            {productStatus === "active" && (
              <button
                onClick={handleDeactivate}
                className={s.deactivateButton}
                title="Desactivar"
              >
                <span className="material-symbols-outlined">pause_circle</span>
              </button>
            )}

            {productStatus === "inactive" && (
              <button
                onClick={handleActivate}
                className={s.activateButton}
                title="Activar"
              >
                <span className="material-symbols-outlined">play_circle</span>
              </button>
            )}

            {productStatus !== "deleted" && (
              <button
                onClick={handleSoftDelete}
                className={s.softDeleteButton}
                title="Eliminar"
              >
                <span className="material-symbols-outlined">
                  delete_outline
                </span>
              </button>
            )}

            {productStatus === "deleted" && (
              <button
                onClick={handleRestore}
                className={s.activateButton}
                title="Restaurar"
              >
                <span className="material-symbols-outlined">restore</span>
              </button>
            )}

            {/* <button onClick={handleDelete} className={s.deleteButton} title="Eliminar Permanente">
              <span className="material-symbols-outlined">delete_forever</span>
            </button> */}
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productToEdit={product}
      />
    </>
  );
};
