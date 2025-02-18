import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
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
      });
      set({ user: res.data.user, loading: false });
      toast.success(`Welcome, ${name}`);
    } catch (error) {
      set({ loading: false });
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
      set({ user: res.data.user, loading: false });
      toast.success('Login Successfull');
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ user: null });
      toast.success("Logged Out Successfully!");
    } catch (error) {
      toast.error(error.response.data.message || "An unexpected error occured");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");

      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
      toast.error(error.response.message || "An unexpected error occured");
    }
  },
}));
