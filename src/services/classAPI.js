import api from "./api";

// POST /api/classes - Create new class
export const createClassAPI = (data) => {
  return api.post("/api/classes", data);
};

// GET /api/classes - Get all classes
export const getAllClassesAPI = () => {
  return api.get("/api/classes");
};

// GET /api/classes/faculty-list - Get all faculty
export const getFacultyListAPI = () => {
  return api.get("/api/classes/faculty-list");
};

// PUT /api/classes/:classId/assign-teacher - Assign class teacher
export const assignTeacherAPI = (classId, teacherId) => {
  return api.put(`/api/classes/${classId}/assign-teacher`, { teacherId });
};

// PUT /api/classes/:classId/assign-faculty - Assign faculty to subject
export const assignFacultyAPI = (classId, subjectName, teacherId) => {
  return api.put(`/api/classes/${classId}/assign-faculty`, {
    subjectName,
    teacherId,
  });
};

// PUT /api/classes/:classId/assign-student - Assign student to class
export const assignStudentAPI = (classId, studentId) => {
  return api.put(`/api/classes/${classId}/assign-student`, { studentId });
};

// GET /api/classes/:classId/students - Get all students in class
export const getClassStudentsAPI = (classId) => {
  return api.get(`/api/classes/${classId}/students`);
};

// GET /api/classes/:classId - Get class details
export const getClassDetailsAPI = (classId) => {
  return api.get(`/api/classes/${classId}`);
};

// GET /api/admin/users - Get all users (for student selection)
export const getAllUsersAPI = () => {
  return api.get("/api/admin/users");
};

