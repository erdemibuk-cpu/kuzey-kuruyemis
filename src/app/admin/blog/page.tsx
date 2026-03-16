'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = () => {
    setLoading(true)
    fetch('/api/admin/blog')
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yaziyi silmek istediginize emin misiniz?')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  const togglePublish = async (post: any) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, isPublished: !post.isPublished }),
    })
    fetchPosts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Yazilari ({posts.length})</h1>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          Yeni Yazi
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Baslik</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Yazar</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Goruntulenme</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{post.title}</div>
                      <div className="text-xs text-gray-400">/{post.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.viewCount}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${
                        post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {post.isPublished ? <><Eye size={12} /> Yayinda</> : <><EyeOff size={12} /> Taslak</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/blog/${post.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Yukleniyor...' : 'Henuz blog yazisi yok'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
