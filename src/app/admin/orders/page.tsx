'use client'

import { useState, useEffect } from 'react'
import { Eye, Truck } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  paid: 'Odendi',
  preparing: 'Hazirlaniyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'Iptal',
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  paid: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparisler ({orders.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">No</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Musteri</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tutar</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-4 py-3 text-sm font-medium">#{order.id.slice(-6)}</td>
                    <td className="px-4 py-3 text-sm">{order.shippingName}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 text-gray-400 hover:text-primary"><Eye size={16} /></button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">{loading ? 'Yukleniyor...' : 'Siparis bulunamadi'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {selectedOrder ? (
            <div>
              <h2 className="font-bold text-gray-800 mb-4">Siparis #{selectedOrder.id.slice(-6)}</h2>

              <div className="space-y-3 text-sm mb-6">
                <div><span className="text-gray-500">Musteri:</span> <span className="font-medium">{selectedOrder.shippingName}</span></div>
                <div><span className="text-gray-500">Telefon:</span> <span className="font-medium">{selectedOrder.shippingPhone}</span></div>
                <div><span className="text-gray-500">Adres:</span> <span className="font-medium">{selectedOrder.shippingAddress}, {selectedOrder.shippingCity}</span></div>
                <div><span className="text-gray-500">Toplam:</span> <span className="font-bold text-primary">{formatPrice(selectedOrder.totalAmount)}</span></div>
              </div>

              {/* Payment Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Odeme Durumu</label>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                    selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    selectedOrder.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedOrder.paymentStatus === 'paid' ? 'Odendi' :
                     selectedOrder.paymentStatus === 'failed' ? 'Basarisiz' : 'Odeme Bekleniyor'}
                  </span>
                  {selectedOrder.paymentStatus !== 'paid' && (
                    <button
                      onClick={async () => {
                        if (!confirm('Odemeyi onaylamak istediginize emin misiniz?')) return
                        await fetch(`/api/admin/orders/${selectedOrder.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...selectedOrder, paymentStatus: 'paid', status: 'paid' }),
                        })
                        fetchOrders()
                        setSelectedOrder({ ...selectedOrder, paymentStatus: 'paid', status: 'paid' })
                      }}
                      className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Odemeyi Onayla
                    </button>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Siparis Durumu</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className="input-field"
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Items */}
              <h3 className="font-medium text-gray-800 mb-2">Urunler</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <div>
                      <div className="font-medium">{item.product?.name}</div>
                      {item.variantName && <div className="text-xs text-gray-500">{item.variantName}</div>}
                    </div>
                    <div className="text-right">
                      <div>{item.quantity} x {formatPrice(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder.note && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
                  <span className="font-medium">Not:</span> {selectedOrder.note}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <Eye size={48} className="mx-auto mb-3 opacity-50" />
              <p>Detay gormek icin bir siparis secin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
