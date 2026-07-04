import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/dashboard`,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const DashboardService = {
  getStats: async () => {
    const response = await API.get("/stats");
    return response.data;
  },

  getUserProfile: async () => {
    const response = await API.get("/user");
    return response.data;
  },

  searchProjects: async (termo) => {
    const response = await API.get("/projects", {
      params: { search: termo },
    });

    return response.data;
  },
};
