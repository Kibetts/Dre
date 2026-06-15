import express from 'express'
import { listCategories, addCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js'
import { adminMiddleware } from '../middleware/auth.js'

const categoryRouter = express.Router()
categoryRouter.get('/list', listCategories)
categoryRouter.post('/add', adminMiddleware, addCategory)
categoryRouter.put('/:id', adminMiddleware, updateCategory)
categoryRouter.delete('/:id', adminMiddleware, deleteCategory)

export default categoryRouter