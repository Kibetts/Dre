// client/src/services/orderService.js
// All order-related API calls.

import api from './api.js'

const orderService = {
  /** Place a new order. Returns Stripe session_url or orderId. */
  place: (orderPayload) =>
    api.post('/api/order/place', orderPayload),

  /** Verify Stripe payment result (called from /verify page) */
  verify: (orderId, success) =>
    api.post('/api/order/verify', { orderId, success }),

  /** Get the current user's order history */
  getMyOrders: () =>
    api.post('/api/order/userorders', {}),

  // ── Admin ──

  /** List all orders (admin), optionally filter by status */
  listAll: (params = {}) =>
    api.get('/api/order/list', { params }),

  /** Update an order's status (admin) */
  updateStatus: (orderId, status) =>
    api.post('/api/order/status', { orderId, status }),

  /** Get revenue and order count analytics (admin) */
  getAnalytics: () =>
    api.get('/api/order/analytics'),
}

export default orderService