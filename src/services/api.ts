import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    withCredentials: true,
    timeout: 10000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });