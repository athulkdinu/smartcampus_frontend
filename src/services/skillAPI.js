import SERVERURL from "./serverURL";
import commonAPI from "./commonAPI";

// POST /api/skills - Submit a skill (Student only)
export const submitSkillAPI = async (data) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "POST",
    `${SERVERURL}/api/skills`,
    data,
    {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// GET /api/skills/mine - Get my skills (Student only)
export const getMySkillsAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "GET",
    `${SERVERURL}/api/skills/mine`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// GET /api/skills - Get skills for faculty (Faculty only)
export const getSkillsForFacultyAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "GET",
    `${SERVERURL}/api/skills`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// PATCH /api/skills/:id/approve - Approve a skill (Faculty only)
export const approveSkillAPI = async (skillId) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "PATCH",
    `${SERVERURL}/api/skills/${skillId}/approve`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// PATCH /api/skills/:id/reject - Reject a skill (Faculty only)
export const rejectSkillAPI = async (skillId, remarks) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "PATCH",
    `${SERVERURL}/api/skills/${skillId}/reject`,
    { remarks },
    {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

