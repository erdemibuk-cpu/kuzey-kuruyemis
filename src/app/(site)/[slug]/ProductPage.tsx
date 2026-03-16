'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Zap, Truck, RotateCcw, ChevronRight, Minus, Plus, CreditCard, Building2, Package, Heart, Bell, X, Check } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoriteContext'
import { ProductCard } from '@/components/product/ProductCard'
import { ReviewSection } from '@/components/product/ReviewSection'

interface ProductData {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: number
  salePrice: number | null
  stock: number
  category: { name: string; slug: string }
  images: { id: string; url: string; alt: string | null }[]
  variants: { id: string; name: string; price: number; salePrice: number | null; stock: number }[]
  reviews: { id: string; rating: number; comment: string | null; createdAt: string; user: { name: string } }[]
  relatedProducts: any[]
}

export default function ProductPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('aciklama')
  const [showStockAlert, setShowStockAlert] = useState(false)
  const [stockEmail, setStockEmail] = useState('')
  const [stockPhone, setStockPhone] = useState('')
  const [stockAlertSent, setStockAlertSent] = useState(false)
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0].id)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Urun Bulunamadi</h1>
        <Link href="/" className="btn-primary">Anasayfaya Don</Link>
      </div>
    )
  }

  const activeVariant = product.variants.find(v => v.id === selectedVariant)
  const currentPrice = activeVariant
    ? (activeVariant.salePrice || activeVariant.price)
    : (product.salePrice || product.basePrice)
  const originalPrice = activeVariant ? activeVariant.price : product.basePrice
  const hasDiscount = currentPrice < originalPrice
  const discount = hasDiscount ? calculateDiscount(originalPrice, currentPrice) : 0
  const avgRating = product.reviews.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(2)
    : null

  const handleAddToCart = () => {
    addItem(
      { id: product.id, name: product.name, slug: product.slug, basePrice: product.basePrice, salePrice: product.salePrice, images: product.images },
      quantity,
      selectedVariant,
      activeVariant?.name,
      currentPrice
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link href={`/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${product.images[selectedImage]?.url || '/images/placeholder.jpg'})` }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                    i === selectedImage ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${img.url})` }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
            <button
              onClick={() => toggleFavorite({
                id: product.id, name: product.name, slug: product.slug,
                basePrice: product.basePrice, salePrice: product.salePrice,
                image: product.images[0]?.url || '',
              })}
              className={`flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${
                isFavorite(product.id)
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-500'
              }`}
            >
              <Heart size={20} className={isFavorite(product.id) ? 'fill-white' : ''} />
            </button>
          </div>

          {avgRating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={18}
                    className={star <= Math.round(Number(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="font-medium">{avgRating}</span>
              <span className="text-gray-500 text-sm">({product.reviews.length} Yorum)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">%{discount}</span>
              </>
            )}
            <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
          </div>

          {/* Kargo Bilgisi */}
          <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <img src="/images/kargo-logo.png" alt="Surat Kargo" className="h-8 w-auto" />
            <div className="flex-1">
              <div className="text-sm font-medium text-green-800">Surat Kargo ile Gonderim</div>
              <div className="text-xs text-green-600">2-3 is gununde kapinizda | 1500 TL uzeri ucretsiz</div>
            </div>
          </div>

          {product.variants.length > 0 && (() => {
            const getGrams = (name: string) => {
              const lower = name.toLowerCase()
              if (lower.includes('kg') || lower.includes('kilo')) { const n = parseFloat(lower); return isNaN(n) ? 1000 : n * 1000 }
              const n = parseFloat(lower); return isNaN(n) ? 0 : n
            }
            const sorted = [...product.variants].sort((a, b) => getGrams(a.name) - getGrams(b.name))
            const best = sorted[sorted.length - 1]
            const bestGrams = getGrams(best.name)
            const bestUnit = bestGrams > 0 ? (best.salePrice || best.price) / bestGrams : 0

            const activeV = product.variants.find(v => v.id === selectedVariant)
            const activeGrams = activeV ? getGrams(activeV.name) : 0
            const activeUnit = activeGrams > 0 ? ((activeV?.salePrice || activeV?.price || 0) / activeGrams) : 0
            const savePct = bestUnit > 0 && activeUnit > bestUnit && activeV?.id !== best.id
              ? Math.round(((activeUnit - bestUnit) / activeUnit) * 100) : 0

            return (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Gramaj Secin:</label>
                <div className="grid grid-cols-3 gap-2">
                  {sorted.map(variant => {
                    const isSelected = selectedVariant === variant.id
                    const isBest = variant.id === best.id
                    const price = variant.salePrice || variant.price
                    const grams = getGrams(variant.name)
                    const unitPriceKg = grams > 0 ? Math.round(price / grams * 1000) : 0
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                          isSelected
                            ? isBest ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-primary bg-primary/5 ring-1 ring-primary'
                            : isBest ? 'border-green-300 bg-green-50/50 hover:border-green-500' : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        {isBest && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            EN AVANTAJLI
                          </span>
                        )}
                        <div className={`text-sm font-bold ${isSelected ? (isBest ? 'text-green-700' : 'text-primary') : 'text-gray-800'}`}>
                          {variant.name}
                        </div>
                        <div className={`text-base font-bold mt-1 ${isSelected ? (isBest ? 'text-green-700' : 'text-primary') : 'text-gray-800'}`}>
                          {formatPrice(price)}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {formatPrice(unitPriceKg)} / KG
                        </div>
                      </button>
                    )
                  })}
                </div>
                {savePct > 0 && (
                  <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span><strong>{best.name}</strong> secersen <strong>%{savePct} daha uygun</strong> fiyatla alirsin!</span>
                  </div>
                )}
              </div>
            )
          })()}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 transition-colors">
                <Minus size={18} />
              </button>
              <span className="px-4 font-semibold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 transition-colors">
                <Plus size={18} />
              </button>
            </div>

            <button onClick={handleAddToCart} className="flex-1 btn-accent flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              Sepete Ekle
            </button>
          </div>

          <button onClick={handleAddToCart} className="w-full btn-primary flex items-center justify-center gap-2 mb-4">
            <Zap size={20} />
            Simdi Satin Al
          </button>

          {/* Stok Hatirlatma */}
          {!showStockAlert ? (
            <button
              onClick={() => setShowStockAlert(true)}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary border border-dashed border-gray-300 hover:border-primary rounded-lg py-2.5 transition-colors mb-6"
            >
              <Bell size={16} />
              Stok ve Fiyat Degisikliginde Haber Ver
            </button>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              {stockAlertSent ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check size={18} />
                  <span>Bildirim tercihiniz kaydedildi! Stok ve fiyat degisikliklerinde sizi bilgilendrecegiz.</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                      <Bell size={15} className="text-accent" /> Beni Haberdar Et
                    </span>
                    <button onClick={() => setShowStockAlert(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={stockEmail}
                      onChange={(e) => setStockEmail(e.target.value)}
                      placeholder="E-posta adresiniz"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="tel"
                      value={stockPhone}
                      onChange={(e) => setStockPhone(e.target.value)}
                      placeholder="Telefon (SMS icin, istege bagli)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        if (!stockEmail) { alert('Lutfen e-posta adresinizi girin'); return }
                        setStockAlertSent(true)
                      }}
                      className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Kaydet
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Fiyat dusunce, stok gelince veya kampanya olunca bildirim alirsiniz.</p>
                </>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck size={18} className="text-primary" />
              <span>Ort. 2-3 is gununde kargoya teslim edilir</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Truck size={18} className="text-primary" />
              <span>1500 TL uzeri ucretsiz kargo</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw size={18} className="text-primary" />
              <span>15 gun icerisinde kolay iade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-1 md:gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {[
            { id: 'aciklama', label: 'Aciklama' },
            { id: 'ozellikler', label: 'Ozellikleri' },
            { id: 'kargo', label: 'Kargo' },
            { id: 'odeme', label: 'Odeme' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'border-accent border-b-white text-accent bg-white -mb-[2px] z-10'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-6 md:p-8">
          {/* Aciklama Tab */}
          {activeTab === 'aciklama' && product.description && (
            <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
          )}

          {/* Urun Ozellikleri Tab */}
          {activeTab === 'ozellikler' && (
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">One Cikan Ozellikler</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 md:px-5 py-3 text-xs md:text-sm font-semibold text-gray-700 w-1/3">Ozellik</th>
                      <th className="text-left px-3 md:px-5 py-3 text-xs md:text-sm font-semibold text-gray-700">Aciklama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Urun Adi</td>
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">{product.name}</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 bg-gray-50/30">
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Kategori</td>
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">{product.category.name}</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Mensei</td>
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">Turkiye</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 bg-gray-50/30">
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Saklama Kosullari</td>
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">Serin ve kuru ortamda, hava almayan kapta saklayin</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Raf Omru</td>
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">Uretim tarihinden itibaren 12 ay</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 bg-gray-50/30">
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Paketleme</td>
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">Vakumlu, hijyenik ambalajda</td>
                    </tr>
                    {product.variants.length > 0 && (
                      <tr className="hover:bg-gray-50/50">
                        <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Gramaj Secenekleri</td>
                        <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">{product.variants.map(v => v.name).join(', ')}</td>
                      </tr>
                    )}
                    <tr className="hover:bg-gray-50/50 bg-gray-50/30">
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium text-gray-700">Katki Maddesi</td>
                      <td className="px-3 md:px-5 py-3 text-xs md:text-sm text-gray-600">Iceermez - %100 Dogal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Kargo Bilgileri Tab */}
          {activeTab === 'kargo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Truck size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Kargo Bilgileri</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> Siparisleriniz 2-3 is gunu icerisinde kargoya teslim edilir</li>
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> 1500 TL ve uzeri siparislerde kargo ucretsizdir</li>
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> Kargo firmasi: Aras Kargo</li>
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> Kargo takip numarasi SMS ile bildirilir</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <RotateCcw size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Iade Kosullari</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> 15 gun icerisinde kosulsuz iade</li>
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> Acilmamis ve orijinal ambalajda olmalidir</li>
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> Hasarli urunlerde kargo firmamiz tarafindan karsilanir</li>
                    <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span> Iade icin 0541 256 53 52 numarasini arayin</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Not:</strong> Gida urunlerinde hijyen nedeniyle acilmis paketler iade alinamaz. Hasarli veya hatali teslim durumunda acilmis olsa dahi iade kabul edilir.
              </div>
            </div>
          )}

          {/* Odeme Secenekleri Tab */}
          {activeTab === 'odeme' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Havale / EFT</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>Banka havalesi veya EFT ile odeme yapabilirsiniz.</p>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex justify-between mb-1"><span className="text-gray-500">Hesap Sahibi:</span><span className="font-semibold text-gray-800">Murat Devran</span></div>
                      <div><span className="text-gray-500">IBAN:</span></div>
                      <code className="text-xs font-mono block mt-1 bg-gray-50 p-2 rounded select-all">TR20 0004 6000 9988 8000 3957 31</code>
                    </div>
                    <p className="text-xs text-gray-400">Aciklama kismina siparis numaranizi yazmayi unutmayin.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Kredi / Banka Karti</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>Kredi karti ile guvenli odeme yakin zamanda aktif olacaktir.</p>
                    <div className="flex gap-2 mt-3">
                      {['VISA', 'MC', 'TROY'].map(card => (
                        <div key={card} className="bg-white border rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500">{card}</div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">256-bit SSL sertifikasi ile guvenli odeme altyapisi.</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-sm text-green-800">
                <Package size={18} className="flex-shrink-0" />
                <span><strong>Kapida Odeme:</strong> Su an icin kapida odeme secenegi bulunmamaktadir.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={product.id} reviews={product.reviews} />

      {product.relatedProducts?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Benzer Urunler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {product.relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
