// client/src/hooks/useOrders.js
// Fetches and manages the current user's order history.

import { useState, useEffect, useCallback } from 'react'
import orderService from '../services/orderService.js'

/**
 * @returns {{ orders, loading, error, refetch, getOrderById }}
 */
const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await orderService.getMyOrders()
      if (res.data.success) {
        setOrders(res.data.data)
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError(err.message || 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  /** Look up a single order from the already-loaded list */
  const getOrderById = useCallback(
    (id) => orders.find((o) => o._id === id || o.orderNumber === id),
    [orders]
  )

  /** Orders grouped by status */
  const byStatus = useCallback(
    (status) => orders.filter((o) => o.status === status),
    [orders]
  )

  return {
    orders,
    loading,
    error,
    refetch: fetch,
    getOrderById,
    byStatus,
    hasOrders: orders.length > 0,
  }
}

export default useOrders