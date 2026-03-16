'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Search, ShoppingCart, User, Menu, X, Phone, Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoriteContext'
import { formatPrice } from '@/lib/utils'

const categories = [
  { name: 'Kuruyemisler', slug: 'kuruyemisler' },
  { name: 'Kuru Meyveler', slug: 'kuru-meyveler' },
  { name: 'Lokum & Sekerleme', slug: 'lokum-sekerleme' },
  { name: 'Baharatlar', slug: 'baharatlar' },
  { name: 'Cikolata & Seker', slug: 'cikolata-seker' },
  { name: 'Kahve & Cay', slug: 'kahve-cay' },
  { name: 'Kampanyalar', slug: 'kampanyalar' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const { totalItems, totalPrice } = useCart()
  const { totalFavorites } = useFavorites()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => { if (data.user) setUser(data.user) }).catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              0541 256 53 52
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Pazartesi - Cumartesi: 09:00 - 18:00</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="bg-accent/90 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">1500 TL uzeri UCRETSIZ KARGO!</span>
            <Link href="/hesap/siparislerim" className="hover:underline">Siparis Takibi</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo-final.png"
              alt="Kuzey Kuruyemis"
              width={400}
              height={180}
              className="h-[70px] md:h-[80px] w-auto"
              priority
            />
          </Link>

          {/* Search Bar - daha merkezi */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <form action="/arama" className="flex w-full shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <input
                type="text"
                name="q"
                placeholder="Urun, kategori veya marka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 focus:outline-none text-sm bg-gray-50"
              />
              <button type="submit" className="bg-primary text-white px-5 py-2.5 hover:bg-primary-dark transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Favoriler */}
            <Link href="/favoriler" className="hidden md:flex flex-col items-center text-gray-600 hover:text-primary transition-colors relative">
              <Heart size={22} />
              <span className="text-[10px] mt-0.5">Favoriler</span>
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Hesabim */}
            <Link href={user ? '/hesap/profil' : '/hesap/giris'} className="hidden md:flex flex-col items-center text-gray-600 hover:text-primary transition-colors">
              <User size={22} />
              <span className="text-[10px] mt-0.5">{user ? user.name.split(' ')[0] : 'Hesabim'}</span>
            </Link>

            {/* Sepet */}
            <Link href="/sepet" className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors relative">
              <ShoppingCart size={20} />
              <div className="text-xs leading-tight">
                <div className="font-bold">{formatPrice(totalPrice)}</div>
                <div className="opacity-80">{totalItems} urun</div>
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-2 mb-1">
          <form action="/arama" className="flex w-full shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <input
              type="text"
              name="q"
              placeholder="Urun ara..."
              className="flex-1 px-3 py-2 focus:outline-none text-sm bg-gray-50"
            />
            <button type="submit" className="bg-primary text-white px-4 py-2">
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="hidden md:block bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-0">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="block px-5 py-2.5 text-white text-[13px] font-medium hover:bg-white/10 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="max-w-7xl mx-auto px-4 py-3">
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="border-t pt-2 mt-2">
                {user ? (
                  <>
                    <Link href="/hesap/profil" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Hesabim ({user.name.split(' ')[0]})
                    </Link>
                    <Link href="/hesap/siparislerim" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Siparislerim
                    </Link>
                    <Link href="/favoriler" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Favorilerim
                    </Link>
                  </>
                ) : (
                  <Link href="/hesap/giris" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Giris Yap / Kayit Ol
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
