import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  return { title: searchParams.q ? `"${searchParams.q}" Arama Sonuclari - Kuzey Kuruyemis` : 'Arama - Kuzey Kuruyemis' }
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ''

  const products = query ? await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      reviews: { where: { isApproved: true }, select: { rating: true } },
      variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
    },
  }) : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {query ? `"${query}" icin ${products.length} sonuc` : 'Urun Ara'}
        </h1>
        <form action="/arama" className="max-w-lg mx-auto flex mt-4">
          <input type="text" name="q" defaultValue={query} placeholder="Urun, kategori ara..." className="input-field flex-1 rounded-r-none" autoFocus />
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-r-lg hover:bg-primary-dark"><Search size={20} /></button>
        </form>
      </div>

      {query && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">Aradiginiz kriterlere uygun urun bulunamadi.</p>
          <p className="text-sm text-gray-400">Farkli bir arama terimi deneyin veya kategorilere goz atin.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
