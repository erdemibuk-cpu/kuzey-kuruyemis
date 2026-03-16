import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { FavoriteProvider } from '@/context/FavoriteContext'

export const metadata: Metadata = {
  title: 'Kuzey Kuruyemis - Taze ve Dogal Kuruyemis',
  description: 'En taze kuruyemis, kuru meyve, baharat ve daha fazlasi. Guvenli alisveris, hizli kargo.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>
          <FavoriteProvider>
            {children}
          </FavoriteProvider>
        </CartProvider>
      </body>
    </html>
  )
}
