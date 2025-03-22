import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,
  checkingAuth: true,
  isAuthenticated: false,

  signup: async ({ name, email, password, confirmPassword, phone }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords Do Not Match!");
    }
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        phone
      });
      set({ user: res.data.user, loading: false, isAuthenticated: true });
      toast.success(`Welcome, ${name}`);
    } catch (error) {
      set({ loading: false, isAuthenticated: false });
      toast.error(error.response.data.message || "An unexpected error occured");
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data.user, loading: false, isAuthenticated: true });
      toast.success('Login Successfull');
      return res.data;
    } catch (error) {
      set({ loading: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ user: null, isAuthenticated: false });
      toast.success("Logged Out Successfully!");
      // Refresh the page after logout
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message || "An unexpected error occured");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ 
        user: res.data, 
        checkingAuth: false,
        isAuthenticated: true 
      });
    } catch (error) {
      set({ 
        user: null, 
        checkingAuth: false,
        isAuthenticated: false 
      });
      // toast.error(error.response.message || "An unexpected error occured");
    }
  },

  // New user management functions
  getAllUsers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get('/users');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      set({ 
        users: response.data,
        loading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ 
        loading: false,
        error: errorMessage,
        users: []
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(`/users/${userId}/role`, { role });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Update the users array with the updated user
      set(state => ({
        users: state.users.map(user => 
          user._id === userId ? { ...user, role: response.data.role } : user
        ),
        loading: false,
        error: null
      }));
      
      toast.success('User role updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/users/${userId}`);
      
      // Remove the deleted user from the users array
      set(state => ({
        users: state.users.filter(user => user._id !== userId),
        loading: false,
        error: null
      }));
      
      toast.success('User deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  }
}));
