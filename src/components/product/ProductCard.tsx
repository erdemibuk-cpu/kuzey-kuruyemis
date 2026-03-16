'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Heart, Check } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoriteContext'

interface Variant {
  id: string
  name: string
  price: number
  salePrice: number | null
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    basePrice: number
    salePrice: number | null
    images: { url: string; alt: string | null }[]
    reviews?: { rating: number }[]
    variants?: Variant[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const variants = product.variants || []
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants.length > 0 ? variants[0] : null)
  const [added, setAdded] = useState(false)

  const currentPrice = selectedVariant
    ? (selectedVariant.salePrice || selectedVariant.price)
    : (product.salePrice || product.basePrice)
  const originalPrice = selectedVariant ? selectedVariant.price : product.basePrice
  const hasDiscount = currentPrice < originalPrice
  const discount = hasDiscount ? calculateDiscount(originalPrice, currentPrice) : 0

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null
  const imageUrl = product.images?.[0]?.url || '/images/placeholder.jpg'
  const fav = isFavorite(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(
      { id: product.id, name: product.name, slug: product.slug, basePrice: product.basePrice, salePrice: product.salePrice, images: product.images },
      1,
      selectedVariant?.id,
      selectedVariant?.name,
      currentPrice
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({ id: product.id, name: product.name, slug: product.slug, basePrice: product.basePrice, salePrice: product.salePrice, image: imageUrl })
  }

  const handleVariantClick = (e: React.MouseEvent, variant: Variant) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedVariant(variant)
  }

  return (
    <Link href={`/${product.slug}`} className="card group flex flex-col h-full">
      {/* Gorsel */}
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-100">
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </div>

        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-lg">
            %{discount}
          </div>
        )}

        <button
          onClick={handleToggleFav}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
            fav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={14} className={fav ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Icerik */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {avgRating && (
          <div className="flex items-center gap-1 mb-1.5">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700">{avgRating}</span>
            <span className="text-[10px] text-gray-400">({product.reviews?.length})</span>
          </div>
        )}

        <h3 className="font-medium text-gray-800 text-xs md:text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
          {product.name}
        </h3>

        {/* Varyantlar */}
        {variants.length > 0 && (() => {
          const getGrams = (name: string) => {
            const lower = name.toLowerCase()
            if (lower.includes('kg') || lower.includes('kilo')) {
              const num = parseFloat(lower); return isNaN(num) ? 1000 : num * 1000
            }
            const num = parseFloat(lower); return isNaN(num) ? 0 : num
          }
          const sorted = [...variants].sort((a, b) => getGrams(a.name) - getGrams(b.name))
          const maxVariant = sorted[sorted.length - 1]
          const maxGrams = getGrams(maxVariant.name)
          const maxUnitPrice = maxGrams > 0 ? (maxVariant.salePrice || maxVariant.price) / maxGrams : 0

          return (
            <div className="mb-2 space-y-1.5">
              <div className="flex gap-1">
                {sorted.map(v => {
                  const isSelected = selectedVariant?.id === v.id
                  const isBest = v.id === maxVariant.id
                  return (
                    <button
                      key={v.id}
                      onClick={(e) => handleVariantClick(e, v)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] md:text-[11px] font-semibold border transition-all text-center ${
                        isSelected
                          ? isBest ? 'bg-green-600 text-white border-green-600' : 'bg-primary text-white border-primary'
                          : isBest ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary'
                      }`}
                    >
                      {v.name}
                      {isBest && <span className="block text-[8px] font-bold opacity-80">AVANTAJLI</span>}
                    </button>
                  )
                })}
              </div>
              {selectedVariant && selectedVariant.id !== maxVariant.id && (() => {
                const selGrams = getGrams(selectedVariant.name)
                const selUnit = selGrams > 0 ? (selectedVariant.salePrice || selectedVariant.price) / selGrams : 0
                const pct = maxUnitPrice > 0 && selUnit > maxUnitPrice ? Math.round(((selUnit - maxUnitPrice) / selUnit) * 100) : 0
                if (pct <= 0) return null
                return (
                  <div className="text-[9px] md:text-[10px] text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 py-1 text-center">
                    {maxVariant.name} secersen <strong>%{pct} daha uygun!</strong>
                  </div>
                )
              })()}
            </div>
          )
        })()}

        {/* Fiyat */}
        <div className="flex items-center gap-1.5 mb-3">
          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
          <span className="text-base md:text-lg font-bold text-primary">
            {formatPrice(currentPrice)}
          </span>
        </div>

        {/* Sepete Ekle */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-accent text-white hover:bg-accent-dark'
          }`}
        >
          {added ? (
            <>
              <Check size={14} />
              Eklendi!
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              Sepete Ekle
            </>
          )}
        </button>
      </div>
    </Link>
  )
}
