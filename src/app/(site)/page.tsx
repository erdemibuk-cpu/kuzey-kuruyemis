import { prisma } from '@/lib/prisma'
import { BannerSlider } from '@/components/ui/BannerSlider'
import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'
import { Star, ArrowRight, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { sortOrder: 'asc' } }, reviews: { where: { isApproved: true }, select: { rating: true } }, variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    take: 8,
    orderBy: { sortOrder: 'asc' },
  })
}

async function getNewProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sortOrder: 'asc' } }, reviews: { where: { isApproved: true }, select: { rating: true } }, variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: 'asc' },
  })
}

async function getBanners() {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })
}

export default async function HomePage() {
  const [featuredProducts, newProducts, categories, banners, blogPosts] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getCategories(),
    getBanners(),
    getBlogPosts(),
  ])

  return (
    <div>
      {/* Banner Slider */}
      <BannerSlider banners={banners} />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Kategoriler</h2>
          <p className="text-gray-500 text-sm mt-2">Aradiginiz her sey burada</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-5">
          {categories.map((cat) => {
            const iconMap: Record<string, { emoji: string; bg: string }> = {
              'kuruyemisler': { emoji: '🥜', bg: 'from-amber-50 to-orange-50' },
              'kuru-meyveler': { emoji: '🍑', bg: 'from-red-50 to-pink-50' },
              'lokum-sekerleme': { emoji: '🍬', bg: 'from-pink-50 to-purple-50' },
              'baharatlar': { emoji: '🌶️', bg: 'from-red-50 to-orange-50' },
              'cikolata-seker': { emoji: '🍫', bg: 'from-amber-50 to-yellow-50' },
              'kahve-cay': { emoji: '☕', bg: 'from-amber-50 to-stone-50' },
              'kampanyalar': { emoji: '🔥', bg: 'from-orange-50 to-red-50' },
            }
            const icon = iconMap[cat.slug] || { emoji: '📦', bg: 'from-gray-50 to-gray-100' }
            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 hover:border-primary/20 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${icon.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl md:text-4xl">{icon.emoji}</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 text-center group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Ayin Favorileri</h2>
              <Link href="/kuruyemisler" className="text-accent font-medium flex items-center gap-1 hover:underline">
                Tumunu Gor <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">1500 TL Ustu Ucretsiz Kargo!</h2>
          <p className="text-lg opacity-90 mb-6">Taze kuruyemisler kapiniza gelsin</p>
          <Link href="/kuruyemisler" className="btn-accent inline-block">
            Alisverise Basla
          </Link>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Vazgecilmez Urunler</h2>
            <Link href="/kuruyemisler" className="text-accent font-medium flex items-center gap-1 hover:underline">
              Tumunu Gor <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Blogumuz</h2>
              <p className="text-gray-500 text-sm mt-1">Kuruyemis dunyasindan yazilar</p>
            </div>
            <Link href="/blog" className="text-accent font-medium flex items-center gap-1 hover:underline">
              Tum Yazilar <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="h-44 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    {post.image ? (
                      <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${post.image})` }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><span className="text-5xl opacity-20">📝</span></div>
                    )}
                    {post.tags && (
                      <span className="absolute top-3 left-3 bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {post.tags.split(',')[0].trim()}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                    {post.excerpt && <p className="text-gray-500 text-sm line-clamp-2 flex-1">{post.excerpt}</p>}
                    <span className="text-accent font-medium text-sm mt-3 flex items-center gap-1">
                      Devamini Oku <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Sizden Gelenler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ayse Y.', comment: 'Cok taze ve lezzetli urunler. Her zaman memnunum!', rating: 5 },
              { name: 'Mehmet K.', comment: 'Kargo cok hizli geldi, paketleme muhtesem.', rating: 5 },
              { name: 'Fatma S.', comment: 'Fiyat/performans olarak en iyi site. Tavsiye ederim.', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">&ldquo;{review.comment}&rdquo;</p>
                <div className="font-medium text-gray-800">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
