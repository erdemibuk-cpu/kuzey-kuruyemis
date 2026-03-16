'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { cityNames, cities } from '@/lib/cities'
import Link from 'next/link'
import { ShoppingBag, CreditCard, Building2, ChevronRight, Copy, Check, Truck, ShieldCheck, Phone } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingCity: '',
    shippingDistrict: '',
    shippingAddress: '',
    shippingZipCode: '',
    billingName: '',
    billingSame: true,
    billingAddress: '',
    billingCity: '',
    billingTaxNo: '',
    note: '',
    paymentMethod: 'havale',
    agreeTerms: false,
    agreePrivacy: false,
  })

  const districts = useMemo(() => {
    return form.shippingCity ? (cities[form.shippingCity] || []) : []
  }, [form.shippingCity])

  const shippingFree = totalPrice >= 1500
  const shippingCost = shippingFree ? 0 : 49.90
  const grandTotal = totalPrice + shippingCost

  const handleCopyIban = () => {
    navigator.clipboard.writeText('TR20 0004 6000 9988 8000 3957 31')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const update = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateStep1 = () => {
    const errs: Record<string, string> = {}
    if (!form.shippingName.trim()) errs.shippingName = 'Ad Soyad zorunludur'
    if (!form.shippingPhone.trim()) errs.shippingPhone = 'Telefon zorunludur'
    else if (form.shippingPhone.replace(/\D/g, '').length < 10) errs.shippingPhone = 'Gecerli bir telefon numarasi girin'
    if (!form.shippingCity) errs.shippingCity = 'Il seciniz'
    if (!form.shippingDistrict) errs.shippingDistrict = 'Ilce seciniz'
    if (!form.shippingAddress.trim()) errs.shippingAddress = 'Adres zorunludur'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    if (!form.agreeTerms) errs.agreeTerms = 'Satis sozlesmesini kabul etmelisiniz'
    if (!form.agreePrivacy) errs.agreePrivacy = 'Gizlilik politikasini kabul etmelisiniz'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingName: form.shippingName,
          shippingPhone: form.shippingPhone,
          shippingCity: `${form.shippingCity} / ${form.shippingDistrict}`,
          shippingAddress: form.shippingAddress,
          note: form.note || null,
          paymentMethod: form.paymentMethod,
          items: items.map(item => ({
            productId: item.productId,
            variantName: item.variantName,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: grandTotal,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrderId(data.id)
        setStep(3)
        clearCart()
      } else {
        alert(data.error || 'Siparis olusturulamadi')
      }
    } catch {
      alert('Bir hata olustu')
    }
    setLoading(false)
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz Bos</h1>
        <Link href="/" className="btn-primary mt-4 inline-block">Alisverise Basla</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[{ n: 1, label: 'Teslimat Bilgileri' }, { n: 2, label: 'Odeme' }, { n: 3, label: 'Siparis Onay' }].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step > s.n ? 'bg-green-500 text-white' : step === s.n ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s.n ? <Check size={16} /> : s.n}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${step >= s.n ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
            {i < 2 && <ChevronRight size={16} className="text-gray-300 mx-1 sm:mx-3" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-6">Teslimat Bilgileri</h1>

              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
                {/* Ad Soyad + Telefon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input type="text" value={form.shippingName} onChange={(e) => update('shippingName', e.target.value)} className={`input-field ${errors.shippingName ? 'border-red-400 ring-1 ring-red-400' : ''}`} placeholder="Adiniz Soyadiniz" />
                    {errors.shippingName && <p className="text-red-500 text-xs mt-1">{errors.shippingName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" value={form.shippingPhone} onChange={(e) => update('shippingPhone', e.target.value)} className={`input-field pl-10 ${errors.shippingPhone ? 'border-red-400 ring-1 ring-red-400' : ''}`} placeholder="05XX XXX XX XX" />
                    </div>
                    {errors.shippingPhone && <p className="text-red-500 text-xs mt-1">{errors.shippingPhone}</p>}
                  </div>
                </div>

                {/* Il + Ilce */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Il *</label>
                    <select value={form.shippingCity} onChange={(e) => { update('shippingCity', e.target.value); setForm(prev => ({ ...prev, shippingDistrict: '' })) }} className={`input-field ${errors.shippingCity ? 'border-red-400 ring-1 ring-red-400' : ''}`}>
                      <option value="">Il Seciniz</option>
                      {cityNames.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    {errors.shippingCity && <p className="text-red-500 text-xs mt-1">{errors.shippingCity}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ilce *</label>
                    <select value={form.shippingDistrict} onChange={(e) => update('shippingDistrict', e.target.value)} className={`input-field ${errors.shippingDistrict ? 'border-red-400 ring-1 ring-red-400' : ''}`} disabled={!form.shippingCity}>
                      <option value="">Ilce Seciniz</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.shippingDistrict && <p className="text-red-500 text-xs mt-1">{errors.shippingDistrict}</p>}
                  </div>
                </div>

                {/* Adres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Acik Adres *</label>
                  <textarea rows={3} value={form.shippingAddress} onChange={(e) => update('shippingAddress', e.target.value)} className={`input-field ${errors.shippingAddress ? 'border-red-400 ring-1 ring-red-400' : ''}`} placeholder="Mahalle, sokak, bina no, daire no..." />
                  {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>}
                </div>

                {/* Posta Kodu */}
                <div className="w-full sm:w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                  <input type="text" value={form.shippingZipCode} onChange={(e) => update('shippingZipCode', e.target.value)} className="input-field" placeholder="XXXXX" maxLength={5} />
                </div>

                {/* Siparis Notu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Siparis Notu <span className="text-gray-400 font-normal">(istege bagli)</span></label>
                  <textarea rows={2} value={form.note} onChange={(e) => update('note', e.target.value)} className="input-field" placeholder="Varsa ozel istekleriniz..." />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link href="/sepet" className="btn-outline">Sepete Don</Link>
                <button onClick={() => { if (validateStep1()) setStep(2) }} className="btn-primary flex-1">Odemeye Gec</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-6">Odeme Yontemi</h1>

              <div className="space-y-4">
                {/* Havale/EFT */}
                <label className={`block bg-white rounded-xl border-2 p-5 cursor-pointer transition-colors ${
                  form.paymentMethod === 'havale' ? 'border-primary bg-primary/[0.02]' : 'border-gray-100 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="havale" checked={form.paymentMethod === 'havale'} onChange={() => update('paymentMethod', 'havale')} className="w-5 h-5 text-primary" />
                    <Building2 size={22} className="text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Havale / EFT</div>
                      <div className="text-xs text-gray-500">Banka havalesi ile odeme yapin</div>
                    </div>
                  </div>
                  {form.paymentMethod === 'havale' && (
                    <div className="mt-4 ml-9 bg-primary/5 rounded-lg p-4">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-gray-500">Hesap Sahibi:</span><span className="font-semibold text-gray-800">Murat Devran</span></div>
                        <div>
                          <span className="text-gray-500 text-xs">IBAN:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-white px-3 py-1.5 rounded-lg text-sm font-mono border flex-1 select-all">TR20 0004 6000 9988 8000 3957 31</code>
                            <button type="button" onClick={handleCopyIban} className="p-2 bg-white border rounded-lg hover:bg-gray-50">
                              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">Siparisiniz odeme teyidi sonrasi hazirlanmaya baslanacaktir. Aciklama kismina siparis numaranizi yazmayi unutmayin.</p>
                    </div>
                  )}
                </label>

                {/* Kredi Karti */}
                <label className="block bg-white rounded-xl border-2 border-gray-100 p-5 opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="paytr" disabled className="w-5 h-5" />
                    <CreditCard size={22} className="text-gray-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-600">Kredi / Banka Karti</div>
                      <div className="text-xs text-gray-400">Yakin zamanda aktif olacaktir</div>
                    </div>
                    <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">YAKINDA</span>
                  </div>
                </label>
              </div>

              {/* Sozlesmeler */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms} onChange={(e) => update('agreeTerms', e.target.checked)} className="w-4 h-4 text-primary mt-0.5 rounded" />
                  <span className="text-sm text-gray-600">
                    <Link href="/iade-politikasi" target="_blank" className="text-primary font-medium hover:underline">Mesafeli Satis Sozlesmesi</Link> ve <Link href="/iade-politikasi" target="_blank" className="text-primary font-medium hover:underline">Iade Politikasi</Link>&apos;ni okudum, kabul ediyorum. *
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs ml-7">{errors.agreeTerms}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreePrivacy} onChange={(e) => update('agreePrivacy', e.target.checked)} className="w-4 h-4 text-primary mt-0.5 rounded" />
                  <span className="text-sm text-gray-600">
                    <Link href="/gizlilik-politikasi" target="_blank" className="text-primary font-medium hover:underline">Gizlilik Politikasi</Link>&apos;ni okudum, kabul ediyorum. *
                  </span>
                </label>
                {errors.agreePrivacy && <p className="text-red-500 text-xs ml-7">{errors.agreePrivacy}</p>}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline">Geri</button>
                <button onClick={handleSubmit} disabled={loading} className="btn-accent flex-1 disabled:opacity-50">
                  {loading ? 'Siparis Olusturuluyor...' : `Siparisi Onayla - ${formatPrice(grandTotal)}`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Siparisiniz Alindi!</h1>
              <p className="text-gray-500 mb-1">Siparis numaraniz:</p>
              <p className="font-mono font-bold text-xl text-primary mb-8">#{orderId.slice(-8)}</p>

              <div className="max-w-md mx-auto bg-primary/5 rounded-xl p-6 text-left">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Building2 size={18} className="text-primary" />
                  Havale / EFT Bilgileri
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Hesap Sahibi:</span><span className="font-semibold">Murat Devran</span></div>
                  <div>
                    <span className="text-gray-500 text-xs">IBAN:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-white px-3 py-1.5 rounded-lg text-sm font-mono border flex-1 select-all">TR20 0004 6000 9988 8000 3957 31</code>
                      <button onClick={handleCopyIban} className="p-2 bg-white border rounded-lg hover:bg-gray-50">
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between"><span className="text-gray-500">Tutar:</span><span className="font-bold text-primary text-lg">{formatPrice(grandTotal)}</span></div>
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800"><strong>Onemli:</strong> Havale aciklamasina siparis numaranizi (<strong>#{orderId.slice(-8)}</strong>) yazin. Odeme teyidi sonrasi siparisiniz hazirlanacaktir.</p>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/" className="btn-primary">Alisverise Devam Et</Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Order Summary (step 1 & 2) */}
        {step < 3 && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-28">
              <h3 className="font-bold text-gray-800 mb-4">Siparis Ozeti</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.product.images?.[0]?.url || ''})` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{item.product.name}</div>
                      {item.variantName && <div className="text-xs text-gray-400">{item.variantName}</div>}
                      <div className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price)}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ara Toplam</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kargo</span>
                  <span className={shippingFree ? 'text-green-600 font-medium' : ''}>{shippingFree ? 'Ucretsiz' : formatPrice(shippingCost)}</span>
                </div>
                {!shippingFree && <p className="text-[11px] text-accent">{formatPrice(1500 - totalPrice)} daha ekleyin, kargo bedava!</p>}
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">Toplam</span>
                  <span className="font-bold text-xl text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>256-bit SSL ile guvenli alisveris</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck size={14} className="text-green-600" />
                  <span>2-3 is gununde kargoda</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
