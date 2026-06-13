import productModel from '../models/productModel.js'
import fs from 'fs'

// Add product
export const addProduct = async (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: 'Product image required' })
  }
  try {
    const {
      name, description, price, salePrice, category, subcategory,
      strain, strainName, thcPercentage, cbdPercentage,
      effects, flavors, terpenes, usageRecommendations,
      weight, brand, inStock, stockQuantity, featured,
      bestSeller, newArrival, tags
    } = req.body

    const product = new productModel({
      name,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      image: req.file.filename,
      category,
      subcategory,
      strain,
      strainName,
      thcPercentage: thcPercentage ? Number(thcPercentage) : 0,
      cbdPercentage: cbdPercentage ? Number(cbdPercentage) : 0,
      effects: effects ? (Array.isArray(effects) ? effects : effects.split(',').map(e => e.trim())) : [],
      flavors: flavors ? (Array.isArray(flavors) ? flavors : flavors.split(',').map(f => f.trim())) : [],
      terpenes: terpenes ? (typeof terpenes === 'string' ? JSON.parse(terpenes) : terpenes) : [],
      usageRecommendations,
      weight,
      brand,
      inStock: inStock === 'true' || inStock === true,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 100,
      featured: featured === 'true' || featured === true,
      bestSeller: bestSeller === 'true' || bestSeller === true,
      newArrival: newArrival === 'true' || newArrival === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
    })

    await product.save()
    res.json({ success: true, message: 'Product added successfully', data: product })
  } catch (error) {
    console.log(error)
    if (req.file) fs.unlink(`uploads/${req.file.filename}`, () => {})
    res.json({ success: false, message: 'Error adding product' })
  }
}

// List all products with filters
export const listProducts = async (req, res) => {
  try {
    const {
      category, strain, minPrice, maxPrice, minThc, maxThc,
      minCbd, maxCbd, effects, search, sort, featured,
      bestSeller, newArrival, inStock, page = 1, limit = 20
    } = req.query

    const query = {}

    if (category && category !== 'All') query.category = category
    if (strain) query.strain = strain
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (minThc || maxThc) {
      query.thcPercentage = {}
      if (minThc) query.thcPercentage.$gte = Number(minThc)
      if (maxThc) query.thcPercentage.$lte = Number(maxThc)
    }
    if (minCbd || maxCbd) {
      query.cbdPercentage = {}
      if (minCbd) query.cbdPercentage.$gte = Number(minCbd)
      if (maxCbd) query.cbdPercentage.$lte = Number(maxCbd)
    }
    if (effects) {
      const effectsArr = Array.isArray(effects) ? effects : effects.split(',')
      query.effects = { $in: effectsArr }
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { strainName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ]
    }
    if (featured === 'true') query.featured = true
    if (bestSeller === 'true') query.bestSeller = true
    if (newArrival === 'true') query.newArrival = true
    if (inStock === 'true') query.inStock = true

    let sortObj = {}
    switch (sort) {
      case 'price_asc': sortObj = { price: 1 }; break
      case 'price_desc': sortObj = { price: -1 }; break
      case 'rating': sortObj = { rating: -1 }; break
      case 'newest': sortObj = { createdAt: -1 }; break
      case 'popular': sortObj = { reviewCount: -1 }; break
      default: sortObj = { createdAt: -1 }
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await productModel.countDocuments(query)
    const products = await productModel.find(query).sort(sortObj).skip(skip).limit(Number(limit))

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error fetching products' })
  }
}

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) return res.json({ success: false, message: 'Product not found' })
    res.json({ success: true, data: product })
  } catch (error) {
    res.json({ success: false, message: 'Error fetching product' })
  }
}

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body }
    if (req.file) updates.image = req.file.filename
    if (updates.effects && typeof updates.effects === 'string') {
      updates.effects = updates.effects.split(',').map(e => e.trim())
    }
    if (updates.terpenes && typeof updates.terpenes === 'string') {
      updates.terpenes = JSON.parse(updates.terpenes)
    }
    updates.updatedAt = Date.now()

    const product = await productModel.findByIdAndUpdate(req.params.id, updates, { new: true })
    res.json({ success: true, message: 'Product updated', data: product })
  } catch (error) {
    res.json({ success: false, message: 'Error updating product' })
  }
}

// Remove product
export const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id)
    if (!product) return res.json({ success: false, message: 'Product not found' })
    if (product.image) fs.unlink(`uploads/${product.image}`, () => {})
    await productModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: 'Product removed' })
  } catch (error) {
    res.json({ success: false, message: 'Error removing product' })
  }
}

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await productModel.find({ featured: true, inStock: true }).limit(8)
    const bestSellers = await productModel.find({ bestSeller: true, inStock: true }).limit(8)
    const newArrivals = await productModel.find({ newArrival: true, inStock: true }).limit(8)
    res.json({ success: true, data: { featured, bestSellers, newArrivals } })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}

// Get related products
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) return res.json({ success: false, message: 'Product not found' })

    const related = await productModel.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { strain: product.strain },
        { effects: { $in: product.effects } }
      ],
      inStock: true
    }).limit(6)

    res.json({ success: true, data: related })
  } catch (error) {
    res.json({ success: false, message: 'Error' })
  }
}