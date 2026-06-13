import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import couponModel from '../models/couponModel.js'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

// Place order
export const placeOrder = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  try {
    const { items, address, orderType, couponCode, specialInstructions, scheduledTime } = req.body
    const userId = req.body.userId

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = orderType === 'delivery' ? 9.99 : 0
    const taxRate = 0.0975 // California cannabis tax ~9.75%
    const tax = subtotal * taxRate

    // Apply coupon
    let discount = 0
    if (couponCode) {
      const coupon = await couponModel.findOne({ code: couponCode.toUpperCase(), isActive: true })
      if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (subtotal >= coupon.minimumOrder) {
          if (coupon.discountType === 'percentage') {
            discount = subtotal * (coupon.discountValue / 100)
            if (coupon.maximumDiscount) discount = Math.min(discount, coupon.maximumDiscount)
          } else {
            discount = coupon.discountValue
          }
          coupon.usedCount += 1
          await coupon.save()
        }
      }
    }

    const amount = subtotal + deliveryFee + tax - discount

    const newOrder = new orderModel({
      userId,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee: Math.round(deliveryFee * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      amount: Math.round(amount * 100) / 100,
      address,
      orderType,
      couponCode,
      specialInstructions,
      scheduledTime
    })

    await newOrder.save()
    await userModel.findByIdAndUpdate(userId, { cartData: {} })

    // Stripe payment session
    if (stripe) {
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      }))

      if (deliveryFee > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: { name: 'Delivery Fee' },
            unit_amount: Math.round(deliveryFee * 100)
          },
          quantity: 1
        })
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'California Cannabis Tax' },
          unit_amount: Math.round(tax * 100)
        },
        quantity: 1
      })

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`
      })

      res.json({ success: true, session_url: session.url, orderId: newOrder._id, orderNumber: newOrder.orderNumber })
    } else {
      // Cash/in-person payment
      newOrder.paymentStatus = 'pending'
      await newOrder.save()
      res.json({ success: true, orderId: newOrder._id, orderNumber: newOrder.orderNumber, message: 'Order placed successfully' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error placing order' })
  }
}

// Verify Stripe payment
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body
  try {
    if (success === 'true') {
      const order = await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        status: 'confirmed'
      }, { new: true })

      // Award loyalty points
      if (order) {
        const points = Math.floor(order.amount)
        await userModel.findByIdAndUpdate(order.userId, {
          $inc: { loyaltyPoints: points, totalSpent: order.amount, orderCount: 1 }
        })
      }

      res.json({ success: true, message: 'Payment confirmed' })
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: 'Payment cancelled' })
    }
  } catch (error) {
    res.json({ success: false, message: 'Verification error' })
  }
}

// User's orders
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

// Admin: all orders
export const listOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query
    const query = status ? { status } : {}
    const skip = (Number(page) - 1) * Number(limit)
    const total = await orderModel.countDocuments(query)
    const orders = await orderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
    res.json({ success: true, data: orders, total })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

// Update order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    const order = await orderModel.findByIdAndUpdate(orderId, { status, updatedAt: Date.now() }, { new: true })
    res.json({ success: true, message: 'Order status updated', data: order })
  } catch (error) {
    res.json({ success: false, message: 'Error updating status' })
  }
}

// Admin analytics
export const getOrderAnalytics = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments()
    const pendingOrders = await orderModel.countDocuments({ status: 'pending' })
    const completedOrders = await orderModel.countDocuments({ status: 'delivered' })
    const revenueResult = await orderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    res.json({
      success: true,
      data: { totalOrders, pendingOrders, completedOrders, totalRevenue }
    })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}