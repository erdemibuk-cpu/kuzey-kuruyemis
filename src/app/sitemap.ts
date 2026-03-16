import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kuzeykuruyemis.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/iade-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const { prisma } = await import('@/lib/prisma')
    const products = await prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } })
    const categories = await prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } })
    const blogPosts = await prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } })

    const dynamicPages: MetadataRoute.Sitemap = [
      ...categories.map(cat => ({ url: `${baseUrl}/${cat.slug}`, lastModified: cat.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
      ...products.map(p => ({ url: `${baseUrl}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.9 })),
      ...blogPosts.map(post => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ]

    return [...staticPages, ...dynamicPages]
  } catch {
    return staticPages
  }
}
