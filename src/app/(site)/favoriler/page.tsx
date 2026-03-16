'use client'

import Link from 'next/link'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useFavorites } from '@/context/FavoriteContext'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()
  const { addItem } = useCart()

  const handleAddToCart = (fav: any) => {
    addItem(
      { id: fav.id, name: fav.name, slug: fav.slug, basePrice: fav.basePrice, salePrice: fav.salePrice, images: [{ url: fav.image }] },
      1
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Favorileriniz Bos</h1>
        <p className="text-gray-500 mb-6">Henuz favori urun eklemediniz.</p>
        <Link href="/" className="btn-primary">Alisverise Basla</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Favorilerim ({favorites.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {favorites.map(fav => (
          <div key={fav.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/${fav.slug}`}>
              <div className="aspect-square bg-gray-100 relative">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${fav.image})` }} />
                <button
                  onClick={(e) => { e.preventDefault(); removeFavorite(fav.id) }}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/${fav.slug}`}>
                <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">{fav.name}</h3>
              </Link>

              <div className="flex items-center gap-2 mb-3">
                {fav.salePrice && fav.salePrice < fav.basePrice && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(fav.basePrice)}</span>
                )}
                <span className="text-lg font-bold text-primary">
                  {formatPrice(fav.salePrice && fav.salePrice < fav.basePrice ? fav.salePrice : fav.basePrice)}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(fav)}
                className="w-full bg-accent text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent-dark transition-colors"
              >
                <ShoppingCart size={16} />
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
