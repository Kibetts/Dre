import api from './api.js'

const reviewService = {
  /** Submit a new review for a product */
  add: (productId, { rating, title, body }) =>
    api.post('/api/review/add', { productId, rating, title, body }),

  /** Get all reviews for a given product */
  getByProduct: (productId) =>
    api.get(`/api/review/product/${productId}`),

  /** Delete a review (admin) */
  delete: (id) =>
    api.delete(`/api/review/${id}`),
}

export default reviewService
EOF
cat /home/claude/audit/project/client/src/services/reviewService.js
Output

// client/src/services/reviewService.js
// All product review API calls.

import api from './api.js'

const reviewService = {
  /** Submit a new review for a product */
  add: (productId, { rating, title, body }) =>
    api.post('/api/review/add', { productId, rating, title, body }),

  /** Get all reviews for a given product */
  getByProduct: (productId) =>
    api.get(`/api/review/product/${productId}`),

  /** Delete a review (admin) */
  delete: (id) =>
    api.delete(`/api/review/${id}`),
}

export default reviewService
