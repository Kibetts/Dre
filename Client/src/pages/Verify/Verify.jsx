// ============================================================
// FILE: client/src/pages/Verify/Verify.jsx
// ============================================================
import { useEffect, useContext } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')
  const { url, clearCart } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(`${url}/api/order/verify`, { success, orderId })
        if (res.data.success) {
          clearCart()
          setTimeout(() => navigate('/orders'), 3000)
        } else {
          setTimeout(() => navigate('/cart'), 3000)
        }
      } catch (e) {
        setTimeout(() => navigate('/'), 3000)
      }
    }
    if (orderId) verify()
  }, [orderId, success])

  const isSuccess = success === 'true'

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isSuccess ? 'var(--border-green)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-2xl)',
        textAlign: 'center',
        maxWidth: 480,
        width: '100%',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>
          {isSuccess ? '✅' : '❌'}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
          {isSuccess ? 'Order Confirmed!' : 'Payment Cancelled'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
          {isSuccess
            ? 'Your order has been placed successfully. You\'ll receive a confirmation shortly. Redirecting to your orders…'
            : 'Your payment was not completed. Redirecting to your cart…'
          }
        </p>
        {isSuccess ? (
          <Link to="/orders" className="btn btn-primary" style={{ padding: '12px 28px' }}>View My Orders</Link>
        ) : (
          <Link to="/cart" className="btn btn-secondary" style={{ padding: '12px 28px' }}>Back to Cart</Link>
        )}
      </div>
    </div>
  )
}

export default Verify