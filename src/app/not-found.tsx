import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sayfa Bulunamadi</h1>
        <p className="text-gray-500 mb-6">Aradiginiz sayfa mevcut degil veya kaldirilmis olabilir.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
            Anasayfa
          </Link>
          <Link href="/iletisim" className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
            Iletisim
          </Link>
        </div>
      </div>
    </div>
  )
}
