import axios from "axios";
import SERVERURL from "./serverURL";

const api = axios.create({
  baseURL: SERVERURL,
});

// add token to request headers
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllUsersAPI = () => {
  return api.get("/api/admin/users");
};

export default api;


