'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Phone, Mail, User, Lock } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', passwordConfirm: '',
    agreeSms: false, agreeEmail: false, agreeTerms: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.agreeTerms) {
      setError('Uyelik sozlesmesini kabul etmelisiniz')
      return
    }

    if (form.password.length < 6) {
      setError('Sifre en az 6 karakter olmalidir')
      return
    }

    if (form.password !== form.passwordConfirm) {
      setError('Sifreler eslesmiyor')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          agreeSms: form.agreeSms,
          agreeEmail: form.agreeEmail,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      window.location.href = '/'
    } catch {
      setError('Bir hata olustu')
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Google OAuth - ilerde entegre edilecek
    alert('Google ile giris yakin zamanda aktif olacaktir')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hesap Olustur</h1>
          <p className="text-sm text-gray-500 mt-1">Alisverise baslamak icin kayit olun</p>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google ile Kayit Ol
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">veya e-posta ile</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="input-field pl-10" placeholder="Adiniz Soyadiniz" required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="input-field pl-10" placeholder="ornek@email.com" required />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} className="input-field pl-10" placeholder="05XX XXX XX XX" required />
            </div>
          </div>

          {/* Sifre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sifre *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} className="input-field pl-10 pr-10" placeholder="En az 6 karakter" required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Sifre Tekrar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sifre Tekrar *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} value={form.passwordConfirm} onChange={(e) => setForm(prev => ({ ...prev, passwordConfirm: e.target.value }))} className="input-field pl-10" placeholder="Sifreyi tekrar girin" required />
            </div>
          </div>

          {/* Iletisim Izinleri */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-700">Iletisim Tercihleri</p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.agreeSms} onChange={(e) => setForm(prev => ({ ...prev, agreeSms: e.target.checked }))} className="w-4 h-4 text-primary mt-0.5 rounded" />
              <span className="text-xs text-gray-600 leading-relaxed">
                Kampanya, indirim ve firsatlardan <strong>SMS</strong> ile haberdar olmak istiyorum.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.agreeEmail} onChange={(e) => setForm(prev => ({ ...prev, agreeEmail: e.target.checked }))} className="w-4 h-4 text-primary mt-0.5 rounded" />
              <span className="text-xs text-gray-600 leading-relaxed">
                Kampanya, indirim ve firsatlardan <strong>E-Posta</strong> ile haberdar olmak istiyorum.
              </span>
            </label>
          </div>

          {/* Uyelik Sozlesmesi */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.agreeTerms} onChange={(e) => setForm(prev => ({ ...prev, agreeTerms: e.target.checked }))} className="w-4 h-4 text-primary mt-0.5 rounded" />
            <span className="text-xs text-gray-600 leading-relaxed">
              <Link href="/gizlilik-politikasi" target="_blank" className="text-primary font-medium hover:underline">Gizlilik Politikasi</Link> ve{' '}
              <Link href="/iade-politikasi" target="_blank" className="text-primary font-medium hover:underline">Uyelik Sozlesmesi</Link>&apos;ni okudum, kabul ediyorum. *
            </span>
          </label>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Kayit Olunuyor...' : 'Kayit Ol'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Zaten hesabiniz var mi?{' '}
            <Link href="/hesap/giris" className="text-primary font-medium hover:underline">Giris Yap</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
