import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        salePrice: data.salePrice || null,
        stock: data.stock || 0,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        images: {
          create: (data.images || []).map((img: any, i: number) => ({
            url: img.url,
            alt: img.alt || null,
            sortOrder: i,
          })),
        },
        variants: {
          create: (data.variants || []).map((v: any, i: number) => ({
            name: v.name,
            price: v.price,
            salePrice: v.salePrice || null,
            stock: v.stock || 0,
            sortOrder: i,
          })),
        },
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
