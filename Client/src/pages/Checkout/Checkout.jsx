import { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'
import orderService from '../../services/orderService.js'
import { CA_TAX_RATE, DELIVERY_FEE } from '../../utils/constants.js'
import { getImageUrl } from '../../utils/helpers.js'
import './Checkout.css'

const Checkout = () => {
  const { cartItems, products, getTotalCartAmount, token, user, url } = useContext(StoreContext)
  const { state } = useLocation()
  const couponData = state?.couponData || null
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderType, setOrderType] = useState('pickup')

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: 'CA',
    zipCode: '',
    specialInstructions: '',
  })

  const cartProductList = products.filter(p => cartItems[p._id] > 0)
  const items = cartProductList.map(p => ({
    productId: p._id,
    name: p.name,
    image: p.image,
    price: p.salePrice || p.price,
    quantity: cartItems[p._id],
    category: p.category,
    weight: p.weight,
  }))

  const subtotal = getTotalCartAmount()
  const discount = couponData?.discountAmount || 0
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0
  const tax = (subtotal - discount) * CA_TAX_RATE
  const total = subtotal - discount + deliveryFee + tax

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!token) { toast.error('Please sign in'); return }
    if (items.length === 0) { toast.error('Your cart is empty'); return }

    if (orderType === 'delivery' && !form.street) {
      toast.error('Please enter a delivery address')
      return
    }

    setLoading(true)
    try {
      const address = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      }

      const res = await orderService.place({
        items,
        address,
        orderType,
        couponCode: couponData?.code || '',
        specialInstructions: form.specialInstructions,
      })

      if (res.data.success) {
        if (res.data.session_url) {
          window.location.replace(res.data.session_url)
        } else {
          toast.success('Order placed successfully!')
          navigate(`/verify?success=true&orderId=${res.data.orderId}`)
        }
      } else {
        toast.error(res.data.message || 'Failed to place order')
      }
    } catch (e) {
      toast.error('Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="page-wrapper">
        <div className="checkout-header">
          <p className="section-eyebrow">Secure Checkout</p>
          <h1 className="checkout-title">Complete Your Order</h1>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          {/* Left: Form */}
          <div className="checkout-form-col">
            {/* Contact */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">
                <span className="checkout-step">1</span>
                Contact Information
              </h3>
              <div className="checkout-grid-2">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" name="firstName" value={form.firstName}
                    onChange={handleChange} required placeholder="Jane" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" name="lastName" value={form.lastName}
                    onChange={handleChange} required placeholder="Doe" />
                </div>
              </div>
              <div className="checkout-grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" name="email" value={form.email}
                    onChange={handleChange} required placeholder="you@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>

            {/* Order Type */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">
                <span className="checkout-step">2</span>
                Fulfillment Method
              </h3>
              <div className="checkout-order-types">
                <label className={`checkout-order-type ${orderType === 'pickup' ? 'active' : ''}`}>
                  <input
                    type="radio" name="orderType" value="pickup"
                    checked={orderType === 'pickup'}
                    onChange={() => setOrderType('pickup')}
                  />
                  <span className="checkout-order-icon">🏪</span>
                  <div>
                    <p className="checkout-order-label">In-Store Pickup</p>
                    <p className="checkout-order-sub">Free · Ready in 30 min</p>
                  </div>
                </label>
                <label className={`checkout-order-type ${orderType === 'delivery' ? 'active' : ''}`}>
                  <input
                    type="radio" name="orderType" value="delivery"
                    checked={orderType === 'delivery'}
                    onChange={() => setOrderType('delivery')}
                  />
                  <span className="checkout-order-icon">🚚</span>
                  <div>
                    <p className="checkout-order-label">Home Delivery</p>
                    <p className="checkout-order-sub">${DELIVERY_FEE} · 60–90 min</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="checkout-section">
                <h3 className="checkout-section-title">
                  <span className="checkout-step">3</span>
                  Delivery Address
                  <span className="checkout-ca-note">California only</span>
                </h3>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" name="street" value={form.street}
                    onChange={handleChange} required={orderType === 'delivery'}
                    placeholder="123 Main St" />
                </div>
                <div className="checkout-grid-3">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" name="city" value={form.city}
                      onChange={handleChange} required={orderType === 'delivery'} placeholder="Los Angeles" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-input" name="state" value={form.state} onChange={handleChange}>
                      <option value="CA">California</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input className="form-input" name="zipCode" value={form.zipCode}
                      onChange={handleChange} required={orderType === 'delivery'} placeholder="90001" />
                  </div>
                </div>
              </div>
            )}

            {/* Pickup info */}
            {orderType === 'pickup' && (
              <div className="checkout-pickup-info">
                <div className="checkout-pickup-icon">📍</div>
                <div>
                  <p className="checkout-pickup-name">GreenLeaf Dispensary</p>
                  <p className="checkout-pickup-addr">123 Cannabis Blvd, San Francisco, CA 94102</p>
                  <p className="checkout-pickup-hours">Mon–Sat: 9am–9pm · Sun: 10am–7pm</p>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">
                <span className="checkout-step">{orderType === 'delivery' ? '4' : '3'}</span>
                Special Instructions <span className="checkout-optional">(optional)</span>
              </h3>
              <textarea
                className="form-input checkout-instructions"
                name="specialInstructions"
                value={form.specialInstructions}
                onChange={handleChange}
                placeholder="Any special requests or notes for your order…"
                rows={3}
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="checkout-summary-col">
            <div className="checkout-summary">
              <h3 className="checkout-summary-title">Order Summary</h3>

              <div className="checkout-items">
                {cartProductList.map(p => {
                  const price = p.salePrice || p.price
                  const qty = cartItems[p._id]
                  return (
                    <div key={p._id} className="checkout-item">
                      <div className="checkout-item-img">
                        {p.image
                          ? <img src={getImageUrl(p.image, url)} alt={p.name} />
                          : <span>🌿</span>}
                        <span className="checkout-item-qty-badge">{qty}</span>
                      </div>
                      <div className="checkout-item-info">
                        <p className="checkout-item-name">{p.name}</p>
                        <p className="checkout-item-meta">{p.category}{p.weight && ` · ${p.weight}`}</p>
                      </div>
                      <span className="checkout-item-price">${(price * qty).toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>

              <div className="checkout-divider" />

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="checkout-total-row checkout-discount">
                    <span>Discount</span><span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="checkout-total-row">
                  <span>Delivery</span>
                  <span>{orderType === 'delivery' ? `$${DELIVERY_FEE.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="checkout-total-row">
                  <span>CA Tax</span><span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="checkout-divider" />

              <div className="checkout-grand-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary checkout-place-btn"
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Placing Order…</>
                  : <>Place Order · ${total.toFixed(2)}</>
                }
              </button>

              <p className="checkout-legal">
                By placing your order, you confirm you are 21+ years of age and comply with California cannabis regulations.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout