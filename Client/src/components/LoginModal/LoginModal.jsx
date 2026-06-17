import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'
import userService from '../../services/userService.js'
import { validateEmail, validateAge, validatePassword } from '../../utils/validators.js'
import './LoginModal.css'

const LoginModal = ({ onClose }) => {
  const { login } = useContext(StoreContext)
  const [mode, setMode] = useState('login') // login | register
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    name: '', email: '', password: '', dateOfBirth: ''
  })

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(data.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!validatePassword(data.password)) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (mode === 'register' && !validateAge(data.dateOfBirth, 21)) {
      toast.error('You must be 21 or older to create an account')
      return
    }

    setLoading(true)
    try {
      const payload = mode === 'login'
        ? { email: data.email, password: data.password }
        : data

      const res = mode === 'login'
        ? await userService.login(payload.email, payload.password)
        : await userService.register(payload)

      if (res.data.success) {
        await login(res.data.token, res.data.user)
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
        onClose()
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card fade-up">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-logo">
          <span>🌿</span>
          <span className="modal-brand">GreenLeaf</span>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`modal-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Your name"
                value={data.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@email.com"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'}
              value={data.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Date of Birth <span className="modal-required">(Must be 21+)</span></label>
              <input
                className="form-input"
                type="date"
                name="dateOfBirth"
                value={data.dateOfBirth}
                onChange={handleChange}
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="modal-terms">
              <p>By creating an account, you confirm you are 21+ years old and agree to our Terms of Service and Privacy Policy.</p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary modal-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{ width: 18, height: 18 }} />
            ) : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="modal-switch">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => setMode('register')}>Create one</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode('login')}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  )
}

export default LoginModal