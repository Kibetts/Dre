import { Route, Routes, useLocation } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { StoreContext } from './context/StoreContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import AgeGate from './components/AgeGate/AgeGate'
import Home from './pages/Home/Home'
import Shop from './pages/Shop/Shop'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Profile from './pages/Profile/Profile'
import Wishlist from './pages/Wishlist/Wishlist'
import FloatingCart from './components/FloatingCart/FloatingCart'

const App = () => {
  const { ageVerified } = useContext(StoreContext)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  if (!ageVerified) {
    return <AgeGate />
  }

  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
      <Footer />
      <FloatingCart />
    </div>
  )
}

export default App