import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './AdminLogin.css'

const AdminLogin = ({ url, onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${url}/api/user/login`, { email, password })
      if (res.data.success) {
        if (res.data.user?.role === 'admin' || res.data.user?.role === 'budtender') {
          onLogin(res.data.token)
          toast.success(`Welcome, ${res.data.user.name}!`)
        } else {
          toast.error('Admin access required.')
        }
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card fade-up">
        <div className="admin-login-logo">
          <span>🌿</span>
          <div>
            <p className="admin-login-brand">GreenLeaf</p>
            <p className="admin-login-sub">Admin Dashboard</p>
          </div>
        </div>

        <h2 className="admin-login-title">Sign In</h2>
        <p className="admin-login-desc">Authorized personnel only.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@greenleaf.com"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary admin-login-btn" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Sign In'}
          </button>
        </form>

        <p className="admin-login-notice">
          🔒 Restricted access. All activity is logged and monitored.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin