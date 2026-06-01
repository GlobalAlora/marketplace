import Link from 'next/link'
import type { Vehiculo } from '@/types'

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

/** Clases de acento izquierdo dorado para el panel info (siempre horizontal) */
const ACENTO_IZQUIERDO = 'border-l-[3px] border-l-[#FFC107]'

function BadgeDestacado({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`font-extrabold tracking-[0.18em] text-[#FFC107] uppercase leading-none ${
        small ? 'text-[9px]' : 'text-[10px]'
      }`}
    >
      ★ Destacado
    </span>
  )
}

/** Card principal — 2/3 del ancho en desktop, horizontal */
function CardGrande({ vehiculo }: { vehiculo: Vehiculo }) {
  const vendedor =
    vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()

  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
    >
      {/* Imagen — 55% en sm+ */}
      <div className="relative w-full sm:w-[55%] aspect-[4/3] sm:aspect-auto shrink-0 overflow-hidden bg-gray-100">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}
      </div>

      {/* Info — top accent en mobile (layout vertical), left accent en sm+ (layout horizontal) */}
      <div className="flex flex-col justify-between p-6 lg:p-8 flex-1 min-w-0 border-t-[3px] border-t-[#FFC107] sm:border-t-0 sm:border-l-[3px] sm:border-l-[#FFC107]">
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
          <p className="text-3xl font-black text-[#0D0F14] tracking-tight leading-none">
            {formatPrecio(vehiculo.precio)}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 bg-[#282F8F] text-white text-sm font-bold px-5 py-2.5 rounded-xl group-hover:bg-[#1f2570] transition-colors">
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

/** Cards secundarias — 1/3 del ancho, stacked, layout horizontal compacto */
function CardPequeña({ vehiculo }: { vehiculo: Vehiculo }) {
  return (
    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="group flex flex-row rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 min-h-[130px]"
    >
      {/* Imagen — se estira al alto del contenido (absolute fill) */}
      <div className="relative w-[42%] shrink-0 overflow-hidden bg-gray-100">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
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
      <div className={`flex flex-col justify-between p-4 flex-1 min-w-0 ${ACENTO_IZQUIERDO}`}>
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
        <p className="text-base font-black text-[#0D0F14] mt-2 leading-none">
          {formatPrecio(vehiculo.precio)}
        </p>
      </div>
    </Link>
  )
}

export default function SeccionDestacados({ vehiculos }: SeccionDestacadosProps) {
  if (vehiculos.length === 0) return null

  const [principal, ...resto] = vehiculos

  return (
    // Fondo blanco — inversión deliberada después del hero oscuro
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-10">

        {/* Header de sección */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#0D0F14]">
              Autos Destacados
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Selección del equipo AUTODUX
            </p>
          </div>
          <Link
            href="/vehiculos"
            className="text-sm font-semibold text-[#282F8F] hover:text-[#FFC107] transition-colors shrink-0"
          >
            Ver todos →
          </Link>
        </div>

        {/* Bento grid: card grande col-span-2, pequeñas col-span-1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Card grande — ocupa 2 de 3 columnas si hay cards secundarias */}
          <div className={resto.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <CardGrande vehiculo={principal} />
          </div>

          {/* Cards secundarias stacked — se ajustan al alto de la card grande */}
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
