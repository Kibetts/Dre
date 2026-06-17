import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import productService from '../../services/productService.js'
import './Home.css'

const EFFECTS = ['Relaxed', 'Happy', 'Euphoric', 'Creative', 'Focused', 'Sleepy', 'Energetic', 'Uplifted']

const TESTIMONIALS = [
  {
    name: 'Sarah M.', location: 'San Francisco, CA', rating: 5,
    body: 'GreenLeaf has completely changed my experience with medicinal cannabis. The staff knowledge and product quality are unmatched. My chronic pain is finally manageable.',
    product: 'Blue Dream Flower'
  },
  {
    name: 'James R.', location: 'Oakland, CA', rating: 5,
    body: 'I was nervous about trying cannabis for my anxiety, but the team walked me through every option. The CBD tincture they recommended has been life-changing.',
    product: 'Full Spectrum CBD Oil'
  },
  {
    name: 'Linda K.', location: 'Berkeley, CA', rating: 5,
    body: 'Fast delivery, discreet packaging, and the products are consistently top-tier. The loyalty rewards are a great bonus. 10/10 would recommend.',
    product: 'OG Kush Concentrate'
  }
]

const Stars = ({ count }) => (
  <div className="stars">
    {[1,2,3,4,5].map(n => (
      <span key={n} className={`star ${n <= count ? 'filled' : ''}`}>★</span>
    ))}
  </div>
)

