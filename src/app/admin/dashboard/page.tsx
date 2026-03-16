'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Package, ShoppingBag, Users, CreditCard, ArrowUpRight, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [period, setPeriod] = useState('today')

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  const statCards = [
    {
      title: 'Toplam Satis',
      value: formatPrice(stats?.totalRevenue || 0),
      change: '+76.88%',
      up: true,
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Siparis Sayisi',
      value: stats?.totalOrders || 0,
      change: '+55.10%',
      up: true,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Toplam Urun',
      value: stats?.totalProducts || 0,
      change: '',
      up: true,
      icon: Package,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      title: 'Musteri Sayisi',
      value: stats?.totalUsers || 0,
      change: '+12.39%',
      up: true,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Magazanizin genel gorunumu</p>
        </div>
        <div className="flex items-center gap-2">
          {['today', 'week', 'month'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                period === p ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p === 'today' ? 'Bugun' : p === 'week' ? 'Bu Hafta' : 'Bu Ay'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800">{card.value}</span>
                {card.change && (
                  <span className={`flex items-center text-xs font-medium mb-1 ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {card.up ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                    {card.change}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-800">Satis Grafigi</h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Gelir</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Siparis</span>
            </div>
          </div>
          {/* Simple bar chart */}
          <div className="flex items-end gap-2 h-48">
            {['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => {
              const heights = [40, 55, 35, 70, 85, 60, 45]
              const h2 = [25, 30, 20, 45, 55, 35, 28]
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end justify-center" style={{ height: '160px' }}>
                    <div className="w-3 bg-blue-500 rounded-t transition-all" style={{ height: `${heights[i]}%` }} />
                    <div className="w-3 bg-amber-400 rounded-t transition-all" style={{ height: `${h2[i]}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-5">Buyume Metrikleri</h2>
          <div className="space-y-5">
            {[
              { label: 'Ort. Siparis Tutari', value: formatPrice(stats?.totalRevenue && stats?.totalOrders ? stats.totalRevenue / stats.totalOrders : 0), change: '+14.04%', up: true },
              { label: 'Ort. Urun Fiyati', value: formatPrice(850), change: '+34.18%', up: true },
              { label: 'Donusum Orani', value: '%3.36', change: '+27.11%', up: true },
              { label: 'Iade Orani', value: '%0.00', change: '0%', up: true },
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">{metric.label}</div>
                  <div className="text-lg font-bold text-gray-800 mt-0.5">{metric.value}</div>
                </div>
                <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  metric.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}>
                  <ArrowUpRight size={12} className="mr-0.5" />
                  {metric.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Son Siparisler</h2>
            <Link href="/admin/orders" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              Tumunu Goruntule <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentOrders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">#{order.id.slice(-6)}</div>
                    <div className="text-xs text-gray-400">{order.shippingName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{formatPrice(order.totalAmount)}</div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                    order.status === 'preparing' ? 'bg-amber-50 text-amber-600' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {order.status === 'pending' ? 'Beklemede' :
                     order.status === 'paid' ? 'Odendi' :
                     order.status === 'preparing' ? 'Hazirlaniyor' :
                     order.status === 'shipped' ? 'Kargoda' :
                     order.status === 'delivered' ? 'Teslim Edildi' : 'Iptal'}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">Henuz siparis bulunmuyor</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">En Cok Satanlar</h2>
            <Link href="/admin/products" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              Tumunu Goruntule <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.topProducts?.slice(0, 5).map((product: any, i: number) => (
              <div key={product.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images?.[0] ? (
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.images[0].url})` }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.category?.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{formatPrice(product.salePrice || product.basePrice)}</div>
                  <div className="text-[10px] text-gray-400">Stok: {product.stock}</div>
                </div>
              </div>
            ))}
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">Henuz urun bulunmuyor</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
