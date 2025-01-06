import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance"; // Assuming you have this setup already
import { toast } from "react-hot-toast";
const FLIPBOOK_ID = "677bd0ef177dd36ac6e4b6d3"; // Define the static ID at the top

const useFlipbookStore = create((set) => ({
  flipbook: null,
  loading: false,
  error: null,
  flipbookId: FLIPBOOK_ID,

  getFlipbookById: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/flipbook/${FLIPBOOK_ID}`);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      set({
        flipbook: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching flipbook:", error.response || error);
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
        flipbook: null,
      });
    }
  },

  updatePage: async (pageId, pageData) => {
    try {
      set({ loading: true });
      const { version, ...updateData } = pageData;

      const response = await axiosInstance.put(
        `/flipbook/${FLIPBOOK_ID}/pages/${pageId}`,
        updateData
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      set({ flipbook: response.data.flipbook, loading: false });
      toast.success("Page updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating page:", error.response || error);
      throw error.response?.data?.message || error.message;
    }
  },
}));

export default useFlipbookStore;
