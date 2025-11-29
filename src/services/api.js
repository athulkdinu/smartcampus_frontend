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

export const createEventAPI = (data) => {
  return api.post("/api/events", data);
};

export const getStudentApprovedEventsAPI = () => {
  return api.get("/api/events/student/approved");
};

export const getStudentProposalsAPI = () => {
  return api.get("/api/events/student/proposals");
};

export const getFacultyRequestsAPI = () => {
  return api.get("/api/events/faculty/requests");
};

export const updateEventStatusAPI = (id, action) => {
  return api.patch(`/api/events/${id}/status`, { action });
};

export const getAdminEventsAPI = () => {
  return api.get("/api/events/admin");
};

export default api;


