'use client'

import { useState, useEffect } from 'react'
import { Save, Palette, Type } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

export default function AdminThemePage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [theme, setTheme] = useState({
    site_name: 'Kuzey Kuruyemis',
    site_description: '',
    primary_color: '#0e532e',
    accent_color: '#ff751d',
    logo_url: '/images/logo-final.png',
    favicon_url: '/favicon.ico',
    hero_title: 'Taze Kuruyemisler',
    hero_subtitle: 'En kaliteli kuruyemisler uygun fiyatlarla kapinizda!',
    free_shipping_text: '1500 TL uzeri UCRETSIZ KARGO!',
    phone: '0850 XXX XX XX',
    working_hours: 'Pazartesi - Cumartesi: 09:00 - 18:00',
    footer_text: 'En taze ve dogal kuruyemisler, ozenle secilmis urunler ile sofraniza lezzet katiyoruz.',
    instagram: '',
    facebook: '',
    tiktok: '',
    whatsapp: '',
  })

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: any[]) => {
        setTheme(prev => {
          const updated = { ...prev }
          data.forEach((s: any) => {
            if (s.key in updated) (updated as any)[s.key] = s.value
          })
          return updated
        })
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const settings = Object.entries(theme).map(([key, value]) => ({ key, value }))
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tema & Gorunum</h1>
          <p className="text-sm text-gray-500">Sitenizin gorunumunu buradan yonetin</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-accent text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-accent-dark disabled:opacity-50 flex items-center gap-2">
          <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {saved && <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm">Tema ayarlari kaydedildi!</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Renkler */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-accent" />
            <h2 className="font-semibold text-gray-800">Renkler</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ana Renk (Primary)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.primary_color} onChange={(e) => setTheme(prev => ({ ...prev, primary_color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <input type="text" value={theme.primary_color} onChange={(e) => setTheme(prev => ({ ...prev, primary_color: e.target.value }))} className="input-field flex-1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vurgu Renk (Accent)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.accent_color} onChange={(e) => setTheme(prev => ({ ...prev, accent_color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <input type="text" value={theme.accent_color} onChange={(e) => setTheme(prev => ({ ...prev, accent_color: e.target.value }))} className="input-field flex-1" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <div className="flex-1 h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: theme.primary_color }}>Primary</div>
            <div className="flex-1 h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: theme.accent_color }}>Accent</div>
          </div>
        </div>

        {/* Logo & Gorseller */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Logo & Gorseller</h2>
          <div className="space-y-4">
            <ImageUpload
              label="Site Logosu"
              value={theme.logo_url}
              onChange={(url) => setTheme(prev => ({ ...prev, logo_url: url }))}
            />
            <ImageUpload
              label="Favicon"
              value={theme.favicon_url}
              onChange={(url) => setTheme(prev => ({ ...prev, favicon_url: url }))}
            />
          </div>
        </div>

        {/* Site Bilgileri */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Type size={18} className="text-accent" />
            <h2 className="font-semibold text-gray-800">Site Bilgileri</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Site Adi</label>
              <input type="text" value={theme.site_name} onChange={(e) => setTheme(prev => ({ ...prev, site_name: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Site Aciklamasi</label>
              <textarea rows={2} value={theme.site_description} onChange={(e) => setTheme(prev => ({ ...prev, site_description: e.target.value }))} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
                <input type="text" value={theme.phone} onChange={(e) => setTheme(prev => ({ ...prev, phone: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Calisma Saatleri</label>
                <input type="text" value={theme.working_hours} onChange={(e) => setTheme(prev => ({ ...prev, working_hours: e.target.value }))} className="input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero / Banner Metinleri */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Anasayfa Metinleri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hero Baslik</label>
              <input type="text" value={theme.hero_title} onChange={(e) => setTheme(prev => ({ ...prev, hero_title: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hero Alt Baslik</label>
              <input type="text" value={theme.hero_subtitle} onChange={(e) => setTheme(prev => ({ ...prev, hero_subtitle: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ucretsiz Kargo Mesaji</label>
              <input type="text" value={theme.free_shipping_text} onChange={(e) => setTheme(prev => ({ ...prev, free_shipping_text: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Footer Aciklama</label>
              <textarea rows={2} value={theme.footer_text} onChange={(e) => setTheme(prev => ({ ...prev, footer_text: e.target.value }))} className="input-field" />
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-800 mb-4">Sosyal Medya</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instagram</label>
              <input type="text" value={theme.instagram} onChange={(e) => setTheme(prev => ({ ...prev, instagram: e.target.value }))} className="input-field" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Facebook</label>
              <input type="text" value={theme.facebook} onChange={(e) => setTheme(prev => ({ ...prev, facebook: e.target.value }))} className="input-field" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">TikTok</label>
              <input type="text" value={theme.tiktok} onChange={(e) => setTheme(prev => ({ ...prev, tiktok: e.target.value }))} className="input-field" placeholder="https://tiktok.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
              <input type="text" value={theme.whatsapp} onChange={(e) => setTheme(prev => ({ ...prev, whatsapp: e.target.value }))} className="input-field" placeholder="+90 5XX XXX XX XX" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
