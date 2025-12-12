import api from './api'

// Courses
export const getCoursesAPI = (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return api.get(`/api/skills/courses${queryString ? `?${queryString}` : ''}`)
}

export const getCourseAPI = (courseId) => {
  return api.get(`/api/skills/courses/${courseId}`)
}

export const createCourseAPI = (data) => {
  return api.post(`/api/skills/courses`, data)
}

export const updateCourseAPI = (courseId, data) => {
  return api.put(`/api/skills/courses/${courseId}`, data)
}

export const deleteCourseAPI = (courseId) => {
  return api.delete(`/api/skills/courses/${courseId}`)
}

// Enrollment
export const enrollInCourseAPI = (courseId) => {
  return api.post(`/api/skills/courses/${courseId}/enroll`)
}

export const unenrollFromCourseAPI = (courseId) => {
  return api.delete(`/api/skills/courses/${courseId}/enroll`)
}

export const getProgressAPI = (courseId) => {
  return api.get(`/api/skills/courses/${courseId}/progress`)
}

// Rounds
export const createOrUpdateRoundAPI = (courseId, data) => {
  return api.post(`/api/skills/courses/${courseId}/rounds`, data)
}

export const completeRound1API = (courseId) => {
  return api.post(`/api/skills/courses/${courseId}/rounds/1/complete`)
}

export const submitQuizAPI = (courseId, roundNumber, answers) => {
  return api.post(`/api/skills/courses/${courseId}/rounds/${roundNumber}/quiz`, { answers })
}

// Projects
export const submitProjectAPI = (courseId, formData) => {
  return api.post(`/api/skills/courses/${courseId}/project`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const getProjectSubmissionsAPI = (courseId) => {
  return api.get(`/api/skills/courses/${courseId}/projects`)
}

export const reviewProjectAPI = (submissionId, status, feedback) => {
  return api.put(`/api/skills/projects/${submissionId}/review`, { status, feedback })
}

// Enrollments (Faculty)
export const getCourseEnrollmentsAPI = (courseId) => {
  return api.get(`/api/skills/courses/${courseId}/enrollments`)
}



