import mongoose from 'mongoose'

const terpeneSchema = new mongoose.Schema({
  name: { type: String },
  percentage: { type: Number },
  description: { type: String }
}, { _id: false })

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: null },
  image: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  subcategory: { type: String },
  strain: { type: String }, // indica, sativa, hybrid, cbd, n/a
  strainName: { type: String },
  thcPercentage: { type: Number, default: 0 },
  cbdPercentage: { type: Number, default: 0 },
  terpenes: [terpeneSchema],
  effects: [{ type: String }],
  flavors: [{ type: String }],
  usageRecommendations: { type: String },
  weight: { type: String }, // e.g. "3.5g", "1g"
  brand: { type: String },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 100 },
  lowStockThreshold: { type: Number, default: 10 },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  ageVerificationRequired: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

productSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema)

export default productModel