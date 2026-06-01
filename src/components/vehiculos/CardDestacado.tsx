import Link from 'next/link'
import type { Vehiculo } from '@/types'

interface CardDestacadoProps {
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

export default function CardDestacado({ vehiculo }: CardDestacadoProps) {
  const vendedor = vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-col lg:flex-row bg-white/5 border border-[#FFC107]/20 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(255,193,7,0.20)] hover:shadow-[0_16px_48px_rgba(255,193,7,0.30)] hover:border-[#FFC107]/45 transition-all duration-300"
    >
      {/* Imagen — 40% en desktop, full-width en mobile */}
      <div className="relative w-full lg:w-[40%] aspect-[16/9] lg:aspect-auto overflow-hidden bg-gray-900/60">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}

        {/* Badge DESTACADO */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#FFC107] text-[#0D0F14] font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg tracking-wide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
          </svg>
          DESTACADO
        </div>
      </div>

      {/* Info — 60% en desktop */}
      <div className="flex flex-col flex-1 p-6 lg:p-8 gap-4">
        {/* Título */}
        <div>
          <h3 className="text-white font-bold text-lg lg:text-xl leading-snug group-hover:text-[#FFC107] transition-colors duration-200">
            {vehiculo.titulo}
          </h3>
          {vendedor && (
            <p className="text-gray-500 text-xs mt-1">{vendedor}</p>
          )}
        </div>

        {/* Specs */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
          <span>{vehiculo.año}</span>
          <span className="text-gray-600">·</span>
          <span>{formatKm(vehiculo.kilometraje)}</span>
          <span className="text-gray-600">·</span>
          <span>{vehiculo.ubicacion}</span>
          {vehiculo.transmision && (
            <>
              <span className="text-gray-600">·</span>
              <span className="capitalize">{vehiculo.transmision}</span>
            </>
          )}
          {vehiculo.combustible && (
            <>
              <span className="text-gray-600">·</span>
              <span className="capitalize">{vehiculo.combustible}</span>
            </>
          )}
        </div>

        {/* Descripción corta */}
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {vehiculo.descripcion}
        </p>

        {/* Precio + CTA */}
        <div className="mt-auto pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-3xl font-black text-[#FFC107] tracking-tight leading-none">
            {formatPrecio(vehiculo.precio)}
          </p>
          <span className="inline-flex items-center justify-center gap-2 bg-[#FFC107] text-[#0D0F14] font-extrabold text-sm px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg group-hover:shadow-[0_4px_20px_rgba(255,193,7,0.4)] whitespace-nowrap">
            Ver vehículo →
          </span>
        </div>
      </div>
    </Link>
  )
}
