import express from 'express'
import cors from 'cors'
import { ConnectDB } from './config/db.js'
import productRouter from './routes/productRoute.js'
import userRouter from './routes/userRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import couponRouter from './routes/couponRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 4000

// Middleware
app.use(express.json())
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))

// DB Connection
ConnectDB()

// Static uploads
app.use('/images', express.static(path.join(__dirname, 'uploads')))

// API Routes
app.use('/api/product', productRouter)
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)
app.use('/api/category', categoryRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/wishlist', wishlistRouter)

app.get('/', (req, res) => {
  res.json({ message: 'GreenLeaf Dispensary API - Running', status: 'ok' })
})

app.listen(port, () => {
  console.log(`GreenLeaf Server running on http://localhost:${port}`)
})