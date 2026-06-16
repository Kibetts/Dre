import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/', icon: '📊', label: 'Dashboard', end: true },
  { to: '/products', icon: '🌿', label: 'Products' },
  { to: '/orders', icon: '📦', label: 'Orders' },
  { to: '/customers', icon: '👥', label: 'Customers' },
  { to: '/coupons', icon: '🏷️', label: 'Coupons' },
]

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🌿</span>
        <div>
          <p className="sidebar-logo-text">GreenLeaf</p>
          <p className="sidebar-logo-sub">Admin Panel</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Navigation</p>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <p className="sidebar-footer-role">Admin</p>
          <p className="sidebar-footer-name">GreenLeaf Mgmt</p>
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout} title="Sign out">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar