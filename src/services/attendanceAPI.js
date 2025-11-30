import api from "./api";

// GET /api/faculty/classes-with-subjects - Get classes with only subjects faculty teaches
export const getFacultyClassesWithSubjectsAPI = () => {
  return api.get("/api/faculty/classes-with-subjects");
};

// POST /api/attendance/mark-subject - Mark attendance for a specific subject (faculty)
export const markSubjectAttendanceAPI = (data) => {
  return api.post("/api/attendance/mark-subject", data);
};

// GET /api/attendance/class-subject - Get attendance for class + subject + date
export const getClassSubjectAttendanceAPI = (classId, subjectName, date) => {
  const params = new URLSearchParams({
    classId,
    subjectName,
    date,
  });
  return api.get(`/api/attendance/class-subject?${params.toString()}`);
};

// GET /api/student/attendance/summary - Get student attendance summary (subject-wise)
export const getStudentAttendanceSummaryAPI = () => {
  return api.get("/api/student/attendance/summary");
};

// GET /api/classes/:classId/students - Get students in class (for faculty)
export const getClassStudentsForFacultyAPI = (classId) => {
  return api.get(`/api/classes/${classId}/students`);
};

// Old endpoints (for backward compatibility)
export const markAttendanceAPI = (data) => {
  return api.post("/api/attendance/mark", data);
};

export const getClassAttendanceForDateAPI = (classId, date, subject = null) => {
  const params = new URLSearchParams({ date });
  if (subject) {
    params.append("subject", subject);
  }
  return api.get(`/api/attendance/class/${classId}?${params.toString()}`);
};

export const getFacultyClassesAPI = () => {
  return api.get("/api/faculty/classes");
};

