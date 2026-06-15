import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Wishlist.css'

const Wishlist = () => {
  const { token, url } = useContext(StoreContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    const fetch = async () => {
      try {
        const res = await axios.get(`${url}/api/wishlist`, { headers: { token } })
        if (res.data.success) setItems(res.data.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [token, url])

  if (!token) return (
    <div className="wishlist-page">
      <div className="page-wrapper">
        <div className="wishlist-empty">
          <span>❤️</span>
          <h2>Sign in to view your wishlist</h2>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="wishlist-page">
      <div className="page-wrapper">
        <div className="wishlist-header">
          <p className="section-eyebrow">Saved For Later</p>
          <h1 className="wishlist-title">My Wishlist</h1>
          {!loading && <p className="wishlist-count">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>}
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="wishlist-empty">
            <span>🌿</span>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products to come back to them later.</p>
            <Link to="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid-4">
            {items.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist