import express from 'express'
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js'
import authMiddleware from '../middleware/auth.js'

const wishlistRouter = express.Router()
wishlistRouter.get('/', authMiddleware, getWishlist)
wishlistRouter.post('/toggle', authMiddleware, toggleWishlist)

export default wishlistRouter