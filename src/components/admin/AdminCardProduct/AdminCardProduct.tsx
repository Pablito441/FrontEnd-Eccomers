import { useNavigate } from "react-router-dom";
import s from "./AdminCardProduct.module.css";
import type { IProduct } from "../../../types/IProduct";
import type { FC } from "react";
import { useProductStore } from "../../../hooks/useProductStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";
import { useProductImageStore } from "../../../hooks/useProductImage";
import { AddProductModal } from "../AddProductModal/AddProductModal";
import { useState } from "react";

type AdminCardProductProps = {
  product: IProduct;
};

export const AdminCardProduct: FC<AdminCardProductProps> = ({ product }) => {
  const navigate = useNavigate();
  const { update: updateProduct, delete: deleteProduct } = useProductStore();
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

  const handleDelete = async () => {
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
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <>
      <div className={s.container}>
        <div className={s.containerImg}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className={s.containerContent}>
          <h1>{product.brand?.name}</h1>
          <h2>Zapatillas {product.name}</h2>
          <h2>$ {product.price}</h2>
          <div className={s.actions}>
            <button onClick={handleView} className={s.viewButton}>
              <span className="material-symbols-outlined">visibility</span>
              Ver
            </button>
            <button onClick={handleEdit} className={s.editButton}>
              <span className="material-symbols-outlined">edit</span>
              Editar
            </button>
            <button onClick={handleDelete} className={s.deleteButton}>
              <span className="material-symbols-outlined">delete</span>
              Eliminar
            </button>
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
