import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Customers.css'

const Customers = ({ url, token }) => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${url}/api/user/list`, { headers: { token } })
        if (res.data.success) setCustomers(res.data.data)
      } catch (e) {
        toast.error('Failed to load customers')
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [url, token])

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div className="customers-page fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-sub">{customers.length} registered accounts</p>
        </div>
      </div>

      <div className="admin-card customers-filter-bar">
        <div className="customers-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="customers-search-icon">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="form-input customers-search"
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="customers-stats">
          <span className="customers-stat">
            <strong>{customers.filter(c => c.isActive).length}</strong> Active
          </span>
          <span className="customers-stat">
            <strong>{customers.filter(c => c.ageVerified).length}</strong> Age Verified
          </span>
          <span className="customers-stat">
            <strong>{customers.filter(c => c.newsletterSubscribed).length}</strong> Subscribed
          </span>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="customers-empty">
            <span>👥</span>
            <p>No customers found</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Points</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <div className="customer-name-cell">
                      <div className="customer-avatar">
                        {customer.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className="customer-name">{customer.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="customer-email">{customer.email}</span>
                  </td>
                  <td>
                    <span className="customer-phone">{customer.phone || '—'}</span>
                  </td>
                  <td>
                    <span className={`customer-role-badge role-${customer.role}`}>
                      {customer.role || 'customer'}
                    </span>
                  </td>
                  <td>
                    <span className="customer-orders">{customer.orderCount || 0}</span>
                  </td>
                  <td>
                    <span className="customer-spent">
                      ${(customer.totalSpent || 0).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="customer-points">
                      ⭐ {customer.loyaltyPoints || 0}
                    </span>
                  </td>
                  <td>
                    {customer.ageVerified ? (
                      <span className="customer-verified">✓ Verified</span>
                    ) : (
                      <span className="customer-unverified">Pending</span>
                    )}
                  </td>
                  <td>
                    <span className="customer-date">
                      {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td>
                    <span className={`customer-status ${customer.isActive ? 'active' : 'inactive'}`}>
                      {customer.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Customers