import api from "./api";

// Faculty APIs
// POST /api/assignments/create - Create assignment
export const createAssignmentAPI = (data) => {
  return api.post("/api/assignments/create", data);
};

// GET /api/assignments/faculty - Get faculty's assignments
export const getFacultyAssignmentsAPI = () => {
  return api.get("/api/assignments/faculty");
};

// GET /api/assignments/:assignmentId/submissions - Get submissions for assignment
export const getAssignmentSubmissionsAPI = (assignmentId) => {
  return api.get(`/api/assignments/${assignmentId}/submissions`);
};

// PATCH /api/assignments/submission/:submissionId/status - Update submission status
export const updateSubmissionStatusAPI = (submissionId, data) => {
  return api.patch(`/api/assignments/submission/${submissionId}/status`, data);
};

// Student APIs
// GET /api/assignments/student - Get student's assignments
export const getStudentAssignmentsAPI = () => {
  return api.get("/api/assignments/student");
};

// POST /api/assignments/submit/:assignmentId - Submit assignment (with file upload)
export const submitAssignmentAPI = (assignmentId, formData) => {
  return api.post(`/api/assignments/submit/${assignmentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// GET /api/assignments/upcoming - Get upcoming deadlines for student
export const getUpcomingDeadlinesAPI = () => {
  return api.get("/api/assignments/upcoming");
};

