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

export default function InfoVehiculo({ vehiculo }: InfoVehiculoProps) {
  const esAgencia =
    vehiculo.profiles?.role === 'agencia_premium' ||
    vehiculo.profiles?.role === 'agencia_basica'

  const nombreVendedor = esAgencia
    ? (vehiculo.profiles?.nombre_agencia ?? 'Agencia')
    : `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim() || 'Vendedor'

  const verificado = vehiculo.profiles?.verificado ?? false

  const specs = [
    { label: 'Año', value: String(vehiculo.año) },
    { label: 'Kilometraje', value: formatKm(vehiculo.kilometraje) },
    { label: 'Marca', value: vehiculo.marca },
    { label: 'Modelo', value: vehiculo.modelo },
    { label: 'Ubicación', value: vehiculo.ubicacion },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Precio */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Precio</p>
        <p className="text-4xl font-extrabold text-white leading-none">
          {formatPrecio(vehiculo.precio)}
        </p>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-3">
        {specs.map(({ label, value }) => (
          <div key={label} className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Descripción */}
      {vehiculo.descripcion && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Descripción</p>
          <p className="text-sm text-gray-300 leading-relaxed">{vehiculo.descripcion}</p>
        </div>
      )}

      {/* Vendedor */}
      <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#282F8F]/30 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-[#6B84FF]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{nombreVendedor}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {esAgencia ? (
              <span className="text-xs bg-[#282F8F] text-white px-2 py-0.5 rounded-full font-semibold">
                Agencia verificada
              </span>
            ) : (
              <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-semibold">
                Particular
              </span>
            )}
            {verificado && !esAgencia && (
              <span className="text-xs text-[#FFC107] font-semibold">✓ Verificado</span>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
