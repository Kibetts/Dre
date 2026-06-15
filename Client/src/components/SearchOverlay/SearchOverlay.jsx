import { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './SearchOverlay.css'

const SearchOverlay = ({ onClose }) => {
  const { products, url } = useContext(StoreContext)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const q = query.toLowerCase()
    const filtered = products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.strainName?.toLowerCase().includes(q) ||
      p.effects?.some(e => e.toLowerCase().includes(q))
    ).slice(0, 8)
    setResults(filtered)
  }, [query, products])

  const handleSelect = (productId) => {
    navigate(`/product/${productId}`)
    onClose()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  return (
    <div className="search-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel fade-up">
        <form className="search-form" onSubmit={handleSearch}>
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search strains, products, effects…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="button" className="search-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </form>

        {results.length > 0 && (
          <ul className="search-results">
            {results.map(product => (
              <li key={product._id} className="search-result-item" onClick={() => handleSelect(product._id)}>
                <div className="search-result-img">
                  {product.image
                    ? <img src={`${url}/images/${product.image}`} alt={product.name} />
                    : <span>🌿</span>}
                </div>
                <div className="search-result-info">
                  <p className="search-result-name">{product.name}</p>
                  <p className="search-result-meta">
                    {product.category}
                    {product.thcPercentage > 0 && ` · THC ${product.thcPercentage}%`}
                  </p>
                </div>
                <p className="search-result-price">${product.salePrice || product.price}</p>
              </li>
            ))}
          </ul>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="search-empty">
            <p>No products found for "<strong>{query}</strong>"</p>
            <button className="btn btn-ghost" onClick={() => { navigate(`/shop?search=${query}`); onClose() }}>
              Browse all products
            </button>
          </div>
        )}

        {query.length === 0 && (
          <div className="search-suggestions">
            <p className="search-suggestions-label">Popular searches</p>
            <div className="search-tags">
              {['OG Kush', 'Blue Dream', 'Sativa', 'CBD', 'Edibles', 'Vapes'].map(tag => (
                <button key={tag} className="search-tag" onClick={() => setQuery(tag)}>{tag}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchOverlay