'use client'

import { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, Send, Check, User } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { name: string }
}

interface Props {
  productId: string
  reviews: Review[]
}

export function ReviewSection({ productId, reviews: initialReviews }: Props) {
  const [reviews] = useState(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [form, setForm] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
  })

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }))

  const handleSubmit = async () => {
    if (!form.name || !form.rating || !form.comment) {
      alert('Lutfen adinizi, puaninizi ve yorumunuzu girin')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...form }),
      })
      if (res.ok) {
        setSubmitted(true)
        setShowForm(false)
      } else {
        const data = await res.json()
        alert(data.error || 'Bir hata olustu')
      }
    } catch {
      alert('Bir hata olustu')
    }
    setSubmitting(false)
  }

  return (
    <div className="mt-12" id="yorumlar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-800">Musteri Yorumlari</h2>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <MessageSquare size={16} />
            Yorum Yaz
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Rating Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="text-center mb-5">
            <div className="text-5xl font-bold text-gray-800">{avgRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} className={star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
              ))}
            </div>
            <div className="text-sm text-gray-500">{reviews.length} degerlendirme</div>
          </div>

          <div className="space-y-2">
            {ratingCounts.map(rc => (
              <div key={rc.star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{rc.star}</span>
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${rc.percent}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{rc.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List + Form */}
        <div className="lg:col-span-2">
          {/* Success Message */}
          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={20} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Yorumunuz Alindi!</h4>
                <p className="text-sm text-green-600 mt-1">Yorumunuz incelendikten sonra yayinlanacaktir. Katkilariniz icin tesekkur ederiz.</p>
              </div>
            </div>
          )}

          {/* Review Form */}
          {showForm && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Yorum Yaz</h3>

              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Puaniniz *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          star <= (hoverRating || form.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200 hover:text-yellow-200'
                        }`}
                      />
                    </button>
                  ))}
                  {form.rating > 0 && (
                    <span className="ml-2 text-sm text-gray-500 self-center">
                      {form.rating === 1 ? 'Cok Kotu' : form.rating === 2 ? 'Kotu' : form.rating === 3 ? 'Orta' : form.rating === 4 ? 'Iyi' : 'Mukemmel'}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adiniz *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Adiniz Soyadiniz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    placeholder="ornek@email.com (yayinlanmaz)"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Yorumunuz *</label>
                <textarea
                  rows={4}
                  value={form.comment}
                  onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="input-field"
                  placeholder="Bu urun hakkindaki dusuncelerinizi paylasın..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={16} />
                  {submitting ? 'Gonderiliyor...' : 'Yorumu Gonder'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Iptal
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{review.user.name}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors">
                      <ThumbsUp size={13} />
                      Faydali
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : !submitted && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-3">Bu urun icin henuz yorum yapilmamis.</p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-accent font-medium text-sm hover:underline"
                >
                  Ilk yorumu siz yapin!
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
