import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String },
  weight: { type: String }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  address: { type: Object },
  orderType: { type: String, enum: ['delivery', 'pickup'], default: 'pickup' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { type: String, default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  stripeSessionId: { type: String },
  couponCode: { type: String },
  specialInstructions: { type: String },
  scheduledTime: { type: Date },
  estimatedDeliveryTime: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('order').countDocuments()
    this.orderNumber = `GL-${String(count + 1001).padStart(5, '0')}`
  }
  this.updatedAt = Date.now()
  next()
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel