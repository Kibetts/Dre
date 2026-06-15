import express from 'express'
import { addReview, getProductReviews, deleteReview } from '../controllers/reviewController.js'
import authMiddleware, { adminMiddleware } from '../middleware/auth.js'

const reviewRouter = express.Router()
reviewRouter.post('/add', authMiddleware, addReview)
reviewRouter.get('/product/:productId', getProductReviews)
reviewRouter.delete('/:id', adminMiddleware, deleteReview)

export default reviewRouter