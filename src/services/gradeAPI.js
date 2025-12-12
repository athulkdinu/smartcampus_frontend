import api from "./api";

// Faculty APIs
// POST /api/grades/generate - Generate grade sheet (Faculty only)

export const generateGradeSheetAPI = (data) => {
  return api.post("/api/grades/generate", data);
};

// GET /api/grades/faculty - Get grade sheets for faculty
export const getFacultyGradeSheetsAPI = (classId = null, subject = null) => {
  const params = new URLSearchParams();
  if (classId) params.append("classId", classId);
  if (subject) params.append("subject", subject);
  const queryString = params.toString();
  return api.get(`/api/grades/faculty${queryString ? `?${queryString}` : ""}`);
};

// GET /api/grades/:gradeSheetId - Get single grade sheet
export const getGradeSheetAPI = (gradeSheetId) => {
  return api.get(`/api/grades/${gradeSheetId}`);
};

// PUT /api/grades/:gradeSheetId/grade/:studentId - Update grade for student
export const updateStudentGradeAPI = (gradeSheetId, studentId, data) => {
  return api.put(`/api/grades/${gradeSheetId}/grade/${studentId}`, data);
};

// Student APIs
// GET /api/grades/student - Get grades for student
export const getStudentGradesAPI = () => {
  return api.get("/api/grades/student");
};






