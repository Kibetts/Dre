import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  icon: { type: String },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 }
})

const categoryModel = mongoose.models.category || mongoose.model('category', categorySchema)

export default categoryModel