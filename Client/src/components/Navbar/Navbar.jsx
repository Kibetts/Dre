import { useContext, useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import LoginModal from '../LoginModal/LoginModal'
import SearchOverlay from '../SearchOverlay/SearchOverlay'
import './Navbar.css'

const Navbar = () => {
  const { token, user, logout, getCartCount, showLoginModal, openLoginModal, closeLoginModal } = useContext(StoreContext)
  const [showSearch, setShowSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const profileRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setProfileOpen(false)
  }

  const cartCount = getCartCount()

  return (
    <>
      {showLoginModal && <LoginModal onClose={closeLoginModal} />}
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}

      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner page-wrapper">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-icon">🌿</span>
            <span className="navbar-logo-text">GreenLeaf</span>
          </Link>

          {/* Desktop nav */}
          <ul className="navbar-links">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Shop</NavLink></li>
            <li><Link to="/shop/flower">Flower</Link></li>
            <li><Link to="/shop/edibles">Edibles</Link></li>
            <li><Link to="/shop/concentrates">Concentrates</Link></li>
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              className="navbar-icon-btn"
              onClick={() => setShowSearch(true)}
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link to="/wishlist" className="navbar-icon-btn" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link to="/cart" className="navbar-cart-btn" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="navbar-cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {!token ? (
              <button className="btn btn-primary navbar-signin" onClick={openLoginModal}>
                Sign In
              </button>
            ) : (
              <div className="navbar-profile" ref={profileRef}>
                <button
                  className="navbar-profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="navbar-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>
                {profileOpen && (
                  <div className="navbar-dropdown fade-in">
                    <div className="navbar-dropdown-header">
                      <p className="navbar-dropdown-name">{user?.name}</p>
                      <p className="navbar-dropdown-email">{user?.email}</p>
                    </div>
                    <div className="navbar-dropdown-divider" />
                    <Link to="/profile" className="navbar-dropdown-item" onClick={() => setProfileOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      My Profile
                    </Link>
                    <Link to="/orders" className="navbar-dropdown-item" onClick={() => setProfileOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                      </svg>
                      My Orders
                    </Link>
                    <Link to="/wishlist" className="navbar-dropdown-item" onClick={() => setProfileOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Wishlist
                    </Link>
                    <div className="navbar-dropdown-divider" />
                    <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="navbar-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={mobileOpen ? 'open' : ''} />
              <span className={mobileOpen ? 'open' : ''} />
              <span className={mobileOpen ? 'open' : ''} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="navbar-mobile fade-in">
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop All</Link>
            <Link to="/shop/flower" onClick={() => setMobileOpen(false)}>Flower</Link>
            <Link to="/shop/edibles" onClick={() => setMobileOpen(false)}>Edibles</Link>
            <Link to="/shop/concentrates" onClick={() => setMobileOpen(false)}>Concentrates</Link>
            <Link to="/shop/vapes" onClick={() => setMobileOpen(false)}>Vapes</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
            {token ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false) }}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => { openLoginModal(); setMobileOpen(false) }}>Sign In</button>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar