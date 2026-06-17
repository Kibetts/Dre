import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import productService from '../../services/productService.js'
import reviewService from '../../services/reviewService.js'
import { getImageUrl } from '../../utils/helpers.js'
import './ProductDetail.css'

const Stars = ({ rating, interactive, onRate }) => (
  <div className="stars">
    {[1,2,3,4,5].map(n => (
      <span
        key={n}
        className={`star ${n <= Math.round(rating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={() => interactive && onRate(n)}
      >★</span>
    ))}
  </div>
)

const TerpeneBar = ({ name, percentage }) => (
  <div className="terpene-bar">
    <div className="terpene-bar-header">
      <span className="terpene-name">{name}</span>
      <span className="terpene-pct">{percentage}%</span>
    </div>
    <div className="terpene-track">
      <div className="terpene-fill" style={{ width: `${Math.min(percentage * 10, 100)}%` }} />
    </div>
  </div>
)

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart, toggleWishlist, isInWishlist, token, user, url, openLoginModal } = useContext(StoreContext)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('details')

  // Review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [prodRes, relRes, revRes] = await Promise.all([
          productService.getById(id),
          productService.getRelated(id),
          reviewService.getByProduct(id),
        ])
        if (!isMounted) return
        if (prodRes.data.success) setProduct(prodRes.data.data)
        if (relRes.data.success) setRelated(relRes.data.data)
        if (revRes.data.success) setReviews(revRes.data.data)
      } catch (e) { console.error(e) }
      finally { if (isMounted) setLoading(false) }
    }
    load()
    window.scrollTo(0, 0)
    return () => { isMounted = false }
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product._id)
    toast.success(`${qty}x ${product.name} added to cart`)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!token) { toast.info('Sign in to leave a review'); return }
    setSubmittingReview(true)
    try {
      const res = await reviewService.add(id, reviewForm)
      if (res.data.success) {
        toast.success('Review submitted!')
        setReviews(prev => [res.data.data, ...prev])
        setReviewForm({ rating: 5, title: '', body: '' })
      } else {
        toast.error(res.data.message)
      }
    } catch (e) { toast.error('Error submitting review') }
    finally { setSubmittingReview(false) }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>
  if (!product) return (
    <div className="pd-not-found">
      <h2>Product not found</h2>
      <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  )

  const imgSrc = getImageUrl(product.image, url)
  const displayPrice = product.salePrice || product.price
  const inWishlist = isInWishlist(product._id)

  return (
    <div className="pd-page">
      <div className="page-wrapper">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/shop">Shop</Link><span>/</span>
          <Link to={`/shop/${product.category?.toLowerCase()}`}>{product.category}</Link><span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Main product section */}
        <div className="pd-main">
          {/* Image */}
          <div className="pd-image-col">
            <div className="pd-image-main">
              {imgSrc
                ? <img src={imgSrc} alt={product.name} />
                : <div className="pd-image-placeholder">🌿</div>
              }
              {!product.inStock && (
                <div className="pd-oos-overlay">Out of Stock</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info-col">
            <div className="pd-badges">
              {product.bestSeller && <span className="badge badge-gold">Best Seller</span>}
              {product.newArrival && <span className="badge badge-green">New Arrival</span>}
              {product.featured && <span className="badge badge-green">Featured</span>}
            </div>

            <p className="pd-category">{product.category}</p>
            <h1 className="pd-name">{product.name}</h1>

            {product.strainName && (
              <p className="pd-strain-name">{product.strainName}</p>
            )}

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="pd-rating-row">
                <Stars rating={product.rating} />
                <span className="pd-rating-num">{product.rating}</span>
                <span className="pd-review-count">({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Cannabinoid pills */}
            {(product.thcPercentage > 0 || product.cbdPercentage > 0) && (
              <div className="pd-cannabinoids">
                {product.thcPercentage > 0 && (
                  <div className="pd-cannabinoid thc">
                    <span className="pd-cann-label">THC</span>
                    <span className="pd-cann-value">{product.thcPercentage}%</span>
                  </div>
                )}
                {product.cbdPercentage > 0 && (
                  <div className="pd-cannabinoid cbd">
                    <span className="pd-cann-label">CBD</span>
                    <span className="pd-cann-value">{product.cbdPercentage}%</span>
                  </div>
                )}
                {product.strain && product.strain !== 'n/a' && (
                  <div className={`pd-strain-type strain-${product.strain}`}>
                    {product.strain.charAt(0).toUpperCase() + product.strain.slice(1)}
                  </div>
                )}
              </div>
            )}

            <p className="pd-description">{product.description}</p>

            {/* Effects */}
            {product.effects?.length > 0 && (
              <div className="pd-effects">
                <p className="pd-detail-label">Effects</p>
                <div className="pd-tags">
                  {product.effects.map(e => (
                    <Link key={e} to={`/shop?effects=${e}`} className="pd-tag">{e}</Link>
                  ))}
                </div>
              </div>
            )}

            {/* Flavors */}
            {product.flavors?.length > 0 && (
              <div className="pd-flavors">
                <p className="pd-detail-label">Flavors</p>
                <div className="pd-tags">
                  {product.flavors.map(f => (
                    <span key={f} className="pd-tag pd-tag-gold">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Price + Add */}
            <div className="pd-purchase">
              <div className="pd-price-block">
                <span className="pd-price">${displayPrice.toFixed(2)}</span>
                {product.salePrice && product.salePrice < product.price && (
                  <span className="pd-original-price">${product.price.toFixed(2)}</span>
                )}
                {product.weight && (
                  <span className="pd-weight">{product.weight}</span>
                )}
              </div>

              <div className="pd-add-row">
                <div className="pd-qty">
                  <button className="pd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                  <span className="pd-qty-num">{qty}</span>
                  <button className="pd-qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <button
                  className="btn btn-primary pd-add-btn"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  className={`pd-wishlist-btn ${inWishlist ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product._id)}
                  aria-label="Wishlist"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <div className="pd-delivery-info">
                <span>🚚 Same-day delivery available</span>
                <span>🏪 Free in-store pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs-section">
          <div className="pd-tabs">
            {['details', 'terpenes', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'details' ? 'Product Details' : tab === 'terpenes' ? 'Terpene Profile' : `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'details' && (
              <div className="pd-details-tab fade-in">
                {product.usageRecommendations && (
                  <div className="pd-detail-block">
                    <h4 className="pd-detail-title">Usage Recommendations</h4>
                    <p>{product.usageRecommendations}</p>
                  </div>
                )}
                <div className="pd-detail-grid">
                  {product.brand && (
                    <div className="pd-detail-item">
                      <span className="pd-detail-key">Brand</span>
                      <span className="pd-detail-val">{product.brand}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="pd-detail-item">
                      <span className="pd-detail-key">Net Weight</span>
                      <span className="pd-detail-val">{product.weight}</span>
                    </div>
                  )}
                  {product.strain && product.strain !== 'n/a' && (
                    <div className="pd-detail-item">
                      <span className="pd-detail-key">Strain Type</span>
                      <span className={`pd-detail-val strain-${product.strain}`}>
                        {product.strain.charAt(0).toUpperCase() + product.strain.slice(1)}
                      </span>
                    </div>
                  )}
                  {product.thcPercentage > 0 && (
                    <div className="pd-detail-item">
                      <span className="pd-detail-key">THC Content</span>
                      <span className="pd-detail-val">{product.thcPercentage}%</span>
                    </div>
                  )}
                  {product.cbdPercentage > 0 && (
                    <div className="pd-detail-item">
                      <span className="pd-detail-key">CBD Content</span>
                      <span className="pd-detail-val">{product.cbdPercentage}%</span>
                    </div>
                  )}
                  <div className="pd-detail-item">
                    <span className="pd-detail-key">Category</span>
                    <span className="pd-detail-val">{product.category}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'terpenes' && (
              <div className="pd-terpenes-tab fade-in">
                {product.terpenes?.length > 0 ? (
                  <div className="pd-terpenes-grid">
                    {product.terpenes.map(t => (
                      <TerpeneBar key={t.name} name={t.name} percentage={t.percentage} />
                    ))}
                  </div>
                ) : (
                  <p className="pd-no-data">Terpene data not available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pd-reviews-tab fade-in">
                {/* Write review */}
                <div className="pd-review-form-wrap">
                  <h4>Write a Review</h4>
                  {token ? (
                    <form className="pd-review-form" onSubmit={handleReviewSubmit}>
                      <div className="pd-review-rating">
                        <span className="form-label">Your Rating</span>
                        <Stars
                          rating={reviewForm.rating}
                          interactive
                          onRate={r => setReviewForm(prev => ({ ...prev, rating: r }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                          className="form-input"
                          type="text"
                          placeholder="Summary of your experience"
                          value={reviewForm.title}
                          onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Review</label>
                        <textarea
                          className="form-input pd-review-textarea"
                          placeholder="Share your experience with this product…"
                          value={reviewForm.body}
                          onChange={e => setReviewForm(prev => ({ ...prev, body: e.target.value }))}
                          required rows={4}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                        {submittingReview ? 'Submitting…' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <p className="pd-review-signin">
                      <button
                        type="button"
                        className="pd-review-signin-link"
                        style={{ color: 'var(--green-bright)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}
                        onClick={openLoginModal}
                      >
                        Sign in
                      </button> to leave a review.
                    </p>
                  )}
                </div>

                {/* Review list */}
                {reviews.length > 0 ? (
                  <div className="pd-reviews-list">
                    {reviews.map(r => (
                      <div key={r._id} className="pd-review-item">
                        <div className="pd-review-header">
                          <div className="pd-reviewer-avatar">{r.userName?.charAt(0)}</div>
                          <div className="pd-reviewer-info">
                            <div className="pd-reviewer-row">
                              <span className="pd-reviewer-name">{r.userName}</span>
                              {r.verified && <span className="pd-verified">✓ Verified Purchase</span>}
                            </div>
                            <Stars rating={r.rating} />
                          </div>
                          <span className="pd-review-date">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {r.title && <p className="pd-review-title">{r.title}</p>}
                        <p className="pd-review-body">{r.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="pd-no-data">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="pd-related">
            <div className="section-header">
              <p className="section-eyebrow">You Might Also Like</p>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="grid-4">
              {related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail