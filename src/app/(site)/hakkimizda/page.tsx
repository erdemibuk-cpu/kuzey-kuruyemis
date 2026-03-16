import { Metadata } from 'next'
import Image from 'next/image'
import { Award, Leaf, Truck, Users, Heart, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakkimizda - Kuzey Kuruyemis',
  description: 'Kuzey Kuruyemis olarak en taze ve dogal kuruyemisleri Rize\'den kapilarınıza ulastiriyoruz.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Hakkimizda</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Dogadan sofraniza, en taze kuruyemisler</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-16">
          <div>
            <span className="text-accent font-semibold text-sm">HIKAYEMIZ</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-4">Kuzey Kuruyemis</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kuzey Kuruyemis olarak, Turkiye'nin dort bir yanindan ozenle secilmis en kaliteli kuruyemisleri, kuru meyveleri, baharatlari ve daha fazlasini sizlere ulastiriyoruz.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Rize'nin dogal guzellikleri arasinda kurulan firmamiz, musterilerimize her zaman en taze ve dogal urunleri sunmayi ilke edinmistir. Urunlerimiz, guvenilir tedarikçilerimizden temin edilmekte ve hijyenik kosullarda paketlenmektedir.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Amacimiz, saglikli ve lezzetli atistirmaliklari herkesin kolayca ulasabilecegi sekilde sunmak ve musterilerimize unutulmaz bir alisveris deneyimi yasamataktir.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden">
            <Image src="/images/IMG_3912.jpg" alt="Kuzey Kuruyemis Magazasi" width={600} height={800} className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        {/* Magaza Gorselleri */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-accent font-semibold text-sm">MAGAZAMIZ</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Rize'deki Magazamiz</h2>
            <p className="text-gray-500 text-sm mt-2">Piricelebi, Ataturk Cd. No:326/A, 53020 Rize Merkez/Rize</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: '/images/IMG_3913.jpg', alt: 'Kuzey Kuruyemis - Urun raflari' },
              { src: '/images/IMG_3915.jpg', alt: 'Kuzey Kuruyemis - Magaza ici' },
              { src: '/images/IMG_3916.jpg', alt: 'Kuzey Kuruyemis - Baharat raflari' },
              { src: '/images/IMG_3919.jpg', alt: 'Kuzey Kuruyemis - Kuruyemis tezgahi' },
              { src: '/images/IMG_3920.jpg', alt: 'Kuzey Kuruyemis - Magaza gorunumu' },
              { src: '/images/IMG_3912.jpg', alt: 'Kuzey Kuruyemis - Genel gorunum' },
            ].map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden group">
                <Image src={img.src} alt={img.alt} width={500} height={375} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-accent font-semibold text-sm">DEGERLERIMIZ</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Neden Bizi Tercih Etmelisiniz?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Leaf, title: '%100 Dogal', desc: 'Tum urunlerimiz katki maddesiz, dogal ve tazedir. Sagliginiz bizim icin onemli.' },
              { icon: Award, title: 'Premium Kalite', desc: 'Urunlerimiz Turkiye\'nin en iyi bolgelerinden ozenle secilmektedir.' },
              { icon: Truck, title: 'Hizli Teslimat', desc: '2-3 is gununde kargoya teslim. 1500 TL uzeri siparislerde ucretsiz kargo.' },
              { icon: ShieldCheck, title: 'Guvenli Alisveris', desc: '256-bit SSL sertifikasi ile guvenli odeme. PayTR altyapisi.' },
              { icon: Heart, title: 'Musteri Memnuniyeti', desc: 'Musterilerimizin memnuniyeti her zaman oncelgimizdir.' },
              { icon: Users, title: 'Uzman Kadro', desc: 'Deneyimli ekibimiz ile en iyi hizmeti sunuyoruz.' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-primary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center text-white">
            {[
              { value: '200+', label: 'Urun Cesidi' },
              { value: '10.000+', label: 'Mutlu Musteri' },
              { value: '50.000+', label: 'Tamamlanan Siparis' },
              { value: '4.8/5', label: 'Musteri Puani' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
