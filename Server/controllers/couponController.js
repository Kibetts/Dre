import couponModel from '../models/couponModel.js'

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body
    const coupon = await couponModel.findOne({ code: code.toUpperCase(), isActive: true })

    if (!coupon) return res.json({ success: false, message: 'Invalid coupon code' })
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.json({ success: false, message: 'This coupon has expired' })
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ success: false, message: 'Coupon usage limit reached' })
    }
    if (orderAmount < coupon.minimumOrder) {
      return res.json({
        success: false,
        message: `Minimum order of $${coupon.minimumOrder} required for this coupon`
      })
    }

    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = orderAmount * (coupon.discountValue / 100)
      if (coupon.maximumDiscount) discountAmount = Math.min(discountAmount, coupon.maximumDiscount)
    } else {
      discountAmount = coupon.discountValue
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount * 100) / 100,
        description: coupon.description
      },
      message: `Coupon applied! You save $${discountAmount.toFixed(2)}`
    })
  } catch (error) {
    res.json({ success: false, message: 'Error validating coupon' })
  }
}

export const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: coupons })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

export const addCoupon = async (req, res) => {
  try {
    const coupon = new couponModel(req.body)
    await coupon.save()
    res.json({ success: true, data: coupon, message: 'Coupon created' })
  } catch (error) {
    res.json({ success: false, message: 'Error creating coupon' })
  }
}

export const deleteCoupon = async (req, res) => {
  try {
    await couponModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Coupon deleted' })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}