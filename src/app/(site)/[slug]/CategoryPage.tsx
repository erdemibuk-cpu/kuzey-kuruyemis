'use client'

import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Props {
  category: {
    id: string
    name: string
    slug: string
    description: string | null
    children: { id: string; name: string; slug: string }[]
  }
  products: any[]
}

export default function CategoryPage({ category, products }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800">{category.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        {category.children.length > 0 && (
          <aside className="md:w-64 flex-shrink-0">
            <h3 className="font-semibold text-gray-800 mb-3">Alt Kategoriler</h3>
            <ul className="space-y-1">
              {category.children.map(child => (
                <li key={child.id}>
                  <Link
                    href={`/${child.slug}`}
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
            <span className="text-sm text-gray-500">{products.length} urun</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Bu kategoride henuz urun bulunmuyor.</p>
              <Link href="/" className="btn-primary">Anasayfaya Don</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* SEO Category Description */}
          {category.description && (
            <div className="mt-12 product-description" dangerouslySetInnerHTML={{ __html: category.description }} />
          )}
        </div>
      </div>
    </div>
  )
}
