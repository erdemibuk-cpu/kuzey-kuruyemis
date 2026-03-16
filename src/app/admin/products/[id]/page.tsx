'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { slugify } from '@/lib/utils'
import { MultiImageUpload } from '@/components/admin/ImageUpload'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', categoryId: '',
    basePrice: '', salePrice: '', stock: '0',
    isActive: true, isFeatured: false,
    images: [{ url: '', alt: '' }],
    variants: [] as { name: string; price: string; salePrice: string; stock: string }[],
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories').then(r => r.json()),
      fetch(`/api/admin/products/${params.id}`).then(r => r.json()),
    ]).then(([cats, product]) => {
      setCategories(cats)
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        categoryId: product.categoryId,
        basePrice: String(product.basePrice),
        salePrice: product.salePrice ? String(product.salePrice) : '',
        stock: String(product.stock),
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        images: product.images?.length > 0 ? product.images.map((img: any) => ({ url: img.url, alt: img.alt || '' })) : [{ url: '', alt: '' }],
        variants: product.variants?.map((v: any) => ({
          name: v.name,
          price: String(v.price),
          salePrice: v.salePrice ? String(v.salePrice) : '',
          stock: String(v.stock),
        })) || [],
      })
      setLoading(false)
    })
  }, [params.id])

  const addVariant = () => setForm(prev => ({ ...prev, variants: [...prev.variants, { name: '', price: '', salePrice: '', stock: '0' }] }))
  const removeVariant = (i: number) => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }))
  const updateVariant = (i: number, field: string, value: string) => setForm(prev => ({ ...prev, variants: prev.variants.map((v, idx) => idx === i ? { ...v, [field]: value } : v) }))
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          basePrice: parseFloat(form.basePrice),
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
          stock: parseInt(form.stock),
          images: form.images.filter(img => img.url),
          variants: form.variants.filter(v => v.name).map(v => ({
            ...v, price: parseFloat(v.price), salePrice: v.salePrice ? parseFloat(v.salePrice) : null, stock: parseInt(v.stock),
          })),
        }),
      })
      if (res.ok) router.push('/admin/products')
    } catch { alert('Bir hata olustu') }
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-lg"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Urun Duzenle</h1>
          <p className="text-sm text-gray-500">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Urun Adi *</label>
              <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kategori *</label>
              <select value={form.categoryId} onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))} className="input-field" required>
                <option value="">Kategori Secin</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stok</label>
              <input type="number" value={form.stock} onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fiyat (TL) *</label>
              <input type="number" step="0.01" value={form.basePrice} onChange={(e) => setForm(prev => ({ ...prev, basePrice: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Indirimli Fiyat (TL)</label>
              <input type="number" step="0.01" value={form.salePrice} onChange={(e) => setForm(prev => ({ ...prev, salePrice: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Aciklama</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="input-field" />
          </div>
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 text-accent rounded" /><span className="text-sm">Aktif</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 text-accent rounded" /><span className="text-sm">One Cikan</span></label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <MultiImageUpload
            label="Urun Gorselleri"
            values={form.images}
            onChange={(images) => setForm(prev => ({ ...prev, images }))}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Gramaj / Varyantlar</h2>
            <button type="button" onClick={addVariant} className="text-xs text-accent font-medium flex items-center gap-1"><Plus size={14} /> Ekle</button>
          </div>
          {form.variants.length === 0 ? (
            <p className="text-sm text-gray-400">Varyant eklenmedi.</p>
          ) : (
            <div className="space-y-3">
              {form.variants.map((v, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input type="text" placeholder="Orn: 500 Gr" value={v.name} onChange={(e) => updateVariant(i, 'name', e.target.value)} className="input-field flex-1" />
                  <input type="number" step="0.01" placeholder="Fiyat" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} className="input-field w-28" />
                  <input type="number" step="0.01" placeholder="Ind." value={v.salePrice} onChange={(e) => updateVariant(i, 'salePrice', e.target.value)} className="input-field w-28" />
                  <input type="number" placeholder="Stok" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} className="input-field w-20" />
                  <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Degisiklikleri Kaydet'}
          </button>
          <Link href="/admin/products" className="px-6 py-2.5 rounded-lg font-medium text-sm border border-gray-200 text-gray-600 hover:bg-gray-50">Iptal</Link>
        </div>
      </form>
    </div>
  )
}
