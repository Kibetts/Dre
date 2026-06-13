import reviewModel from '../models/reviewModel.js'
import productModel from '../models/productModel.js'
import orderModel from '../models/orderModel.js'

export const addReview = async (req, res) => {
  try {
    const { productId, rating, title, body } = req.body
    const userId = req.body.userId

    // Check if already reviewed
    const existing = await reviewModel.findOne({ productId, userId })
    if (existing) return res.json({ success: false, message: 'You have already reviewed this product' })

    // Check if verified purchase
    const order = await orderModel.findOne({
      userId,
      'items.productId': productId,
      status: 'delivered'
    })

    const user = await (await import('../models/userModel.js')).default.findById(userId)

    const review = new reviewModel({
      productId,
      userId,
      userName: user.name,
      rating: Number(rating),
      title,
      body,
      verified: !!order
    })

    await review.save()

    // Update product rating
    const reviews = await reviewModel.find({ productId })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await productModel.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    })

    res.json({ success: true, message: 'Review submitted', data: review })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error submitting review' })
  }
}

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ productId: req.params.productId }).sort({ createdAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

export const deleteReview = async (req, res) => {
  try {
    await reviewModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Review deleted' })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}