import axios from "axios";
import { Vehicle } from "../types/vehicle";
import { AuthResponse } from "../types/AuthResponse";
import { LoginCredentials } from "../types/LoginCredentials";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehicleApi = {
  getAll: () => api.get<Vehicle[]>("/vehicles/"),
  getById: (id: number) => api.get<Vehicle>(`/vehicles/${id}/`),
  create: (data: Omit<Vehicle, "id" | "last_updated">) =>
    api.post<Vehicle>("/vehicles/", data),
  update: (id: number, data: Partial<Vehicle>) =>
    api.put<Vehicle>(`/vehicles/${id}/`, data),
  delete: (id: number) => api.delete(`/vehicles/${id}/`),
};

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>("/token/", credentials),
  refresh: (refresh: string) =>
    api.post<AuthResponse>("/token/refresh/", { refresh }),
};

export default api;
