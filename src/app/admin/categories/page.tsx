'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { slugify } from '@/lib/utils'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '', parentId: '' })

  const fetchCategories = () => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => {})
  }

  useEffect(() => { fetchCategories() }, [])

  const handleSave = async () => {
    const url = editing ? `/api/admin/categories/${editing}` : '/api/admin/categories'
    const method = editing ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, parentId: form.parentId || null }),
    })

    setForm({ name: '', slug: '', description: '', image: '', parentId: '' })
    setEditing(null)
    setShowNew(false)
    fetchCategories()
  }

  const handleEdit = (cat: any) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image || '', parentId: cat.parentId || '' })
    setEditing(cat.id)
    setShowNew(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediginize emin misiniz?')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kategoriler ({categories.length})</h1>
        <button onClick={() => { setShowNew(true); setEditing(null); setForm({ name: '', slug: '', description: '', image: '', parentId: '' }) }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          Yeni Kategori
        </button>
      </div>

      {/* New/Edit Form */}
      {showNew && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">{editing ? 'Kategori Duzenle' : 'Yeni Kategori'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adi</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value, slug: editing ? prev.slug : slugify(e.target.value) }))}
                className="input-field"
                placeholder="Orn: Kuruyemisler"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ust Kategori</label>
              <select value={form.parentId} onChange={(e) => setForm(prev => ({ ...prev, parentId: e.target.value }))} className="input-field">
                <option value="">Ana Kategori</option>
                {categories.filter(c => c.id !== editing).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gorsel URL</label>
              <input type="text" value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="input-field" />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
              <Save size={16} /> Kaydet
            </button>
            <button onClick={() => { setShowNew(false); setEditing(null) }} className="btn-outline flex items-center gap-2 text-sm">
              <X size={16} /> Iptal
            </button>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ust Kategori</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Islemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-sm">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.parent?.name || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
