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

      // Create a new FormData to ensure proper formatting
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', pageData.get('title'));
      formData.append('pageNumber', pageData.get('pageNumber'));
      formData.append('subtitle', pageData.get('subtitle'));
      
      // Parse and re-stringify imagesData to ensure it's an array
      const imagesDataString = pageData.get('imagesData');
      const imagesData = JSON.parse(imagesDataString);
      if (!Array.isArray(imagesData)) {
        throw new Error('ImagesData should be an array');
      }
      formData.append('imagesData', JSON.stringify(imagesData));

      // Add any image files
      const files = pageData.getAll('images');
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/gallery`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
      
      const formData = new FormData();
      formData.append("title", pageData.title);
      formData.append("pageNumber", pageData.pageNumber);
      formData.append("subtitle", pageData.subtitle);
      formData.append("imagesData", JSON.stringify(pageData.imagesData));

      // Append multiple images if they exist
      if (pageData.images) {
        pageData.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/gallery/${pageId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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