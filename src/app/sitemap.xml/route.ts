import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kuzeykuruyemis.com'

  let dynamicUrls = ''
  try {
    const { prisma } = await import('@/lib/prisma')
    const products = await prisma.product.findMany({ where: { isActive: true }, select: { slug: true } })
    const categories = await prisma.category.findMany({ where: { isActive: true }, select: { slug: true } })
    const posts = await prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true } })

    categories.forEach(c => { dynamicUrls += `<url><loc>${baseUrl}/${c.slug}</loc><priority>0.8</priority></url>\n` })
    products.forEach(p => { dynamicUrls += `<url><loc>${baseUrl}/${p.slug}</loc><priority>0.9</priority></url>\n` })
    posts.forEach(p => { dynamicUrls += `<url><loc>${baseUrl}/blog/${p.slug}</loc><priority>0.6</priority></url>\n` })
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${baseUrl}</loc><priority>1.0</priority></url>
<url><loc>${baseUrl}/hakkimizda</loc><priority>0.5</priority></url>
<url><loc>${baseUrl}/iletisim</loc><priority>0.5</priority></url>
<url><loc>${baseUrl}/blog</loc><priority>0.7</priority></url>
${dynamicUrls}</urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
