import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, addAddress, listUsers, getAnalytics } from '../controllers/userController.js'
import authMiddleware, { adminMiddleware } from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', authMiddleware, getProfile)
userRouter.put('/profile', authMiddleware, updateProfile)
userRouter.post('/address', authMiddleware, addAddress)
userRouter.get('/list', adminMiddleware, listUsers)
userRouter.get('/analytics', adminMiddleware, getAnalytics)

export default userRouter