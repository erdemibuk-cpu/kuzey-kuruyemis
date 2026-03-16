'use client'

import { useState, useEffect } from 'react'
import { Star, Check, X, Trash2, Eye, EyeOff } from 'lucide-react'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [filter, setFilter] = useState('all') // all, pending, approved
  const [loading, setLoading] = useState(true)

  const fetchReviews = () => {
    setLoading(true)
    fetch('/api/admin/reviews')
      .then(r => r.json())
      .then(data => { setReviews(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchReviews() }, [])

  const toggleApproval = async (id: string, isApproved: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved }),
    })
    fetchReviews()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediginize emin misiniz?')) return
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    fetchReviews()
  }

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return !r.isApproved
    if (filter === 'approved') return r.isApproved
    return true
  })

  const pendingCount = reviews.filter(r => !r.isApproved).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Yorumlar ({reviews.length})</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-600 mt-0.5">{pendingCount} yorum onay bekliyor</p>
          )}
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tumu' },
            { id: 'pending', label: 'Bekleyen' },
            { id: 'approved', label: 'Onaylanan' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(review => (
          <div key={review.id} className={`bg-white rounded-xl border p-5 ${!review.isApproved ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                    {review.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-800">{review.user?.name}</div>
                    <div className="text-xs text-gray-400">{review.user?.email}</div>
                  </div>
                  <div className="flex gap-0.5 ml-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={13} className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    review.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {review.isApproved ? 'Onaylandi' : 'Bekliyor'}
                  </span>
                </div>

                <div className="text-xs text-accent font-medium mb-1">{review.product?.name}</div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                <div className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!review.isApproved ? (
                  <button
                    onClick={() => toggleApproval(review.id, true)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Onayla"
                  >
                    <Check size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => toggleApproval(review.id, false)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                    title="Onay Kaldir"
                  >
                    <EyeOff size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 text-sm">{loading ? 'Yukleniyor...' : 'Yorum bulunamadi'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
