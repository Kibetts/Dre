import userModel from '../models/userModel.js'

export const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body
    const user = await userModel.findById(req.body.userId)
    const cartData = user.cartData || {}

    cartData[itemId] = (cartData[itemId] || 0) + 1
    await userModel.findByIdAndUpdate(req.body.userId, { cartData })
    res.json({ success: true, message: 'Added to cart' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body
    const user = await userModel.findById(req.body.userId)
    const cartData = user.cartData || {}

    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1
    } else {
      delete cartData[itemId]
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData })
    res.json({ success: true, message: 'Removed from cart' })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

export const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId)
    res.json({ success: true, cartData: user.cartData || {} })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

export const clearCart = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} })
    res.json({ success: true, message: 'Cart cleared' })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}