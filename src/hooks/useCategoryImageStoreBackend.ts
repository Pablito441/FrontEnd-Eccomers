import { create } from "zustand";
import { categoryImageService, type ICategoryImage, type ICreateCategoryImage } from "../http/CategoryImageService";

type CategoryImageStore = {
  images: ICategoryImage[];
  loading: boolean;
  error: string | null;
  
  // Métodos para cargar datos
  fetchImages: () => Promise<void>;
  fetchOrderedImages: () => Promise<void>;
  fetchImagesByProduct: (productId: number) => Promise<void>;
  
  // Métodos para modificar datos
  addImage: (data: ICreateCategoryImage) => Promise<void>;
  removeImage: (id: number) => Promise<void>;
  updateImagePosition: (id: number, position: number) => Promise<void>;
  activateImage: (id: number) => Promise<void>;
  deactivateImage: (id: number) => Promise<void>;
  softDeleteImage: (id: number) => Promise<void>;
  restoreImage: (id: number) => Promise<void>;
  
  // Métodos de utilidad
  clearError: () => void;
  setLoading: (loading: boolean) => void;
};

export const useCategoryImageStoreBackend = create<CategoryImageStore>((set) => ({
  images: [],
  loading: false,
  error: null,

  // Cargar todas las imágenes activas
  fetchImages: async () => {
    set({ loading: true, error: null });
    try {
      const images = await categoryImageService.getActive();
      set({ images, loading: false });
    } catch (error) {
      set({ error: `Error al cargar imágenes: ${error}`, loading: false });
    }
  },

  // Cargar imágenes ordenadas por posición
  fetchOrderedImages: async () => {
    set({ loading: true, error: null });
    try {
      const images = await categoryImageService.getOrdered();
      set({ images, loading: false });
    } catch (error) {
      set({ error: `Error al cargar imágenes ordenadas: ${error}`, loading: false });
    }
  },

  // Cargar imágenes por producto
  fetchImagesByProduct: async (productId: number) => {
    set({ loading: true, error: null });
    try {
      const images = await categoryImageService.getByProductId(productId);
      set({ images, loading: false });
    } catch (error) {
      set({ error: `Error al cargar imágenes por producto: ${error}`, loading: false });
    }
  },

  // Agregar nueva imagen
  addImage: async (data: ICreateCategoryImage) => {
    set({ loading: true, error: null });
    try {
      const newImage = await categoryImageService.createCategoryImage(data);
      if (newImage) {
        set((state) => ({
          images: [...state.images, newImage].sort((a, b) => a.position - b.position),
          loading: false
        }));
      } else {
        set({ error: "Error al crear la imagen", loading: false });
      }
    } catch (error) {
      set({ error: `Error al agregar imagen: ${error}`, loading: false });
    }
  },

  // Eliminar imagen
  removeImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const success = await categoryImageService.delete(id);
      if (success) {
        set((state) => ({
          images: state.images.filter(img => img.id !== id),
          loading: false
        }));
      } else {
        set({ error: "Error al eliminar la imagen", loading: false });
      }
    } catch (error) {
      set({ error: `Error al eliminar imagen: ${error}`, loading: false });
    }
  },

  // Actualizar posición de imagen
  updateImagePosition: async (id: number, position: number) => {
    set({ loading: true, error: null });
    try {
      const updatedImage = await categoryImageService.updatePosition(id, position);
      if (updatedImage) {
        set((state) => ({
          images: state.images.map(img => 
            img.id === id ? updatedImage : img
          ).sort((a, b) => a.position - b.position),
          loading: false
        }));
      } else {
        set({ error: "Error al actualizar posición", loading: false });
      }
    } catch (error) {
      set({ error: `Error al actualizar posición: ${error}`, loading: false });
    }
  },

  // Activar imagen
  activateImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const activatedImage = await categoryImageService.activate(id);
      if (activatedImage) {
        set((state) => ({
          images: state.images.map(img => 
            img.id === id ? activatedImage : img
          ),
          loading: false
        }));
      } else {
        set({ error: "Error al activar la imagen", loading: false });
      }
    } catch (error) {
      set({ error: `Error al activar imagen: ${error}`, loading: false });
    }
  },

  // Desactivar imagen
  deactivateImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const deactivatedImage = await categoryImageService.deactivate(id);
      if (deactivatedImage) {
        set((state) => ({
          images: state.images.map(img => 
            img.id === id ? deactivatedImage : img
          ),
          loading: false
        }));
      } else {
        set({ error: "Error al desactivar la imagen", loading: false });
      }
    } catch (error) {
      set({ error: `Error al desactivar imagen: ${error}`, loading: false });
    }
  },

  // Soft delete imagen
  softDeleteImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const deletedImage = await categoryImageService.softDelete(id);
      if (deletedImage) {
        set((state) => ({
          images: state.images.filter(img => img.id !== id),
          loading: false
        }));
      } else {
        set({ error: "Error al eliminar la imagen", loading: false });
      }
    } catch (error) {
      set({ error: `Error al eliminar imagen: ${error}`, loading: false });
    }
  },

  // Restaurar imagen
  restoreImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const restoredImage = await categoryImageService.restore(id);
      if (restoredImage) {
        set((state) => ({
          images: [...state.images, restoredImage].sort((a, b) => a.position - b.position),
          loading: false
        }));
      } else {
        set({ error: "Error al restaurar la imagen", loading: false });
      }
    } catch (error) {
      set({ error: `Error al restaurar imagen: ${error}`, loading: false });
    }
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Establecer loading
  setLoading: (loading: boolean) => set({ loading }),
})); 