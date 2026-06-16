// client/src/hooks/useProducts.js
// Fetches products from the API with full filter support.
// Handles loading, error, and pagination state automatically.

import { useState, useEffect, useCallback } from 'react'
import productService from '../services/productService.js'

/**
 * @param {Object} initialFilters - Same keys as productService.getAll() params
 * @returns {{ products, loading, error, pagination, refetch, setFilters, filters }}
 */
const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ page: 1, limit: 20, ...initialFilters })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({})

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Strip empty/falsy filter values so the URL stays clean
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )
      const res = await productService.getAll(cleanParams)
      if (res.data.success) {
        setProducts(res.data.data)
        setPagination(res.data.pagination || {})
      } else {
        setError(res.data.message || 'Failed to load products')
      }
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetch()
  }, [fetch])

  /** Merge new filters and reset to page 1 */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  /** Go to a specific page */
  const setPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    setFilters: updateFilters,
    setPage,
    refetch: fetch,
  }
}

export default useProducts