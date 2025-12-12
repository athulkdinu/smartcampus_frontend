import api from "./api";

// POST /api/skills - Submit a skill (Student only)
export const submitSkillAPI = (data) => {
  return api.post("/api/skills", data);
};

// GET /api/skills/mine - Get my skills (Student only)
export const getMySkillsAPI = () => {
  return api.get("/api/skills/mine");
};

// GET /api/skills - Get skills for faculty (Faculty only)
export const getSkillsForFacultyAPI = () => {
  return api.get("/api/skills");
};

// PATCH /api/skills/:id/approve - Approve a skill (Faculty only)
export const approveSkillAPI = (skillId) => {
  return api.patch(`/api/skills/${skillId}/approve`);
};

// PATCH /api/skills/:id/reject - Reject a skill (Faculty only)
export const rejectSkillAPI = (skillId, remarks) => {
  return api.patch(`/api/skills/${skillId}/reject`, { remarks });
};

