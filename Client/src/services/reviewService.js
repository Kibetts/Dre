// client/src/services/userService.js
// Auth and user profile API calls.

import api from './api.js'

const userService = {
  /** Register a new account */
  register: (data) =>
    api.post('/api/user/register', data),

  /** Log in — returns { token, user } */
  login: (email, password) =>
    api.post('/api/user/login', { email, password }),

  /** Fetch the current user's full profile */
  getProfile: () =>
    api.get('/api/user/profile'),

  /** Update name, phone, newsletter preference */
  updateProfile: (data) =>
    api.put('/api/user/profile', data),

  /** Add a delivery address to the user's profile */
  addAddress: (address) =>
    api.post('/api/user/address', { address }),

  // ── Admin ──

  /** List all registered customers (admin) */
  listAll: () =>
    api.get('/api/user/list'),

  /** Get user count analytics (admin) */
  getAnalytics: () =>
    api.get('/api/user/analytics'),
}

export default userService