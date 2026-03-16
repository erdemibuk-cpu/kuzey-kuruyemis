import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.shippingName || !data.shippingPhone || !data.shippingCity || !data.shippingAddress) {
      return NextResponse.json({ error: 'Teslimat bilgileri eksik' }, { status: 400 })
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Sepet bos' }, { status: 400 })
    }

    // Kullanici girisi varsa userId al, yoksa misafir siparis
    const user = await getCurrentUser()

    const order = await prisma.order.create({
      data: {
        userId: user?.id || null,
        totalAmount: data.totalAmount,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingCity: data.shippingCity,
        shippingAddress: data.shippingAddress,
        note: data.note || null,
        status: 'pending',
        paymentStatus: data.paymentMethod === 'havale' ? 'pending' : 'pending',
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            variantName: item.variantName || null,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    return NextResponse.json({ id: order.id, status: order.status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
