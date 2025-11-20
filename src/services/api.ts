import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    timeout: 10000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  
  // Interceptor para agregar token a cada request
  api.interceptors.request.use(
    (config) => {
      const authData = localStorage.getItem("luaspets_auth"); // o "authToken", según lo guardes
      const token = authData ? JSON.parse(authData).token : null;
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );