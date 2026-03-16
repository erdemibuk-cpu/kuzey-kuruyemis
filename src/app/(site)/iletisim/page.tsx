import { Metadata } from 'next'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Iletisim - Kuzey Kuruyemis',
  description: 'Kuzey Kuruyemis iletisim bilgileri. Rize merkezde hizmetinizdeyiz.',
}

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Iletisim</h1>
          <p className="text-lg text-white/80">Sorulariniz icin bize ulasabilirsiniz</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Telefon</h3>
                  <a href="tel:05412565352" className="text-accent font-medium hover:underline">0541 256 53 52</a>
                  <p className="text-xs text-gray-400 mt-1">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">WhatsApp</h3>
                  <a href="https://wa.me/905412565352" target="_blank" className="text-accent font-medium hover:underline">0541 256 53 52</a>
                  <p className="text-xs text-gray-400 mt-1">Hizli destek icin yazin</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">E-Posta</h3>
                  <a href="mailto:info@kuzeykuruyemis.com" className="text-accent font-medium hover:underline">info@kuzeykuruyemis.com</a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Adres</h3>
                  <p className="text-sm text-gray-600">Piricelebi, Ataturk Cd. No:326/A, 53020 Rize Merkez/Rize</p>
                </div>
              </div>
            </div>

            {/* Magaza Gorseli */}
            <div className="rounded-2xl overflow-hidden">
              <Image src="/images/IMG_3912.jpg" alt="Kuzey Kuruyemis Magazasi - Rize" width={500} height={350} className="w-full h-48 object-cover rounded-2xl" />
            </div>

            {/* Banka Bilgileri */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-2xl">
              <h3 className="font-bold mb-3">Havale / EFT Bilgileri</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-white/60">Hesap Sahibi:</span>
                  <span className="font-medium ml-2">Murat Devran</span>
                </div>
                <div>
                  <span className="text-white/60">IBAN:</span>
                  <span className="font-mono font-medium ml-2 text-xs">TR20 0004 6000 9988 8000 3957 31</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form + Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.5!2d40.5217!3d41.0201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAxJzEyLjQiTiA0MMKwMzEnMTguMSJF!5e0!3m2!1str!2str!4v1710000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Bize Yazin</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                    <input type="text" className="input-field" placeholder="Adiniz Soyadiniz" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                    <input type="email" className="input-field" placeholder="ornek@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <input type="text" className="input-field" placeholder="Mesajinizin konusu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                  <textarea rows={5} className="input-field" placeholder="Mesajinizi yazin..." />
                </div>
                <button type="submit" className="btn-primary">Gonder</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Magazamiz */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <span className="text-accent font-semibold text-sm">MAGAZAMIZ</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Rize Magazamiz</h2>
          <p className="text-gray-500 text-sm mt-2">Piricelebi, Ataturk Cd. No:326/A, 53020 Rize Merkez/Rize</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { src: '/images/IMG_3912.jpg', alt: 'Kuzey Kuruyemis - Magaza genel gorunum' },
            { src: '/images/IMG_3913.jpg', alt: 'Kuzey Kuruyemis - Urun raflari' },
            { src: '/images/IMG_3915.jpg', alt: 'Kuzey Kuruyemis - Magaza ici' },
            { src: '/images/IMG_3916.jpg', alt: 'Kuzey Kuruyemis - Baharat ve urun cesitleri' },
            { src: '/images/IMG_3919.jpg', alt: 'Kuzey Kuruyemis - Kuruyemis tezgahi' },
            { src: '/images/IMG_3920.jpg', alt: 'Kuzey Kuruyemis - Magaza vitrin' },
          ].map((img, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ minHeight: i === 0 ? '100%' : '200px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
