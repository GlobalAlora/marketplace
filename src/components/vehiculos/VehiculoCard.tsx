import Link from 'next/link'
import type { Vehiculo } from '@/types'

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

export default function VehiculoCard({ vehiculo }: VehiculoCardProps) {
  const vendedor = vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-400 transition-all duration-200"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}
        {vehiculo.destacado && (
          <span className="absolute top-2 left-2 bg-brand-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Destacado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
          {vehiculo.titulo}
        </h3>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{vehiculo.año}</span>
          <span>·</span>
          <span>{formatKm(vehiculo.kilometraje)}</span>
          <span>·</span>
          <span>{vehiculo.ubicacion}</span>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <p className="text-lg font-bold text-gray-900">
            {formatPrecio(vehiculo.precio)}
          </p>
          {vendedor && (
            <span className="text-xs text-gray-400 truncate max-w-[100px]">{vendedor}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
