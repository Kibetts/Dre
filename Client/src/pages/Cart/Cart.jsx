import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'
import './Cart.css'

const Cart = () => {
  const { cartItems, products, removeFromCart, addToCart, clearCart, getTotalCartAmount, token, url } = useContext(StoreContext)
  const [couponCode, setCouponCode] = useState('')
  const [couponData, setCouponData] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const navigate = useNavigate()

  const TAX_RATE = 0.0975
  const DELIVERY_FEE = 9.99

  const cartProducts = products.filter(p => cartItems[p._id] > 0)
  const subtotal = getTotalCartAmount()
  const discount = couponData ? couponData.discountAmount : 0
  const tax = (subtotal - discount) * TAX_RATE
  const total = subtotal - discount + tax

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    if (!token) { toast.info('Please sign in to apply coupons'); return }
    setCouponLoading(true)
    try {
      const res = await axios.post(`${url}/api/coupon/validate`,
        { code: couponCode, orderAmount: subtotal },
        { headers: { token } }
      )
      if (res.data.success) {
        setCouponData(res.data.data)
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message)
        setCouponData(null)
      }
    } catch (e) {
      toast.error('Error applying coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleCheckout = () => {
    if (!token) { toast.info('Please sign in to checkout'); return }
    navigate('/checkout', { state: { couponData } })
  }

  if (cartProducts.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-wrapper">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-sub">Explore our premium cannabis products and add your favorites.</p>
            <Link to="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="page-wrapper">
        <div className="cart-header">
          <div>
            <p className="section-eyebrow">Review Your Order</p>
            <h1 className="cart-title">Shopping Cart</h1>
          </div>
          <button className="btn btn-ghost cart-clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
            </div>

            {cartProducts.map(product => {
              const qty = cartItems[product._id]
              const price = product.salePrice || product.price
              const imgSrc = product.image ? `${url}/images/${product.image}` : null

              return (
                <div key={product._id} className="cart-item">
                  <div className="cart-item-product">
                    <Link to={`/product/${product._id}`} className="cart-item-img">
                      {imgSrc
                        ? <img src={imgSrc} alt={product.name} />
                        : <span>🌿</span>}
                    </Link>
                    <div className="cart-item-info">
                      <Link to={`/product/${product._id}`} className="cart-item-name">{product.name}</Link>
                      <p className="cart-item-meta">
                        {product.category}
                        {product.thcPercentage > 0 && ` · THC ${product.thcPercentage}%`}
                        {product.weight && ` · ${product.weight}`}
                      </p>
                      {product.strain && product.strain !== 'n/a' && (
                        <span className={`cart-item-strain strain-${product.strain}`}>
                          {product.strain.charAt(0).toUpperCase() + product.strain.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="cart-item-price">${price.toFixed(2)}</span>

                  <div className="cart-item-qty">
                    <button className="cart-qty-btn" onClick={() => removeFromCart(product._id)}>−</button>
                    <span className="cart-qty-num">{qty}</span>
                    <button className="cart-qty-btn" onClick={() => addToCart(product._id)}>+</button>
                  </div>

                  <div className="cart-item-total-col">
                    <span className="cart-item-total">${(price * qty).toFixed(2)}</span>
                    <button
                      className="cart-item-remove"
                      onClick={() => {
                        for (let i = 0; i < qty; i++) removeFromCart(product._id)
                      }}
                      aria-label="Remove item"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order summary */}
          <div className="cart-summary">
            <h3 className="cart-summary-title">Order Summary</h3>

            {/* Coupon */}
            <div className="cart-coupon">
              <p className="cart-coupon-label">Promo Code</p>
              <div className="cart-coupon-row">
                <input
                  className="form-input cart-coupon-input"
                  type="text"
                  placeholder="GREENLEAF20"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  className="btn btn-secondary cart-coupon-btn"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                >
                  Apply
                </button>
              </div>
              {couponData && (
                <div className="cart-coupon-applied">
                  <span>✓ {couponData.code} applied</span>
                  <button onClick={() => { setCouponData(null); setCouponCode('') }}>Remove</button>
                </div>
              )}
            </div>

            <div className="cart-summary-divider" />

            {/* Totals */}
            <div className="cart-totals">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="cart-total-row cart-total-discount">
                  <span>Discount ({couponData?.code})</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-total-row">
                <span>Delivery Fee</span>
                <span className="cart-total-note">Calculated at checkout</span>
              </div>
              <div className="cart-total-row">
                <span>CA Cannabis Tax (~9.75%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-grand-total">
              <span>Estimated Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary cart-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            <Link to="/shop" className="btn btn-ghost cart-continue-btn">
              Continue Shopping
            </Link>

            <div className="cart-secure-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Secure checkout powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart