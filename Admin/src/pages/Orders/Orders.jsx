import { useState, useEffect, Fragment } from 'react'
import { toast } from 'react-toastify'
import adminServices from '../../services/adminServices.js'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/adminUtils.js'
import './Orders.css'

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = filterStatus ? { status: filterStatus } : {}
      const res = await adminServices.orders.list(params)
      if (res.data.success) setOrders(res.data.data)
    } catch (e) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [filterStatus])

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId)
    try {
      const res = await adminServices.orders.updateStatus(orderId, status)
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
        toast.success(`Order status updated to "${ORDER_STATUS_LABELS[status]}"`)
      }
    } catch (e) {
      toast.error('Error updating status')
    } finally {
      setUpdatingId(null)
    }
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const todayRevenue = orders
    .filter(o => {
      const today = new Date()
      const created = new Date(o.createdAt)
      return o.paymentStatus === 'paid' &&
        created.getDate() === today.getDate() &&
        created.getMonth() === today.getMonth() &&
        created.getFullYear() === today.getFullYear()
    })
    .reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="orders-admin fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-sub">{orders.length} orders · {pendingCount} pending</p>
        </div>
        <div className="orders-header-stats">
          <div className="orders-header-stat">
            <span className="orders-header-stat-label">Today's Revenue</span>
            <span className="orders-header-stat-value">${todayRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Status filter */}
      <div className="orders-filter-bar admin-card">
        <button
          className={`orders-status-pill ${!filterStatus ? 'active' : ''}`}
          onClick={() => setFilterStatus('')}
        >
          All Orders <span className="orders-status-count">{orders.length}</span>
        </button>
        {STATUS_OPTIONS.map(s => {
          const count = orders.filter(o => o.status === s).length
          return (
            <button
              key={s}
              className={`orders-status-pill ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              style={filterStatus === s ? { color: ORDER_STATUS_COLORS[s], borderColor: ORDER_STATUS_COLORS[s] + '60', background: ORDER_STATUS_COLORS[s] + '15' } : {}}
            >
              {ORDER_STATUS_LABELS[s]}
              {count > 0 && <span className="orders-status-count">{count}</span>}
            </button>
          )
        })}
      </div>

      {/* Orders table */}
      <div className="admin-card">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <span>📦</span>
            <p>No orders {filterStatus ? `with status "${ORDER_STATUS_LABELS[filterStatus]}"` : 'yet'}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Type</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <Fragment key={order._id}>
                  <tr
                    className={`order-row ${expanded === order._id ? 'expanded' : ''}`}
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  >
                    <td>
                      <span className="order-num-cell">
                        {order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="order-customer-cell">
                        <p className="order-customer-name">
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <p className="order-customer-email">{order.address?.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className="order-items-count">
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <span className="order-type-cell">
                        {order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                      </span>
                    </td>
                    <td>
                      <span className="order-total-cell">${order.amount?.toFixed(2)}</span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          color: order.paymentStatus === 'paid' ? '#52b788' : '#e0a050',
                          borderColor: order.paymentStatus === 'paid' ? 'rgba(82,183,136,0.3)' : 'rgba(224,160,80,0.3)',
                          background: order.paymentStatus === 'paid' ? 'rgba(82,183,136,0.08)' : 'rgba(224,160,80,0.08)',
                        }}
                      >
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <select
                        className="order-status-select"
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        style={{ color: ORDER_STATUS_COLORS[order.status] }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="order-date-cell">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        className="order-expand-btn"
                        onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                        title="View details"
                      >
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          style={{ transform: expanded === order._id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        Details
                      </button>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {expanded === order._id && (
                    <tr key={`${order._id}-expanded`} className="order-detail-row">
                      <td colSpan="9">
                        <div className="order-detail-panel fade-in">
                          <div className="order-detail-grid">
                            {/* Items */}
                            <div className="order-detail-section">
                              <p className="order-detail-label">Order Items</p>
                              {order.items?.map((item, i) => (
                                <div key={i} className="order-detail-item">
                                  <div className="order-detail-item-img">
                                    {item.image
                                      ? <img src={`${url}/images/${item.image}`} alt={item.name} />
                                      : <span>🌿</span>}
                                  </div>
                                  <div>
                                    <p className="order-detail-item-name">{item.name}</p>
                                    <p className="order-detail-item-meta">{item.category}{item.weight && ` · ${item.weight}`}</p>
                                  </div>
                                  <div className="order-detail-item-right">
                                    <span>×{item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Address / Breakdown */}
                            <div>
                              {order.orderType === 'delivery' && order.address && (
                                <div className="order-detail-section">
                                  <p className="order-detail-label">Delivery Address</p>
                                  <p className="order-detail-addr">
                                    {order.address.firstName} {order.address.lastName}<br />
                                    {order.address.street}<br />
                                    {order.address.city}, {order.address.state} {order.address.zipCode}
                                  </p>
                                  {order.address.phone && <p className="order-detail-phone">{order.address.phone}</p>}
                                </div>
                              )}

                              <div className="order-detail-section">
                                <p className="order-detail-label">Order Breakdown</p>
                                <div className="order-detail-breakdown">
                                  <div className="order-breakdown-row"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
                                  {order.discount > 0 && <div className="order-breakdown-row" style={{ color: '#52b788' }}><span>Discount</span><span>−${order.discount?.toFixed(2)}</span></div>}
                                  {order.deliveryFee > 0 && <div className="order-breakdown-row"><span>Delivery</span><span>${order.deliveryFee?.toFixed(2)}</span></div>}
                                  <div className="order-breakdown-row"><span>Tax</span><span>${order.tax?.toFixed(2)}</span></div>
                                  <div className="order-breakdown-row order-breakdown-total"><span>Total</span><span>${order.amount?.toFixed(2)}</span></div>
                                </div>
                              </div>

                              {order.specialInstructions && (
                                <div className="order-detail-section">
                                  <p className="order-detail-label">Special Instructions</p>
                                  <p className="order-detail-instructions">{order.specialInstructions}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Orders