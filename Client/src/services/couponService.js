import api from './api.js'

const couponService = {
  /** Validate a coupon code against the current order subtotal */
  validate: (code, orderAmount) =>
    api.post('/api/coupon/validate', { code, orderAmount }),
}

export default couponService

