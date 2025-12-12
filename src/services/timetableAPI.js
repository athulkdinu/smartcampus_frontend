import SERVERURL from "./serverURL";
import commonAPI from "./commonAPI";

// GET /api/timetable/today - Get today's classes (Student)
export const getTodayClassesAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "GET",
    `${SERVERURL}/api/timetable/today`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// GET /api/timetable/:classId - Get timetable for a class
export const getTimetableAPI = async (classId) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "GET",
    `${SERVERURL}/api/timetable/${classId}`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// POST /api/timetable - Create or update timetable (Faculty/Admin)
export const createOrUpdateTimetableAPI = async (data) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "POST",
    `${SERVERURL}/api/timetable`,
    data,
    {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// GET /api/timetable/faculty/my-classes - Get classes faculty can manage
export const getFacultyClassesAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "GET",
    `${SERVERURL}/api/timetable/faculty/my-classes`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

