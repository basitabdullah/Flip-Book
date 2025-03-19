import { create } from 'zustand';
import axiosInstance from '../lib/axiosInstance';
import useFlipbookStore from './useFlipbookStore';

const useBackCoverStore = create((set, get) => ({
  backCovers: [],
  loading: false,
  error: null,
  
  fetchBackCovers: async (flipbookId) => {
    try {
      set({ loading: true, error: null });
      
      const { flipbook } = useFlipbookStore.getState();
      
      if (!flipbook) {
        throw new Error("Flipbook not found");
      }
      
      const backCovers = flipbook.pages.filter(
        (page) => page.pageType === "BackPage" || page.pageType === "BackCover"
      );
      
      set({
        backCovers,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        backCovers: [],
      });
      throw error;
    }
  },
  
  addBackCover: async (flipbookId, formData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/backcover`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);
      
      await get().fetchBackCovers(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to add back cover";
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
  
  updateBackCover: async (flipbookId, pageId, formData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/backcover/${pageId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);
      
      await get().fetchBackCovers(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update back cover";
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
  
  deleteBackCover: async (flipbookId, pageId) => {
    try {
      set({ loading: true, error: null });
      
      // Make sure we have valid IDs
      if (!flipbookId || !pageId) {
        throw new Error("Missing required IDs for deletion");
      }
      
      const response = await axiosInstance.delete(`/flipbook/${flipbookId}/backcover/${pageId}`);
      
      set(state => ({
        backCovers: state.backCovers.filter(cover => cover._id !== pageId),
        loading: false
      }));
      
      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);
      
      await get().fetchBackCovers(flipbookId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete back cover";
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
  
  // Clear any errors
  clearError: () => set({ error: null }),
}));

export default useBackCoverStore;
