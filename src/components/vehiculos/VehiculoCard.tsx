'use client'

import Link from 'next/link'
import type { Vehiculo } from '@/types'
import { useAuth } from '@/lib/mock-auth'

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

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className={[
        'group flex flex-col rounded-xl overflow-hidden transition-all duration-200',
        d
          ? 'bg-white border-2 border-[#FFC107] hover:shadow-lg hover:shadow-[#FFC107]/15'
          : 'bg-[#163055] border border-white/10 hover:bg-[#1e3d6e] hover:border-white/20 hover:shadow-lg',
      ].join(' ')}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1f3d]">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}

        {/* Badge destacado */}
        {d && (
          <span className="absolute top-2 left-2 text-[9px] font-extrabold tracking-widest text-[#0D0F14] bg-[#FFC107] px-2 py-0.5 rounded-full uppercase">
            ★ Dest.
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className={`font-semibold text-sm leading-snug line-clamp-2 transition-colors ${
          d ? 'text-gray-900 group-hover:text-[#282F8F]' : 'text-white group-hover:text-[#FFC107]'
        }`}>
          {vehiculo.titulo}
        </h3>

        <div className={`flex items-center gap-3 text-xs ${d ? 'text-gray-500' : 'text-gray-300'}`}>
          <span>{vehiculo.año}</span>
          <span>·</span>
          <span>{formatKm(vehiculo.kilometraje)}</span>
          <span>·</span>
          <span>{vehiculo.ubicacion}</span>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between">
          {isLoggedIn ? (
            <p className={`text-lg font-bold ${d ? 'text-gray-900' : 'text-white'}`}>
              {formatPrecio(vehiculo.precio)}
            </p>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FFC107] hover:text-yellow-300 transition-colors">
              <IconLock />
              Ver precio
            </span>
          )}
          {vendedor && (
            <span className={`text-xs truncate max-w-[100px] ${d ? 'text-gray-400' : 'text-gray-200'}`}>
              {vendedor}
            </span>
          )}
        </div>

        {/* Ver más */}
        <div className={`mt-2 pt-2 border-t ${d ? 'border-gray-100' : 'border-white/8'}`}>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 group-hover:gap-2.5 ${
            d ? 'text-[#282F8F]' : 'text-[#FFC107]'
          }`}>
            Ver más
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>

        {/* Badge vendedor */}
        {role && (
          <div className="pt-1">
            {esAgencia ? (
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                d ? 'bg-[#282F8F] text-white' : 'bg-[#282F8F]/80 text-blue-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Agencia verificada
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                d ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-gray-200'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
                Particular
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
