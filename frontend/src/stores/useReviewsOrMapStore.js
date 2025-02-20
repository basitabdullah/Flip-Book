import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import useFlipbookStore from "./useFlipbookStore";
import { toast } from "react-hot-toast";

const useReviewsOrMapStore = create((set, get) => ({
  reviewsOrMapPages: [],
  loading: false,
  error: null,

  // Fetch reviews/map pages from flipbook data
  fetchReviewsOrMapPages: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const { flipbook } = useFlipbookStore.getState();

      if (!flipbook) {
        throw new Error("Flipbook not found");
      }

      const reviewsOrMapPages = flipbook.pages.filter(
        (page) => page.pageType === "ReviewsOrMap"
      );

      set({
        reviewsOrMapPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        reviewsOrMapPages: [],
      });
      throw error;
    }
  },

  // Add reviews/map page
  addReviewsOrMapPage: async (flipbookId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/reviews-map`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchReviewsOrMapPages(flipbookId);
      toast.success("Reviews/Map page added successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  // Update reviews/map page
  updateReviewsOrMapPage: async (flipbookId, pageId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/reviews-map/${pageId}`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchReviewsOrMapPages(flipbookId);
      toast.success("Reviews/Map page updated successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  // Delete reviews/map page
  deleteReviewsOrMapPage: async (flipbookId, pageId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `/flipbook/${flipbookId}/reviews-map/${pageId}`
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      const { getFlipbookById } = useFlipbookStore.getState();
      await getFlipbookById(flipbookId);

      await get().fetchReviewsOrMapPages(flipbookId);
      toast.success("Reviews/Map page deleted successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },
}));

export default useReviewsOrMapStore; 