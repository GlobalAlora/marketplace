'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import RevealSection from '@/components/ui/RevealSection'

/* ─── Beneficios lista (columna izquierda) ─────────────────────────────────── */
const LISTA = [
  { text: 'Compará vehículos de múltiples agencias' },
  { text: 'Ahorrá tiempo y kilómetros de búsqueda' },
  { text: 'Contacto directo con vendedores' },
  { text: 'Agencias verificadas' },
  { text: 'Publicaciones actualizadas diariamente' },
  { text: 'Diseñado para el mercado patagónico' },
]

/* ─── Cards del carrusel (columna derecha) ─────────────────────────────────── */
interface CarouselCard {
  icon: React.ReactNode
  accent: string
  titulo: string
  descripcion: string
  detalle: string
}

function IconCompare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}

function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

const CARDS: CarouselCard[] = [
  {
    icon: <IconCompare />,
    accent: '#FFC107',
    titulo: 'Compará sin moverte',
    descripcion: 'Accedé al stock completo de múltiples agencias desde un solo lugar. Sin recorrer la ciudad, sin perder tiempo comparando publicaciones dispersas.',
    detalle: '20+ agencias en toda la Patagonia',
  },
  {
    icon: <IconClock />,
    accent: '#7cb9ff',
    titulo: 'Ahorrá tiempo y kilómetros',
    descripcion: 'Filtrá por marca, modelo, precio y ubicación en segundos. Encontrá exactamente lo que buscás sin visitar cada agencia por separado.',
    detalle: 'Todo en un solo lugar',
  },
  {
    icon: <IconChat />,
    accent: '#25D366',
    titulo: 'Contacto directo',
    descripcion: 'Hablá directamente con el vendedor por WhatsApp. Sin intermediarios, sin formularios, sin esperar respuestas automáticas.',
    detalle: 'WhatsApp directo al instante',
  },
  {
    icon: <IconShield />,
    accent: '#FFC107',
    titulo: 'Agencias verificadas',
    descripcion: 'Cada agencia en AUTODUX pasó por un proceso de verificación. Comprás con la tranquilidad de saber que estás tratando con vendedores reales.',
    detalle: '100% de agencias validadas',
  },
  {
    icon: <IconRefresh />,
    accent: '#7cb9ff',
    titulo: 'Siempre actualizado',
    descripcion: 'El inventario se actualiza diariamente. Ves los precios reales, el stock disponible y los vehículos que acaban de publicarse.',
    detalle: 'Actualizaciones diarias',
  },
  {
    icon: <IconMap />,
    accent: '#f97316',
    titulo: 'Hecho para la Patagonia',
    descripcion: 'AUTODUX nació en Comodoro Rivadavia pensando en la realidad del mercado automotor patagónico. Toda la oferta de Chubut, Santa Cruz, Río Negro y Neuquén.',
    detalle: 'Patagonia completa',
  },
]

/* ─── Dot indicator ───────────────────────────────────────────────────────── */
function Dot({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Ir a esta tarjeta"
      className={`rounded-full transition-all duration-300 ${
        active ? 'w-6 h-2 bg-[#FFC107]' : 'w-2 h-2 bg-white/25 hover:bg-white/50'
      }`}
    />
  )
}

/* ─── Flecha de navegación ────────────────────────────────────────────────── */
function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Anterior' : 'Siguiente'}
      className="w-9 h-9 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-gray-300 hover:bg-white/15 hover:text-white transition-all duration-200 shrink-0"
    >
      {dir === 'prev' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      )}
    </button>
  )
}

/* ─── Componente principal ────────────────────────────────────────────────── */
export default function SeccionBeneficios() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  /* anima la tarjeta activa en la entrada */
  const animateIn = useCallback((fromRight = true) => {
    const el = cardRef.current
    if (!el) return
    el.style.transition = 'none'
    el.style.opacity = '0'
    el.style.transform = fromRight ? 'translateX(28px)' : 'translateX(-28px)'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.45s ease, transform 0.45s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
      })
    })
  }, [])

  /* auto-rotate cada 4 s */
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setActive(a => (a + 1) % CARDS.length)
    }, 4000)
    return () => clearInterval(t)
  }, [paused])

  /* animación en cada cambio de card */
  useEffect(() => {
    animateIn(true)
  }, [active, animateIn])

  function goTo(idx: number) {
    if (idx === active) return
    animateIn(idx > active)
    setActive(idx)
  }

  function goPrev() {
    setActive(a => {
      const next = (a - 1 + CARDS.length) % CARDS.length
      animateIn(false)
      return next
    })
  }

  function goNext() {
    setActive(a => {
      const next = (a + 1) % CARDS.length
      animateIn(true)
      return next
    })
  }

  const card = CARDS[active]

  return (
    <section className="bg-[#0D0F14] py-16 sm:py-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">

          {/* ── Columna izquierda ────────────────────────────────────────── */}
          <RevealSection className="w-full lg:w-[420px] xl:w-[460px] shrink-0">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              ¿Por qué usar{' '}
              <span className="text-[#FFC107]">AUTODUX?</span>
            </h2>
            <div className="mt-4 text-base leading-relaxed space-y-1">
              <p className="text-white font-semibold">
                Encontrá tu próximo vehículo sin perder días buscando.
              </p>
              <p className="text-gray-400">
                Compará agencias, vehículos y precios de toda la Patagonia en un solo lugar.
              </p>
            </div>

            {/* Lista de beneficios */}
            <ul className="mt-8 flex flex-col gap-3.5" role="list">
              {LISTA.map((item, i) => (
                <li
                  key={item.text}
                  className={`flex items-center gap-3 cursor-pointer group transition-all duration-200 ${
                    i === active ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                  }`}
                  onClick={() => goTo(i)}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      i === active
                        ? 'bg-[#FFC107]'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className={`w-3 h-3 ${i === active ? 'text-[#0D0F14]' : 'text-gray-400'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      i === active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                    }`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </RevealSection>

          {/* ── Columna derecha (carrusel) ────────────────────────────────── */}
          <RevealSection className="flex-1 min-w-0" delay={150}>
            {/* Card contenedor */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0f1729 0%, #0a1220 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Acento de color dinámico en la esquina */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none transition-colors duration-700"
                style={{ background: `radial-gradient(circle, ${card.accent} 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}
                aria-hidden="true"
              />

              {/* Contenido animado */}
              <div ref={cardRef} className="relative z-10 p-8 sm:p-10 h-[340px] flex flex-col justify-between overflow-hidden">
                <div>
                  {/* Ícono */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${card.accent}20`, color: card.accent }}
                  >
                    {card.icon}
                  </div>

                  {/* Texto */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                    {card.titulo}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed max-w-lg">
                    {card.descripcion}
                  </p>
                </div>

                {/* Stat + número de card */}
                <div className="flex items-center justify-between mt-8">
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
                    style={{ backgroundColor: `${card.accent}18`, color: card.accent }}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {card.detalle}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    {active + 1} / {CARDS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2">
                {CARDS.map((_, i) => (
                  <Dot key={i} active={i === active} onClick={() => goTo(i)} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Arrow dir="prev" onClick={goPrev} />
                <Arrow dir="next" onClick={goNext} />
              </div>
            </div>
          </RevealSection>

        </div>
      </div>
    </section>
  )
}
