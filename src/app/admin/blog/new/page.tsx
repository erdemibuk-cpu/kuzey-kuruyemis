'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { ImageUpload } from '@/components/admin/ImageUpload'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    author: 'Admin',
    tags: '',
    isPublished: false,
  })

  const handleTitleChange = (title: string) => {
    setForm(prev => ({ ...prev, title, slug: slugify(title) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push('/admin/blog')
      }
    } catch {
      alert('Bir hata olustu')
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Yeni Blog Yazisi</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baslik *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="input-field"
                    placeholder="Blog yazisi basligi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ozet</label>
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="input-field"
                    placeholder="Yazinin kisa ozeti (liste sayfasinda gorunur)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icerik * (HTML destekler)</label>
                  <textarea
                    rows={16}
                    value={form.content}
                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                    className="input-field font-mono text-sm"
                    placeholder="<p>Blog icerigini buraya yazin...</p>"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Yayinla</h2>
              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm font-medium">Yayinda</span>
              </label>
              <button type="submit" disabled={saving} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                <Save size={16} />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div>
                <ImageUpload
                  label="Kapak Gorseli"
                  value={form.image}
                  onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yazar</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="input-field"
                  placeholder="Saglik, Tarif, Kuruyemis"
                />
                <p className="text-xs text-gray-400 mt-1">Virgul ile ayirin</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
