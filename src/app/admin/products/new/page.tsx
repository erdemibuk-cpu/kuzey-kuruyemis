'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { slugify } from '@/lib/utils'
import { MultiImageUpload } from '@/components/admin/ImageUpload'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    basePrice: '',
    salePrice: '',
    stock: '0',
    isActive: true,
    isFeatured: false,
    images: [{ url: '', alt: '' }],
    variants: [] as { name: string; price: string; salePrice: string; stock: string }[],
  })

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  const handleNameChange = (name: string) => {
    setForm(prev => ({ ...prev, name, slug: slugify(name) }))
  }

  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', price: '', salePrice: '', stock: '0' }],
    }))
  }

  const removeVariant = (index: number) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }))
  }

  const updateVariant = (index: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          basePrice: parseFloat(form.basePrice),
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
          stock: parseInt(form.stock),
          images: form.images.filter(img => img.url),
          variants: form.variants.filter(v => v.name).map(v => ({
            ...v,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stock: parseInt(v.stock),
          })),
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
      }
    } catch (error) {
      alert('Bir hata olustu')
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Yeni Urun Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urun Adi *</label>
              <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select value={form.categoryId} onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))} className="input-field" required>
                <option value="">Kategori Secin</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input type="number" value={form.stock} onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL) *</label>
              <input type="number" step="0.01" value={form.basePrice} onChange={(e) => setForm(prev => ({ ...prev, basePrice: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Indirimli Fiyat (TL)</label>
              <input type="number" step="0.01" value={form.salePrice} onChange={(e) => setForm(prev => ({ ...prev, salePrice: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="input-field" />
          </div>
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 text-primary" />
              <span className="text-sm">Aktif</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 text-primary" />
              <span className="text-sm">One Cikan</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <MultiImageUpload
            label="Urun Gorselleri"
            values={form.images}
            onChange={(images) => setForm(prev => ({ ...prev, images }))}
          />
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Gramaj / Varyantlar</h2>
            <button type="button" onClick={addVariant} className="text-sm text-primary font-medium flex items-center gap-1">
              <Plus size={16} /> Varyant Ekle
            </button>
          </div>
          {form.variants.length === 0 ? (
            <p className="text-sm text-gray-500">Henuz varyant eklenmedi. "Varyant Ekle" ile gramaj secenekleri olusturabilirsiniz.</p>
          ) : (
            <div className="space-y-3">
              {form.variants.map((variant, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input type="text" placeholder="Orn: 500 Gr" value={variant.name} onChange={(e) => updateVariant(i, 'name', e.target.value)} className="input-field flex-1" />
                  <input type="number" step="0.01" placeholder="Fiyat" value={variant.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} className="input-field w-32" />
                  <input type="number" step="0.01" placeholder="Ind. Fiyat" value={variant.salePrice} onChange={(e) => updateVariant(i, 'salePrice', e.target.value)} className="input-field w-32" />
                  <input type="number" placeholder="Stok" value={variant.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} className="input-field w-24" />
                  <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : 'Urunu Kaydet'}
          </button>
          <Link href="/admin/products" className="btn-outline">Iptal</Link>
        </div>
      </form>
    </div>
  )
}
