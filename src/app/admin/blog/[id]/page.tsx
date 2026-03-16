'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { ImageUpload } from '@/components/admin/ImageUpload'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '', slug: '', content: '', excerpt: '',
    image: '', author: 'Admin', tags: '', isPublished: false,
  })

  useEffect(() => {
    fetch(`/api/admin/blog/${params.id}`)
      .then(r => r.json())
      .then(post => {
        setForm({
          title: post.title, slug: post.slug, content: post.content,
          excerpt: post.excerpt || '', image: post.image || '',
          author: post.author, tags: post.tags || '', isPublished: post.isPublished,
        })
        setLoading(false)
      })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) router.push('/admin/blog')
    } catch { alert('Bir hata olustu') }
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-200 rounded-lg"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blog Yazisi Duzenle</h1>
          <p className="text-sm text-gray-500">{form.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Baslik *</label>
                <input type="text" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ozet</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Icerik * (HTML)</label>
                <textarea rows={16} value={form.content} onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))} className="input-field font-mono text-sm" required />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Yayinla</h2>
              <label className="flex items-center gap-3 mb-4">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))} className="w-4 h-4 text-accent rounded" />
                <span className="text-sm font-medium">Yayinda</span>
              </label>
              <button type="submit" disabled={saving} className="w-full bg-accent text-white py-2.5 rounded-lg font-medium text-sm hover:bg-accent-dark disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <div>
                <ImageUpload
                  label="Kapak Gorseli"
                  value={form.image}
                  onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Yazar</label>
                <input type="text" value={form.author} onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Etiketler</label>
                <input type="text" value={form.tags} onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))} className="input-field" placeholder="Saglik, Tarif" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
