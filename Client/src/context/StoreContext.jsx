import { createContext, useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api.js'
import productService from '../services/productService.js'
import wishlistService, { categoryService } from '../services/wishlistService.js'
import userService from '../services/userService.js'
import { STORAGE_KEYS } from '../utils/constants.js'
import { getCartTotal } from '../utils/helpers.js'

export const StoreContext = createContext(null)

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({})
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [ageVerified, setAgeVerified] = useState(
    () => localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED) === 'true'
  )
  const [showLoginModal, setShowLoginModal] = useState(false)
  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  const url = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'

  const addToCart = async (itemId) => {
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
    if (token) {
      try {
        await api.post('/api/cart/add', { itemId })
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
        await api.post('/api/cart/remove', { itemId })
      } catch (e) { console.error(e) }
    }
  }

  const clearCart = () => {
    setCartItems({})
    if (token) {
      api.post('/api/cart/clear', {}).catch(console.error)
    }
  }

  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalCartAmount = () => getCartTotal(cartItems, products)

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.info('Sign in to save favorites')
      return
    }
    try {
      const res = await wishlistService.toggle(productId)
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
      const res = await productService.getAll(params)
      if (res.data.success) {
        setProducts(res.data.data)
        return res.data
      }
    } catch (e) { console.error(e) }
    return { data: [] }
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll()
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

  const loadCartData = async () => {
    try {
      const res = await api.post('/api/cart/get', {})
      if (res.data.success) setCartItems(res.data.cartData)
    } catch (e) { console.error(e) }
  }

  const loadWishlist = async () => {
    try {
      const res = await wishlistService.get()
      if (res.data.success) {
        setWishlist(res.data.data.map(p => p._id || p))
      }
    } catch (e) { console.error(e) }
  }

  const login = async (tkn, userData) => {
    setToken(tkn)
    setUser(userData)
    localStorage.setItem(STORAGE_KEYS.TOKEN, tkn)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    await loadCartData()
    await loadWishlist()
  }

  const logout = () => {
    setToken('')
    setUser(null)
    setCartItems({})
    setWishlist([])
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  const verifyAge = () => {
    setAgeVerified(true)
    localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, 'true')
  }

  useEffect(() => {
    const init = async () => {
      await fetchProducts()
      await fetchCategories()
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
      if (savedToken) {
        setToken(savedToken)
        if (savedUser) setUser(JSON.parse(savedUser))
        await loadCartData()
        await loadWishlist()
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      showLoginModal, openLoginModal, closeLoginModal,
      url
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider