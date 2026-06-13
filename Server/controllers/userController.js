import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, dateOfBirth, newsletterSubscribed } = req.body
  try {
    const exists = await userModel.findOne({ email })
    if (exists) return res.json({ success: false, message: 'An account with this email already exists' })

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email address' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' })
    }

    // Age verification - must be 21+ for California
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const m = today.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
      if (age < 21) {
        return res.json({ success: false, message: 'You must be 21 or older to register' })
      }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      ageVerified: !!dateOfBirth,
      newsletterSubscribed: newsletterSubscribed || false
    })

    await user.save()
    const token = createToken(user._id, user.role)
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Registration failed. Please try again.' })
  }
}

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'No account found with this email' })
    if (!user.isActive) return res.json({ success: false, message: 'Account suspended. Contact support.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.json({ success: false, message: 'Incorrect password' })

    user.lastLogin = new Date()
    await user.save()

    const token = createToken(user._id, user.role)
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, loyaltyPoints: user.loyaltyPoints }
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Login failed. Please try again.' })
  }
}

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password')
    if (!user) return res.json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (error) {
    res.json({ success: false, message: 'Error fetching profile' })
  }
}

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, newsletterSubscribed } = req.body
    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      { name, phone, newsletterSubscribed },
      { new: true }
    ).select('-password')
    res.json({ success: true, data: user, message: 'Profile updated' })
  } catch (error) {
    res.json({ success: false, message: 'Error updating profile' })
  }
}

// Add address
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body
    const user = await userModel.findById(req.body.userId)
    if (address.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false })
    }
    user.addresses.push(address)
    await user.save()
    res.json({ success: true, data: user.addresses, message: 'Address added' })
  } catch (error) {
    res.json({ success: false, message: 'Error adding address' })
  }
}

// Admin: list all users
export const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password').sort({ createdAt: -1 })
    res.json({ success: true, data: users })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

// Admin: get analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments()
    const activeUsers = await userModel.countDocuments({ isActive: true })
    res.json({ success: true, data: { totalUsers, activeUsers } })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}