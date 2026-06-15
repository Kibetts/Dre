import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner page-wrapper">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🌿</span>
              <span className="footer-logo-text">GreenLeaf</span>
            </div>
            <p className="footer-tagline">
              California's premier licensed medicinal cannabis dispensary. Premium products, expert guidance.
            </p>
            <div className="footer-license">
              <span className="footer-license-badge">Licensed Retailer</span>
              <p>CA License #C10-0000123-LIC</p>
            </div>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="footer-social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter/X" className="footer-social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="footer-social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/shop/flower">Flower</Link></li>
              <li><Link to="/shop/pre-rolls">Pre-Rolls</Link></li>
              <li><Link to="/shop/edibles">Edibles</Link></li>
              <li><Link to="/shop/concentrates">Concentrates</Link></li>
              <li><Link to="/shop/vapes">Vapes</Link></li>
              <li><Link to="/shop/cbd">CBD & Wellness</Link></li>
              <li><Link to="/shop/accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <ul className="footer-links">
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>

            <h4 className="footer-col-title" style={{ marginTop: 'var(--space-lg)' }}>Help</h4>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Delivery Info</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Return Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4 className="footer-col-title">Stay in the Loop</h4>
            <p className="footer-newsletter-desc">
              Get exclusive deals, new strain alerts, and educational content.
            </p>
            <form className="footer-newsletter" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                className="form-input footer-newsletter-input"
                placeholder="your@email.com"
                required
              />
              <button type="submit" className="btn btn-primary footer-newsletter-btn">
                Subscribe
              </button>
            </form>
            <div className="footer-hours">
              <h5>Store Hours</h5>
              <p>Mon–Sat: 9am – 9pm</p>
              <p>Sunday: 10am – 7pm</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© {new Date().getFullYear()} GreenLeaf Dispensary, LLC. All rights reserved.</p>
            <p className="footer-warning">⚠️ Cannabis products are for adults 21+ only. Keep out of reach of children and pets.</p>
          </div>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer