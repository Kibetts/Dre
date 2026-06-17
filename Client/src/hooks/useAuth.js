// client/src/hooks/useAuth.js
// Encapsulates authentication logic.
// Use this inside components that need to trigger login/logout/register
// independently of StoreContext (e.g. in a standalone modal).

import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { StoreContext } from '../context/StoreContext.jsx'
import userService from '../services/userService.js'

/**
 * @returns {{ user, token, loading, login, logout, register }}
 */
const useAuth = () => {
  const { user, token, login, logout } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)

  /**
   * Log in with email + password.
   * @returns {boolean} true on success
   */
  const handleLogin = async (email, password) => {
    setLoading(true)
    try {
      const res = await userService.login(email, password)
      if (res.data.success) {
        await login(res.data.token, res.data.user)
        toast.success('Welcome back!')
        return true
      } else {
        toast.error(res.data.message)
        return false
      }
    } catch {
      toast.error('Connection error. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Register a new account.
   * @param {{ name, email, password, dateOfBirth, newsletterSubscribed }} data
   * @returns {boolean} true on success
   */
  const handleRegister = async (data) => {
    setLoading(true)
    try {
      const res = await userService.register(data)
      if (res.data.success) {
        await login(res.data.token, res.data.user)
        toast.success('Account created! Welcome to GreenLeaf.')
        return true
      } else {
        toast.error(res.data.message)
        return false
      }
    } catch {
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Signed out.')
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  }
}

export default useAuth