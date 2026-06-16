import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Coupons.css'

const defaultForm = {
  code: '', description: '', discountType: 'percentage',
  discountValue: '', minimumOrder: '', maximumDiscount: '',
  usageLimit: '', expiresAt: '', isActive: true,
}

const Coupons = ({ url, token }) => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${url}/api/coupon/list`, { headers: { token } })
      if (res.data.success) setCoupons(res.data.data)
    } catch (e) { toast.error('Failed to load coupons') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCoupons() }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minimumOrder: Number(form.minimumOrder) || 0,
        maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      }
      const res = await axios.post(`${url}/api/coupon/add`, payload, { headers: { token } })
      if (res.data.success) {
        toast.success('Coupon created!')
        setCoupons(prev => [res.data.data, ...prev])
        setForm(defaultForm)
        setShowForm(false)
      } else {
        toast.error(res.data.message)
      }
    } catch (e) { toast.error('Error creating coupon') }
    finally { setSaving(false) }
  }

  const deleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return
    try {
      const res = await axios.delete(`${url}/api/coupon/${id}`, { headers: { token } })
      if (res.data.success) {
        toast.success('Coupon deleted')
        setCoupons(prev => prev.filter(c => c._id !== id))
      }
    } catch (e) { toast.error('Error deleting coupon') }
  }

  const isExpired = coupon => coupon.expiresAt && new Date(coupon.expiresAt) < new Date()
  const isExhausted = coupon => coupon.usageLimit && coupon.usedCount >= coupon.usageLimit

  return (
    <div className="coupons-page fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons & Promotions</h1>
          <p className="admin-page-sub">{coupons.length} coupon codes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Create Coupon'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="admin-card coupon-form-card fade-in">
          <div className="coupon-form-header">
            <h3>New Coupon Code</h3>
          </div>
          <form className="coupon-form" onSubmit={handleSubmit}>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input className="form-input coupon-code-input" name="code" value={form.code}
                  onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                  required placeholder="GREENLEAF20" />
              </div>
              <div className="form-group">
                <label className="form-label">Discount Type *</label>
                <select className="form-input" name="discountType" value={form.discountType} onChange={handleChange}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Discount Value *</label>
                <input className="form-input" type="number" name="discountValue" value={form.discountValue}
                  onChange={handleChange} required min="0" step="0.01"
                  placeholder={form.discountType === 'percentage' ? '20' : '10.00'} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" name="description" value={form.description} onChange={handleChange}
                placeholder="e.g. 20% off your first order" />
            </div>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Minimum Order ($)</label>
                <input className="form-input" type="number" name="minimumOrder" value={form.minimumOrder}
                  onChange={handleChange} min="0" placeholder="0" />
              </div>
              {form.discountType === 'percentage' && (
                <div className="form-group">
                  <label className="form-label">Max Discount ($)</label>
                  <input className="form-input" type="number" name="maximumDiscount" value={form.maximumDiscount}
                    onChange={handleChange} min="0" placeholder="No limit" />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Usage Limit</label>
                <input className="form-input" type="number" name="usageLimit" value={form.usageLimit}
                  onChange={handleChange} min="1" placeholder="Unlimited" />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input className="form-input" type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange} />
              </div>
            </div>
            <div className="coupon-form-footer">
              <label className="coupon-active-toggle">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Active immediately
              </label>
              <div className="coupon-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setForm(defaultForm) }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Creating…' : 'Create Coupon'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Coupons list */}
      <div className="admin-card">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : coupons.length === 0 ? (
          <div className="coupons-empty">
            <span>🏷️</span>
            <p>No coupons yet. Create your first promo code!</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Usage</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => {
                const expired = isExpired(coupon)
                const exhausted = isExhausted(coupon)
                const statusColor = !coupon.isActive || expired || exhausted ? 'var(--red)' : 'var(--green-bright)'
                const statusLabel = !coupon.isActive ? 'Disabled' : expired ? 'Expired' : exhausted ? 'Exhausted' : 'Active'

                return (
                  <tr key={coupon._id}>
                    <td>
                      <span className="coupon-code-cell">{coupon.code}</span>
                    </td>
                    <td>
                      <span className="coupon-desc">{coupon.description || '—'}</span>
                    </td>
                    <td>
                      <span className="coupon-discount">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% off`
                          : `$${coupon.discountValue} off`}
                      </span>
                      {coupon.maximumDiscount && (
                        <span className="coupon-max-note">up to ${coupon.maximumDiscount}</span>
                      )}
                    </td>
                    <td>
                      <span className="coupon-min">
                        {coupon.minimumOrder > 0 ? `$${coupon.minimumOrder}` : 'None'}
                      </span>
                    </td>
                    <td>
                      <span className="coupon-usage">
                        {coupon.usedCount}/{coupon.usageLimit || '∞'}
                      </span>
                    </td>
                    <td>
                      <span className="coupon-expiry" style={{ color: expired ? 'var(--red)' : 'var(--text-muted)' }}>
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : 'No expiry'}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ color: statusColor, borderColor: statusColor + '40', background: statusColor + '12' }}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-danger coupon-delete-btn" onClick={() => deleteCoupon(coupon._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Coupons