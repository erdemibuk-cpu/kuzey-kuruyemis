import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sortOrder: 'asc' } }, variants: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Delete old images and variants
    await prisma.productImage.deleteMany({ where: { productId: params.id } })
    await prisma.productVariant.deleteMany({ where: { productId: params.id } })

    const product = await prisma.product.update({
      where: { id: params.id },
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
