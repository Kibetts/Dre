import axios from 'axios'
import { createContext, useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

export const StoreContext = createContext(null)

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({})
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [ageVerified, setAgeVerified] = useState(
    () => localStorage.getItem('gl_age_verified') === 'true'
  )

  const url = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'

  const addToCart = async (itemId) => {
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
    if (token) {
      try {
        await axios.post(url + '/api/cart/add', { itemId }, { headers: { token } })
      } catch (e) { console.error(e) }
    }
    toast.success('Added to cart', { autoClose: 1500 })
  }

  const removeFromCart = async (itemId) => {
    setCartItems(prev => {
      const updated = { ...prev }
      if (updated[itemId] > 1) updated[itemId] -= 1
      else delete updated[itemId]
      return updated
    })
    if (token) {
      try {
        await axios.post(url + '/api/cart/remove', { itemId }, { headers: { token } })
      } catch (e) { console.error(e) }
    }
  }

  const clearCart = () => {
    setCartItems({})
    if (token) {
      axios.post(url + '/api/cart/clear', {}, { headers: { token } }).catch(console.error)
    }
  }

  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalCartAmount = () => {
    let total = 0
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = products.find(p => p._id === itemId)
        if (product) {
          const price = product.salePrice || product.price
          total += price * cartItems[itemId]
        }
      }
    }
    return Math.round(total * 100) / 100
  }

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.info('Sign in to save favorites')
      return
    }
    try {
      const res = await axios.post(url + '/api/wishlist/toggle', { productId }, { headers: { token } })
      if (res.data.success) {
        if (res.data.inWishlist) {
          setWishlist(prev => [...prev, productId])
          toast.success('Added to wishlist')
        } else {
          setWishlist(prev => prev.filter(id => id !== productId))
          toast.success('Removed from wishlist')
        }
      }
    } catch (e) { console.error(e) }
  }

  const isInWishlist = (productId) => wishlist.includes(productId)

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const res = await axios.get(`${url}/api/product/list?${queryString}`)
      if (res.data.success) {
        setProducts(res.data.data)
        return res.data
      }
    } catch (e) { console.error(e) }
    return { data: [] }
  }, [url])

  const fetchCategories = async () => {
    try {
      const res = await axios.get(url + '/api/category/list')
      if (res.data.success) setCategories(res.data.data)
    } catch (e) {
      // Use defaults if server unavailable
      setCategories([
        { name: 'Flower', slug: 'flower', icon: '🌿' },
        { name: 'Pre-Rolls', slug: 'pre-rolls', icon: '🚬' },
        { name: 'Edibles', slug: 'edibles', icon: '🍫' },
        { name: 'Concentrates', slug: 'concentrates', icon: '💎' },
        { name: 'Vapes', slug: 'vapes', icon: '💨' },
        { name: 'CBD', slug: 'cbd', icon: '🌱' },
        { name: 'Tinctures', slug: 'tinctures', icon: '💧' },
        { name: 'Topicals', slug: 'topicals', icon: '🧴' },
        { name: 'Accessories', slug: 'accessories', icon: '🔧' }
      ])
    }
  }

  const loadCartData = async (tkn) => {
    try {
      const res = await axios.post(url + '/api/cart/get', {}, { headers: { token: tkn } })
      if (res.data.success) setCartItems(res.data.cartData)
    } catch (e) { console.error(e) }
  }

  const loadWishlist = async (tkn) => {
    try {
      const res = await axios.get(url + '/api/wishlist', { headers: { token: tkn } })
      if (res.data.success) {
        setWishlist(res.data.data.map(p => p._id || p))
      }
    } catch (e) { console.error(e) }
  }

  const login = async (tkn, userData) => {
    setToken(tkn)
    setUser(userData)
    localStorage.setItem('gl_token', tkn)
    localStorage.setItem('gl_user', JSON.stringify(userData))
    await loadCartData(tkn)
    await loadWishlist(tkn)
  }

  const logout = () => {
    setToken('')
    setUser(null)
    setCartItems({})
    setWishlist([])
    localStorage.removeItem('gl_token')
    localStorage.removeItem('gl_user')
  }

  const verifyAge = () => {
    setAgeVerified(true)
    localStorage.setItem('gl_age_verified', 'true')
  }

  useEffect(() => {
    const init = async () => {
      await fetchProducts()
      await fetchCategories()
      const savedToken = localStorage.getItem('gl_token')
      const savedUser = localStorage.getItem('gl_user')
      if (savedToken) {
        setToken(savedToken)
        if (savedUser) setUser(JSON.parse(savedUser))
        await loadCartData(savedToken)
        await loadWishlist(savedToken)
      }
    }
    init()
  }, [])

  return (
    <StoreContext.Provider value={{
      products, categories, cartItems, setCartItems,
      token, user, wishlist,
      addToCart, removeFromCart, clearCart,
      getCartCount, getTotalCartAmount,
      toggleWishlist, isInWishlist,
      fetchProducts, fetchCategories,
      login, logout,
      ageVerified, verifyAge,
      url
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider