import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Truck, Shield, RotateCcw, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <Truck className="text-accent flex-shrink-0" size={32} />
            <div>
              <div className="font-semibold text-white text-sm">Ucretsiz Kargo</div>
              <div className="text-xs">1500 TL ustu siparislerde</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="text-accent flex-shrink-0" size={32} />
            <div>
              <div className="font-semibold text-white text-sm">Guvenli Odeme</div>
              <div className="text-xs">256-bit SSL sertifikasi</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="text-accent flex-shrink-0" size={32} />
            <div>
              <div className="font-semibold text-white text-sm">Kolay Iade</div>
              <div className="text-xs">15 gun icerisinde iade</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-accent flex-shrink-0" size={32} />
            <div>
              <div className="font-semibold text-white text-sm">Hizli Teslimat</div>
              <div className="text-xs">2-3 is gununde kargoda</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {/* About */}
        <div>
          <Image
            src="/images/logo-final.png"
            alt="Kuzey Kuruyemiş"
            width={160}
            height={70}
            className="h-14 w-auto mb-2 brightness-0 invert"
          />
          <p className="text-sm leading-relaxed mb-4">
            En taze ve dogal kuruyemisler, ozenle secilmis urunler ile sofraniza lezzet katiyoruz.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
              <span className="text-xs font-bold">f</span>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
              <span className="text-xs font-bold">in</span>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
              <span className="text-xs font-bold">tk</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-white mb-4">Kategoriler</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/kuruyemisler" className="hover:text-accent transition-colors">Kuruyemisler</Link></li>
            <li><Link href="/kuru-meyveler" className="hover:text-accent transition-colors">Kuru Meyveler</Link></li>
            <li><Link href="/lokum-sekerleme" className="hover:text-accent transition-colors">Lokum & Sekerleme</Link></li>
            <li><Link href="/baharatlar" className="hover:text-accent transition-colors">Baharatlar</Link></li>
            <li><Link href="/cikolata-seker" className="hover:text-accent transition-colors">Cikolata & Seker</Link></li>
            <li><Link href="/kahve-cay" className="hover:text-accent transition-colors">Kahve & Cay</Link></li>
          </ul>
        </div>

        {/* Corporate */}
        <div>
          <h4 className="font-semibold text-white mb-4">Kurumsal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/hakkimizda" className="hover:text-accent transition-colors">Hakkimizda</Link></li>
            <li><Link href="/iletisim" className="hover:text-accent transition-colors">Iletisim</Link></li>
            <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            <li><Link href="/gizlilik-politikasi" className="hover:text-accent transition-colors">Gizlilik Politikasi</Link></li>
            <li><Link href="/iade-politikasi" className="hover:text-accent transition-colors">Iade Politikasi</Link></li>
            <li><Link href="/iletisim" className="hover:text-accent transition-colors">Siparis Takibi</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Iletisim</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <span>0541 256 53 52</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <span>info@kuzeykuruyemis.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <span>Piricelebi, Ataturk Cd. No:326/A, 53020 Rize Merkez/Rize</span>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-6">
            <h5 className="text-sm font-semibold text-white mb-2">Bulten Aboneligi</h5>
            <div className="flex">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button className="bg-accent text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-accent-dark transition-colors">
                Abone Ol
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <span>&copy; 2026 Kuzey Kuruyemis. Tum haklari saklidir.</span>
          <span>
            Altyapi: <a href="#" className="text-accent hover:underline">EHYSOFT</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
