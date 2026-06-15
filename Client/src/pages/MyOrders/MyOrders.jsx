import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import './MyOrders.css'

const STATUS_COLORS = {
  pending: '#e0a050',
  confirmed: '#4ecdc4',
  processing: '#7c6ae0',
  ready: '#52b788',
  out_for_delivery: '#e07c3a',
  delivered: '#52b788',
  cancelled: '#e55353',
}

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const MyOrders = () => {
  const { token, url } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    if (!token) return
    const fetchOrders = async () => {
      try {
        const res = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } })
        if (res.data.success) setOrders(res.data.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchOrders()
  }, [token, url])

  if (!token) return (
    <div className="orders-page">
      <div className="page-wrapper">
        <div className="orders-empty">
          <span>🔐</span>
          <h2>Sign in to view your orders</h2>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="orders-page">
      <div className="page-wrapper">
        <div className="orders-header">
          <p className="section-eyebrow">Your Purchase History</p>
          <h1 className="orders-title">My Orders</h1>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <span>📦</span>
            <h2>No orders yet</h2>
            <p>Your order history will appear here after your first purchase.</p>
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card card">
                {/* Order Header */}
                <div
                  className="order-card-header"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="order-card-left">
                    <div>
                      <p className="order-number">Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span
                      className="order-status-badge"
                      style={{ color: STATUS_COLORS[order.status], borderColor: STATUS_COLORS[order.status] + '40', background: STATUS_COLORS[order.status] + '15' }}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <div className="order-card-right">
                    <div className="order-summary-pills">
                      <span className="order-pill">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                      <span className="order-pill order-pill-type">{order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</span>
                    </div>
                    <p className="order-total">${order.amount?.toFixed(2)}</p>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: expandedOrder === order._id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {/* Expanded order */}
                {expandedOrder === order._id && (
                  <div className="order-card-body fade-in">
                    <div className="order-items-list">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="order-item-img">
                            {item.image
                              ? <img src={`${url}/images/${item.image}`} alt={item.name} />
                              : <span>🌿</span>}
                          </div>
                          <div className="order-item-info">
                            <p className="order-item-name">{item.name}</p>
                            <p className="order-item-meta">{item.category}{item.weight && ` · ${item.weight}`}</p>
                          </div>
                          <div className="order-item-right">
                            <span className="order-item-qty">×{item.quantity}</span>
                            <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-breakdown">
                      <div className="order-breakdown-row">
                        <span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="order-breakdown-row order-discount-row">
                          <span>Discount</span><span>−${order.discount?.toFixed(2)}</span>
                        </div>
                      )}
                      {order.deliveryFee > 0 && (
                        <div className="order-breakdown-row">
                          <span>Delivery Fee</span><span>${order.deliveryFee?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="order-breakdown-row">
                        <span>Tax</span><span>${order.tax?.toFixed(2)}</span>
                      </div>
                      <div className="order-breakdown-row order-breakdown-total">
                        <span>Total</span><span>${order.amount?.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.orderType === 'delivery' && order.address && (
                      <div className="order-address">
                        <p className="order-address-label">Delivery Address</p>
                        <p className="order-address-text">
                          {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders