import { useState, useEffect } from "react";
import s from "./AddProductModal.module.css";
import { useProductStore } from "../../../hooks/useProductStore";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";
import { useBrandStore } from "../../../hooks/useBrandStore";
import { useColourStore } from "../../../hooks/useColourStore";
import { useProductImageStore } from "../../../hooks/useProductImage";
import type { IProduct } from "../../../types/IProduct";
import type { IProductImage } from "../../../types/IProductImage";
import type { IProductSize } from "../../../types/IProductSize";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: IProduct;
};

export const AddProductModal = ({
  isOpen,
  onClose,
  productToEdit,
}: AddProductModalProps) => {
  const {
    create: createProduct,
    update: updateProduct,
    items: products,
  } = useProductStore();
  const { items: categories, fetchAll: fetchAllCategories } =
    useCategoryStore();
  const { items: brands, fetchAll: fetchAllBrands } = useBrandStore();
  const { items: colors, fetchAll: fetchAllColors } = useColourStore();
  const { items: sizes, fetchAll: fetchAllSizes } = useSizeStore();
  const {
    items: productSizes,
    create: createProductSize,
    delete: deleteProductSize,
    fetchAll: fetchAllProductSizes,
  } = useProductSizeStore();
  const {
    items: productImages,
    create: createProductImage,
    delete: deleteProductImage,
    fetchAll: fetchAllProductImages,
  } = useProductImageStore();

  const initialFormState = {
    name: "",
    price: "",
    description: "",
    images: ["", "", "", "", ""],
    categoryId: "",
    colourId: "",
    brandId: "",
    sizes: [] as { sizeId: string; stock: string }[],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [uploading, setUploading] = useState([false, false, false, false, false]);

  const resetForm = () => {
    setFormData(initialFormState);
    setHasLoadedData(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Cargar datos básicos al montar el componente
  useEffect(() => {
    const loadBasicData = async () => {
      try {
        await Promise.all([
          fetchAllCategories(),
          fetchAllBrands(),
          fetchAllColors(),
          fetchAllSizes(),
        ]);
      } catch (error) {
        console.error("Error al cargar datos básicos:", error);
      }
    };
    loadBasicData();
  }, [fetchAllCategories, fetchAllBrands, fetchAllColors, fetchAllSizes]);

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    const loadProductData = async () => {
      if (productToEdit && !hasLoadedData) {
        setIsLoading(true);
        try {
          // Cargar datos específicos del producto
          await Promise.all([fetchAllProductImages(), fetchAllProductSizes()]);

          const product = products.find((p) => p.id === productToEdit.id);
          if (!product) {
            throw new Error("No se pudo cargar el producto");
          }

          const productImagesList = productImages.filter(
            (img: IProductImage) => img.productId === productToEdit.id
          );
          const productSizesList = productSizes.filter(
            (ps: IProductSize) => ps.idProduct === productToEdit.id
          );

          // Ordenar las imágenes: primero la principal, luego las demás
          const sortedImages = [
            product.image,
            ...productImagesList
              .filter((img: IProductImage) => !img.isPrincipalProductImage)
              .map((img: IProductImage) => img.link),
          ].slice(0, 4);

          // Rellenar el array de imágenes hasta 4 elementos
          while (sortedImages.length < 4) {
            sortedImages.push("");
          }

          setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            images: sortedImages,
            categoryId: product.categoryId.toString(),
            colourId: product.colourId.toString(),
            brandId: product.brandId.toString(),
            sizes: productSizesList.map((ps: IProductSize) => ({
              sizeId: ps.idSize.toString(),
              stock: ps.stock.toString(),
            })),
          });
          setHasLoadedData(true);
        } catch (error) {
          console.error("Error al cargar los datos del producto:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isOpen) {
      loadProductData();
    }
  }, [
    isOpen,
    productToEdit,
    hasLoadedData,
    fetchAllProductImages,
    fetchAllProductSizes,
    productImages,
    productSizes,
    products,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const handleSizeChange = (sizeId: string, stock: string) => {
    setFormData((prev) => {
      const existingSizeIndex = prev.sizes.findIndex(
        (s) => s.sizeId === sizeId
      );
      if (existingSizeIndex >= 0) {
        const newSizes = [...prev.sizes];
        newSizes[existingSizeIndex] = { sizeId, stock };
        return { ...prev, sizes: newSizes };
      }
      return { ...prev, sizes: [...prev.sizes, { sizeId, stock }] };
    });
  };

  // Cloudinary config
  const CLOUD_NAME = "di4o0xrvh";
  const UPLOAD_PRESET = "unsigned_preset";

  const uploadImageToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });
    const json = await res.json();
    console.log("Respuesta Cloudinary:", json);
    return json.secure_url;
  };

  const handleFileChange = async (index: number, file: File) => {
    if (!file) return;
    setUploading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
    const imageUrl = await uploadImageToCloudinary(file);
    handleImageChange(index, imageUrl);
    setUploading((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        image: formData.images[0],
        categoryId: Number(formData.categoryId),
        colourId: Number(formData.colourId),
        brandId: Number(formData.brandId),
        status: true,
        isActive: true,
      };

      let product;
      if (productToEdit) {
        // Modo edición
        product = await updateProduct(productToEdit.id, productData);

        // Eliminar imágenes existentes
        const existingImages = productImages.filter(
          (img) => img.productId === productToEdit.id
        );
        for (const image of existingImages) {
          await deleteProductImage(image.id);
        }

        // Eliminar talles existentes
        const existingSizes = productSizes.filter(
          (ps) => ps.idProduct === productToEdit.id
        );
        for (const ps of existingSizes) {
          await deleteProductSize({
            idProduct: productToEdit.id,
            idSize: ps.idSize,
          });
        }
      } else {
        // Modo creación
        product = await createProduct(productData);
      }

      if (!product) {
        throw new Error("No se pudo guardar el producto");
      }

      // Crear las imágenes del producto
      for (let i = 0; i < formData.images.length; i++) {
        if (formData.images[i]) {
          await createProductImage({
            link: formData.images[i],
            productId: product.id,
            isPrincipalProductImage: i === 0,
            isActive: true,
          });
        }
      }

      // Crear los talles asociados
      for (const size of formData.sizes) {
        await createProductSize({
          idProduct: product.id,
          idSize: Number(size.sizeId),
          stock: Number(size.stock),
        });
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className={s.modalOverlay}>
        <div className={s.modalContent}>
          <div className={s.loadingMessage}>Cargando datos del producto...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalContent}>
        <div className={s.modalHeader}>
          <h2>
            {productToEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
          </h2>
          <button className={s.closeButton} onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.formGroup}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={s.formGroup}>
            <label>Imágenes del Producto</label>
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className={s.imageInput}>
                <label>
                  {index === 0 ? "Imagen Principal (obligatoria)" : `Imagen Adicional ${index}`}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading[index]}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(index, e.target.files[0]);
                    }
                  }}
                  required={index === 0}
                />
                {uploading[index] && (
                  <div style={{ color: '#d32f2f', fontWeight: 600, marginTop: 4 }}>Subiendo imagen...</div>
                )}
                {formData.images[index] && !uploading[index] && (
                  <img src={formData.images[index]} alt={`preview-${index}`} style={{ maxWidth: 120, marginTop: 8, border: '1px solid #ccc' }} />
                )}
              </div>
            ))}
          </div>

          <div className={s.formGroup}>
            <label htmlFor="categoryId">Categoría</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="brandId">Marca</label>
            <select
              id="brandId"
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="colourId">Color</label>
            <select
              id="colourId"
              name="colourId"
              value={formData.colourId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar color</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>

          <div className={s.formGroup}>
            <label>Talles y Stock</label>
            <div className={s.sizesGrid}>
              {sizes.map((size) => (
                <div key={size.id} className={s.sizeInput}>
                  <label>{size.number}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={formData.sizes.find((s) => s.sizeId === size.id.toString())?.stock || ""}
                    onChange={(e) => handleSizeChange(size.id.toString(), e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={s.formActions}>
            <button
              type="button"
              className={s.cancelButton}
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className={s.submitButton}>
              {productToEdit ? "Guardar Cambios" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
