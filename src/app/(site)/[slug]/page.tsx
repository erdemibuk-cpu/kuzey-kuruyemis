import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import CategoryPage from './CategoryPage'
import ProductPage from './ProductPage'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (category) {
    const plainDesc = (category.description || '').replace(/<[^>]*>/g, '').substring(0, 160)
    const metaDesc = plainDesc || `${category.name} kategorisindeki en taze urunler. Uygun fiyat, hizli kargo.`
    return {
      title: `${category.name} - Kuzey Kuruyemis | En Taze ${category.name}`,
      description: metaDesc,
      openGraph: {
        title: `${category.name} - Kuzey Kuruyemis`,
        description: metaDesc,
        type: 'website',
      },
    }
  }

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } },
  })
  if (product) {
    return {
      title: `${product.name} - Kuzey Kuruyemis`,
      description: product.description || `${product.name} en uygun fiyatla Kuzey Kuruyemis'te. Hizli kargo, guvenli odeme.`,
      openGraph: {
        title: product.name,
        description: product.description || `${product.name} - Kuzey Kuruyemis`,
        type: 'website',
        images: product.images[0]?.url ? [product.images[0].url] : [],
      },
    }
  }

  return { title: 'Sayfa Bulunamadi' }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  // Once kategoride ara
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { children: { where: { isActive: true } } },
  })

  if (category) {
    const products = await prisma.product.findMany({
      where: { categoryId: category.id, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: { where: { isApproved: true }, select: { rating: true } },
        variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    })
    return <CategoryPage category={category} products={products} />
  }

  // Kategoride yoksa urunde ara
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (product) {
    return <ProductPage slug={params.slug} />
  }

  return notFound()
}
