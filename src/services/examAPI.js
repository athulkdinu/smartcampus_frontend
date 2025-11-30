import api from "./api";

// Create a new exam
export const createExamAPI = (data) => {
  return api.post("/api/exams", data);
};

// Get all exams
export const getExamsAPI = () => {
  return api.get("/api/exams");
};

// Get a single exam by ID
export const getExamByIdAPI = (examId) => {
  return api.get(`/api/exams/${examId}`);
};

// Add a subject to an exam
export const addSubjectToExamAPI = (examId, data) => {
  return api.post(`/api/exams/${examId}/subjects`, data);
};

// Delete an exam
export const deleteExamAPI = (examId) => {
  return api.delete(`/api/exams/${examId}`);
};

// Delete a subject from an exam
export const deleteSubjectFromExamAPI = (examId, subjectId) => {
  return api.delete(`/api/exams/${examId}/subjects/${subjectId}`);
};