const Home = () => {
  const { categories } = useContext(StoreContext)
  const [featured, setFeatured] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadFeatured = async () => {
      try {
        const res = await productService.getFeatured()
        if (!isMounted) return
        if (res.data.success) {
          setFeatured(res.data.data.featured || [])
          setBestSellers(res.data.data.bestSellers || [])
          setNewArrivals(res.data.data.newArrivals || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadFeatured()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="hero-inner page-wrapper">
          <div className="hero-content fade-up">
            <div className="hero-eyebrow section-eyebrow">
              California Licensed · Premium Quality
            </div>
            <h1 className="hero-title display-xl">
              Nature's Finest<br />
              <em className="hero-title-accent">Medicine</em>
            </h1>
            <p className="hero-subtitle">
              Curated cannabis for wellness, clarity, and relief. Expert guidance from licensed budtenders for every stage of your journey.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary hero-cta">
                Shop All Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/shop/flower" className="btn btn-secondary">
                Explore Strains
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">200+</span>
                <span className="hero-stat-label">Premium Products</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">4.9★</span>
                <span className="hero-stat-label">Average Rating</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">15k+</span>
                <span className="hero-stat-label">Happy Patients</span>
              </div>
            </div>
          </div>
          <div className="hero-visual fade-up">
            <div className="hero-card-wrap">
              <div className="hero-card">
                <div className="hero-card-icon">🌿</div>
                <div className="hero-card-info">
                  <p className="hero-card-name">Blue Dream</p>
                  <p className="hero-card-sub">Sativa Hybrid · 22% THC</p>
                </div>
                <div className="hero-card-rating">
                  <Stars count={5} />
                </div>
              </div>
              <div className="hero-card hero-card-2">
                <div className="hero-card-icon">💎</div>
                <div className="hero-card-info">
                  <p className="hero-card-name">Live Resin</p>
                  <p className="hero-card-sub">Concentrate · 85% THC</p>
                </div>
                <span className="badge badge-gold">Best Seller</span>
              </div>
              <div className="hero-badge-float">
                <span>🔒</span>
                <span>Lab Tested &amp; Licensed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="trust-bar">
        <div className="trust-bar-inner page-wrapper">
          {[
            { icon: '🔬', label: 'Lab Tested', desc: 'Every batch third-party verified' },
            { icon: '🌿', label: 'Organically Grown', desc: 'No pesticides or harmful chemicals' },
            { icon: '🚚', label: 'Same-Day Delivery', desc: 'Available in select CA cities' },
            { icon: '💳', label: 'Loyalty Rewards', desc: 'Earn points on every purchase' },
            { icon: '👨‍⚕️', label: 'Expert Guidance', desc: 'Licensed budtender consultation' },
          ].map(item => (
            <div key={item.label} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <div>
                <p className="trust-label">{item.label}</p>
                <p className="trust-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section home-categories">
        <div className="page-wrapper">
          <div className="section-header">
            <p className="section-eyebrow">Browse By Category</p>
            <h2 className="section-title">Find Your Perfect Product</h2>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link
                key={cat.slug || cat.name}
                to={`/shop/${cat.slug || cat.name.toLowerCase()}`}
                className="category-card"
              >
                <span className="category-icon">{cat.icon || '🌿'}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="section home-products">
          <div className="page-wrapper">
            <div className="section-header home-section-header">
              <div>
                <p className="section-eyebrow">Handpicked For You</p>
                <h2 className="section-title">Featured Products</h2>
              </div>
              <Link to="/shop?featured=true" className="btn btn-secondary">View All</Link>
            </div>
            <div className="grid-4">
              {featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Best Sellers ── */}
      {bestSellers.length > 0 && (
        <section className="section home-products home-products-alt">
          <div className="page-wrapper">
            <div className="section-header home-section-header">
              <div>
                <p className="section-eyebrow">Top Rated</p>
                <h2 className="section-title">Best Sellers</h2>
              </div>
              <Link to="/shop?bestSeller=true" className="btn btn-secondary">View All</Link>
            </div>
            <div className="grid-4">
              {bestSellers.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by Effect ── */}
      <section className="section home-effects">
        <div className="page-wrapper">
          <div className="section-header">
            <p className="section-eyebrow">Find By Effect</p>
            <h2 className="section-title">How Do You Want to Feel?</h2>
          </div>
          <div className="effects-grid">
            {EFFECTS.map(effect => (
              <Link
                key={effect}
                to={`/shop?effects=${effect}`}
                className="effect-card"
              >
                <span className="effect-name">{effect}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="section home-products">
          <div className="page-wrapper">
            <div className="section-header home-section-header">
              <div>
                <p className="section-eyebrow">Just Dropped</p>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <Link to="/shop?newArrival=true" className="btn btn-secondary">View All</Link>
            </div>
            <div className="grid-4">
              {newArrivals.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Educational Banner ── */}
      <section className="section home-edu">
        <div className="page-wrapper">
          <div className="edu-banner">
            <div className="edu-banner-content">
              <p className="section-eyebrow">Education</p>
              <h2 className="edu-banner-title display-md">New to Cannabis?</h2>
              <p className="edu-banner-desc">
                Our licensed budtenders are here to guide you through strains, dosing, and consumption methods. Start your wellness journey with confidence.
              </p>
              <div className="edu-features">
                {[
                  'Personalized strain recommendations',
                  'Microdosing guidance',
                  'Medical card assistance',
                  'Terpene education'
                ].map(f => (
                  <div key={f} className="edu-feature">
                    <span className="edu-feature-check">✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="#" className="btn btn-gold">Book a Consultation</a>
            </div>
            <div className="edu-banner-visual">
              <div className="edu-card">
                <div className="edu-card-header">
                  <span>🌿</span>
                  <span>Indica vs Sativa</span>
                </div>
                <div className="edu-strain-compare">
                  <div className="edu-strain-item">
                    <span className="strain-indica">Indica</span>
                    <p>Body relaxation, sleep, pain relief</p>
                  </div>
                  <div className="edu-strain-divider" />
                  <div className="edu-strain-item">
                    <span className="strain-sativa">Sativa</span>
                    <p>Energy, creativity, focus, mood lift</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section home-testimonials">
        <div className="page-wrapper">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <p className="section-eyebrow">Patient Stories</p>
            <h2 className="section-title">What Our Patients Say</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card card">
                <div className="testimonial-rating">
                  <Stars count={t.rating} />
                </div>
                <p className="testimonial-body">"{t.body}"</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-location">{t.location}</p>
                  </div>
                  <span className="testimonial-product">{t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="home-cta-strip">
        <div className="page-wrapper">
          <div className="cta-strip-inner">
            <div>
              <h3 className="cta-strip-title">Ready to find your perfect product?</h3>
              <p className="cta-strip-sub">Browse 200+ premium cannabis products or speak with a licensed budtender.</p>
            </div>
            <div className="cta-strip-actions">
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
              <a href="tel:+15555551234" className="btn btn-secondary">Call Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home