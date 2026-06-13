import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  body: { type: String, required: true },
  verified: { type: Boolean, default: false }, // verified purchase
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true })

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema)

export default reviewModel