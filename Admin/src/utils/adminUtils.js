export const ORDER_STATUS_COLORS = {
  pending: '#e0a050',
  confirmed: '#4ecdc4',
  processing: '#7c6ae0',
  ready: '#52b788',
  out_for_delivery: '#e07c3a',
  delivered: '#52b788',
  cancelled: '#e55353',
}

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

/** Format a number as a USD price string, e.g. 12.5 -> "$12.50" */
export const formatPrice = (n) => {
  const value = Number(n) || 0
  return `$${value.toFixed(2)}`
}

/** Format a date (string or Date) as "Mon Day, Year" */
export const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Build a full image URL from a stored filename and the server base URL */
export const getImageUrl = (filename, serverUrl) => {
  if (!filename) return null
  return `${serverUrl}/images/${filename}`
}

/** Returns inline style object for a status badge using the shared color scale */
export const getStatusBadgeStyle = (status) => {
  const color = ORDER_STATUS_COLORS[status] || 'var(--text-muted)'
  return {
    color,
    borderColor: `${color}40`,
    background: `${color}15`,
  }
}
EOF
cat /home/claude/audit/project/admin/src/utils/adminUtils.js
Output

// admin/src/utils/adminUtils.js
// Shared display helpers and constants for the admin panel.

export const ORDER_STATUS_COLORS = {
  pending: '#e0a050',
  confirmed: '#4ecdc4',
  processing: '#7c6ae0',
  ready: '#52b788',
  out_for_delivery: '#e07c3a',
  delivered: '#52b788',
  cancelled: '#e55353',
}

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

/** Format a number as a USD price string, e.g. 12.5 -> "$12.50" */
export const formatPrice = (n) => {
  const value = Number(n) || 0
  return `$${value.toFixed(2)}`
}

/** Format a date (string or Date) as "Mon Day, Year" */
export const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Build a full image URL from a stored filename and the server base URL */
export const getImageUrl = (filename, serverUrl) => {
  if (!filename) return null
  return `${serverUrl}/images/${filename}`
}

/** Returns inline style object for a status badge using the shared color scale */
export const getStatusBadgeStyle = (status) => {
  const color = ORDER_STATUS_COLORS[status] || 'var(--text-muted)'
  return {
    color,
    borderColor: `${color}40`,
    background: `${color}15`,
  }
}
