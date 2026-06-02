'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MARCAS } from '@/lib/utils/mock-data'

const PRECIOS = [
  { label: 'Sin límite', value: '' },
  { label: 'Hasta $15M', value: '15000000' },
  { label: 'Hasta $20M', value: '20000000' },
  { label: 'Hasta $25M', value: '25000000' },
  { label: 'Hasta $30M', value: '30000000' },
  { label: 'Hasta $40M', value: '40000000' },
]

const AÑOS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2015', '2010', '2000']

const KMS = [
  { label: 'Sin límite', value: '' },
  { label: 'Hasta 30k km', value: '30000' },
  { label: 'Hasta 50k km', value: '50000' },
  { label: 'Hasta 80k km', value: '80000' },
  { label: 'Hasta 120k km', value: '120000' },
]

const LOCALIDADES = [
  'Comodoro Rivadavia',
  'Rada Tilly',
  'Caleta Olivia',
  'Sarmiento',
]

type Filters = {
  marca: string
  precio: string
  año: string
  km: string
  ubicacion: string
}

const EMPTY: Filters = { marca: '', precio: '', año: '', km: '', ubicacion: '' }

function buildHref(f: Filters): string {
  const params = new URLSearchParams()
  if (f.marca) params.set('marca', f.marca)
  if (f.precio) params.set('precio_max', f.precio)
  if (f.año) params.set('año_desde', f.año)
  if (f.km) params.set('km_max', f.km)
  if (f.ubicacion) params.set('ubicacion', f.ubicacion)
  const qs = params.toString()
  return `/vehiculos${qs ? '?' + qs : ''}`
}

const CHIP =
  'relative bg-white/8 border border-white/15 text-white text-sm rounded-full pl-4 pr-8 py-2 focus:outline-none focus:border-[#FFC107]/60 transition-all duration-150 appearance-none cursor-pointer hover:bg-white/14 hover:border-white/25'

const CHIP_ACTIVE =
  'relative bg-[#FFC107]/15 border border-[#FFC107]/50 text-[#FFC107] text-sm rounded-full pl-4 pr-8 py-2 focus:outline-none focus:border-[#FFC107] transition-all duration-150 appearance-none cursor-pointer hover:bg-[#FFC107]/20'

interface ChevronProps { active: boolean }
function Chevron({ active }: ChevronProps) {
  return (
    <svg
      className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${active ? 'text-[#FFC107]' : 'text-gray-400'}`}
      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

interface FiltrosHorizontalesProps {
  /** Si true, este bar será sticky bajo el header (top-16 z-40) */
  sticky?: boolean
}

export default function FiltrosHorizontales({ sticky = false }: FiltrosHorizontalesProps) {
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const router = useRouter()

  const set = (key: keyof Filters) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setFilters(f => ({ ...f, [key]: e.target.value }))

  const hasFilters = Object.values(filters).some(Boolean)

  function handleApply() {
    router.push(buildHref(filters))
  }

  function handleClear() {
    setFilters(EMPTY)
    router.push('/vehiculos')
  }

  const wrapperClass = sticky
    ? 'sticky top-16 z-40 bg-[#071526] border-b border-white/8'
    : ''

  return (
    <div className={wrapperClass}>
      <div className={sticky ? 'max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3' : ''}>
        <div className="flex flex-wrap items-center gap-2">

          {/* Marca */}
          <div className="relative">
            <select value={filters.marca} onChange={set('marca')} className={filters.marca ? CHIP_ACTIVE : CHIP} aria-label="Filtrar por marca">
              <option value="">Todas las marcas</option>
              {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <Chevron active={!!filters.marca} />
          </div>

          {/* Precio */}
          <div className="relative">
            <select value={filters.precio} onChange={set('precio')} className={filters.precio ? CHIP_ACTIVE : CHIP} aria-label="Filtrar por precio">
              {PRECIOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <Chevron active={!!filters.precio} />
          </div>

          {/* Año */}
          <div className="relative">
            <select value={filters.año} onChange={set('año')} className={filters.año ? CHIP_ACTIVE : CHIP} aria-label="Filtrar por año">
              <option value="">Cualquier año</option>
              {AÑOS.map(y => <option key={y} value={y}>Desde {y}</option>)}
            </select>
            <Chevron active={!!filters.año} />
          </div>

          {/* Km */}
          <div className="relative">
            <select value={filters.km} onChange={set('km')} className={filters.km ? CHIP_ACTIVE : CHIP} aria-label="Filtrar por kilómetros">
              {KMS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
            <Chevron active={!!filters.km} />
          </div>

          {/* Localidad */}
          <div className="relative">
            <select value={filters.ubicacion} onChange={set('ubicacion')} className={filters.ubicacion ? CHIP_ACTIVE : CHIP} aria-label="Filtrar por localidad">
              <option value="">Todas las ciudades</option>
              {LOCALIDADES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <Chevron active={!!filters.ubicacion} />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 ml-auto">
            {hasFilters && (
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-gray-400 hover:text-white transition-colors px-3 py-2"
              >
                Limpiar
              </button>
            )}
            <button
              onClick={handleApply}
              className="bg-[#FFC107] text-[#0D0F14] text-sm font-bold px-5 py-2 rounded-full hover:bg-yellow-400 active:scale-[0.98] transition-all"
            >
              Buscar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
