import SERVERURL from "./serverURL";
import commonAPI from "./commonAPI";

// REGISTER API
export const registerAPI = async (data) => {
  return await commonAPI(
    "POST",
    `${SERVERURL}/api/auth/register`,
    data,
    {
      "Content-Type": "application/json",
    }
  );
};

// LOGIN API
export const loginAPI = async (email, password) => {
  return await commonAPI(
    "POST",
    `${SERVERURL}/api/auth/login`,
    { email, password },
    {
      "Content-Type": "application/json",
    }
  );
};

// EXAMPLE: Protected student dashboard request
export const fetchStudentDashboardSummaryAPI = async () => {
  const token = sessionStorage.getItem("token");

  return await commonAPI(
    "GET",
    `${SERVERURL}/api/student/dashboard-summary`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// ADMIN: create user
export const createUserByAdminAPI = async (data) => {
  const token = sessionStorage.getItem("token");

  return await commonAPI(
    "POST",
    `${SERVERURL}/api/admin/create-user`,
    data,
    {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};
