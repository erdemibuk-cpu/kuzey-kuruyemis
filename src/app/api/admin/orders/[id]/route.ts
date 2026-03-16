import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: data.status,
        paymentStatus: data.paymentStatus,
        cargoTrackingNo: data.cargoTrackingNo,
        cargoCompany: data.cargoCompany,
      },
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
