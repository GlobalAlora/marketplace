'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MARCAS } from '@/lib/constants'

interface Option {
  label: string
  value: string
}

const PRECIO_OPTS: Option[] = [
  { label: 'Sin límite',   value: '' },
  { label: 'Hasta $15M',  value: '15000000' },
  { label: 'Hasta $20M',  value: '20000000' },
  { label: 'Hasta $25M',  value: '25000000' },
  { label: 'Hasta $30M',  value: '30000000' },
  { label: 'Hasta $40M',  value: '40000000' },
]

const AÑO_OPTS: Option[] = [
  { label: 'Cualquier año', value: '' },
  { label: 'Desde 2024',   value: '2024' },
  { label: 'Desde 2022',   value: '2022' },
  { label: 'Desde 2020',   value: '2020' },
  { label: 'Desde 2018',   value: '2018' },
  { label: 'Desde 2015',   value: '2015' },
]

const KM_OPTS: Option[] = [
  { label: 'Sin límite',     value: '' },
  { label: 'Hasta 30k km',  value: '30000' },
  { label: 'Hasta 50k km',  value: '50000' },
  { label: 'Hasta 80k km',  value: '80000' },
  { label: 'Hasta 120k km', value: '120000' },
]

const LOCALIDAD_OPTS: Option[] = [
  { label: 'Todas las ciudades',  value: '' },
  { label: 'Comodoro Rivadavia', value: 'Comodoro Rivadavia' },
  { label: 'Rada Tilly',         value: 'Rada Tilly' },
  { label: 'Caleta Olivia',      value: 'Caleta Olivia' },
  { label: 'Sarmiento',          value: 'Sarmiento' },
]

const MARCA_OPTS: Option[] = [
  { label: 'Todas las marcas', value: '' },
  ...MARCAS.map(m => ({ label: m, value: m })),
]

type Filters = {
  marca: string
  precio: string
  año: string
  km: string
  ubicacion: string
}

// ── Dropdown chip individual ──────────────────────────────────────────────────
function FilterChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Option[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cierra al hacer click fuera
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const active   = !!value
  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={[
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 select-none',
          active
            ? 'bg-[#FFC107]/15 border-[#FFC107]/50 text-[#FFC107]'
            : 'bg-white/8 border-white/15 text-white hover:bg-white/14 hover:border-white/25',
        ].join(' ')}
      >
        {selected?.label ?? label}
        <svg
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-[190px] max-h-64 overflow-y-auto bg-[#0d2137] border border-white/15 rounded-xl shadow-2xl shadow-black/60"
        >
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={[
                  'w-full text-left px-4 py-2.5 text-sm transition-colors',
                  opt.value === value
                    ? 'bg-[#FFC107]/15 text-[#FFC107] font-semibold'
                    : 'text-gray-300 hover:bg-white/8 hover:text-white',
                ].join(' ')}
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

// ── Componente principal ──────────────────────────────────────────────────────
interface FiltrosHorizontalesProps {
  sticky?: boolean
}

export default function FiltrosHorizontales({ sticky = false }: FiltrosHorizontalesProps) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  // Inicializa con los params actuales de la URL (refleja filtros activos al navegar directo)
  const [filters, setFilters] = useState<Filters>({
    marca:    searchParams.get('marca')      ?? '',
    precio:   searchParams.get('precio_max') ?? '',
    año:      searchParams.get('año_desde')  ?? '',
    km:       searchParams.get('km_max')     ?? '',
    ubicacion: searchParams.get('ubicacion') ?? '',
  })

  const hasFilters = Object.values(filters).some(Boolean)

  function buildHref(f: Filters): string {
    const params = new URLSearchParams()
    if (f.marca)    params.set('marca',      f.marca)
    if (f.precio)   params.set('precio_max', f.precio)
    if (f.año)      params.set('año_desde',  f.año)
    if (f.km)       params.set('km_max',     f.km)
    if (f.ubicacion) params.set('ubicacion', f.ubicacion)
    const qs = params.toString()
    return `/vehiculos${qs ? '?' + qs : ''}`
  }

  // Aplica el filtro inmediatamente (AJAX) — replace en /vehiculos, push desde otras páginas
  function applyFilter(key: keyof Filters, value: string) {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const href = buildHref(next)
    if (pathname === '/vehiculos') {
      router.replace(href, { scroll: false })
    } else {
      router.push(href)
    }
  }

  function clearAll() {
    const empty: Filters = { marca: '', precio: '', año: '', km: '', ubicacion: '' }
    setFilters(empty)
    if (pathname === '/vehiculos') {
      router.replace('/vehiculos', { scroll: false })
    } else {
      router.push('/vehiculos')
    }
  }

  const wrapperCls = sticky
    ? 'sticky top-16 z-40 bg-[#071526] border-b border-white/8'
    : ''

  const innerCls = sticky
    ? 'max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3'
    : ''

  return (
    <div className={wrapperCls}>
      <div className={innerCls}>
        <div className="flex flex-wrap items-center gap-2">

          <FilterChip
            label="Todas las marcas"
            value={filters.marca}
            options={MARCA_OPTS}
            onChange={v => applyFilter('marca', v)}
          />

          <FilterChip
            label="Sin límite"
            value={filters.precio}
            options={PRECIO_OPTS}
            onChange={v => applyFilter('precio', v)}
          />

          <FilterChip
            label="Cualquier año"
            value={filters.año}
            options={AÑO_OPTS}
            onChange={v => applyFilter('año', v)}
          />

          <FilterChip
            label="Sin límite"
            value={filters.km}
            options={KM_OPTS}
            onChange={v => applyFilter('km', v)}
          />

          <FilterChip
            label="Todas las ciudades"
            value={filters.ubicacion}
            options={LOCALIDAD_OPTS}
            onChange={v => applyFilter('ubicacion', v)}
          />

          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors px-2 py-2"
            >
              Limpiar
            </button>
          )}

        </div>
      </div>
    </div>
  )
}
