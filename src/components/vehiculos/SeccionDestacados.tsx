'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Vehiculo } from '@/types'
import { useAuth } from '@/lib/mock-auth'

interface SeccionDestacadosProps {
  vehiculos: Vehiculo[]
}

// ── Design tokens ────────────────────────────────────────────────────────────
const GOLD        = '#FFC107'   // brand primary yellow
const GOLD_LIGHT  = '#FFD033'   // lighter tint for gradients
const GOLD_DARK   = '#E5A800'   // darker shade for gradients
const NAVY        = '#0C1D36'
const NAVY_MID    = '#0F2340'
const NAVY_LIGHT  = '#162B4A'

function formatPrecio(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}

function formatKm(km: number): string {
  return new Intl.NumberFormat('es-AR').format(km) + ' km'
}

// ── Decorative elements ───────────────────────────────────────────────────────

/** Diagonal corner ribbon "VITRINA" in the top-left.
 *  The strip must be exactly container * √2 wide so it reaches
 *  edge-to-edge without leaving gaps at the lower corners. */
function CornerRibbon({ small = false }: { small?: boolean }) {
  // container square: must be big enough to show the full diagonal strip
  const size      = small ? 80   : 100
  // strip dimensions — width = size * √2 ≈ size * 1.415
  const stripW    = Math.round(size * 1.415)
  const stripH    = small ? 18   : 22
  // center strip on container diagonal
  const top       = Math.round((size - stripH) / 2)
  const left      = Math.round((size - stripW) / 2)
  const fsize     = small ? '8px' : '9.5px'

  return (
    <div
      className="absolute top-0 left-0 overflow-hidden z-10 pointer-events-none"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute font-black text-center select-none"
        style={{
          top,
          left,
          width: stripW,
          height: stripH,
          lineHeight: `${stripH}px`,
          transform: 'rotate(-45deg)',
          transformOrigin: 'center center',
          background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD_DARK} 100%)`,
          color: NAVY,
          fontSize: fsize,
          letterSpacing: '0.2em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        VITRINA
      </div>
    </div>
  )
}

/** Downward-shield badge with star in the top-right */
function ShieldBadge({ small = false }: { small?: boolean }) {
  const w = small ? 38 : 46
  const h = small ? 46 : 56
  return (
    <div className="absolute top-0 right-4 z-10 pointer-events-none" style={{ width: w, height: h }}>
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD_DARK} 100%)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)',
          boxShadow: `0 4px 16px ${GOLD}66`,
        }}
      >
        {/* star — solid fill for clean contrast on gold */}
        <svg
          viewBox="0 0 24 24"
          fill={NAVY}
          style={{ width: small ? 15 : 19, height: small ? 15 : 19, marginTop: small ? -4 : -6 }}
          aria-hidden="true"
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
      </div>
    </div>
  )
}

/** Car placeholder for empty image slots */
function CarPlaceholder({ large = false }: { large?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ color: NAVY_LIGHT }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={large ? 'w-20 h-20 opacity-60' : 'w-10 h-10 opacity-50'}
        aria-hidden="true"
      >
        <path d="M3.75 5.25h.386l1.295-3.235A2.25 2.25 0 017.5 0.75h9a2.25 2.25 0 012.069 1.265L19.864 5.25h.386A2.25 2.25 0 0122.5 7.5v6a2.25 2.25 0 01-2.25 2.25v1.5a.75.75 0 01-1.5 0V15.75h-13.5v1.5a.75.75 0 01-1.5 0V15.75A2.25 2.25 0 011.5 13.5v-6a2.25 2.25 0 012.25-2.25zM5.61 5.25h12.78l-.97-2.425a.75.75 0 00-.69-.575h-9a.75.75 0 00-.69.455L5.61 5.25zM6 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    </div>
  )
}

// ── Icon for section header ───────────────────────────────────────────────────
function IconVitrina({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M12 2L14.2 9.8H22L15.9 14.4L18.1 22L12 17.4L5.9 22L8.1 14.4L2 9.8H9.8L12 2Z" />
    </svg>
  )
}

// ── Cards ─────────────────────────────────────────────────────────────────────

function CardGrande({ vehiculo }: { vehiculo: Vehiculo }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const vendedor =
    vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden min-h-[260px] transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${NAVY_MID} 0%, ${NAVY} 100%)`,
        border: `1.5px solid ${GOLD}55`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 ${GOLD}22`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1.5px ${GOLD}99, inset 0 1px 0 ${GOLD}33`
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 ${GOLD}22`
      }}
    >
      {/* ── Image panel ── */}
      <div className="relative w-full sm:w-[55%] aspect-[4/3] sm:aspect-auto sm:min-h-[260px] shrink-0 overflow-hidden" style={{ background: NAVY }}>
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <CarPlaceholder large />
        )}

        {/* Dark overlay so ribbon/badge always readable over images */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(12,29,54,0.3) 0%, transparent 50%)' }} />

        <CornerRibbon />
        <ShieldBadge />
      </div>

      {/* ── Info panel ── */}
      <div
        className="flex flex-col justify-between p-6 lg:p-8 flex-1 min-w-0"
        style={{ borderLeft: `1px solid ${GOLD}22` }}
      >
        <div className="flex flex-col gap-3">
          {/* Subtle "Destacado" label */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            <IconVitrina className="w-2.5 h-2.5" />
            Destacado
          </span>

          <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight group-hover:opacity-90 transition-opacity">
            {vehiculo.titulo}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-blue-200/70">
            <span>{vehiculo.año}</span>
            <span className="opacity-40">·</span>
            <span>{formatKm(vehiculo.kilometraje)}</span>
            <span className="opacity-40">·</span>
            <span>{vehiculo.ubicacion}</span>
            {vehiculo.transmision && (
              <>
                <span className="opacity-40">·</span>
                <span className="capitalize">{vehiculo.transmision}</span>
              </>
            )}
          </div>

          {vehiculo.descripcion && (
            <p className="text-sm text-blue-100/50 line-clamp-3 leading-relaxed hidden sm:block">
              {vehiculo.descripcion}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-5">
          {isLoggedIn ? (
            <p className="text-3xl font-black tracking-tight leading-none" style={{ color: GOLD }}>
              {formatPrecio(vehiculo.precio)}
            </p>
          ) : (
            <button
              type="button"
              onClick={e => { e.preventDefault(); router.push('/auth/login') }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-200/70 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Iniciá sesión para ver el precio
            </button>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_DARK})`, color: NAVY }}
            >
              Ver vehículo →
            </span>
            {vendedor && (
              <span className="text-xs text-blue-200/50 truncate">{vendedor}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function CardPequeña({ vehiculo }: { vehiculo: Vehiculo }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-row rounded-2xl overflow-hidden min-h-[130px] transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${NAVY_MID} 0%, ${NAVY} 100%)`,
        border: `1.5px solid ${GOLD}55`,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 ${GOLD}22`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 6px 28px rgba(0,0,0,0.55), 0 0 0 1.5px ${GOLD}99, inset 0 1px 0 ${GOLD}33`
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 ${GOLD}22`
      }}
    >
      {/* Image */}
      <div
        className="relative w-[42%] min-h-[130px] shrink-0 overflow-hidden"
        style={{ background: NAVY }}
      >
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <CarPlaceholder />
        )}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(12,29,54,0.35) 0%, transparent 55%)' }} />
        <CornerRibbon small />
        <ShieldBadge small />
      </div>

      {/* Info */}
      <div
        className="flex flex-col justify-between p-4 flex-1 min-w-0"
        style={{ borderLeft: `2px solid ${GOLD}33` }}
      >
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 text-[8px] font-extrabold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            <IconVitrina className="w-2 h-2" />
            Destacado
          </span>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:opacity-90 transition-opacity">
            {vehiculo.titulo}
          </h3>
          <div className="flex items-center gap-2 text-xs text-blue-200/60">
            <span>{vehiculo.año}</span>
            <span className="opacity-40">·</span>
            <span>{formatKm(vehiculo.kilometraje)}</span>
          </div>
        </div>

        {isLoggedIn ? (
          <p className="text-base font-black mt-2 leading-none" style={{ color: GOLD }}>
            {formatPrecio(vehiculo.precio)}
          </p>
        ) : (
          <button
            type="button"
            onClick={e => { e.preventDefault(); router.push('/auth/login') }}
            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-200/60 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Ver precio
          </button>
        )}
      </div>
    </Link>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function SeccionDestacados({ vehiculos }: SeccionDestacadosProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (vehiculos.length === 0) return null

  const [principal, ...resto] = vehiculos

  return (
    <section className="bg-[#071526] border-b border-white/8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-10">

        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_DARK})` }}
            >
              <IconVitrina className="w-5 h-5" style={{ color: NAVY }} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Vitrina AUTODUX</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Descubrí las oportunidades más interesantes de la Patagonia.
              </p>
            </div>
          </div>
          <Link
            href="/vehiculos"
            className="text-sm font-semibold hover:text-white transition-colors shrink-0"
            style={{ color: GOLD }}
          >
            Ver todos →
          </Link>
        </div>

        {/* Bento grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 transition-opacity duration-300"
          style={{ opacity: mounted ? 1 : 0 }}
        >
          <div className={resto.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <CardGrande vehiculo={principal} />
          </div>

          {resto.length > 0 && (
            <div className="flex flex-col gap-5">
              {resto.map(v => (
                <CardPequeña key={v.id} vehiculo={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
