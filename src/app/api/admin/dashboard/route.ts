import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalUsers, orders, recentOrders, topProducts] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.order.findMany({ where: { paymentStatus: 'paid' }, select: { totalAmount: true } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.product.findMany({
        include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, category: { select: { name: true } } },
        orderBy: { sortOrder: 'asc' },
        take: 5,
      }),
    ])

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

    return NextResponse.json({ totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders, topProducts })
  } catch {
    return NextResponse.json({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0, recentOrders: [], topProducts: [] })
  }
}
