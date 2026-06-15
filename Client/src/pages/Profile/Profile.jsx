import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'
import './Profile.css'

const Profile = () => {
  const { token, user, url, logout } = useContext(StoreContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm] = useState({ name: '', phone: '', newsletterSubscribed: false })

  useEffect(() => {
    if (!token) return
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${url}/api/user/profile`, { headers: { token } })
        if (res.data.success) {
          setProfile(res.data.data)
          setForm({
            name: res.data.data.name || '',
            phone: res.data.data.phone || '',
            newsletterSubscribed: res.data.data.newsletterSubscribed || false,
          })
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchProfile()
  }, [token, url])

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await axios.put(`${url}/api/user/profile`, form, { headers: { token } })
      if (res.data.success) {
        setProfile(res.data.data)
        toast.success('Profile updated successfully')
      }
    } catch (e) { toast.error('Error saving profile') }
    finally { setSaving(false) }
  }

  if (!token) return (
    <div className="profile-page">
      <div className="page-wrapper">
        <div className="profile-empty">
          <span>👤</span>
          <h2>Sign in to view your profile</h2>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  )

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

  return (
    <div className="profile-page">
      <div className="page-wrapper">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar-lg">
                {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="profile-name">{profile?.name}</h3>
              <p className="profile-email">{profile?.email}</p>
            </div>

            <div className="profile-loyalty-card">
              <div className="profile-loyalty-top">
                <span>⭐</span>
                <p className="profile-loyalty-label">Loyalty Points</p>
              </div>
              <p className="profile-loyalty-points">{profile?.loyaltyPoints || 0}</p>
              <p className="profile-loyalty-sub">Earn 1 point per $1 spent</p>
            </div>

            <nav className="profile-nav">
              {[
                { id: 'profile', icon: '👤', label: 'My Profile' },
                { id: 'orders', icon: '📦', label: 'Order History' },
                { id: 'wishlist', icon: '❤️', label: 'Wishlist' },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    if (tab.id === 'orders') window.location.href = '/orders'
                    else if (tab.id === 'wishlist') window.location.href = '/wishlist'
                    else setActiveTab(tab.id)
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <button className="profile-nav-item profile-nav-logout" onClick={logout}>
                <span>🚪</span> Sign Out
              </button>
            </nav>
          </aside>

          {/* Main */}
          <div className="profile-main">
            <div className="profile-section">
              <h2 className="profile-section-title">Personal Information</h2>
              <form className="profile-form" onSubmit={handleSave}>
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" value={profile?.email || ''} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Member Since</label>
                    <input
                      className="form-input"
                      type="text"
                      value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                      disabled
                    />
                  </div>
                </div>

                <label className="profile-newsletter-toggle">
                  <input
                    type="checkbox"
                    checked={form.newsletterSubscribed}
                    onChange={e => setForm(p => ({ ...p, newsletterSubscribed: e.target.checked }))}
                  />
                  <span className="profile-toggle-track">
                    <span className="profile-toggle-thumb" />
                  </span>
                  <span className="profile-toggle-label">Subscribe to newsletter for deals and updates</span>
                </label>

                <button type="submit" className="btn btn-primary profile-save-btn" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="profile-section">
              <h2 className="profile-section-title">Account Stats</h2>
              <div className="profile-stats-grid">
                <div className="profile-stat-card">
                  <p className="profile-stat-num">{profile?.orderCount || 0}</p>
                  <p className="profile-stat-label">Total Orders</p>
                </div>
                <div className="profile-stat-card">
                  <p className="profile-stat-num">${(profile?.totalSpent || 0).toFixed(2)}</p>
                  <p className="profile-stat-label">Total Spent</p>
                </div>
                <div className="profile-stat-card">
                  <p className="profile-stat-num">{profile?.loyaltyPoints || 0}</p>
                  <p className="profile-stat-label">Loyalty Points</p>
                </div>
                <div className="profile-stat-card">
                  <p className="profile-stat-num">{profile?.wishlist?.length || 0}</p>
                  <p className="profile-stat-label">Saved Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile