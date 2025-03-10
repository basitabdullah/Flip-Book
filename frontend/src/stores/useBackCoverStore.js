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
      
      console.log("All pages in flipbook:", flipbook.pages);
      
      // Look for both 'BackPage' and 'BackCover' page types
      const backCovers = flipbook.pages.filter(
        (page) => page.pageType === "BackPage" || page.pageType === "BackCover"
      );
      
      console.log("Filtered back covers:", backCovers);
      
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
      console.error("Error fetching back covers:", error);
      throw error;
    }
  },
  
  addBackCover: async (flipbookId, formData) => {
    try {
      set({ loading: true, error: null });
      
      console.log("Adding back cover with data:", formData);
      
      // Using the correct API endpoint from backend routes
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/backcover`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log("Add back cover response:", response.data);
      
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      
      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);
      
      await get().fetchBackCovers(flipbookId);
      return response.data;
    } catch (error) {
      console.error("Error adding back cover:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add back cover";
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
  
  updateBackCover: async (flipbookId, pageNumber, formData) => {
    try {
      set({ loading: true, error: null });
      
      console.log("Updating back cover with data:", formData);
      
      // Using the correct API endpoint from backend routes
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/backcover/${pageNumber}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log("Update back cover response:", response.data);
      
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      
      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);
      
      await get().fetchBackCovers(flipbookId);
      return response.data;
    } catch (error) {
      console.error("Error updating back cover:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update back cover";
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
  
  deleteBackCover: async (flipbookId, pageNumber) => {
    try {
      set({ loading: true, error: null });
      
      console.log("Deleting back cover");
      
      // Using the correct API endpoint from backend routes
      const response = await axiosInstance.delete(
        `/flipbook/${flipbookId}/backcover/${pageNumber}`
      );
      
      console.log("Delete back cover response:", response.data);
      
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      
      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);
      
      await get().fetchBackCovers(flipbookId);
      return response.data;
    } catch (error) {
      console.error("Error deleting back cover:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete back cover";
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },
  
  // Clear any errors
  clearError: () => set({ error: null }),
}));

export default useBackCoverStore;
