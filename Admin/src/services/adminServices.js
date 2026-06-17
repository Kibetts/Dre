// admin/src/services/adminServices.js
// All admin API calls in one place: products, orders, users, coupons, categories.

import api from './api.js'

const adminServices = {
  // ── Products ──
  products: {
    getAll: (params = {}) => api.get('/api/product/list', { params }),
    getById: (id) => api.get(`/api/product/${id}`),
    add: (formData) =>
      api.post('/api/product/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    update: (id, data) => api.put(`/api/product/${id}`, data),
    remove: (id) => api.post('/api/product/remove', { id }),
  },

  // ── Orders ──
  orders: {
    list: (params = {}) => api.get('/api/order/list', { params }),
    updateStatus: (orderId, status) => api.post('/api/order/status', { orderId, status }),
    getAnalytics: () => api.get('/api/order/analytics'),
  },

  // ── Users / Customers ──
  users: {
    list: () => api.get('/api/user/list'),
    getAnalytics: () => api.get('/api/user/analytics'),
  },

  // ── Coupons ──
  coupons: {
    list: () => api.get('/api/coupon/list'),
    add: (data) => api.post('/api/coupon/add', data),
    remove: (id) => api.delete(`/api/coupon/${id}`),
  },

  // ── Categories ──
  categories: {
    list: () => api.get('/api/category/list'),
    add: (data) => api.post('/api/category/add', data),
    update: (id, data) => api.put(`/api/category/${id}`, data),
    remove: (id) => api.delete(`/api/category/${id}`),
  },
}

export default adminServices