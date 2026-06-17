import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import adminServices from '../../services/adminServices.js'
import { getImageUrl } from '../../utils/adminUtils.js'
import './AddProduct.css'

const CATEGORIES = ['Flower', 'Pre-Rolls', 'Edibles', 'Concentrates', 'Vapes', 'CBD', 'Tinctures', 'Topicals', 'Accessories']
const STRAINS = ['indica', 'sativa', 'hybrid', 'cbd', 'n/a']
const EFFECTS_LIST = ['Relaxed', 'Happy', 'Euphoric', 'Creative', 'Focused', 'Sleepy', 'Energetic', 'Uplifted', 'Hungry', 'Talkative']

const defaultForm = {
  name: '', description: '', price: '', salePrice: '',
  category: 'Flower', subcategory: '', strain: 'hybrid', strainName: '',
  thcPercentage: '', cbdPercentage: '',
  effects: [], flavors: '', weight: '', brand: '',
  usageRecommendations: '',
  inStock: true, stockQuantity: '100',
  featured: false, bestSeller: false, newArrival: false,
  tags: '',
}

const AddProduct = ({ url, editMode = false }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [terpenes, setTerpenes] = useState([])

  useEffect(() => {
    if (!editMode || !id) return
    let isMounted = true
    const loadProduct = async () => {
      try {
        const res = await adminServices.products.getById(id)
        if (!isMounted) return
        if (res.data.success) {
          const p = res.data.data
          setForm({
            name: p.name || '', description: p.description || '',
            price: p.price || '', salePrice: p.salePrice || '',
            category: p.category || 'Flower', subcategory: p.subcategory || '',
            strain: p.strain || 'hybrid', strainName: p.strainName || '',
            thcPercentage: p.thcPercentage || '', cbdPercentage: p.cbdPercentage || '',
            effects: p.effects || [], flavors: p.flavors?.join(', ') || '',
            weight: p.weight || '', brand: p.brand || '',
            usageRecommendations: p.usageRecommendations || '',
            inStock: p.inStock ?? true, stockQuantity: p.stockQuantity || '100',
            featured: p.featured || false, bestSeller: p.bestSeller || false,
            newArrival: p.newArrival || false,
            tags: p.tags?.join(', ') || '',
          })
          if (p.terpenes) setTerpenes(p.terpenes)
          if (p.image) setImagePreview(getImageUrl(p.image, url))
        }
      } catch (e) {
        toast.error('Failed to load product')
      }
    }
    loadProduct()
    return () => { isMounted = false }
  }, [editMode, id, url])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const toggleEffect = effect => {
    setForm(prev => ({
      ...prev,
      effects: prev.effects.includes(effect)
        ? prev.effects.filter(e => e !== effect)
        : [...prev.effects, effect]
    }))
  }

  const addTerpene = () => {
    setTerpenes(prev => [...prev, { name: '', percentage: '' }])
  }

  const updateTerpene = (idx, field, value) => {
    setTerpenes(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t))
  }

  const removeTerpene = idx => {
    setTerpenes(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!editMode && !image) { toast.error('Please upload a product image'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      if (image) formData.append('image', image)
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          formData.append(k, v.join(','))
        } else {
          formData.append(k, v)
        }
      })
      if (terpenes.length > 0) {
        formData.append('terpenes', JSON.stringify(terpenes.filter(t => t.name)))
      }

      const res = editMode
        ? await adminServices.products.update(id, formData)
        : await adminServices.products.add(formData)

      if (res.data.success) {
        toast.success(editMode ? 'Product updated!' : 'Product added!')
        navigate('/products')
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Error saving product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-product fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{editMode ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="admin-page-sub">{editMode ? 'Update product details' : 'Add a cannabis product to your catalog'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>
          ← Back to Products
        </button>
      </div>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="add-product-layout">
          {/* Left column */}
          <div className="add-product-main">
            {/* Basic Info */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Basic Information</h3>
              <div className="add-section-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Blue Dream Premium Flower" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Detailed product description…" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input className="form-input" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. GreenLeaf Reserve" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Net Weight</label>
                    <input className="form-input" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 3.5g, 1oz, 10 pieces" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Usage Recommendations</label>
                  <textarea className="form-input" name="usageRecommendations" value={form.usageRecommendations} onChange={handleChange} rows={2} placeholder="How to use this product…" />
                </div>
              </div>
            </div>

            {/* Category & Strain */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Category & Strain</h3>
              <div className="add-section-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subcategory</label>
                    <input className="form-input" name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="e.g. Indoor, Craft" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Strain Type</label>
                    <select className="form-input" name="strain" value={form.strain} onChange={handleChange}>
                      {STRAINS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Strain Name</label>
                    <input className="form-input" name="strainName" value={form.strainName} onChange={handleChange} placeholder="e.g. Blue Dream" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cannabinoids */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Cannabinoid Profile</h3>
              <div className="add-section-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">THC % (0–100)</label>
                    <input className="form-input" type="number" name="thcPercentage" value={form.thcPercentage} onChange={handleChange} min="0" max="100" step="0.1" placeholder="e.g. 22.5" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CBD % (0–100)</label>
                    <input className="form-input" type="number" name="cbdPercentage" value={form.cbdPercentage} onChange={handleChange} min="0" max="100" step="0.1" placeholder="e.g. 0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terpenes */}
            <div className="add-section admin-card">
              <div className="add-section-header">
                <h3 className="add-section-title">Terpene Profile</h3>
                <button type="button" className="btn btn-secondary add-terpene-btn" onClick={addTerpene}>+ Add Terpene</button>
              </div>
              <div className="add-section-body">
                {terpenes.length === 0 ? (
                  <p className="add-empty-note">No terpenes added. Click "+ Add Terpene" to add.</p>
                ) : (
                  terpenes.map((t, i) => (
                    <div key={i} className="terpene-row">
                      <input className="form-input" placeholder="Name (e.g. Myrcene)" value={t.name} onChange={e => updateTerpene(i, 'name', e.target.value)} />
                      <input className="form-input terpene-pct-input" type="number" placeholder="%" value={t.percentage} onChange={e => updateTerpene(i, 'percentage', e.target.value)} min="0" max="30" step="0.1" />
                      <button type="button" className="btn btn-danger terpene-remove" onClick={() => removeTerpene(i)}>✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Effects */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Effects & Flavors</h3>
              <div className="add-section-body">
                <div className="form-group">
                  <label className="form-label">Effects</label>
                  <div className="add-effects-grid">
                    {EFFECTS_LIST.map(effect => (
                      <label key={effect} className={`add-effect-chip ${form.effects.includes(effect) ? 'active' : ''}`}>
                        <input type="checkbox" checked={form.effects.includes(effect)} onChange={() => toggleEffect(effect)} style={{ display: 'none' }} />
                        {effect}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Flavors <span className="add-note">(comma-separated)</span></label>
                  <input className="form-input" name="flavors" value={form.flavors} onChange={handleChange} placeholder="e.g. Blueberry, Pine, Earth" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags <span className="add-note">(comma-separated)</span></label>
                  <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. organic, indoor, premium" />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="add-product-sidebar">
            {/* Image */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Product Image</h3>
              <div className="add-section-body">
                <label className="add-image-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="add-image-preview" />
                  ) : (
                    <div className="add-image-placeholder">
                      <span>📷</span>
                      <p>Click to upload image</p>
                      <p className="add-image-hint">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="add-image-input" />
                </label>
                {imagePreview && (
                  <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                    onClick={() => { setImage(null); setImagePreview(null) }}>
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Pricing</h3>
              <div className="add-section-body">
                <div className="form-group">
                  <label className="form-label">Regular Price ($) *</label>
                  <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sale Price ($) <span className="add-note">optional</span></label>
                  <input className="form-input" type="number" name="salePrice" value={form.salePrice} onChange={handleChange} min="0" step="0.01" placeholder="0.00" />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Inventory</h3>
              <div className="add-section-body">
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input className="form-input" type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} min="0" />
                </div>
                <label className="add-toggle-row">
                  <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
                  <span className="add-toggle-label">In Stock</span>
                </label>
              </div>
            </div>

            {/* Visibility */}
            <div className="add-section admin-card">
              <h3 className="add-section-title">Visibility</h3>
              <div className="add-section-body">
                {[
                  { name: 'featured', label: '⭐ Featured Product' },
                  { name: 'bestSeller', label: '🔥 Best Seller' },
                  { name: 'newArrival', label: '✨ New Arrival' },
                ].map(({ name, label }) => (
                  <label key={name} className="add-toggle-row">
                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
                    <span className="add-toggle-label">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary add-submit-btn" disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Saving…</>
                : editMode ? '✓ Update Product' : '+ Add Product'
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProduct