// client/src/utils/constants.js
// Centralized constants used across the storefront.
// Keeps tax rate, delivery fee, and other shared values defined in exactly one place.

export const CA_TAX_RATE = 0.0975

export const DELIVERY_FEE = 9.99

export const CATEGORIES = [
  { name: 'Flower', slug: 'flower', icon: '🌿' },
  { name: 'Pre-Rolls', slug: 'pre-rolls', icon: '🚬' },
  { name: 'Edibles', slug: 'edibles', icon: '🍫' },
  { name: 'Concentrates', slug: 'concentrates', icon: '💎' },
  { name: 'Vapes', slug: 'vapes', icon: '💨' },
  { name: 'CBD', slug: 'cbd', icon: '🌱' },
  { name: 'Tinctures', slug: 'tinctures', icon: '💧' },
  { name: 'Topicals', slug: 'topicals', icon: '🧴' },
  { name: 'Accessories', slug: 'accessories', icon: '🔧' },
]

export const EFFECTS_LIST = [
  'Relaxed', 'Happy', 'Euphoric', 'Creative', 'Focused',
  'Sleepy', 'Energetic', 'Uplifted', 'Hungry', 'Talkative',
]

export const STRAIN_TYPES = [
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'cbd', label: 'CBD' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export const STORAGE_KEYS = {
  TOKEN: 'gl_token',
  USER: 'gl_user',
  AGE_VERIFIED: 'gl_age_verified',
}