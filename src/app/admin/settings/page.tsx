'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

const defaultSettings = [
  { key: 'site_name', label: 'Site Adi', value: '' },
  { key: 'site_description', label: 'Site Aciklamasi', value: '' },
  { key: 'phone', label: 'Telefon', value: '' },
  { key: 'email', label: 'Email', value: '' },
  { key: 'address', label: 'Adres', value: '' },
  { key: 'instagram', label: 'Instagram URL', value: '' },
  { key: 'facebook', label: 'Facebook URL', value: '' },
  { key: 'tiktok', label: 'TikTok URL', value: '' },
  { key: 'free_shipping_min', label: 'Ucretsiz Kargo Limiti (TL)', value: '1500' },
  { key: 'paytr_merchant_id', label: 'PayTR Merchant ID', value: '' },
  { key: 'paytr_merchant_key', label: 'PayTR Merchant Key', value: '' },
  { key: 'paytr_merchant_salt', label: 'PayTR Merchant Salt', value: '' },
  { key: 'aras_api_key', label: 'Aras Kargo API Key', value: '' },
  { key: 'aras_customer_code', label: 'Aras Kargo Musteri Kodu', value: '' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then((data: any[]) => {
        setSettings(prev => prev.map(s => {
          const found = data.find((d: any) => d.key === s.key)
          return found ? { ...s, value: found.value } : s
        }))
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings.map(s => ({ key: s.key, value: s.value }))),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Site Ayarlari</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
          <Save size={16} />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">Ayarlar basariyla kaydedildi!</div>
      )}

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Genel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.filter(s => ['site_name', 'site_description', 'phone', 'email', 'address'].includes(s.key)).map(s => (
              <div key={s.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
                <input type="text" value={s.value} onChange={(e) => updateSetting(s.key, e.target.value)} className="input-field" />
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Sosyal Medya</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settings.filter(s => ['instagram', 'facebook', 'tiktok'].includes(s.key)).map(s => (
              <div key={s.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
                <input type="text" value={s.value} onChange={(e) => updateSetting(s.key, e.target.value)} className="input-field" />
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Kargo Ayarlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.filter(s => ['free_shipping_min', 'aras_api_key', 'aras_customer_code'].includes(s.key)).map(s => (
              <div key={s.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
                <input type="text" value={s.value} onChange={(e) => updateSetting(s.key, e.target.value)} className="input-field" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Odeme Ayarlari (PayTR)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settings.filter(s => s.key.startsWith('paytr_')).map(s => (
              <div key={s.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
                <input type="text" value={s.value} onChange={(e) => updateSetting(s.key, e.target.value)} className="input-field" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
