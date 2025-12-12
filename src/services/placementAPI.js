import SERVERURL from "./serverURL";
import commonAPI from "./commonAPI";

const authHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams(params);
  const str = query.toString();
  return str ? `?${str}` : "";
};

// Jobs
export const fetchJobsAPI = async (params = {}) =>
  commonAPI("GET", `${SERVERURL}/api/placements/jobs${buildQuery(params)}`, null, {
    ...authHeader(),
  });

export const fetchJobByIdAPI = async (id) =>
  commonAPI("GET", `${SERVERURL}/api/placements/jobs/${id}`, null, {
    ...authHeader(),
  });

export const createJobAPI = async (payload) =>
  commonAPI("POST", `${SERVERURL}/api/placements/jobs`, payload, {
    "Content-Type": "application/json",
    ...authHeader(),
  });

export const updateJobAPI = async (id, payload) =>
  commonAPI("PATCH", `${SERVERURL}/api/placements/jobs/${id}`, payload, {
    "Content-Type": "application/json",
    ...authHeader(),
  });

export const updateJobStatusAPI = async (id, status) =>
  commonAPI(
    "PATCH",
    `${SERVERURL}/api/placements/jobs/${id}/status`,
    { status },
    {
      "Content-Type": "application/json",
      ...authHeader(),
    }
  );

export const deleteJobAPI = async (id) =>
  commonAPI("DELETE", `${SERVERURL}/api/placements/jobs/${id}`, null, {
    ...authHeader(),
  });

// Applications
export const applyJobAPI = async (jobId, formData) =>
  commonAPI(
    "POST",
    `${SERVERURL}/api/placements/jobs/${jobId}/apply`,
    formData,
    {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    }
  );

export const fetchMyApplicationsAPI = async () =>
  commonAPI("GET", `${SERVERURL}/api/placements/applications/me`, null, {
    ...authHeader(),
  });

export const fetchApplicationsForJobAPI = async (jobId) =>
  commonAPI(
    "GET",
    `${SERVERURL}/api/placements/jobs/${jobId}/applications`,
    null,
    {
      ...authHeader(),
    }
  );

export const fetchAllApplicationsForHrAPI = async () =>
  commonAPI("GET", `${SERVERURL}/api/placements/applications`, null, {
    ...authHeader(),
  });

export const updateApplicationStatusAPI = async (id, status, notes) =>
  commonAPI(
    "PATCH",
    `${SERVERURL}/api/placements/applications/${id}/status`,
    { status, notes },
    {
      "Content-Type": "application/json",
      ...authHeader(),
    }
  );

// Interviews
export const scheduleInterviewAPI = async (applicationId, payload) =>
  commonAPI(
    "POST",
    `${SERVERURL}/api/placements/applications/${applicationId}/interviews`,
    payload,
    {
      "Content-Type": "application/json",
      ...authHeader(),
    }
  );

export const fetchMyInterviewsAPI = async () =>
  commonAPI("GET", `${SERVERURL}/api/placements/interviews/me`, null, {
    ...authHeader(),
  });

export const fetchHrInterviewsAPI = async () =>
  commonAPI("GET", `${SERVERURL}/api/placements/interviews`, null, {
    ...authHeader(),
  });

// Offers
export const sendOfferAPI = async (applicationId, formData) =>
  commonAPI(
    "POST",
    `${SERVERURL}/api/placements/applications/${applicationId}/offers`,
    formData,
    {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    }
  );

export const fetchMyOffersAPI = async () =>
  commonAPI("GET", `${SERVERURL}/api/placements/offers/me`, null, {
    ...authHeader(),
  });

export const fetchHrOffersAPI = async () =>
  commonAPI("GET", `${SERVERURL}/api/placements/offers`, null, {
    ...authHeader(),
  });

// Resume
export const uploadResumeAPI = async (formData) =>
  commonAPI("POST", `${SERVERURL}/api/placements/resume`, formData, {
    ...authHeader(),
    "Content-Type": "multipart/form-data",
  });

export const fetchMyResumeAPI = async () =>
  commonAPI("GET", `${SERVERURL}/api/placements/resume/me`, null, {
    ...authHeader(),
  });

