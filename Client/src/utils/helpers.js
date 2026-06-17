// client/src/utils/helpers.js
// Shared logic helpers used across pages and components.

import { CA_TAX_RATE, DELIVERY_FEE } from './constants.js'

/** Build a full image URL from a stored filename and the server base URL */
export const getImageUrl = (filename, serverUrl) => {
  if (!filename) return null
  return `${serverUrl}/images/${filename}`
}

/**
 * Calculate subtotal/tax/delivery/total for a set of cart lines.
 * @param {Array<{product: object, quantity: number}>} items
 * @param {{ orderType?: 'pickup'|'delivery', discount?: number }} opts
 */
export const calculateOrderTotals = (items = [], opts = {}) => {
  const { orderType = 'pickup', discount = 0 } = opts

  const subtotal = items.reduce((sum, { product, quantity }) => {
    const price = product?.salePrice || product?.price || 0
    return sum + price * quantity
  }, 0)

  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0
  const tax = Math.max(subtotal - discount, 0) * CA_TAX_RATE
  const total = subtotal - discount + deliveryFee + tax

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

/** Convert a string into a URL-safe slug */
export const slugify = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Build a query string from a params object, skipping empty/null/undefined values */
export const buildQueryString = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )
  return new URLSearchParams(clean).toString()
}

/** Compute total cart amount from a cartItems map ({ productId: qty }) and a products array */
export const getCartTotal = (cartItems = {}, products = []) => {
  let total = 0
  for (const productId in cartItems) {
    const qty = cartItems[productId]
    if (qty > 0) {
      const product = products.find((p) => p._id === productId)
      if (product) {
        const price = product.salePrice || product.price
        total += price * qty
      }
    }
  }
  return Math.round(total * 100) / 100
}