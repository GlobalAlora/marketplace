'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import FiltrosHorizontales from '@/components/vehiculos/FiltrosHorizontales'
import GrillaConPaginacion from '@/components/vehiculos/GrillaConPaginacion'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import type { Vehiculo, Banner } from '@/types'

const SORT_OPTIONS = [
  { label: 'Más recientes', value: 'reciente' },
  { label: 'Menor precio',  value: 'precio_asc' },
  { label: 'Mayor precio',  value: 'precio_desc' },
  { label: 'Menor km',     value: 'km_asc' },
]

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selected = SORT_OPTIONS.find(o => o.value === value) ?? SORT_OPTIONS[0]

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-white/8 border border-white/15 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/14 hover:border-white/25 transition-all duration-150"
      >
        {selected.label}
        <svg className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <ul role="listbox" className="absolute top-[calc(100%+6px)] right-0 z-50 min-w-[170px] bg-[#0d2137] border border-white/15 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          {SORT_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${opt.value === value ? 'bg-[#FFC107]/15 text-[#FFC107] font-semibold' : 'text-gray-300 hover:bg-white/8 hover:text-white'}`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface Props {
  vehiculos: Vehiculo[]
  banners: Record<string, Banner | null>
}

export default function ListadoVehiculos({ vehiculos, banners }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const q         = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const marca     = searchParams.get('marca') ?? ''
  const precioMin = searchParams.get('precio_min') ? Number(searchParams.get('precio_min')) : null
  const precioMax = searchParams.get('precio_max') ? Number(searchParams.get('precio_max')) : null
  const añoDesde  = searchParams.get('año_desde')  ? Number(searchParams.get('año_desde'))  : null
  const kmMax     = searchParams.get('km_max')     ? Number(searchParams.get('km_max'))     : null
  const ubicacion = searchParams.get('ubicacion') ?? ''
  const condicion = searchParams.get('condicion') ?? ''
  const tipo      = searchParams.get('tipo') ?? ''
  const sort      = searchParams.get('sort') ?? 'reciente'

  const marcasDisponibles = useMemo(
    () => Array.from(new Set(vehiculos.map(v => v.marca).filter(Boolean))).sort(),
    [vehiculos]
  )
  const ubicacionesDisponibles = useMemo(
    () => Array.from(new Set(vehiculos.map(v => v.ubicacion).filter(Boolean))).sort(),
    [vehiculos]
  )

  const filtered = useMemo(() => {
    const result = vehiculos.filter(v => {
      if (q && !`${v.titulo} ${v.marca} ${v.modelo}`.toLowerCase().includes(q)) return false
      if (marca && v.marca !== marca) return false
      if (precioMin !== null && v.precio < precioMin) return false
      if (precioMax !== null && v.precio > precioMax) return false
      if (añoDesde  !== null && v.año < añoDesde)     return false
      if (kmMax     !== null && v.kilometraje > kmMax) return false
      if (ubicacion && v.ubicacion !== ubicacion)      return false
      if (condicion && v.condicion !== condicion)      return false
      if (tipo && v.tipo_vehiculo !== tipo)            return false
      return true
    })
    // Destacados siempre primero dentro de cada criterio de orden
    const dest = result.filter(v => v.destacado)
    const rest = result.filter(v => !v.destacado)
    switch (sort) {
      case 'precio_asc': {
        const byPrecio = (a: Vehiculo, b: Vehiculo) => a.precio - b.precio
        return [...dest.sort(byPrecio), ...rest.sort(byPrecio)]
      }
      case 'precio_desc': {
        const byPrecioDesc = (a: Vehiculo, b: Vehiculo) => b.precio - a.precio
        return [...dest.sort(byPrecioDesc), ...rest.sort(byPrecioDesc)]
      }
      case 'km_asc': {
        const byKm = (a: Vehiculo, b: Vehiculo) => a.kilometraje - b.kilometraje
        return [...dest.sort(byKm), ...rest.sort(byKm)]
      }
      default: {
        const byDate = (a: Vehiculo, b: Vehiculo) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        return [...dest.sort(byDate), ...rest.sort(byDate)]
      }
    }
  }, [vehiculos, q, marca, precioMin, precioMax, añoDesde, kmMax, ubicacion, condicion, tipo, sort])

  const hasFilters = !!(q || marca || precioMin || precioMax || añoDesde || kmMax || ubicacion || condicion || tipo)

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'reciente') params.delete('sort')
    else params.set('sort', value)
    router.replace(`/vehiculos${params.toString() ? '?' + params.toString() : ''}`, { scroll: false })
  }

  function handleClearFilters() { router.push('/vehiculos') }

  return (
    <>
      {/* Header strip */}
      <div className="bg-[#0D0F14]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Todos los vehículos</h1>
              <p className="mt-1 text-gray-400 text-sm">Comprá y vendé autos en la región patagónica</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {q && <span className="text-xs text-gray-400">Búsqueda: <span className="text-[#FFC107] font-semibold">&ldquo;{q}&rdquo;</span></span>}
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#FFC107] shrink-0" />
                {filtered.length} {filtered.length === 1 ? 'vehículo' : 'vehículos'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros sticky */}
      <FiltrosHorizontales sticky marcas={marcasDisponibles} ubicaciones={ubicacionesDisponibles} />

      {/* Banner vehiculos_top */}
      {banners.vehiculos_top && (
        <div className="bg-[#071526] border-b border-white/5">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3">
            <BannerPublicitario banner={banners.vehiculos_top} />
          </div>
        </div>
      )}

      {/* Grilla + sidebar */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Listado */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-400 font-medium">
                    {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
                  </span>
                </div>
                <SortDropdown value={sort} onChange={handleSortChange} />
              </div>

              {filtered.length > 0 ? (
                <GrillaConPaginacion
                  vehiculos={filtered}
                  initialLimit={12}
                  pageSize={12}
                  midBanner={banners.vehiculos_mid ?? undefined}
                  midBannerAfter={9}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Sin resultados</h3>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">No hay vehículos que coincidan con los filtros seleccionados.</p>
                  <button onClick={handleClearFilters} className="mt-5 text-sm font-bold text-[#FFC107] hover:text-white transition-colors">
                    Ver todos los vehículos →
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar derecho — 3 banners verticales 220×300 */}
            <aside className="w-[220px] shrink-0 hidden xl:block">
              <div className="sticky top-20 space-y-4">
                {banners.sidebar_derecho_1 && <BannerPublicitario banner={banners.sidebar_derecho_1} />}
                {banners.sidebar_derecho_2 && <BannerPublicitario banner={banners.sidebar_derecho_2} />}
                {banners.sidebar_derecho_3 && <BannerPublicitario banner={banners.sidebar_derecho_3} />}
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  )
}
