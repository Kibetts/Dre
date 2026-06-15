import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.json({ success: false, message: 'Not authorized. Please sign in.' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = decoded.id
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (error) {
    res.json({ success: false, message: 'Token invalid or expired.' })
  }
}

export const adminMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.json({ success: false, message: 'Not authorized.' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'admin' && decoded.role !== 'budtender') {
      return res.json({ success: false, message: 'Admin access required.' })
    }
    req.body.userId = decoded.id
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (error) {
    res.json({ success: false, message: 'Token invalid or expired.' })
  }
}

export default authMiddleware