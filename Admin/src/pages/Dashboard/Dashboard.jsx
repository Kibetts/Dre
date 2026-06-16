import { useEffect, useState } from 'react'
import axios from 'axios'
import './Dashboard.css'

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="dash-stat-card admin-card">
    <div className="dash-stat-top">
      <div className="dash-stat-icon" style={{ background: `${color}15`, color }}>{icon}</div>
      <p className="dash-stat-label">{label}</p>
    </div>
    <p className="dash-stat-value">{value}</p>
    {sub && <p className="dash-stat-sub">{sub}</p>}
  </div>
)

const Dashboard = ({ url, token }) => {
  const [orderStats, setOrderStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [ordRes, userRes, listRes] = await Promise.all([
          axios.get(`${url}/api/order/analytics`, { headers: { token } }),
          axios.get(`${url}/api/user/analytics`, { headers: { token } }),
          axios.get(`${url}/api/order/list?limit=5`, { headers: { token } }),
        ])
        if (ordRes.data.success) setOrderStats(ordRes.data.data)
        if (userRes.data.success) setUserStats(userRes.data.data)
        if (listRes.data.success) setRecentOrders(listRes.data.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [url, token])

  const STATUS_COLORS = {
    pending: '#e0a050', confirmed: '#4ecdc4', processing: '#7c6ae0',
    ready: '#52b788', out_for_delivery: '#e07c3a', delivered: '#52b788', cancelled: '#e55353',
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="dashboard fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">GreenLeaf Dispensary — Overview</p>
        </div>
        <div className="dash-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`$${(orderStats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="From paid orders"
          color="var(--green-bright)"
        />
        <StatCard
          icon="📦"
          label="Total Orders"
          value={orderStats?.totalOrders || 0}
          sub={`${orderStats?.pendingOrders || 0} pending`}
          color="var(--blue)"
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={orderStats?.completedOrders || 0}
          sub="Delivered orders"
          color="var(--gold)"
        />
        <StatCard
          icon="👥"
          label="Customers"
          value={userStats?.totalUsers || 0}
          sub={`${userStats?.activeUsers || 0} active`}
          color="#e07c3a"
        />
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="dash-section-header">
          <h3 className="dash-section-title">Recent Orders</h3>
          <a href="/orders" className="dash-view-all">View All →</a>
        </div>
        {recentOrders.length === 0 ? (
          <div className="dash-empty">No orders yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Type</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td>
                    <span className="dash-order-num">
                      {order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>
                    {order.address?.firstName} {order.address?.lastName}
                  </td>
                  <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                  <td>
                    <span className="dash-type-badge">
                      {order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    ${order.amount?.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        color: STATUS_COLORS[order.status],
                        borderColor: STATUS_COLORS[order.status] + '40',
                        background: STATUS_COLORS[order.status] + '15',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard