import api from "./api";

// POST /api/announcements/create - Create announcement (Faculty/Admin only)
export const createAnnouncementAPI = (data) => {
  return api.post("/api/announcements/create", data);
};

// GET /api/announcements/all - Get all announcements (Admin only)
export const getAllAnnouncementsAPI = () => {
  return api.get("/api/announcements/all");
};

// GET /api/announcements/student - Get announcements for student
export const getStudentAnnouncementsAPI = () => {
  return api.get("/api/announcements/student");
};

// GET /api/announcements/faculty - Get announcements created by faculty
export const getFacultyAnnouncementsAPI = () => {
  return api.get("/api/announcements/faculty");
};

// DELETE /api/announcements/:id - Delete announcement
export const deleteAnnouncementAPI = (id) => {
  return api.delete(`/api/announcements/${id}`);
};

// PUT /api/announcements/:id - Update announcement
export const updateAnnouncementAPI = (id, data) => {
  return api.put(`/api/announcements/${id}`, data);
};

