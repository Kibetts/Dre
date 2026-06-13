import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'

export const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).populate('wishlist')
    res.json({ success: true, data: user.wishlist })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const user = await userModel.findById(req.body.userId)
    const index = user.wishlist.indexOf(productId)

    if (index === -1) {
      user.wishlist.push(productId)
      await user.save()
      res.json({ success: true, message: 'Added to wishlist', inWishlist: true })
    } else {
      user.wishlist.splice(index, 1)
      await user.save()
      res.json({ success: true, message: 'Removed from wishlist', inWishlist: false })
    }
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}