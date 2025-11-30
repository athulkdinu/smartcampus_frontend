import api from "./api";

// Faculty APIs
// POST /api/lectures - Create lecture material (Faculty only)
export const createLectureMaterialAPI = (formData) => {
  return api.post("/api/lectures", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// GET /api/lectures/faculty - Get lecture materials for faculty
export const getFacultyLecturesAPI = (classId = null) => {
  const params = classId ? `?classId=${classId}` : "";
  return api.get(`/api/lectures/faculty${params}`);
};

// DELETE /api/lectures/:id - Delete lecture material (Faculty only)
export const deleteLectureMaterialAPI = (id) => {
  return api.delete(`/api/lectures/${id}`);
};

// Student APIs
// GET /api/lectures/student - Get lecture materials for student
export const getStudentLecturesAPI = () => {
  return api.get("/api/lectures/student");
};

