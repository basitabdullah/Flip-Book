import { create } from 'zustand';
import axiosInstance from '../lib/axiosInstance';
import useFlipbookStore from './useFlipbookStore';
import { toast } from 'react-hot-toast';

const useSocialPageStore = create((set, get) => ({
  socialPages: [],
  loading: false,
  error: null,

  // Fetch social pages from flipbook data
  fetchSocialPages: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const { flipbook } = useFlipbookStore.getState();

      if (!flipbook) {
        throw new Error("Flipbook not found");
      }

      const socialPages = flipbook.pages.filter(
        (page) => page.pageType === "Social"
      );

      set({
        socialPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        socialPages: [],
      });
      throw error;
    }
  },

  // Add social page
  addSocialPage: async (flipbookId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/social`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchSocialPages(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  // Update social page
  updateSocialPage: async (flipbookId, pageId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/social/${pageId}`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchSocialPages(flipbookId);
      toast.success("Social page updated successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  // Delete social page
  deleteSocialPage: async (flipbookId, pageId) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/flipbook/${flipbookId}/social/${pageId}`);

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchSocialPages(flipbookId);
      toast.success("Social page deleted successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  }
}));

export default useSocialPageStore; 