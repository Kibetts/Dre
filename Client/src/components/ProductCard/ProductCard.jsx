import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './ProductCard.css'

const Stars = ({ rating }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`star ${n <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  )
}

const StrainBadge = ({ strain }) => {
  if (!strain || strain === 'n/a') return null
  const labels = { indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybrid', cbd: 'CBD' }
  return (
    <span className={`product-strain-badge strain-${strain}`}>
      {labels[strain] || strain}
    </span>
  )
}

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, url } = useContext(StoreContext)

  const imgSrc = product.image
    ? `${url}/images/${product.image}`
    : null

  const inWishlist = isInWishlist(product._id)
  const displayPrice = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price

  return (
    <div className="product-card card fade-up">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="product-card-img-wrap">
        {imgSrc
          ? <img src={imgSrc} alt={product.name} className="product-card-img" loading="lazy" />
          : <div className="product-card-img-placeholder">🌿</div>
        }
        {/* Badges */}
        <div className="product-card-badges">
          {product.bestSeller && <span className="badge badge-gold">Best Seller</span>}
          {product.newArrival && <span className="badge badge-green">New</span>}
          {hasDiscount && (
            <span className="badge badge-red">
              -{Math.round((1 - product.salePrice / product.price) * 100)}%
            </span>
          )}
          {!product.inStock && <span className="badge product-card-oos">Out of Stock</span>}
        </div>
        {/* Wishlist */}
        <button
          className={`product-card-wishlist ${inWishlist ? 'active' : ''}`}
          onClick={e => { e.preventDefault(); toggleWishlist(product._id) }}
          aria-label="Add to wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-card-category">{product.category}</span>
          <StrainBadge strain={product.strain} />
        </div>

        <Link to={`/product/${product._id}`} className="product-card-name">
          {product.name}
        </Link>

        {/* THC/CBD row */}
        {(product.thcPercentage > 0 || product.cbdPercentage > 0) && (
          <div className="product-card-cannabinoids">
            {product.thcPercentage > 0 && (
              <div className="cannabinoid-pill thc">
                <span className="cannabinoid-label">THC</span>
                <span className="cannabinoid-value">{product.thcPercentage}%</span>
              </div>
            )}
            {product.cbdPercentage > 0 && (
              <div className="cannabinoid-pill cbd">
                <span className="cannabinoid-label">CBD</span>
                <span className="cannabinoid-value">{product.cbdPercentage}%</span>
              </div>
            )}
            {product.weight && (
              <span className="product-card-weight">{product.weight}</span>
            )}
          </div>
        )}

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="product-card-rating">
            <Stars rating={product.rating} />
            <span className="product-card-review-count">({product.reviewCount})</span>
          </div>
        )}

        {/* Price + Add */}
        <div className="product-card-footer">
          <div className="product-card-price-wrap">
            <span className="product-card-price">${displayPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="product-card-original">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            className="product-card-add btn btn-primary"
            onClick={() => addToCart(product._id)}
            disabled={!product.inStock}
          >
            {product.inStock ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add
              </>
            ) : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard