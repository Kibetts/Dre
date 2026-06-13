import categoryModel from '../models/categoryModel.js'

const DEFAULT_CATEGORIES = [
  { name: 'Flower', slug: 'flower', icon: '🌿', displayOrder: 1 },
  { name: 'Pre-Rolls', slug: 'pre-rolls', icon: '🚬', displayOrder: 2 },
  { name: 'Edibles', slug: 'edibles', icon: '🍫', displayOrder: 3 },
  { name: 'Concentrates', slug: 'concentrates', icon: '💎', displayOrder: 4 },
  { name: 'Vapes', slug: 'vapes', icon: '💨', displayOrder: 5 },
  { name: 'CBD', slug: 'cbd', icon: '🌱', displayOrder: 6 },
  { name: 'Tinctures', slug: 'tinctures', icon: '💊', displayOrder: 7 },
  { name: 'Topicals', slug: 'topicals', icon: '🧴', displayOrder: 8 },
  { name: 'Accessories', slug: 'accessories', icon: '🔧', displayOrder: 9 }
]

export const listCategories = async (req, res) => {
  try {
    let categories = await categoryModel.find({ isActive: true }).sort({ displayOrder: 1 })
    if (categories.length === 0) {
      categories = DEFAULT_CATEGORIES
    }
    res.json({ success: true, data: categories })
  } catch (error) {
    res.json({ success: false, message: 'Error', data: DEFAULT_CATEGORIES })
  }
}

export const addCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, displayOrder } = req.body
    const category = new categoryModel({ name, slug, description, icon, displayOrder })
    await category.save()
    res.json({ success: true, data: category, message: 'Category added' })
  } catch (error) {
    res.json({ success: false, message: 'Error adding category' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: category, message: 'Category updated' })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Category deleted' })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}