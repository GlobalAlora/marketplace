'use client'

import { useState } from 'react'
import type { Vehiculo } from '@/types'
import type { Banner } from '@/types'
import VehiculoCard from './VehiculoCard'
import BannerPublicitario from '@/components/ui/BannerPublicitario'

interface GrillaConPaginacionProps {
  vehiculos: Vehiculo[]
  initialLimit?: number
  pageSize?: number
  cols?: 'auto' | 2 | 3
  /** Banner horizontal inyectado dentro de la grilla después de N cards */
  midBanner?: Banner
  /** Después de cuántas cards insertar el banner (default: 9 = 3 filas × 3 cols) */
  midBannerAfter?: number
}

export default function GrillaConPaginacion({
  vehiculos,
  initialLimit = 12,
  pageSize = 12,
  cols = 'auto',
  midBanner,
  midBannerAfter = 9,
}: GrillaConPaginacionProps) {
  const [visible, setVisible] = useState(initialLimit)

  const shown = vehiculos.slice(0, visible)
  const remaining = vehiculos.length - visible
  const hasMore = remaining > 0

  // Divide el listado visible en dos mitades para insertar el banner en el medio
  const firstSlice = shown.slice(0, midBannerAfter)
  const restSlice = shown.slice(midBannerAfter)
  const showMidBanner = !!midBanner && shown.length > 0

  const gridCols =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'

  return (
    <div>
      {/* Primera porción */}
      <div className={`grid ${gridCols} gap-5`}>
        {firstSlice.map(v => (
          <VehiculoCard key={v.id} vehiculo={v} />
        ))}
      </div>

      {/* Banner horizontal mid — solo si hay suficientes cards */}
      {showMidBanner && (
        <div className="my-6">
          <BannerPublicitario banner={midBanner!} />
        </div>
      )}

      {/* Segunda porción */}
      {restSlice.length > 0 && (
        <div className={`grid ${gridCols} gap-5`}>
          {restSlice.map(v => (
            <VehiculoCard key={v.id} vehiculo={v} />
          ))}
        </div>
      )}

      {/* Footer: contador + botón ver más */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-xs text-gray-500">
          Mostrando <span className="text-gray-300 font-medium">{shown.length}</span>{' '}
          de <span className="text-gray-300 font-medium">{vehiculos.length}</span> vehículos
        </p>

        {hasMore && (
          <button
            onClick={() => setVisible(v => v + pageSize)}
            className="inline-flex items-center gap-2 border border-white/15 text-gray-300 text-sm font-semibold px-6 py-2.5 rounded-xl hover:border-[#FFC107]/50 hover:text-white hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-200"
          >
            Ver {Math.min(remaining, pageSize)} vehículos más
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}

        {!hasMore && vehiculos.length > initialLimit && (
          <p className="text-xs text-gray-500">Todos los vehículos cargados</p>
        )}
      </div>
    </div>
  )
}
