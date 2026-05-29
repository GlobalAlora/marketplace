import Link from 'next/link'
import type { Vehiculo } from '@/types'

interface InfoVehiculoProps {
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

function diasDesde(fechaIso: string): number {
  const ms = Date.now() - new Date(fechaIso).getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

function miembroDesde(fechaIso: string): string {
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
}

function getIniciales(nombre: string, apellido: string): string {
  return `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase()
}

// Iconos SVG inline — Heroicons stroke-1.5 (consistente con el resto del codebase)
function IconoCalendario() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
    </svg>
  )
}

function IconoOdometro() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconoEngranaje() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3M15.75 4.505l-.75 1.3M6.106 16.95l-1.149-.964m13.24-9.643l-1.149-.964M6.344 18.178l-.364-1.5M17.656 5.822l-.364-1.5M8.5 21.5l.5-1.7M15 2.5l.5 1.7" />
    </svg>
  )
}

function IconoCombustible() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  )
}

function IconoPuertas() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
    </svg>
  )
}

function IconoColor() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  )
}

function IconoUbicacion() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function IconoOjo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconoTelefono() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

export default function InfoVehiculo({ vehiculo }: InfoVehiculoProps) {
  const esAgencia =
    vehiculo.profiles?.role === 'agencia_premium' ||
    vehiculo.profiles?.role === 'agencia_basica'

  const nombreVendedor = esAgencia
    ? (vehiculo.profiles?.nombre_agencia ?? 'Agencia')
    : `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim() || 'Vendedor'

  const inicialesVendedor = esAgencia
    ? (vehiculo.profiles?.nombre_agencia ?? 'A').slice(0, 2).toUpperCase()
    : getIniciales(vehiculo.profiles?.nombre ?? 'V', vehiculo.profiles?.apellido ?? '')

  const verificado = vehiculo.profiles?.verificado ?? false
  const dias = diasDesde(vehiculo.created_at)

  // Specs técnicas — grid 2 columnas
  const specsBase = [
    { icono: <IconoCalendario />, label: 'Año', value: String(vehiculo.año) },
    { icono: <IconoOdometro />, label: 'Kilometraje', value: formatKm(vehiculo.kilometraje) },
    { icono: <IconoUbicacion />, label: 'Ubicación', value: vehiculo.ubicacion },
  ]

  const specsOpcionales = [
    vehiculo.transmision && {
      icono: <IconoEngranaje />,
      label: 'Transmisión',
      value: vehiculo.transmision === 'automatica' ? 'Automática' : 'Manual',
    },
    vehiculo.combustible && {
      icono: <IconoCombustible />,
      label: 'Combustible',
      value: vehiculo.combustible.charAt(0).toUpperCase() + vehiculo.combustible.slice(1),
    },
    vehiculo.puertas && {
      icono: <IconoPuertas />,
      label: 'Puertas',
      value: `${vehiculo.puertas} puertas`,
    },
    vehiculo.color && {
      icono: <IconoColor />,
      label: 'Color',
      value: vehiculo.color,
    },
  ].filter(Boolean) as Array<{ icono: React.ReactNode; label: string; value: string }>

  const specs = [...specsBase, ...specsOpcionales]

  return (
    <div className="flex flex-col gap-6">

      {/* Precio + trust signals */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Precio</p>
          <p className="text-4xl font-extrabold text-white leading-none">
            {formatPrecio(vehiculo.precio)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 pb-1 text-xs text-gray-500">
          {vehiculo.vistas !== undefined && (
            <span className="flex items-center gap-1">
              <IconoOjo />
              {vehiculo.vistas.toLocaleString('es-AR')} vistas
            </span>
          )}
          <span>
            {dias === 0 ? 'Publicado hoy' : `Hace ${dias} día${dias !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Specs con iconos */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Características</p>
        <div className="grid grid-cols-2 gap-2.5">
          {specs.map(({ icono, label, value }) => (
            <div key={label} className="bg-white/5 hover:bg-white/8 rounded-xl p-3 flex items-start gap-2.5 transition-colors">
              <span className="text-[#FFC107] mt-0.5 shrink-0">{icono}</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 leading-none mb-1">{label}</p>
                <p className="text-sm font-semibold text-white truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      {vehiculo.descripcion && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Descripción</p>
          <p className="text-sm text-gray-300 leading-relaxed">{vehiculo.descripcion}</p>
        </div>
      )}

      {/* Card del vendedor */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Vendedor</p>

        <div className="flex items-center gap-3">
          {/* Avatar / logo placeholder */}
          <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm text-white ${
            esAgencia ? 'bg-[#282F8F]' : 'bg-white/10'
          }`}>
            {inicialesVendedor}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-white truncate">{nombreVendedor}</p>
              {verificado && (
                <span className="inline-flex items-center gap-1 text-xs bg-[#282F8F]/60 text-[#A0AFFF] px-2 py-0.5 rounded-full font-semibold shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verificado
                </span>
              )}
            </div>

            {esAgencia ? (
              <span className="text-xs text-gray-400 mt-0.5 block">Agencia oficial</span>
            ) : (
              <span className="text-xs text-gray-400 mt-0.5 block">
                Particular · Miembro desde {miembroDesde(vehiculo.profiles?.created_at ?? vehiculo.created_at)}
              </span>
            )}
          </div>
        </div>

        {/* Teléfono */}
        {vehiculo.profiles?.telefono && (
          <a
            href={`tel:${vehiculo.profiles.telefono}`}
            className="mt-3 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            aria-label={`Llamar a ${nombreVendedor}`}
          >
            <IconoTelefono />
            <span className="font-medium">{vehiculo.profiles.telefono}</span>
          </a>
        )}

        {/* Botón ver perfil */}
        <Link
          href={esAgencia
            ? `/agencias/${vehiculo.profiles?.id ?? vehiculo.user_id}`
            : `/usuarios/${vehiculo.profiles?.id ?? vehiculo.user_id}`
          }
          className="mt-4 flex items-center justify-center gap-2 w-full border border-white/15 text-white text-sm font-semibold py-2.5 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all duration-150"
        >
          {esAgencia ? 'Ver perfil de agencia' : 'Ver perfil del vendedor'}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

    </div>
  )
}
