import { useContext, useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import productService from '../../services/productService.js'
import { SORT_OPTIONS, STRAIN_TYPES as STRAINS, EFFECTS_LIST } from '../../utils/constants.js'
import './Shop.css'

const Shop = () => {
  const { category: categoryParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories } = useContext(StoreContext)

  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    category: categoryParam || searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    strain: searchParams.get('strain') || '',
    effects: searchParams.get('effects') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minThc: searchParams.get('minThc') || '',
    maxThc: searchParams.get('maxThc') || '',
    sort: searchParams.get('sort') || 'newest',
    featured: searchParams.get('featured') || '',
    bestSeller: searchParams.get('bestSeller') || '',
    newArrival: searchParams.get('newArrival') || '',
    page: 1,
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      const res = await productService.getAll(params)
      if (res.data.success) {
        setProducts(res.data.data)
        setPagination(res.data.pagination || {})
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam, page: 1 }))
    }
  }, [categoryParam])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      category: '', search: '', strain: '', effects: '',
      minPrice: '', maxPrice: '', minThc: '', maxThc: '',
      sort: 'newest', featured: '', bestSeller: '', newArrival: '', page: 1
    })
  }

  const activeFilterCount = [
    filters.strain, filters.effects, filters.minPrice, filters.maxPrice,
    filters.minThc, filters.maxThc, filters.featured, filters.bestSeller, filters.newArrival
  ].filter(Boolean).length

  const pageTitle = filters.category
    ? categories.find(c => c.slug === filters.category || c.name.toLowerCase() === filters.category)?.name || filters.category
    : filters.search ? `Search: "${filters.search}"` : 'All Products'

  return (
    <div className="shop-page">
      <div className="page-wrapper">
        {/* Breadcrumb */}
        <div className="shop-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          {filters.category && (
            <>
              <span>/</span>
              <span className="shop-breadcrumb-current">{pageTitle}</span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="shop-header">
          <div>
            <p className="section-eyebrow">GreenLeaf Catalog</p>
            <h1 className="shop-title">{pageTitle}</h1>
            {!loading && (
              <p className="shop-count">{pagination.total || products.length} products</p>
            )}
          </div>
          <div className="shop-header-actions">
            <button
              className={`btn btn-secondary shop-filter-toggle ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
              {activeFilterCount > 0 && <span className="shop-filter-count">{activeFilterCount}</span>}
            </button>
            <select
              className="form-input shop-sort"
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="shop-cat-pills">
          <button
            className={`shop-cat-pill ${!filters.category ? 'active' : ''}`}
            onClick={() => updateFilter('category', '')}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat.slug || cat.name}
              className={`shop-cat-pill ${filters.category === (cat.slug || cat.name.toLowerCase()) ? 'active' : ''}`}
              onClick={() => updateFilter('category', cat.slug || cat.name.toLowerCase())}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className={`shop-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="shop-sidebar-header">
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button className="shop-clear-btn" onClick={clearFilters}>Clear all</button>
              )}
            </div>

            {/* Search */}
            <div className="shop-filter-section">
              <label className="shop-filter-label">Search</label>
              <div className="shop-search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  className="form-input shop-search-input"
                  type="text"
                  placeholder="Search products…"
                  value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                />
              </div>
            </div>

            {/* Strain Type */}
            <div className="shop-filter-section">
              <label className="shop-filter-label">Strain Type</label>
              <div className="shop-radio-group">
                <label className="shop-radio">
                  <input type="radio" name="strain" value="" checked={!filters.strain} onChange={() => updateFilter('strain', '')} />
                  <span>Any</span>
                </label>
                {STRAINS.map(s => (
                  <label key={s.value} className="shop-radio">
                    <input type="radio" name="strain" value={s.value} checked={filters.strain === s.value} onChange={() => updateFilter('strain', s.value)} />
                    <span className={`strain-${s.value}`}>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="shop-filter-section">
              <label className="shop-filter-label">Price Range</label>
              <div className="shop-range-inputs">
                <input className="form-input" type="number" placeholder="Min $" value={filters.minPrice}
                  onChange={e => updateFilter('minPrice', e.target.value)} min="0" />
                <span className="shop-range-sep">–</span>
                <input className="form-input" type="number" placeholder="Max $" value={filters.maxPrice}
                  onChange={e => updateFilter('maxPrice', e.target.value)} min="0" />
              </div>
            </div>

            {/* THC Range */}
            <div className="shop-filter-section">
              <label className="shop-filter-label">THC % Range</label>
              <div className="shop-range-inputs">
                <input className="form-input" type="number" placeholder="Min" value={filters.minThc}
                  onChange={e => updateFilter('minThc', e.target.value)} min="0" max="100" />
                <span className="shop-range-sep">–</span>
                <input className="form-input" type="number" placeholder="Max" value={filters.maxThc}
                  onChange={e => updateFilter('maxThc', e.target.value)} min="0" max="100" />
              </div>
            </div>

            {/* Effects */}
            <div className="shop-filter-section">
              <label className="shop-filter-label">Effects</label>
              <div className="shop-effects-list">
                {EFFECTS_LIST.map(effect => (
                  <label key={effect} className="shop-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.effects === effect}
                      onChange={() => updateFilter('effects', filters.effects === effect ? '' : effect)}
                    />
                    <span>{effect}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Specials */}
            <div className="shop-filter-section">
              <label className="shop-filter-label">Specials</label>
              <div className="shop-checkbox-group">
                {[
                  { key: 'featured', label: 'Featured' },
                  { key: 'bestSeller', label: 'Best Sellers' },
                  { key: 'newArrival', label: 'New Arrivals' },
                ].map(({ key, label }) => (
                  <label key={key} className="shop-checkbox">
                    <input
                      type="checkbox"
                      checked={filters[key] === 'true'}
                      onChange={() => updateFilter(key, filters[key] === 'true' ? '' : 'true')}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="shop-main">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div className="shop-empty">
                <span className="shop-empty-icon">🌿</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="shop-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="shop-pagination">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`shop-page-btn ${filters.page === p ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Shop