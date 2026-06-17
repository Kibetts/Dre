// client/src/hooks/useDebounce.js
// Delays updating a value until the user stops typing.
// Prevents hammering the API on every keystroke in search fields.
//
// Usage:
//   const debouncedSearch = useDebounce(searchInput, 400)
//   useEffect(() => { fetchProducts({ search: debouncedSearch }) }, [debouncedSearch])

import { useState, useEffect } from 'react'

/**
 * @template T
 * @param {T} value - The value to debounce
 * @param {number} delay - Milliseconds to wait (default: 400ms)
 * @returns {T} The debounced value
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce