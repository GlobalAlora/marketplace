'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const FRASES = [
  'Conectando oportunidades.',
  'Encontrá lo que buscás.',
  'Publicá lo que ofrecés.',
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

export default function Hero() {
  const [fraseIdx, setFraseIdx] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setFraseIdx(i => (i + 1) % FRASES.length)
        setFadeIn(true)
      }, 380)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-[#0D0F14] text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0D0F14]/85" aria-hidden="true" />

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:items-center">

          {/* Left: headline + animated subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Conectamos lo que buscas,{' '}
              <span className="text-[#FFC107]">con lo que se vende.</span>
            </h1>

            <div className="mt-5 h-8 overflow-hidden">
              <p
                className="text-base sm:text-lg text-gray-200 font-medium leading-relaxed transition-opacity duration-380"
                style={{ opacity: fadeIn ? 1 : 0 }}
              >
                {FRASES[fraseIdx]}
              </p>
            </div>

            <div className="mt-3 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-[#FFC107] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.076 3.218-4.688 3.218-7.327 0-5.19-4.054-9-9-9s-9 3.81-9 9c0 2.639 1.274 5.251 3.218 7.327a19.579 19.579 0 002.682 2.282 16.944 16.944 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Comodoro Rivadavia, Rada Tilly y toda la región patagónica.
              </p>
            </div>
          </div>

          {/* Right: 3 user-type cards */}
          <div className="w-full lg:w-[360px] xl:w-[400px] lg:shrink-0 flex flex-col gap-3">
            {CARDS.map((card) => (
              <Link
                key={card.pregunta}
                href={card.href}
                className="group flex items-center gap-4 bg-white/7 border border-white/12 rounded-2xl p-4 hover:bg-white/12 hover:border-white/25 transition-all duration-200"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                >
                  {card.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm leading-snug">{card.pregunta}</p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5 line-clamp-2">{card.descripcion}</p>
                </div>

                {/* Arrow */}
                <span className="text-[#FFC107] text-sm font-bold shrink-0 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
