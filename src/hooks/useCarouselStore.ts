import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CarouselImage = {
  id: string;
  imageUrl: string;
  productName: string;
  productId?: number;
  isCatalogLink: boolean;
};

type CarouselStore = {
  images: CarouselImage[];
  setImages: (images: CarouselImage[]) => void;
  addImage: (image: CarouselImage) => void;
  removeImage: (id: string) => void;
};

export const useCarouselStore = create<CarouselStore>()(
  persist(
    (set) => ({
      images: [],
      setImages: (images) => set({ images }),
      addImage: (image) =>
        set((state) => ({ images: [...state.images, image] })),
      removeImage: (id) =>
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
        })),
    }),
    {
      name: "carousel-storage", // nombre único para el localStorage
      storage: createJSONStorage(() => localStorage), // usa localStorage con serialización JSON
    }
  )
);
