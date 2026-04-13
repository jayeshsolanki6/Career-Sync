import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  checkAuth: () => API.get('/auth/check'),
}

export const uploadAPI = {
  analyzeResume: (formData) =>
    API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const analysisAPI = {
  getHistory: () => API.get('/upload/history'),
}

export const learningAPI = {
  getLearningList: () => API.get('/learning'),
  addSkill: (data) => API.post('/learning/add', data),
  removeSkill: (id) => API.delete(`/learning/${id}`),
  generateRoadmap: (data) => API.post('/learning/roadmap', data),
  getCoursesForSkill: (skill) => API.get(`/learning/courses/${encodeURIComponent(skill)}`),
}

export default API
