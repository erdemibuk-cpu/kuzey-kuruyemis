import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.productId || !data.rating || !data.name) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
    }

    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json({ error: 'Puan 1-5 arasi olmali' }, { status: 400 })
    }

    // Misafir yorum icin: eger kullanici yoksa olustur veya mevcut kullan
    let userId = data.userId
    if (!userId) {
      // Misafir yorumlari icin basit bir kullanici olustur veya mevcut admin kullan
      const guestUser = await prisma.user.findFirst({ where: { email: data.email || 'guest@kuzeykuruyemis.com' } })
      if (guestUser) {
        userId = guestUser.id
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: data.email || `guest-${Date.now()}@kuzeykuruyemis.com`,
            password: 'guest',
            name: data.name,
            phone: data.phone || null,
          },
        })
        userId = newUser.id
      }
    }

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: userId,
        rating: data.rating,
        comment: data.comment || null,
        isApproved: false, // Admin onayina duser
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
