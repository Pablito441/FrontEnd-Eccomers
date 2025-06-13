import { useState, useEffect } from "react";
import { useProductStore } from "../../../hooks/useProductStore";
import {
  useCarouselStore,
  type CarouselImage,
} from "../../../hooks/useCarouselStore";
import {
  useCategoryImageStore,
  type CategoryImage,
} from "../../../hooks/useCategoryImageStore";
import s from "./AdminLanding.module.css";

export const AdminLanding = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedCategoryProduct, setSelectedCategoryProduct] =
    useState<string>("");
  const [isCatalogLink, setIsCatalogLink] = useState(false);
  const { items: products, fetchAll: fetchAllProducts } = useProductStore();
  const { images: carouselImages, addImage, removeImage } = useCarouselStore();
  const {
    images: categoryImages,
    addImage: addCategoryImage,
    removeImage: removeCategoryImage,
  } = useCategoryImageStore();

  // Cloudinary config
  const CLOUD_NAME = "di4o0xrvh";
  const UPLOAD_PRESET = "unsigned_preset";

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const uploadImageToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(e.target.files[0]);
      const newImage: CarouselImage = {
        id: Date.now().toString(),
        imageUrl,
        productName: isCatalogLink
          ? "Catálogo"
          : products.find((p) => p.id.toString() === selectedProduct)?.name ||
            "",
        productId: isCatalogLink ? undefined : Number(selectedProduct),
        isCatalogLink,
      };
      addImage(newImage);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0]) return;

    setUploadingCategory(true);
    try {
      const imageUrl = await uploadImageToCloudinary(e.target.files[0]);
      const newImage: CategoryImage = {
        id: Date.now().toString(),
        imageUrl,
        productName:
          products.find((p) => p.id.toString() === selectedCategoryProduct)
            ?.name || "",
        productId: Number(selectedCategoryProduct),
        position: categoryImages.length,
      };
      addCategoryImage(newImage);
    } catch (error) {
      console.error("Error al subir la imagen de categoría:", error);
    } finally {
      setUploadingCategory(false);
    }
  };

  const handleRemoveImage = (id: string) => {
    removeImage(id);
  };

  const handleRemoveCategoryImage = (id: string) => {
    removeCategoryImage(id);
  };

  const handleImageClick = (image: CarouselImage) => {
    if (image.isCatalogLink) {
      window.location.href = "/catalog";
    } else if (image.productId) {
      window.location.href = `/catalog?search=${encodeURIComponent(
        image.productName
      )}`;
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1>Administrador del Carrusel</h1>
        <div className={s.uploadSection}>
          <div className={s.uploadControls}>
            <div className={s.productSelect}>
              <label>
                <input
                  type="checkbox"
                  checked={isCatalogLink}
                  onChange={(e) => setIsCatalogLink(e.target.checked)}
                />
                Vincular a todo el catálogo
              </label>
              {!isCatalogLink && (
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disabled={isCatalogLink}
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className={s.fileInput}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading || (!isCatalogLink && !selectedProduct)}
              />
              {uploading && <span>Subiendo imagen...</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={s.carouselGrid}>
        {carouselImages.map((image) => (
          <div key={image.id} className={s.carouselItem}>
            <div className={s.imageContainer}>
              <img
                src={image.imageUrl}
                alt={image.productName}
                onClick={() => handleImageClick(image)}
              />
              <button
                className={s.removeButton}
                onClick={() => handleRemoveImage(image.id)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            <div className={s.imageInfo}>
              <p>Producto: {image.productName}</p>
              <p>
                Tipo:{" "}
                {image.isCatalogLink
                  ? "Enlace al catálogo"
                  : "Enlace a producto"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Imágenes de Categorías */}
      <div className={s.header}>
        <h1>Administrador de Imágenes de Categorías</h1>
        <div className={s.uploadSection}>
          <div className={s.uploadControls}>
            <div className={s.productSelect}>
              <select
                value={selectedCategoryProduct}
                onChange={(e) => setSelectedCategoryProduct(e.target.value)}
              >
                <option value="">Seleccionar producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={s.fileInput}>
              <input
                type="file"
                accept="image/*"
                onChange={handleCategoryFileChange}
                disabled={uploadingCategory || !selectedCategoryProduct}
              />
              {uploadingCategory && <span>Subiendo imagen...</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={s.carouselGrid}>
        {categoryImages.map((image) => (
          <div key={image.id} className={s.carouselItem}>
            <div className={s.imageContainer}>
              <img
                src={image.imageUrl}
                alt={image.productName}
                onClick={() =>
                  (window.location.href = `/catalog?search=${encodeURIComponent(
                    image.productName
                  )}`)
                }
              />
              <button
                className={s.removeButton}
                onClick={() => handleRemoveCategoryImage(image.id)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            <div className={s.imageInfo}>
              <p>Producto: {image.productName}</p>
              <p>Posición: {image.position + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
