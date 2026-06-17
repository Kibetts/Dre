// client/src/utils/formatters.js
// Pure display-formatting helpers. No side effects, no API calls.

/** Format a number as a USD price string, e.g. 12.5 -> "$12.50" */
export const formatPrice = (n) => {
  const value = Number(n) || 0
  return `$${value.toFixed(2)}`
}

/** Format a date (string or Date) as "Month Day, Year" */
export const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Format a number as a percentage string, e.g. 22.5 -> "22.5%" */
export const formatPercentage = (n) => {
  const value = Number(n) || 0
  return `${value}%`
}

/** Capitalize a strain string, e.g. "indica" -> "Indica" */
export const formatStrain = (s) => {
  if (!s || s === 'n/a') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Format an order's display number, falling back to a short id if no orderNumber */
export const formatOrderNumber = (order) => {
  if (!order) return ''
  return order.orderNumber || shortId(order._id)
}

/** Last 8 characters of a Mongo ObjectId, uppercased, for compact display */
export const shortId = (id) => {
  if (!id) return ''
  return String(id).slice(-8).toUpperCase()
}