import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikasi - Kuzey Kuruyemis',
  description: 'Kuzey Kuruyemis gizlilik politikasi ve kisisel verilerin korunmasi hakkinda bilgilendirme.',
}

export default function PrivacyPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Gizlilik Politikasi</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-lg max-w-none">
        <p className="text-gray-500 text-sm mb-8">Son guncelleme: 16 Mart 2026</p>

        <h2>1. Genel Bilgilendirme</h2>
        <p>Kuzey Kuruyemis olarak, musterilerimizin gizliligine onem veriyoruz. Bu gizlilik politikasi, kisisel verilerinizin nasil toplandigi, kullanildigi ve korundugu hakkinda sizi bilgilendirmek amaciyla hazirlanmistir.</p>

        <h2>2. Toplanan Bilgiler</h2>
        <p>Sitemizi kullanirken asagidaki bilgiler toplanabilir:</p>
        <ul>
          <li>Ad, soyad, e-posta adresi ve telefon numarasi</li>
          <li>Teslimat ve fatura adresi bilgileri</li>
          <li>Siparis gecmisi ve alisveris tercihleri</li>
          <li>IP adresi, tarayici bilgileri ve cerez verileri</li>
        </ul>

        <h2>3. Bilgilerin Kullanimi</h2>
        <p>Toplanan bilgiler asagidaki amaclarla kullanilmaktadir:</p>
        <ul>
          <li>Siparis islemlerinin gerceklestirilmesi ve teslimat</li>
          <li>Musteri hizmetleri destegi saglanmasi</li>
          <li>Kampanya ve promosyon bilgilendirmelerinin yapilmasi (izin dahilinde)</li>
          <li>Yasal yukumluluklerin yerine getirilmesi</li>
        </ul>

        <h2>4. Bilgi Guvenligi</h2>
        <p>Kisisel verileriniz, 256-bit SSL sertifikasi ile sifrelenmekte ve guvenli sunucularda saklanmaktadir. Odeme bilgileriniz PayTR guvenli odeme altyapisi uzerinden islenmektedir ve firmamiz tarafindan saklanmamaktadir.</p>

        <h2>5. Cerezler (Cookies)</h2>
        <p>Sitemiz, kullanici deneyimini iyilestirmek amaciyla cerezler kullanmaktadir. Cerezler, alisveris sepetinizin hatirlanmasi, tercihlerinizin kaydedilmesi gibi islevleri yerine getirmektedir.</p>

        <h2>6. Ucuncu Taraflar</h2>
        <p>Kisisel bilgileriniz, siparis teslimat sureci disinda ucuncu taraflarla paylasilmaz. Kargo firmalari (Aras Kargo) yalnizca teslimat icin gerekli bilgilere erismektedir.</p>

        <h2>7. Haklariniz</h2>
        <p>6698 sayili Kisisel Verilerin Korunmasi Kanunu (KVKK) kapsaminda asagidaki haklara sahipsiniz:</p>
        <ul>
          <li>Kisisel verilerinizin islenip islenmedigini ogrenme</li>
          <li>Islenme amacini ve amacina uygun kullanilip kullanilmadigini ogrenme</li>
          <li>Eksik veya yanlis islenmisse duzeltilmesini isteme</li>
          <li>Silinmesini veya yok edilmesini isteme</li>
        </ul>

        <h2>8. Iletisim</h2>
        <p>Gizlilik politikamiz hakkinda sorulariniz icin bizimle iletisime gecebilirsiniz:</p>
        <ul>
          <li><strong>Telefon:</strong> 0541 256 53 52</li>
          <li><strong>Adres:</strong> Piricelebi, Ataturk Cd. No:326/A, 53020 Rize Merkez/Rize</li>
        </ul>
      </div>
    </div>
  )
}
