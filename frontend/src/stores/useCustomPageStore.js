import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import useFlipbookStore from "./useFlipbookStore";

const useCustomPageStore = create((set, get) => ({
  customPages: [],
  loading: false,
  error: null,

  // Fetch custom pages from flipbook data
  fetchCustomPages: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const { flipbook } = useFlipbookStore.getState();

      if (!flipbook) {
        throw new Error("Flipbook not found");
      }

      const customPages = flipbook.pages.filter(
        (page) => page.pageType === "IndexPage" || page.isCustom === true
      );

      set({
        customPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error.message;
      set({
        loading: false,
        error: errorMessage,
        customPages: [],
      });
      toast.error(errorMessage);
    }
  },

  // Add custom page
  addCustomPage: async (flipbookId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/index`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      await get().fetchCustomPages(flipbookId);
      toast.success("Custom page added successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  // Update custom page
  updateCustomPage: async (flipbookId, pageNumber, pageData) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/index/${pageNumber}`,
        {
          ...pageData,
          pageType: "IndexPage",
          pageNumber: parseInt(pageNumber),
        }
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      const { flipbook } = useFlipbookStore.getState();
      const updatedCustomPages = flipbook.pages.filter(
        (page) => page.pageType === "IndexPage" || page.type === "IndexPage"
      );

      set({
        customPages: updatedCustomPages,
        loading: false,
        error: null,
      });

      toast.success("Custom page updated successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  // Delete custom page
  deleteCustomPage: async (flipbookId, pageNumber) => {
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

      const updatedCustomPages = response.data.flipbook.pages.filter(
        (page) => page.pageType === "IndexPage" || page.type === "IndexPage"
      );

      set({
        customPages: updatedCustomPages,
        loading: false,
        error: null,
      });

      toast.success("Custom page deleted successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },
}));

export default useCustomPageStore;
