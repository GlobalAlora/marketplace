'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { SiteConfig } from '@/lib/site-config'

const FRASES = [
  { text: 'Conectando oportunidades.', color: '#FFC107' },
  { text: 'Encontrá lo que buscás.',   color: '#ffffff' },
  { text: 'Publicá lo que ofrecés.',   color: '#7cb9ff' },
]

function IconSearch() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function IconTag() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  )
}

const CARDS = [
  {
    icon: <IconSearch />,
    iconBg: '#FFC107',
    iconColor: '#0D0F14',
    pregunta: '¿Buscás tu próximo auto?',
    descripcion: 'AUTODUX es el sitio N.º 1 para encontrar vehículos en la Patagonia.',
    cta: 'Encontrá tu auto',
    href: '/vehiculos',
  },
  {
    icon: <IconTag />,
    iconBg: '#282F8F',
    iconColor: '#ffffff',
    pregunta: '¿Querés vender tu auto?',
    descripcion: 'Publicá de forma rápida y sencilla en AUTODUX.',
    cta: 'Vendé tu auto',
    href: '/auth/registro',
  },
  {
    icon: <IconBuilding />,
    iconBg: '#1a3a6b',
    iconColor: '#FFC107',
    pregunta: '¿Tenés una agencia?',
    descripcion: 'Publicá tu stock, recibí consultas reales y gestioná tus vehículos desde un panel profesional.',
    cta: 'Publicá tu stock',
    href: '/auth/registro',
  },
]

export default function Hero({ config = {} }: { config?: SiteConfig }) {
  const [faseIdx, setFaseIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  const tituloLinea1  = config.hero_titulo_linea1  ?? 'Conectamos lo que buscas,'
  const tituloLinea2  = config.hero_titulo_linea2  ?? 'con lo que se vende.'
  const subtitulo     = config.hero_subtitulo      ?? 'Comodoro Rivadavia, Rada Tilly y toda la región patagónica.'
  const imagenFondo   = config.hero_imagen_fondo   ?? 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600'

  useEffect(() => {
    const cycle = () => {
      // fade out
      setVisible(false)
      const next = setTimeout(() => {
        // swap text + fade in
        setFaseIdx(i => (i + 1) % FRASES.length)
        setVisible(true)
      }, 450)
      return next
    }
    const interval = setInterval(cycle, 2800)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative bg-[#0D0F14] text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imagenFondo})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0D0F14]/85" aria-hidden="true" />
      {/* subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} aria-hidden="true" />

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:items-center">

          {/* Left: headline + animated subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
              {tituloLinea1}{' '}
              <span className="text-[#FFC107]">{tituloLinea2}</span>
            </h1>

            {/* Frase rotante — aparece, desaparece, siguiente */}
            <div className="mt-6 h-9 flex items-center">
              <div
                className="flex items-center gap-3"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: FRASES[faseIdx].color }}
                  aria-hidden="true"
                />
                <p
                  className="text-lg sm:text-xl font-semibold leading-snug"
                  style={{ color: FRASES[faseIdx].color }}
                >
                  {FRASES[faseIdx].text}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2">
              {/* Map pin icon */}
              <svg className="w-5 h-5 mt-0.5 text-[#FFC107] shrink-0" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
                <path d="M32 2C20.402 2 11 11.402 11 23c0 15.274 19.2 37.41 20.026 38.36a1.3 1.3 0 001.948 0C33.8 60.41 53 38.274 53 23 53 11.402 43.598 2 32 2zm0 30a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                {subtitulo}
              </p>
            </div>
          </div>

          {/* Right: 3 user-type cards */}
          <div className="w-full lg:w-[360px] xl:w-[400px] lg:shrink-0 flex flex-col gap-3">
            {CARDS.map((card, i) => (
              <div
                key={card.pregunta}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'opacity 0.55s ease, transform 0.55s ease',
                  transitionDelay: `${i * 100 + 200}ms`,
                }}
              >
                <Link
                  href={card.href}
                  className="group flex items-center gap-4 bg-white/7 border border-white/12 rounded-2xl p-4 hover:bg-white/12 hover:border-white/25 hover:shadow-lg hover:shadow-black/30 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-snug">{card.pregunta}</p>
                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5 line-clamp-2">{card.descripcion}</p>
                  </div>
                  <span className="text-[#FFC107] text-sm font-bold shrink-0 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
