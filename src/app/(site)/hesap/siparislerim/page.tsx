'use client'

import { useState, useEffect } from 'react'
import { Package, Truck, Check, Clock, XCircle, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Odeme Bekleniyor', color: 'text-amber-600 bg-amber-50', icon: Clock },
  paid: { label: 'Odendi', color: 'text-blue-600 bg-blue-50', icon: Check },
  preparing: { label: 'Hazirlaniyor', color: 'text-violet-600 bg-violet-50', icon: Package },
  shipped: { label: 'Kargoda', color: 'text-indigo-600 bg-indigo-50', icon: Truck },
  delivered: { label: 'Teslim Edildi', color: 'text-green-600 bg-green-50', icon: Check },
  cancelled: { label: 'Iptal Edildi', color: 'text-red-600 bg-red-50', icon: XCircle },
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders/my')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" /></div>
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Henuz Siparisiniz Yok</h1>
        <p className="text-gray-500 mb-6">Alisverise baslayin, siparisleriniz burada gorunecek.</p>
        <Link href="/" className="btn-primary">Alisverise Basla</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparislerim ({orders.length})</h1>

      <div className="space-y-4">
        {orders.map((order: any) => {
          const config = statusConfig[order.status] || statusConfig.pending
          const Icon = config.icon
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Siparis #{order.id.slice(-8)}</div>
                    <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{formatPrice(order.totalAmount)}</div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product?.name} {item.variantName ? `(${item.variantName})` : ''} x{item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {order.cargoTrackingNo && (
                  <div className="mt-3 bg-blue-50 rounded-lg p-3 text-sm text-blue-800 flex items-center gap-2">
                    <Truck size={16} />
                    <span>Kargo Takip No: <strong>{order.cargoTrackingNo}</strong></span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
