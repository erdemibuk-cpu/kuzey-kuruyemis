'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings, Image,
  Menu, X, FileText, Tag, Search, Bell, ChevronDown,
  FolderOpen, Palette, Globe, MessageSquare
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { section: 'Ana Menu' },
  { name: 'Giris', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Urunler', href: '/admin/products', icon: Package },
  { name: 'Kategoriler', href: '/admin/categories', icon: FolderOpen },
  { name: 'Siparisler', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Musteriler', href: '/admin/users', icon: Users },
  { name: 'Indirimler', href: '/admin/banners', icon: Tag },
  { name: 'Yorumlar', href: '/admin/reviews', icon: MessageSquare },
  { section: 'Icerik' },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Bannerlar', href: '/admin/banners', icon: Image },
  { section: 'Sistem' },
  { name: 'Tema & Gorunum', href: '/admin/theme', icon: Palette },
  { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-[#1a1d21] text-white flex flex-col transform transition-transform md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <span className="font-bold text-sm">EHYSOFT</span>
              <span className="text-accent text-xs ml-1">Panel</span>
            </div>
          </div>
          <button className="md:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
              <kbd className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘</kbd>
              <kbd className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">K</kbd>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {menuItems.map((item, i) => {
            if ('section' in item && !('href' in item)) {
              return (
                <div key={i} className="mt-5 mb-2 px-3">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{item.section}</span>
                </div>
              )
            }
            if (!('href' in item)) return null
            const Icon = item.icon!
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href!))
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all mb-0.5 ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom - Site Link & User */}
        <div className="border-t border-white/10 p-3 space-y-2">
          <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/5 transition-colors">
            <Globe size={16} />
            Siteyi Goruntule
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">Admin</div>
              <div className="text-[10px] text-gray-500 truncate">admin@ehysoft.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600 hover:text-gray-800" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-gray-400">Kuzey Kuruyemis</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Canli</span>
            </div>
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
