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

export const getAllFacultyAPI = () => {
  return api.get("/api/admin/faculty-list");
};

// GET /api/admin/admins - Get admin users (accessible by faculty and hr)
export const getAdminUsersAPI = () => {
  return api.get("/api/admin/admins");
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

export const getStudentEventsAPI = () => {
  return api.get("/api/events/my-events");
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

export const getProfileAPI = () => {
  return api.get("/api/auth/me");
};

export const updateProfileAPI = (data) => {
  return api.put("/api/auth/update-profile", data);
};

// class management
export const getAllClassesAdminAPI = () => {
  return api.get("/api/admin/classes/all");
};

export const createClassAPI = (data) => {
  return api.post("/api/admin/classes", data);
};

// DEPRECATED: Use getFacultyClassesAPI from attendanceAPI.js instead
// export const getFacultyClassesAPI = () => {
//   return api.get("/api/admin/classes/faculty/my-classes");
// };

export const updateStudentClassAPI = (data) => {
  return api.put("/api/student/update-class", data);
};

export const getClassDetailsAdminAPI = (id) => {
  return api.get(`/api/admin/classes/${id}`);
};

export const assignClassTeacherAPI = (data) => {
  return api.put("/api/admin/classes/assign-class-teacher", data);
};

export const assignSubjectTeacherAPI = (data) => {
  return api.put("/api/admin/classes/assign-subject", data);
};

// leave request APIs
export const createLeaveRequestAPI = (formData) => {
  return api.post("/api/leaves", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStudentLeaveRequestsAPI = () => {
  return api.get("/api/leaves/student");
};

// GET /api/student/dashboard-summary - Get student dashboard summary statistics
export const getStudentDashboardSummaryAPI = () => {
  return api.get("/api/student/dashboard-summary");
};

export const getFacultyLeaveRequestsAPI = () => {
  return api.get("/api/leaves/faculty");
};

export const updateLeaveStatusAPI = (id, status, remarks = null) => {
  return api.patch(`/api/leaves/${id}/status`, { status, remarks });
};

export default api;


