import axios from "axios";

// Singleton axios client
console.log(import.meta.env.VITE_BACKEND_URL);
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
});

export default api;
