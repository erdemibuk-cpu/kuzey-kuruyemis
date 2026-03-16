import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(banners)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        image: data.image || '',
        link: data.link || null,
        isActive: data.isActive ?? true,
      },
    })
    return NextResponse.json(banner)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
