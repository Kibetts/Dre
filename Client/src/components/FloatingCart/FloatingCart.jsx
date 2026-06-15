import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './FloatingCart.css'

const FloatingCart = () => {
  const { getCartCount, getTotalCartAmount } = useContext(StoreContext)
  const count = getCartCount()

  if (count === 0) return null

  return (
    <Link to="/cart" className="floating-cart fade-up">
      <div className="floating-cart-left">
        <span className="floating-cart-count">{count}</span>
        <span>View Cart</span>
      </div>
      <span className="floating-cart-total">${getTotalCartAmount().toFixed(2)}</span>
    </Link>
  )
}

export default FloatingCart