// client/src/hooks/useLocalStorage.js
// A typed, safe wrapper around localStorage.
// Falls back gracefully if localStorage is unavailable (private browsing, etc.)

import { useState } from 'react'

/**
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - default value if key doesn't exist
 * @returns {[T, (value: T | ((prev: T) => T)) => void, () => void]}
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`useLocalStorage: could not set "${key}"`, error)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`useLocalStorage: could not remove "${key}"`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage