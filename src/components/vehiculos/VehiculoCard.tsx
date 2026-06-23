'use client'

import Link from 'next/link'
import type { Vehiculo } from '@/types'
import { useAuth } from '@/lib/mock-auth'
import { TIPOS_VEHICULO } from '@/lib/constants'
import { NAVY, GOLD_DARK, CornerRibbon, ShieldBadge, IconVitrina } from './destacadoStyles'

interface VehiculoCardProps {
  vehiculo: Vehiculo
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

function IconLock() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

export default function VehiculoCard({ vehiculo }: VehiculoCardProps) {
  const { isLoggedIn } = useAuth()

  const vendedor = vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()

  const role = vehiculo.profiles?.role
  const esAgencia = role === 'agencia_premium' || role === 'agencia_basica'
  const d = vehiculo.destacado
  const tipoLabel = TIPOS_VEHICULO.find(t => t.value === vehiculo.tipo_vehiculo)?.label

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className={[
        'group flex flex-col rounded-2xl overflow-hidden transition-all duration-300',
        d
          ? 'bg-white border-2 border-[#FFC107] shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.18)]'
          : 'bg-white/5 border border-white/10 hover:border-white/22 hover:shadow-lg hover:shadow-black/30',
      ].join(' ')}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: d ? NAVY : 'rgba(17,24,39,0.6)' }}>
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}

        {/* Vitrina: cinta + escudo con estrella */}
        {d && (
          <>
            <CornerRibbon small />
            <ShieldBadge small />
          </>
        )}

        {/* Badge tipo de vehículo */}
        {tipoLabel && (
          <div className={`absolute top-2.5 right-2.5 font-semibold text-[10px] px-2.5 py-1 rounded-full tracking-wide ${d ? 'bg-black/60 text-white' : 'bg-black/70 text-white'}`}>
            {tipoLabel}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {d && (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-[0.18em] uppercase" style={{ color: GOLD_DARK }}>
            <IconVitrina className="w-2.5 h-2.5" />
            Destacado
          </span>
        )}

        <h3 className={`font-bold text-sm leading-snug line-clamp-2 transition-colors duration-200 ${d ? 'text-gray-900 group-hover:text-[#282F8F]' : 'text-white group-hover:text-[#FFC107]'}`}>
          {vehiculo.titulo}
        </h3>

        <div className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>{vehiculo.año}</span>
          <span className={d ? 'opacity-40' : 'text-gray-600'}>·</span>
          <span>{formatKm(vehiculo.kilometraje)}</span>
          <span className={d ? 'opacity-40' : 'text-gray-600'}>·</span>
          <span>{vehiculo.ubicacion}</span>
        </div>

        <div className={`mt-auto pt-2.5 flex items-center justify-between border-t ${d ? 'border-gray-100' : 'border-white/8'}`}>
          {isLoggedIn ? (
            <p className={`text-base font-black tracking-tight leading-none ${d ? 'text-gray-900' : 'text-[#FFC107]'}`}>
              {formatPrecio(vehiculo.precio)}
            </p>
          ) : (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${d ? 'text-gray-500' : 'text-[#FFC107]'}`}>
              <IconLock />
              Ver precio
            </span>
          )}

          <span className={`text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-200 ${d ? 'text-[#282F8F]' : 'text-[#FFC107]'}`}>
            Ver más
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>

        {/* Badge vendedor */}
        {role && (
          <div>
            {esAgencia ? (
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${d ? 'bg-[#282F8F]/10 text-[#282F8F]' : 'bg-[#282F8F] text-blue-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {vendedor || 'Agencia verificada'}
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${d ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-gray-300'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
                {vendedor || 'Particular'}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
