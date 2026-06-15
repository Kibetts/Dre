import express from 'express'
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getOrderAnalytics } from '../controllers/orderController.js'
import authMiddleware, { adminMiddleware } from '../middleware/auth.js'

const orderRouter = express.Router()

orderRouter.post('/place', authMiddleware, placeOrder)
orderRouter.post('/verify', verifyOrder)
orderRouter.post('/userorders', authMiddleware, userOrders)
orderRouter.get('/list', adminMiddleware, listOrders)
orderRouter.post('/status', adminMiddleware, updateStatus)
orderRouter.get('/analytics', adminMiddleware, getOrderAnalytics)

export default orderRouter