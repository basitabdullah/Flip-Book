import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import useFlipbookStore from "./useFlipbookStore";

const useCatalogPageStore = create((set, get) => ({
  catalogPages: [],
  loading: false,
  error: null,

  fetchCatalogPages: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const { flipbook } = useFlipbookStore.getState();

      if (!flipbook) {
        throw new Error("Flipbook not found");
      }

      const catalogPages = flipbook.pages.filter(
        (page) => page.pageType === "Catalog"
      );

      set({
        catalogPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        catalogPages: [],
      });
      throw error;
    }
  },

  addCatalogPage: async (flipbookId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/catalog`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }
     
      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchCatalogPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },

  updateCatalogPage: async (flipbookId, pageId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/catalog/${pageId}`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchCatalogPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },

  deleteCatalogPage: async (flipbookId, pageId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `/flipbook/${flipbookId}/catalog/${pageId}`
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchCatalogPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
}));

export default useCatalogPageStore; 