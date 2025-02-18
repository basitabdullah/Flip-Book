import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import useFlipbookStore from "./useFlipbookStore";

const useIndexPageStore = create((set, get) => ({
  indexPages: [],
  loading: false,
  error: null,

  // Fetch index pages from flipbook data
  fetchIndexPages: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const { flipbook } = useFlipbookStore.getState();

      if (!flipbook) {
        throw new Error("Flipbook not found");
      }

      const indexPages = flipbook.pages.filter(
        (page) => page.pageType === "IndexPage"
      );

      set({
        indexPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        indexPages: [],
      });
      throw error;
    }
  },

  // Add index page
  addIndexPage: async (flipbookId, formData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/index`,
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

      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },

  // Update index page
  updateIndexPage: async (flipbookId, pageNumber, formData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/index/${pageNumber}`,
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

      await get().fetchIndexPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },

  // Delete index page
  deleteIndexPage: async (flipbookId, pageNumber) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `/flipbook/${flipbookId}/index/${pageNumber}`
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchIndexPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
}));

export default useIndexPageStore; 