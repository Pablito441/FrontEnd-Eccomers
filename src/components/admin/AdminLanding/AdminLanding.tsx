import { useState, useEffect } from "react";
import { useProductStore } from "../../../hooks/useProductStore";
import s from "./AdminLanding.module.css";

type CarouselImage = {
  id: string;
  imageUrl: string;
  productName: string;
  productId?: number;
  isCatalogLink: boolean;
};

export const AdminLanding = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [isCatalogLink, setIsCatalogLink] = useState(false);
  const { items: products, fetchAll: fetchAllProducts } = useProductStore();

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
      setCarouselImages((prev) => [...prev, newImage]);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (id: string) => {
    setCarouselImages((prev) => prev.filter((img) => img.id !== id));
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
    </div>
  );
};
