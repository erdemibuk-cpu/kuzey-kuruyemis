'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz Bos</h1>
        <p className="text-gray-500 mb-6">Sepetinizde henuz urun bulunmuyor.</p>
        <Link href="/" className="btn-primary">Alisverise Basla</Link>
      </div>
    )
  }

  const shippingFree = totalPrice >= 1500
  const shippingCost = shippingFree ? 0 : 49.90

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sepetim ({totalItems} urun)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.product.images?.[0]?.url || '/images/placeholder.jpg'})` }}
                />
              </div>

              <div className="flex-1">
                <Link href={`/${item.product.slug}`} className="font-medium text-gray-800 hover:text-primary">
                  {item.product.name}
                </Link>
                {item.variantName && (
                  <div className="text-sm text-gray-500 mt-1">{item.variantName}</div>
                )}
                <div className="font-bold text-primary mt-1">{formatPrice(item.price)}</div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
            Sepeti Temizle
          </button>
        </div>

        {/* Summary */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 h-fit lg:sticky lg:top-32">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Siparis Ozeti</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo</span>
              {shippingFree ? (
                <span className="font-medium text-green-600">Ucretsiz</span>
              ) : (
                <span className="font-medium">{formatPrice(shippingCost)}</span>
              )}
            </div>
            {!shippingFree && (
              <div className="text-xs text-accent">
                {formatPrice(1500 - totalPrice)} daha ekleyin, kargo bedava!
              </div>
            )}
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-gray-800">Toplam</span>
              <span className="font-bold text-xl text-primary">{formatPrice(totalPrice + shippingCost)}</span>
            </div>
          </div>

          <Link href="/siparis" className="mt-6 w-full btn-accent block text-center">
            Siparisi Tamamla
          </Link>

          <Link href="/" className="mt-3 w-full btn-outline block text-center text-sm">
            Alisverise Devam Et
          </Link>

          {/* Havale Bilgisi */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Havale / EFT ile Odeme</h3>
            <div className="text-xs text-gray-500 space-y-1">
              <div><span className="font-medium text-gray-700">Hesap Sahibi:</span> Murat Devran</div>
              <div><span className="font-medium text-gray-700">IBAN:</span></div>
              <div className="font-mono text-[11px] bg-white px-2 py-1 rounded border select-all">TR20 0004 6000 9988 8000 3957 31</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
