'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface BannerItem {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
}

export function BannerSlider({ banners }: { banners: BannerItem[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const slides = banners.length > 0 ? banners : [
    { id: 'default1', title: 'Taze Kuruyemisler', subtitle: 'En kaliteli kuruyemisler uygun fiyatlarla kapinizda!', image: '', link: '/kuruyemisler' },
    { id: 'default2', title: 'Kampanyali Urunler', subtitle: '%30\'a varan indirimlerle alismak icin tiklayin', image: '', link: '/kampanyalar' },
  ]

  return (
    <div className="relative w-full h-[250px] md:h-[420px] overflow-hidden bg-primary">
      {slides.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="w-full h-full flex items-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />

            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute right-1/4 bottom-0 w-48 h-48 bg-accent/10 rounded-full" />

            {banner.image && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-2xl">
                <span className="inline-block bg-accent/90 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  KUZEY KURUYEMIS
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-base md:text-lg text-white/80 mb-6 max-w-lg">{banner.subtitle}</p>
                )}
                {banner.link && (
                  <Link
                    href={banner.link}
                    className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors shadow-lg shadow-accent/30"
                  >
                    Hemen Incele
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white p-2.5 rounded-full transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setCurrent(prev => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white p-2.5 rounded-full transition-all"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-full transition-all ${
                  index === current ? 'bg-white w-8 h-2.5' : 'bg-white/40 w-2.5 h-2.5'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
