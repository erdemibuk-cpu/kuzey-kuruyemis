import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        image: data.image || '',
        link: data.link || null,
        isActive: data.isActive ?? true,
      },
    })
    return NextResponse.json(banner)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.banner.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
