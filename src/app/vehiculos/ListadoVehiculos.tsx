'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import FiltrosHorizontales from '@/components/vehiculos/FiltrosHorizontales'
import VehiculoCard from '@/components/vehiculos/VehiculoCard'
import GrillaConPaginacion from '@/components/vehiculos/GrillaConPaginacion'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'
import { MOCK_BANNERS } from '@/lib/utils/mock-banner'

const SORT_OPTIONS = [
  { label: 'Más recientes', value: 'reciente' },
  { label: 'Menor precio', value: 'precio_asc' },
  { label: 'Mayor precio', value: 'precio_desc' },
  { label: 'Menor km', value: 'km_asc' },
]

const SELECT_STYLE =
  'bg-white/8 border border-white/15 text-white text-sm rounded-full pl-3 pr-8 py-2 focus:outline-none focus:border-[#FFC107]/50 transition-colors appearance-none cursor-pointer hover:bg-white/12'

export default function ListadoVehiculos() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const q         = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const marca     = searchParams.get('marca') ?? ''
  const precioMax = searchParams.get('precio_max') ? Number(searchParams.get('precio_max')) : null
  const añoDesde  = searchParams.get('año_desde')  ? Number(searchParams.get('año_desde'))  : null
  const kmMax     = searchParams.get('km_max')     ? Number(searchParams.get('km_max'))     : null
  const ubicacion = searchParams.get('ubicacion') ?? ''
  const sort      = searchParams.get('sort') ?? 'reciente'

  const filtered = useMemo(() => {
    const result = MOCK_VEHICULOS.filter(v => {
      if (q && !`${v.titulo} ${v.marca} ${v.modelo}`.toLowerCase().includes(q)) return false
      if (marca && v.marca !== marca) return false
      if (precioMax !== null && v.precio > precioMax) return false
      if (añoDesde  !== null && v.año < añoDesde)     return false
      if (kmMax     !== null && v.kilometraje > kmMax) return false
      if (ubicacion && v.ubicacion !== ubicacion)      return false
      return true
    })

    switch (sort) {
      case 'precio_asc':
        return [...result].sort((a, b) => a.precio - b.precio)
      case 'precio_desc':
        return [...result].sort((a, b) => b.precio - a.precio)
      case 'km_asc':
        return [...result].sort((a, b) => a.kilometraje - b.kilometraje)
      default: {
        const byDate = (a: { created_at: string }, b: { created_at: string }) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        return [
          ...result.filter(v => v.destacado).sort(byDate),
          ...result.filter(v => !v.destacado).sort(byDate),
        ]
      }
    }
  }, [q, marca, precioMax, añoDesde, kmMax, ubicacion, sort])

  const hasFilters = !!(q || marca || precioMax || añoDesde || kmMax || ubicacion)

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value === 'reciente') {
      params.delete('sort')
    } else {
      params.set('sort', e.target.value)
    }
    const qs = params.toString()
    router.replace(`/vehiculos${qs ? '?' + qs : ''}`)
  }

  function handleClearFilters() {
    router.push('/vehiculos')
  }

  return (
    <>
      {/* Dark page header strip */}
      <div className="bg-[#0D0F14]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Todos los vehículos
              </h1>
              <p className="mt-1 text-gray-400 text-sm">
                Comprá y vendé autos en la región patagónica
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {q && (
                <span className="text-xs text-gray-400">
                  Búsqueda:{' '}
                  <span className="text-[#FFC107] font-semibold">&ldquo;{q}&rdquo;</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#FFC107] shrink-0" />
                {filtered.length}{' '}
                {filtered.length === 1 ? 'vehículo' : 'vehículos'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky horizontal filter bar */}
      <FiltrosHorizontales sticky />

      {/* Banner horizontal top — debajo de filtros, antes de la grilla */}
      <div className="bg-[#071526] border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3">
          <BannerPublicitario banner={MOCK_BANNERS.horizontal_top} />
        </div>
      </div>

      {/* Main content area */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Listings column */}
            <div className="flex-1 min-w-0">

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-400 font-medium">
                    {filtered.length}{' '}
                    {filtered.length === 1 ? 'resultado' : 'resultados'}
                  </span>
                  {hasFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs font-semibold text-[#FFC107] hover:text-white transition-colors underline underline-offset-2"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="relative shrink-0">
                  <select
                    value={sort}
                    onChange={handleSortChange}
                    className={SELECT_STYLE}
                    aria-label="Ordenar vehículos"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Grid */}
              {filtered.length > 0 ? (
                <GrillaConPaginacion
                  vehiculos={filtered}
                  initialLimit={12}
                  pageSize={12}
                  midBanner={MOCK_BANNERS.horizontal_mid}
                  midBannerAfter={9}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Sin resultados</h3>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                    No hay vehículos que coincidan con los filtros seleccionados.
                    Probá con otros criterios.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-5 text-sm font-bold text-[#FFC107] hover:text-white transition-colors"
                  >
                    Ver todos los vehículos →
                  </button>
                </div>
              )}
            </div>

            {/* Right sidebar: sticky banner */}
            <aside className="w-[220px] shrink-0 hidden xl:block">
              <div className="sticky top-36">
                <BannerPublicitario banner={MOCK_BANNERS.sidebar_right} />
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  )
}
