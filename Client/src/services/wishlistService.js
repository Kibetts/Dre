// client/src/services/wishlistService.js
import api from './api.js'

const wishlistService = {
  /** Get the current user's wishlist (populated products) */
  get: () =>
    api.get('/api/wishlist'),

  /** Toggle a product in/out of the wishlist */
  toggle: (productId) =>
    api.post('/api/wishlist/toggle', { productId }),
}

export default wishlistService


// ─────────────────────────────────────────────────────────────────────────────
// client/src/services/categoryService.js
// ─────────────────────────────────────────────────────────────────────────────

import api from './api.js'

export const categoryService = {
  /** Get all active categories */
  getAll: () =>
    api.get('/api/category/list'),

  // ── Admin ──
  add: (data) => api.post('/api/category/add', data),
  update: (id, data) => api.put(`/api/category/${id}`, data),
  delete: (id) => api.delete(`/api/category/${id}`),
}