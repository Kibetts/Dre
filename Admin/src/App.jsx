import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard/Dashboard'
import Products from './pages/Products/Products'
import AddProduct from './pages/AddProduct/AddProduct'
import Orders from './pages/Orders/Orders'
import Customers from './pages/Customers/Customers'
import Coupons from './pages/Coupons/Coupons'
import AdminLogin from './pages/AdminLogin/AdminLogin'

const url = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('gl_admin_token') || '')

  useEffect(() => {
    if (token) localStorage.setItem('gl_admin_token', token)
    else localStorage.removeItem('gl_admin_token')
  }, [token])

  const logout = () => {
    setToken('')
    localStorage.removeItem('gl_admin_token')
  }

  if (!token) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        <AdminLogin url={url} onLogin={setToken} />
      </>
    )
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <div className="admin-layout">
        <Sidebar onLogout={logout} />
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Dashboard url={url} token={token} />} />
            <Route path="/products" element={<Products url={url} token={token} />} />
            <Route path="/products/add" element={<AddProduct url={url} token={token} />} />
            <Route path="/products/edit/:id" element={<AddProduct url={url} token={token} editMode />} />
            <Route path="/orders" element={<Orders url={url} token={token} />} />
            <Route path="/customers" element={<Customers url={url} token={token} />} />
            <Route path="/coupons" element={<Coupons url={url} token={token} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App