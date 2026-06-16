// client/src/services/productService.js
// All product-related API calls in one place.

import api from './api.js'

const productService = {
  /**
   * Fetch products with optional filters.
   * @param {Object} params - { category, search, strain, minPrice, maxPrice,
   *                            minThc, maxThc, effects, sort, page, limit,
   *                            featured, bestSeller, newArrival, inStock }
   */
  getAll: (params = {}) =>
    api.get('/api/product/list', { params }),

  /** Get a single product by ID */
  getById: (id) =>
    api.get(`/api/product/${id}`),

  /** Get featured, bestSellers, newArrivals in one call */
  getFeatured: () =>
    api.get('/api/product/featured'),

  /** Get related products for a given product ID */
  getRelated: (id) =>
    api.get(`/api/product/${id}/related`),

  /** Add a new product (admin) — expects FormData */
  add: (formData) =>
    api.post('/api/product/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** Update a product (admin) — expects FormData or plain object */
  update: (id, data) =>
    api.put(`/api/product/${id}`, data),

  /** Remove a product (admin) */
  remove: (id) =>
    api.post('/api/product/remove', { id }),
}

export default productService