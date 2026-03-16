import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iade Politikasi - Kuzey Kuruyemis',
  description: 'Kuzey Kuruyemis iade ve degisim kosullari hakkinda bilgilendirme.',
}

export default function ReturnPolicyPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Iade Politikasi</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-lg max-w-none">
        <p className="text-gray-500 text-sm mb-8">Son guncelleme: 16 Mart 2026</p>

        <h2>1. Genel Iade Kosullari</h2>
        <p>Kuzey Kuruyemis olarak musteri memnuniyetini on planda tutuyoruz. Asagidaki kosullar dahilinde iade ve degisim islemlerinizi gerceklestirebilirsiniz.</p>

        <h2>2. Iade Suresi</h2>
        <p>Urunlerinizi teslim aldiginiz tarihten itibaren <strong>15 gun</strong> icerisinde iade edebilirsiniz. 15 gunluk sure disindaki iade talepleri kabul edilmemektedir.</p>

        <h2>3. Iade Sartlari</h2>
        <ul>
          <li>Urun, orijinal ambalajinda ve acilmamis olmalidir</li>
          <li>Gida urunlerinde hijyen nedeniyle acilmis paketler iade alinamaz</li>
          <li>Urunun hasarli veya hatali gelmesi durumunda, acilmis olsa dahi iade kabul edilir</li>
          <li>Kargo sirasinda olusan hasarlar icin teslimattan itibaren 3 gun icerisinde bildirim yapilmalidir</li>
        </ul>

        <h2>4. Iade Sureci</h2>
        <ol>
          <li><strong>Iletisime Gecin:</strong> 0541 256 53 52 numarasindan veya WhatsApp uzerinden iade talebinizi iletin</li>
          <li><strong>Onay Alin:</strong> Ekibimiz iade talebinizi degerlendirecek ve onay verecektir</li>
          <li><strong>Kargoya Verin:</strong> Urunu orijinal ambalajinda kargoya teslim edin</li>
          <li><strong>Iade Tutari:</strong> Urun elimize ulastiktan sonra 3 is gunu icerisinde odemeniz iade edilir</li>
        </ol>

        <h2>5. Iade Kargo Ucreti</h2>
        <ul>
          <li>Hatali veya hasarli urun iadellerinde kargo ucreti firmamiz tarafindan karsilanir</li>
          <li>Musteriden kaynakli iadelerde kargo ucreti musteriye aittir</li>
        </ul>

        <h2>6. Para Iadesi</h2>
        <p>Iade islemleri asagidaki sekilde gerceklestirilir:</p>
        <ul>
          <li><strong>Kredi Karti:</strong> Iade tutari, odeme yapilan karta 5-10 is gunu icerisinde yansitilir</li>
          <li><strong>Havale/EFT:</strong> Belirtilen IBAN numarasina 3 is gunu icerisinde transfer edilir</li>
        </ul>

        <h2>7. Degisim</h2>
        <p>Urun degisimi icin oncelikle iade sureci baslatilir, ardindan yeni siparis olusturulur. Fiyat farki varsa ek odeme veya iade yapilir.</p>

        <h2>8. Iletisim</h2>
        <div className="bg-gray-50 p-6 rounded-xl not-prose">
          <p className="font-medium text-gray-800 mb-2">Iade ve degisim islemleriniz icin:</p>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><strong>Telefon:</strong> 0541 256 53 52</li>
            <li><strong>WhatsApp:</strong> 0541 256 53 52</li>
            <li><strong>Adres:</strong> Piricelebi, Ataturk Cd. No:326/A, 53020 Rize Merkez/Rize</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
