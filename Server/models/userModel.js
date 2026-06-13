import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  firstName: { type: String },
  lastName: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String, default: 'USA' },
  phone: { type: String },
  isDefault: { type: Boolean, default: false }
}, { _id: true })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  ageVerified: { type: Boolean, default: false },
  medicalCard: { type: String }, // medical card number
  medicalCardExpiry: { type: Date },
  role: { type: String, enum: ['customer', 'admin', 'budtender'], default: 'customer' },
  addresses: [addressSchema],
  cartData: { type: Object, default: {} },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
  loyaltyPoints: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  newsletterSubscribed: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel