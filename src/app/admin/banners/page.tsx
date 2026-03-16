'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '', isActive: true })

  const fetchBanners = () => {
    fetch('/api/admin/banners')
      .then(res => res.json())
      .then(setBanners)
      .catch(() => {})
  }

  useEffect(() => { fetchBanners() }, [])

  const handleSave = async () => {
    const url = editing ? `/api/admin/banners/${editing}` : '/api/admin/banners'
    const method = editing ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setForm({ title: '', subtitle: '', image: '', link: '', isActive: true })
    setEditing(null)
    setShowNew(false)
    fetchBanners()
  }

  const handleEdit = (banner: any) => {
    setForm({ title: banner.title, subtitle: banner.subtitle || '', image: banner.image, link: banner.link || '', isActive: banner.isActive })
    setEditing(banner.id)
    setShowNew(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu banneri silmek istediginize emin misiniz?')) return
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    fetchBanners()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bannerlar ({banners.length})</h1>
        <button onClick={() => { setShowNew(true); setEditing(null); setForm({ title: '', subtitle: '', image: '', link: '', isActive: true }) }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Yeni Banner
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">{editing ? 'Banner Duzenle' : 'Yeni Banner'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baslik</label>
              <input type="text" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="input-field" placeholder="Kampanya Basligi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Baslik</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))} className="input-field" placeholder="Kampanya aciklamasi" />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                label="Banner Gorseli"
                value={form.image}
                onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input type="text" value={form.link} onChange={(e) => setForm(prev => ({ ...prev, link: e.target.value }))} className="input-field" placeholder="/kategori/kampanyalar" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Save size={16} /> Kaydet</button>
            <button onClick={() => { setShowNew(false); setEditing(null) }} className="btn-outline flex items-center gap-2 text-sm"><X size={16} /> Iptal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-primary to-primary-light flex items-center justify-center relative">
              {banner.image && <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${banner.image})` }} />}
              <div className="relative text-center text-white">
                <h3 className="text-xl font-bold">{banner.title}</h3>
                {banner.subtitle && <p className="text-sm opacity-80">{banner.subtitle}</p>}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {banner.isActive ? 'Aktif' : 'Pasif'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(banner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                <button onClick={() => handleDelete(banner.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
