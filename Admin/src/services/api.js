// admin/src/services/api.js
// Centralized Axios instance for the admin panel — separate from the
// customer storefront's instance. Attaches the admin JWT token automatically.

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:4000',
  timeout: 15000,
})

// ── Request interceptor: attach admin token automatically ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gl_admin_token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 globally ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gl_admin_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api