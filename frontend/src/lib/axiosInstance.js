import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://kweb.im/api",
  withCredentials: true,
});

export default axiosInstance;