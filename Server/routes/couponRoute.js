import express from 'express'
import { validateCoupon, listCoupons, addCoupon, deleteCoupon } from '../controllers/couponController.js'
import authMiddleware, { adminMiddleware } from '../middleware/auth.js'

const couponRouter = express.Router()
couponRouter.post('/validate', authMiddleware, validateCoupon)
couponRouter.get('/list', adminMiddleware, listCoupons)
couponRouter.post('/add', adminMiddleware, addCoupon)
couponRouter.delete('/:id', adminMiddleware, deleteCoupon)

export default couponRouter