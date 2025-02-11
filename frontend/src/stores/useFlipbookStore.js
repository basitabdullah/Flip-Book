import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance"; // Assuming you have this setup already
import { toast } from "react-hot-toast";

const useFlipbookStore = create((set) => ({
  flipbook: null,
  loading: false,
  error: null,
  pages: [],
  archives: null,
  publishedFlipbook: null,
  publishedFlipbooks: null,
  scheduledFlipbooks: [],
  flipbooks: [],

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

  updatePage: async (pageId, pageData, flipbookId) => {
    try {
      set({ loading: true });
      const { version, ...updateData } = pageData;

      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/pages/${pageId}`,
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

      set({ publishedFlipbooks: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      throw errorMessage;
    }
  },
  getPublishedFlipbook: async (flipbookId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/flipbook/published/get-published-flipbook/${flipbookId}`
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

      // Call the backend API to toggle the published status
      const response = await axiosInstance.get(
        `/flipbook/published/toggle-published/${flipbookId}`
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to toggle flipbook.");
      }

      // Access getPublishedFlipbooks from the store itself
      const { getPublishedFlipbooks } = useFlipbookStore.getState();

      // Refetch the published flipbooks to reflect the updated status
      await getPublishedFlipbooks();

      toast.success(`Flipbook ${flipbookId} status updated.`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred.";

      set({
        loading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);

      throw errorMessage;
    }
  },

  updatePublishedFlipbook: async (flipbookId, pageId, pageData) => {
    try {
      set({ loading: true, error: null });
      const { version, ...updateData } = pageData;

      const response = await axiosInstance.put(
        `/flipbook/published/${flipbookId}/pages/${pageId}`,
        updateData
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      set({
        publishedFlipbook: response.data.publishedFlipbook,
        loading: false,
      });

      toast.success("Published page updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating published page:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  deletePublishedFlipbook: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.delete(
        `/flipbook/published/${flipbookId}`
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Remove the deleted flipbook from the state
      set((state) => ({
        publishedFlipbooks: state.publishedFlipbooks.filter(
          (flipbook) => flipbook._id !== flipbookId
        ),
        loading: false,
      }));

      toast.success("Published flipbook deleted successfully");
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting published flipbook:",
        error.response || error
      );
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  getScheduledFlipbooks: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/scheduled-flipbooks");
      set({ scheduledFlipbooks: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        loading: false,
        error: errorMessage,
        scheduledFlipbooks: [],
      });
      throw errorMessage;
    }
  },

  scheduleFlipbook: async (flipbookId, name, issueName, scheduledDate) => {
    try {
      set({ loading: true, error: null });

      // Validate the scheduled date is in the future
      const now = new Date();
      const scheduleTime = new Date(scheduledDate);

      if (scheduleTime <= now) {
        throw new Error("Scheduled time must be in the future");
      }

      // Fix the API endpoint URL to match backend route
      const response = await axiosInstance.post(
        `/scheduled-flipbooks/${flipbookId}`,
        {
          name,
          issue: issueName,
          scheduledDate: scheduleTime,
        }
      );

      // Update only the scheduled flipbooks list
      set((state) => ({
        scheduledFlipbooks: [
          ...(state.scheduledFlipbooks || []),
          response.data,
        ],
        loading: false,
      }));

      toast.success(
        "Flipbook scheduled successfully for " +
          new Date(scheduledDate).toLocaleString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
      );

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  cancelScheduledPublish: async (scheduleId) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/scheduled-flipbooks/${scheduleId}`);

      set((state) => ({
        scheduledFlipbooks: state.scheduledFlipbooks.filter(
          (schedule) => schedule._id !== scheduleId
        ),
        loading: false,
      }));

      toast.success("Schedule cancelled successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  getFlipbooks: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("flipbook/allflipbooks");
      set({ flipbooks: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
      });
    }
  },

  createFlipbook: async (name, image) => {
    try {
      set({ loading: true, error: null });

      // Send a POST request with the required data (name and image)
      const response = await axiosInstance.post("/flipbook/createflipbook", {
        name,
        image,
      });
        
      // Update the state with the new flipbook
      set((state) => ({
        flipbooks: [...state.flipbooks, response.data.newFlipbook],
        loading: false,
      }));

      // Show success message
      toast.success("Flipbook created successfully");
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  },
  getFlipbookById: async (flipbookId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/flipbook/singleflipbook/${flipbookId}`
      );

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
  deleteFlipbook: async (flipbookId) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.delete(`/flipbook/${flipbookId}`);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Remove the deleted flipbook from the state
      set((state) => ({
        flipbooks: state.flipbooks.filter(
          (flipbook) => flipbook._id !== flipbookId
        ),
        loading: false,
      }));

      toast.success("Flipbook deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting flipbook:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message;

      set({
        loading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  addIndexPage: async (flipbookId, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/flipbook/${flipbookId}/index`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      set((state) => ({
        loading: false,
        flipbook: response.data.flipbook,
        pages: response.data.flipbook.pages || [],
        error: null,
      }));

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        loading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  updateIndexPage: async (flipbookId, pageNumber, pageData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/flipbook/${flipbookId}/index/${pageNumber}`,
        pageData
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      set((state) => ({
        loading: false,
        flipbook: response.data.flipbook,
        pages: response.data.flipbook.pages || [],
        error: null,
      }));

      toast.success("Index page updated successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        loading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },

  deleteIndexPage: async (flipbookId, pageNumber) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `/flipbook/${flipbookId}/index/${pageNumber}`
      );

      if (!response.data || !response.data.flipbook) {
        throw new Error("Invalid response from server");
      }

      set((state) => ({
        loading: false,
        flipbook: response.data.flipbook,
        pages: response.data.flipbook.pages || [],
        error: null,
      }));

      toast.success("Index page deleted successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        loading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw errorMessage;
    }
  },
}));

export default useFlipbookStore;
