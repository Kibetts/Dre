// client/src/hooks/useCart.js
// Convenient wrapper around cart operations from StoreContext.
// Keeps components clean by not needing to destructure the full context.

import { useContext, useMemo } from 'react'
import { StoreContext } from '../context/StoreContext.jsx'

/**
 * @returns Cart state and actions with pre-computed totals
 */
const useCart = () => {
  const {
    cartItems,
    products,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getTotalCartAmount,
  } = useContext(StoreContext)

  /** Full product objects that are currently in the cart */
  const cartProducts = useMemo(
    () => products.filter((p) => cartItems[p._id] > 0),
    [products, cartItems]
  )

  /** Flat array of { product, quantity, lineTotal } for easy rendering */
  const cartLines = useMemo(
    () =>
      cartProducts.map((product) => {
        const quantity = cartItems[product._id]
        const unitPrice = product.salePrice || product.price
        return {
          product,
          quantity,
          unitPrice,
          lineTotal: Math.round(unitPrice * quantity * 100) / 100,
        }
      }),
    [cartProducts, cartItems]
  )

  const subtotal = getTotalCartAmount()
  const count = getCartCount()

  /** True if the given product ID is in the cart */
  const isInCart = (productId) => (cartItems[productId] || 0) > 0

  /** How many of this product are in the cart */
  const quantityOf = (productId) => cartItems[productId] || 0

  return {
    cartItems,
    cartProducts,
    cartLines,
    count,
    subtotal,
    isEmpty: count === 0,
    isInCart,
    quantityOf,
    addToCart,
    removeFromCart,
    clearCart,
  }
}

export default useCart