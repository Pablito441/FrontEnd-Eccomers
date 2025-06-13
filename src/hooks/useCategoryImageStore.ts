import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CategoryImage = {
  id: string;
  imageUrl: string;
  productName: string;
  productId?: number;
  position: number; // Para mantener el orden de las imágenes
};

type CategoryImageStore = {
  images: CategoryImage[];
  setImages: (images: CategoryImage[]) => void;
  addImage: (image: CategoryImage) => void;
  removeImage: (id: string) => void;
  updateImagePosition: (id: string, newPosition: number) => void;
};

export const useCategoryImageStore = create<CategoryImageStore>()(
  persist(
    (set) => ({
      images: [],
      setImages: (images) => set({ images }),
      addImage: (image) =>
        set((state) => ({
          images: [...state.images, image].sort(
            (a, b) => a.position - b.position
          ),
        })),
      removeImage: (id) =>
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
        })),
      updateImagePosition: (id, newPosition) =>
        set((state) => ({
          images: state.images
            .map((img) =>
              img.id === id ? { ...img, position: newPosition } : img
            )
            .sort((a, b) => a.position - b.position),
        })),
    }),
    {
      name: "category-images-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
