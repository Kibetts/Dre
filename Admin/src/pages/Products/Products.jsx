import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Products.css'

const Products = ({ url, token }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  const CATEGORIES = ['All', 'Flower', 'Pre-Rolls', 'Edibles', 'Concentrates', 'Vapes', 'CBD', 'Tinctures', 'Topicals', 'Accessories']

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category && category !== 'All') params.category = category
      params.limit = 100
      const res = await axios.get(`${url}/api/product/list`, { params })
      if (res.data.success) setProducts(res.data.data)
    } catch (e) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [search, category])

  const handleDelete = async (id) => {
    try {
      const res = await axios.post(`${url}/api/product/remove`, { id }, { headers: { token } })
      if (res.data.success) {
        toast.success('Product removed')
        setProducts(prev => prev.filter(p => p._id !== id))
        setDeleteId(null)
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error('Error removing product')
    }
  }

  const toggleStock = async (product) => {
    try {
      const res = await axios.put(
        `${url}/api/product/${product._id}`,
        { inStock: !product.inStock },
        { headers: { token } }
      )
      if (res.data.success) {
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, inStock: !p.inStock } : p))
        toast.success(`${product.name} marked as ${!product.inStock ? 'In Stock' : 'Out of Stock'}`)
      }
    } catch (e) {
      toast.error('Error updating stock')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.strainName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="products-page fade-up">
      {/* Confirm delete modal */}
      {deleteId && (
        <div className="delete-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone. The product will be permanently removed.</p>
            <div className="delete-modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/products/add')}>
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="products-filters admin-card">
        <div className="products-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="products-search-icon">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="form-input products-search"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="products-cat-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`products-cat-pill ${(category || 'All') === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-empty">
            <span>🌿</span>
            <p>No products found</p>
            <button className="btn btn-primary" onClick={() => navigate('/products/add')}>Add First Product</button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Strain</th>
                <th>THC</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Badges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const imgSrc = product.image ? `${url}/images/${product.image}` : null
                const displayPrice = product.salePrice || product.price
                return (
                  <tr key={product._id}>
                    <td>
                      <div className="products-product-cell">
                        <div className="products-img">
                          {imgSrc
                            ? <img src={imgSrc} alt={product.name} />
                            : <span>🌿</span>}
                        </div>
                        <div>
                          <p className="products-name">{product.name}</p>
                          {product.strainName && (
                            <p className="products-strain-name">{product.strainName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="products-category-pill">{product.category}</span>
                    </td>
                    <td>
                      {product.strain && product.strain !== 'n/a' ? (
                        <span className={`products-strain-type strain-${product.strain}`}>
                          {product.strain.charAt(0).toUpperCase() + product.strain.slice(1)}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      {product.thcPercentage > 0
                        ? <span className="products-thc">{product.thcPercentage}%</span>
                        : '—'}
                    </td>
                    <td>
                      <div className="products-price-cell">
                        <span className="products-price">${displayPrice?.toFixed(2)}</span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span className="products-original">${product.price?.toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className={`products-stock-btn ${product.inStock ? 'in-stock' : 'out-stock'}`}
                        onClick={() => toggleStock(product)}
                        title="Click to toggle stock status"
                      >
                        {product.inStock ? '● In Stock' : '○ Out of Stock'}
                      </button>
                    </td>
                    <td>
                      {product.reviewCount > 0 ? (
                        <span className="products-rating">
                          ★ {product.rating} <span className="products-review-count">({product.reviewCount})</span>
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      <div className="products-badges">
                        {product.featured && <span className="products-badge products-badge-gold">★</span>}
                        {product.bestSeller && <span className="products-badge products-badge-green">🔥</span>}
                        {product.newArrival && <span className="products-badge products-badge-blue">New</span>}
                      </div>
                    </td>
                    <td>
                      <div className="products-actions">
                        <button
                          className="products-action-btn products-edit-btn"
                          onClick={() => navigate(`/products/edit/${product._id}`)}
                          title="Edit product"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Edit
                        </button>
                        <button
                          className="products-action-btn products-delete-btn"
                          onClick={() => setDeleteId(product._id)}
                          title="Delete product"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Products