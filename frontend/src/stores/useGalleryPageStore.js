import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import useFlipbookStore from "./useFlipbookStore";

const useGalleryPageStore = create((set, get) => ({
  galleryPages: [],
  loading: false,
  error: null,

  // Fetch gallery pages from flipbook data
  fetchGalleryPages: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const { flipbook } = useFlipbookStore.getState();

      if (!flipbook) {
        throw new Error("Flipbook not found");
      }

      const galleryPages = flipbook.pages.filter(
        (page) => page.pageType === "Gallery"
      );

      set({
        galleryPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        galleryPages: [],
      });
      throw error;
    }
  },

  // Add gallery page
  addGalleryPage: async (flipbookId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/gallery`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchGalleryPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },

  // Update gallery page
  updateGalleryPage: async (flipbookId, pageId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/gallery/${pageId}`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchGalleryPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },

  // Delete gallery page
  deleteGalleryPage: async (flipbookId, pageId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `/flipbook/${flipbookId}/gallery/${pageId}`
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchGalleryPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
}));

export default useGalleryPageStore; 