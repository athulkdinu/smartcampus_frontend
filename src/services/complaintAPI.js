import api from "./api";

// Student APIs
// POST /api/complaints/student - Create complaint (Student only)
export const createStudentComplaintAPI = (data) => {
  return api.post("/api/complaints/student", data);
};

// GET /api/complaints/student - Get student's complaints
export const getStudentComplaintsAPI = () => {
  return api.get("/api/complaints/student");
};

// GET /api/complaints/:id - Get complaint details
export const getComplaintDetailsAPI = (id) => {
  return api.get(`/api/complaints/${id}`);
};

// Faculty APIs
// GET /api/complaints/faculty/inbox - Get complaints from students (Faculty inbox)
export const getFacultyInboxAPI = () => {
  return api.get("/api/complaints/faculty/inbox");
};

// POST /api/complaints/faculty - Create complaint (Faculty to Admin)
export const createFacultyComplaintAPI = (data) => {
  return api.post("/api/complaints/faculty", data);
};

// GET /api/complaints/faculty/my-complaints - Get faculty's own complaints
export const getFacultyComplaintsAPI = () => {
  return api.get("/api/complaints/faculty/my-complaints");
};

// GET /api/complaints/faculty/admin-resolved - Get admin-resolved complaints needing faculty action
export const getAdminResolvedComplaintsAPI = () => {
  return api.get("/api/complaints/faculty/admin-resolved");
};

// PATCH /api/complaints/faculty/:id/action - Faculty action (resolve, reject, escalate)
export const facultyActionAPI = (id, data) => {
  return api.patch(`/api/complaints/faculty/${id}/action`, data);
};

// Admin APIs
// GET /api/complaints/admin/inbox - Get admin's inbox (complaints where currentOwner=admin)
export const getAdminInboxAPI = () => {
  return api.get("/api/complaints/admin/inbox");
};

// PATCH /api/complaints/admin/:id/action - Admin action (resolve, reject, comment)
export const adminActionAPI = (id, data) => {
  return api.patch(`/api/complaints/admin/${id}/action`, data);
};

