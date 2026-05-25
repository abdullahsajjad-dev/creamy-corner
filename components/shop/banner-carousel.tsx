'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const banners = [
  {
    id: 1,
    title: 'Premium Kulfi Collection',
    subtitle: 'Creamy, Traditional & Delicious',
    description: 'Experience authentic Pakistani kulfi made from pure milk',
    emoji: '🍨',
    gradient: 'from-violet-600 via-purple-600 to-pink-600',
    badge: 'NEW ARRIVALS',
  },
  {
    id: 2,
    title: 'Summer Specials',
    subtitle: 'Cool Off This Season',
    description: 'Get 20% off on all summer flavors — limited time offer',
    emoji: '☀️',
    gradient: 'from-rose-500 via-pink-500 to-orange-400',
    badge: '20% OFF',
  },
  {
    id: 3,
    title: 'Gourmet Sundaes',
    subtitle: 'Topped with Love',
    description: 'Indulge in our lavish sundae collection with premium toppings',
    emoji: '🍫',
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
    badge: 'BEST SELLER',
  },
  {
    id: 4,
    title: 'Crispy Cone Paradise',
    subtitle: 'Fresh & Creamy',
    description: 'Freshly made crispy waffle cones with your favorite flavors',
    emoji: '🍦',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    badge: 'CUSTOMER FAVORITE',
  },
  {
    id: 5,
    title: 'Signature Falooda',
    subtitle: 'Unique & Refreshing',
    description: 'Try our signature falooda & specialty drinks — exclusively at Creamy Corner',
    emoji: '🥤',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    badge: 'SIGNATURE',
  },
]

export function BannerCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const t = setInterval(() => setCurrent(p => (p + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [autoPlay])

  const prev = () => { setCurrent(p => (p - 1 + banners.length) % banners.length); setAutoPlay(false) }
  const next = () => { setCurrent(p => (p + 1) % banners.length); setAutoPlay(false) }

  const b = banners[current]

  return (
    <div className="w-full mb-12" onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>
      <div className={`relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-r ${b.gradient} shadow-2xl transition-all duration-700`}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-24 -translate-y-24 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* Content */}
        <div className="relative h-full flex items-center px-8 md:px-16 gap-8">
          <div className="flex-1 text-white space-y-3">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] font-black tracking-wider px-3 py-1 rounded-full border border-white/30">
              {b.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">{b.title}</h2>
            <p className="text-lg md:text-xl font-light text-white/90">{b.subtitle}</p>
            <p className="text-sm md:text-base text-white/75 max-w-sm hidden md:block">{b.description}</p>
            <Button
              className="bg-white hover:bg-white/90 text-gray-900 font-bold px-7 py-2.5 rounded-full text-sm mt-2 shadow-md"
              onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
            >
              Shop Now →
            </Button>
          </div>
          <div className="hidden md:block text-8xl lg:text-9xl opacity-25 select-none pointer-events-none">
            {b.emoji}
          </div>
        </div>

        {/* Nav buttons */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all hover:scale-110 border border-white/30">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all hover:scale-110 border border-white/30">
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Slide number */}
        <div className="absolute bottom-4 right-5 text-white/60 text-xs font-medium">
          {current + 1} / {banners.length}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setAutoPlay(false) }}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'bg-primary w-7 h-2.5' : 'bg-border hover:bg-muted-foreground/50 w-2.5 h-2.5'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
