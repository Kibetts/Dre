// client/src/utils/validators.js
// Client-side form validation helpers. These mirror but do not replace
// server-side validation, which always re-checks everything.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Basic email format check */
export const validateEmail = (email) => {
  return typeof email === 'string' && EMAIL_RE.test(email.trim())
}

/** Returns true if the date of birth makes the person at least minAge years old */
export const validateAge = (dob, minAge = 21) => {
  if (!dob) return false
  const birthDate = new Date(dob)
  if (Number.isNaN(birthDate.getTime())) return false

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age >= minAge
}

/** Password must be at least 8 characters, matching the server-side rule */
export const validatePassword = (pw) => {
  return typeof pw === 'string' && pw.length >= 8
}

/** Validate a delivery address object has the required fields */
export const validateAddress = (addr = {}) => {
  const errors = {}
  if (!addr.firstName?.trim()) errors.firstName = 'First name is required'
  if (!addr.lastName?.trim()) errors.lastName = 'Last name is required'
  if (!addr.street?.trim()) errors.street = 'Street address is required'
  if (!addr.city?.trim()) errors.city = 'City is required'
  if (!addr.state?.trim()) errors.state = 'State is required'
  if (!addr.zipCode?.trim()) errors.zipCode = 'ZIP code is required'

  return { isValid: Object.keys(errors).length === 0, errors }
}

/** Validate the admin add/edit product form before submission */
export const validateProductForm = (form = {}) => {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Product name is required'
  if (!form.description?.trim()) errors.description = 'Description is required'
  if (!form.category?.trim()) errors.category = 'Category is required'
  if (form.price === '' || form.price === null || Number(form.price) <= 0) {
    errors.price = 'A valid price is required'
  }
  if (form.salePrice && Number(form.salePrice) >= Number(form.price)) {
    errors.salePrice = 'Sale price must be lower than regular price'
  }
  if (form.thcPercentage && (Number(form.thcPercentage) < 0 || Number(form.thcPercentage) > 100)) {
    errors.thcPercentage = 'THC % must be between 0 and 100'
  }
  if (form.cbdPercentage && (Number(form.cbdPercentage) < 0 || Number(form.cbdPercentage) > 100)) {
    errors.cbdPercentage = 'CBD % must be between 0 and 100'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}