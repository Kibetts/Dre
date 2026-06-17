
import { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './AgeGate.css'

const AgeGate = () => {
  const { verifyAge } = useContext(StoreContext)
  const [exiting, setExiting] = useState(false)

  const handleConfirm = () => {
    verifyAge()
  }

  const handleDeny = () => {
    setExiting(true)
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-card fade-up">
        <div className="age-gate-logo">
          <span className="age-gate-leaf">🌿</span>
          <span className="age-gate-brand">GreenLeaf</span>
        </div>

        <div className="age-gate-divider" />

        <h1 className="age-gate-title">Are You 21 or Older?</h1>
        <p className="age-gate-subtitle">
          This website features products intended for adults 21 years of age and older.
          Please verify your age before entering.
        </p>

        <div className="age-gate-legal">
          <p>By entering this site, you confirm that:</p>
          <ul>
            <li>You are at least 21 years of age, or 18+ with a valid medical card</li>
            <li>You will comply with all California cannabis regulations</li>
            <li>You understand cannabis products have not been approved by the FDA</li>
          </ul>
        </div>

        <div className="age-gate-actions">
          <button className="btn btn-primary age-gate-yes" onClick={handleConfirm} disabled={exiting}>
            I am 21+ — Enter Site
          </button>
          <button className="btn btn-ghost age-gate-no" onClick={handleDeny} disabled={exiting}>
            I am under 21 — Exit
          </button>
        </div>

        <p className="age-gate-disclaimer">
          GreenLeaf Dispensary is a licensed California cannabis retailer. CA License #C10-0000123-LIC.
          Keep all cannabis products out of reach of children and pets.
        </p>
      </div>
    </div>
  )
}

export default AgeGate
