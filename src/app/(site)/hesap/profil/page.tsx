'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Package, Heart, MapPin, LogOut, ChevronRight, Settings } from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        setUser(data.user)
        setLoading(false)
        if (!data.user) window.location.href = '/hesap/giris'
      })
      .catch(() => { setLoading(false); window.location.href = '/hesap/giris' })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" /></div>
  }

  if (!user) return null

  const menuItems = [
    { icon: Package, label: 'Siparislerim', href: '/hesap/siparislerim', desc: 'Siparis gecmisinizi goruntuleyin' },
    { icon: Heart, label: 'Favorilerim', href: '/favoriler', desc: 'Favori urunleriniz' },
    { icon: MapPin, label: 'Adreslerim', href: '#', desc: 'Teslimat adreslerinizi yonetin' },
    { icon: Settings, label: 'Hesap Ayarlari', href: '#', desc: 'Bilgilerinizi guncelleyin' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profil Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 md:p-8 text-white mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{user.name}</h1>
            <p className="text-white/70 text-sm">{user.email}</p>
            {user.phone && <p className="text-white/70 text-sm">{user.phone}</p>}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {menuItems.map((item, i) => {
          const Icon = item.icon
          return (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
            </Link>
          )
        })}
      </div>

      {/* Hesap Bilgileri */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="font-bold text-gray-800 mb-4">Hesap Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Ad Soyad:</span>
            <span className="font-medium text-gray-800 ml-2">{user.name}</span>
          </div>
          <div>
            <span className="text-gray-500">E-Posta:</span>
            <span className="font-medium text-gray-800 ml-2">{user.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Telefon:</span>
            <span className="font-medium text-gray-800 ml-2">{user.phone || 'Belirtilmemis'}</span>
          </div>
          <div>
            <span className="text-gray-500">Uyelik Tarihi:</span>
            <span className="font-medium text-gray-800 ml-2">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      </div>

      {/* Cikis */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm"
      >
        <LogOut size={18} />
        Cikis Yap
      </button>
    </div>
  )
}
