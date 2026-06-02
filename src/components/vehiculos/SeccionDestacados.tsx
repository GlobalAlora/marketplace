'use client'

import Link from 'next/link'
import type { Vehiculo } from '@/types'
import { useAuth } from '@/lib/mock-auth'

interface SeccionDestacadosProps {
  vehiculos: Vehiculo[]
}

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

/** Ícono propio Vitrina — diamante/gema 4 puntas representando exclusividad y premium */
function IconVitrina({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2L14.2 9.8H22L15.9 14.4L18.1 22L12 17.4L5.9 22L8.1 14.4L2 9.8H9.8L12 2Z" />
    </svg>
  )
}

function BadgeDestacado({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-extrabold tracking-[0.16em] text-[#FFC107] uppercase leading-none ${
        small ? 'text-[9px]' : 'text-[10px]'
      }`}
    >
      <IconVitrina className="w-2.5 h-2.5" />
      Destacado
    </span>
  )
}

/** Card principal — 2/3 del ancho en desktop */
function CardGrande({ vehiculo }: { vehiculo: Vehiculo }) {
  const { isLoggedIn } = useAuth()
  const vendedor =
    vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-white border-2 border-[#FFC107] shadow-lg hover:shadow-xl hover:shadow-[#FFC107]/10 transition-all duration-300 h-full"
    >
      {/* Imagen */}
      <div className="relative w-full sm:w-[55%] aspect-[4/3] sm:aspect-auto sm:min-h-[260px] shrink-0 overflow-hidden bg-gray-100">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}
        {/* Badge vitrina sobre imagen */}
        <div className="absolute top-3 left-3 bg-[#FFC107] text-[#0D0F14] text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
          <IconVitrina className="w-2.5 h-2.5" />
          Vitrina
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between p-6 lg:p-8 flex-1 min-w-0">
        <div className="flex flex-col gap-3">
          <BadgeDestacado />
          <h3 className="text-xl lg:text-2xl font-bold text-[#0D0F14] leading-tight group-hover:text-[#282F8F] transition-colors">
            {vehiculo.titulo}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span>{vehiculo.año}</span>
            <span className="text-gray-300">·</span>
            <span>{formatKm(vehiculo.kilometraje)}</span>
            <span className="text-gray-300">·</span>
            <span>{vehiculo.ubicacion}</span>
            {vehiculo.transmision && (
              <>
                <span className="text-gray-300">·</span>
                <span className="capitalize">{vehiculo.transmision}</span>
              </>
            )}
          </div>
          {vehiculo.descripcion && (
            <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed hidden sm:block">
              {vehiculo.descripcion}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-5">
          {isLoggedIn ? (
            <p className="text-3xl font-black text-[#0D0F14] tracking-tight leading-none">
              {formatPrecio(vehiculo.precio)}
            </p>
          ) : (
            <Link
              href="/auth/login"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#282F8F] hover:text-[#FFC107] transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Iniciá sesión para ver el precio
            </Link>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 bg-[#FFC107] text-[#0D0F14] text-sm font-bold px-5 py-2.5 rounded-xl group-hover:bg-yellow-400 transition-colors">
              Ver vehículo →
            </span>
            {vendedor && (
              <span className="text-xs text-gray-400 truncate">{vendedor}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

/** Cards secundarias */
function CardPequeña({ vehiculo }: { vehiculo: Vehiculo }) {
  const { isLoggedIn } = useAuth()
  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-row rounded-2xl overflow-hidden bg-white border-2 border-[#FFC107] shadow-md hover:shadow-lg hover:shadow-[#FFC107]/10 transition-all duration-300 flex-1 min-h-[130px]"
    >
      {/* Imagen */}
      <div className="relative w-[42%] min-h-[130px] shrink-0 overflow-hidden bg-gray-100">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between p-4 flex-1 min-w-0 border-l-4 border-l-[#FFC107]">
        <div className="flex flex-col gap-1.5">
          <BadgeDestacado small />
          <h3 className="text-sm font-bold text-[#0D0F14] leading-snug line-clamp-2 group-hover:text-[#282F8F] transition-colors">
            {vehiculo.titulo}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{vehiculo.año}</span>
            <span>·</span>
            <span>{formatKm(vehiculo.kilometraje)}</span>
          </div>
        </div>
        {isLoggedIn ? (
          <p className="text-base font-black text-[#0D0F14] mt-2 leading-none">
            {formatPrecio(vehiculo.precio)}
          </p>
        ) : (
          <Link
            href="/auth/login"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#282F8F] hover:text-[#FFC107] transition-colors"
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Ver precio
          </Link>
        )}
      </div>
    </Link>
  )
}

export default function SeccionDestacados({ vehiculos }: SeccionDestacadosProps) {
  if (vehiculos.length === 0) return null

  const [principal, ...resto] = vehiculos

  return (
    <section className="bg-[#071526] border-b border-white/8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-10">

        {/* Header de sección */}
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC107] flex items-center justify-center shrink-0">
              <IconVitrina className="w-5 h-5 text-[#0D0F14]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Vitrina AUTODUX
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Descubrí las oportunidades más interesantes de la Patagonia.
              </p>
            </div>
          </div>
          <Link
            href="/vehiculos"
            className="text-sm font-semibold text-[#FFC107] hover:text-white transition-colors shrink-0"
          >
            Ver todos →
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className={resto.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <CardGrande vehiculo={principal} />
          </div>

          {resto.length > 0 && (
            <div className="flex flex-col gap-5 h-full">
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
