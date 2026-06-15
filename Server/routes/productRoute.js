import express from 'express'
import multer from 'multer'
import path from 'path'
import { addProduct, listProducts, getProduct, updateProduct, removeProduct, getFeaturedProducts, getRelatedProducts } from '../controllers/productController.js'
import authMiddleware, { adminMiddleware } from '../middleware/auth.js'

const productRouter = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase()
    cb(null, `${Date.now()}_${sanitized}`)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Images only'), false)
  },
  limits: { fileSize: 10 * 1024 * 1024 }
})

productRouter.post('/add', adminMiddleware, upload.single('image'), addProduct)
productRouter.get('/list', listProducts)
productRouter.get('/featured', getFeaturedProducts)
productRouter.get('/:id/related', getRelatedProducts)
productRouter.get('/:id', getProduct)
productRouter.put('/:id', adminMiddleware, upload.single('image'), updateProduct)
productRouter.post('/remove', adminMiddleware, removeProduct)

export default productRouter