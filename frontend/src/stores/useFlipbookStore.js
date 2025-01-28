import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance"; // Assuming you have this setup already
import { toast } from "react-hot-toast";
const FLIPBOOK_ID = "677fb56e0ecae6e856a5c0cc"; // Define the static ID at the top

const useFlipbookStore = create((set) => ({
  flipbook: null,
  loading: false,
  error: null,
  flipbookId: FLIPBOOK_ID,
  pages: [],
  archives: null,
  publishedFlipbook: null,

  getFlipbookById: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/flipbook/${FLIPBOOK_ID}`);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      set({
        flipbook: response.data,
        pages: response.data.pages || [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching flipbook:", error.response || error);
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
        flipbook: null,
        pages: [],
      });
    }
  },

  getPages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/flipbook/pages");

      if (!response.data) {
        throw new Error("No pages received from server");
      }

      set({
        pages: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching pages:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2)); // Detailed error log
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch pages",
        loading: false,
        pages: [],
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

  addPage: async (pageData, flipbookId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/pages/${flipbookId}`,
        pageData
      );

      set((state) => ({
        loading: false,
        flipbook: response.data.flipbook,
        pages: response.data.flipbook.pages || state.pages,
        error: null,
      }));

      toast.success("Page added successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },

  deletePage: async (pageId) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.delete(`/flipbook/pages/${pageId}`);

      set((state) => ({
        loading: false,
        flipbook: response.data.flipbook,
        pages: response.data.flipbook.pages || [],
        error: null,
      }));

      toast.success("Page deleted successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },

  createArchive: async (flipbookID, { version, name }) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/archive/${flipbookID}`,
        {
          version,
          name,
        }
      );

      set({ archives: response.data.archive, loading: false });
      toast.success("Version Archived Successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },

  getArchivedVersions: async (flipbookID) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/flipbook/archive/${flipbookID}`
      );

      set({ archives: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },
  getArchivedVersionById: async (archiveId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/flipbook/singleArchive/${archiveId}`
      );

      set({ archives: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },

  publishFlipbook: async (flipbookId, name, issueName) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/instantpublish/${flipbookId}`,
        {
          name,
          issueName,
        }
      );

      set({ publishedFlipbook: response.data, loading: false });
      toast.success("Flipbook Published Successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },

  getPublishedFlipbooks: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/flipbook/published/get-published-flipbooks`
      );

      set({ publishedFlipbook: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },

  togglePublishedFlipbook: async (flipbookId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/flipbook/published/toggle-published/${flipbookId}`
      );

      set({ loading: false });
      toast.success(`Flipbook Publication Status Changed to ${response.data}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },
}));

export default useFlipbookStore;
