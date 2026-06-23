'use client'

import Link from 'next/link'
import type { Vehiculo } from '@/types'
import { useAuth } from '@/lib/mock-auth'
import { TIPOS_VEHICULO, TIPOS_MOTO } from '@/lib/constants'

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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">{children}</p>
)

function IconoTipo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )
}

function IconoCalendario() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
    </svg>
  )
}

function IconoOdometro() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconoEngranaje() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3M15.75 4.505l-.75 1.3M6.106 16.95l-1.149-.964m13.24-9.643l-1.149-.964M6.344 18.178l-.364-1.5M17.656 5.822l-.364-1.5M8.5 21.5l.5-1.7M15 2.5l.5 1.7" />
    </svg>
  )
}

function IconoCombustible() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  )
}

function IconoPuertas() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
    </svg>
  )
}

function IconoColor() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  )
}

function IconoUbicacion() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function IconoOjo() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconoTelefono() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function IconoCandado() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

export default function InfoVehiculo({ vehiculo }: InfoVehiculoProps) {
  const { isLoggedIn } = useAuth()

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

  const tipoLabel = TIPOS_VEHICULO.find(t => t.value === vehiculo.tipo_vehiculo)?.label

  const specsBase = [
    tipoLabel && { icono: <IconoTipo />, label: 'Tipo', value: tipoLabel },
    { icono: <IconoCalendario />, label: 'Año', value: String(vehiculo.año) },
    { icono: <IconoOdometro />, label: 'Kilometraje', value: formatKm(vehiculo.kilometraje) },
    { icono: <IconoUbicacion />, label: 'Ubicación', value: vehiculo.ubicacion },
  ].filter(Boolean) as Array<{ icono: React.ReactNode; label: string; value: string }>

  const tipoMotoLabel = TIPOS_MOTO.find(t => t.value === vehiculo.tipo_moto)?.label

  const specsOpcionales = [
    vehiculo.condicion && {
      icono: <IconoTipo />,
      label: 'Condición',
      value: vehiculo.condicion === 'nuevo' ? 'Nuevo' : 'Usado',
    },
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
    vehiculo.cilindrada && {
      icono: <IconoEngranaje />,
      label: 'Cilindrada',
      value: `${vehiculo.cilindrada} cc`,
    },
    tipoMotoLabel && {
      icono: <IconoTipo />,
      label: 'Tipo de moto',
      value: tipoMotoLabel,
    },
  ].filter(Boolean) as Array<{ icono: React.ReactNode; label: string; value: string }>

  const specs = [...specsBase, ...specsOpcionales]

  return (
    <div className="flex flex-col divide-y divide-white/8">

      {/* ── Precio ── */}
      <div className="pb-4">
        <SectionLabel>Precio</SectionLabel>

        {isLoggedIn ? (
          <p className="text-4xl font-extrabold text-white leading-none tracking-tight">
            {formatPrecio(vehiculo.precio)}
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-white/10 leading-none tracking-tight select-none">
              $&nbsp;·····
            </span>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFC107] hover:text-yellow-300 transition-colors"
            >
              <IconoCandado />
              Iniciá sesión para ver
            </Link>
          </div>
        )}

        {/* Trust signals — debajo del precio, no al costado */}
        <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500">
          {vehiculo.vistas !== undefined && (
            <>
              <span className="flex items-center gap-1">
                <IconoOjo />
                {vehiculo.vistas.toLocaleString('es-AR')} vistas
              </span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>
            {dias === 0 ? 'Publicado hoy' : `Hace ${dias} día${dias !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* ── Descripción ── */}
      {vehiculo.descripcion && (
        <div className="py-4">
          <SectionLabel>Descripción</SectionLabel>
          <p className="text-sm text-gray-300 leading-relaxed">{vehiculo.descripcion}</p>
        </div>
      )}

      {/* ── Características ── */}
      <div className="py-4">
        <SectionLabel>Características</SectionLabel>
        <div>
          {specs.map(({ icono, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 py-2.5 border-b border-white/6 last:border-0"
            >
              <span className="text-[#FFC107] shrink-0">{icono}</span>
              <span className="text-xs text-gray-400 w-28 shrink-0">{label}</span>
              <span className="text-sm font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vendedor ── */}
      <div className="pt-4">
        <SectionLabel>Vendedor</SectionLabel>

        <div className="flex items-center gap-3">
          <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm text-white ${
            esAgencia ? 'bg-[#282F8F]' : 'bg-white/10'
          }`}>
            {inicialesVendedor}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {esAgencia ? (
                <Link
                  href={`/agencias/${vehiculo.profiles?.id ?? vehiculo.user_id}`}
                  className="text-sm font-bold text-white hover:text-[#FFC107] transition-colors"
                >
                  {nombreVendedor}
                </Link>
              ) : (
                <p className="text-sm font-bold text-white">{nombreVendedor}</p>
              )}
              {verificado && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#282F8F]/60 text-[#A0AFFF] px-2 py-0.5 rounded-full font-semibold shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Verificado
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {esAgencia
                ? 'Agencia oficial'
                : `Particular · Desde ${miembroDesde(vehiculo.profiles?.created_at ?? vehiculo.created_at)}`}
            </p>
          </div>
        </div>

        {vehiculo.profiles?.telefono && (
          <a
            href={`tel:${vehiculo.profiles.telefono}`}
            className="mt-3.5 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            aria-label={`Llamar a ${nombreVendedor}`}
          >
            <IconoTelefono />
            <span className="font-medium">{vehiculo.profiles.telefono}</span>
          </a>
        )}

        <Link
          href={esAgencia
            ? `/agencias/${vehiculo.profiles?.id ?? vehiculo.user_id}`
            : `/usuarios/${vehiculo.profiles?.id ?? vehiculo.user_id}`
          }
          className="mt-4 flex items-center justify-center gap-2 w-full border border-white/12 text-gray-300 text-sm font-semibold py-2.5 rounded-xl hover:border-white/25 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
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
