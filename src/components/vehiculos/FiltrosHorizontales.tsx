'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { TIPOS_VEHICULO } from '@/lib/constants'

// ── Constantes precio ──────────────────────────────────────────────────────────
const PRICE_ABS_MIN = 0
const PRICE_ABS_MAX = 60_000_000
const PRICE_STEP    = 500_000

function formatPrecio(val: number): string {
  if (val === 0) return '$0'
  if (val < 1_000_000) return `$${val / 1_000}K`
  const m = val / 1_000_000
  return `$${m % 1 === 0 ? m : m.toFixed(1)}M`
}

// ── Opciones otros filtros ─────────────────────────────────────────────────────
interface Option { label: string; value: string }

const AÑO_OPTS: Option[] = [
  { label: 'Cualquier año', value: '' },
  { label: 'Desde 2024',   value: '2024' },
  { label: 'Desde 2022',   value: '2022' },
  { label: 'Desde 2020',   value: '2020' },
  { label: 'Desde 2018',   value: '2018' },
  { label: 'Desde 2015',   value: '2015' },
]

const KM_OPTS: Option[] = [
  { label: 'Cualquier km',   value: '' },
  { label: 'Hasta 30k km',  value: '30000' },
  { label: 'Hasta 50k km',  value: '50000' },
  { label: 'Hasta 80k km',  value: '80000' },
  { label: 'Hasta 120k km', value: '120000' },
]

const CONDICION_OPTS: Option[] = [
  { label: 'Nuevo o usado', value: '' },
  { label: 'Nuevo',         value: 'nuevo' },
  { label: 'Usado',         value: 'usado' },
]

const TIPO_OPTS: Option[] = [
  { label: 'Todos los tipos', value: '' },
  ...TIPOS_VEHICULO.map(t => ({ label: t.label, value: t.value })),
]

// ── Chevron ────────────────────────────────────────────────────────────────────
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// ── Dropdown chip estándar ─────────────────────────────────────────────────────
function FilterChip({ label, value, options, onChange, searchable = false, searchPlaceholder = 'Buscar...' }: {
  label: string
  value: string
  options: Option[]
  onChange: (v: string) => void
  searchable?: boolean
  searchPlaceholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open && searchable) {
      setQuery('')
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open, searchable])

  const active   = !!value
  const selected = options.find(o => o.value === value)
  const visibleOptions = searchable && query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options

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
        <Chevron open={open} />
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-[220px] bg-[#0d2137] border border-white/15 rounded-xl shadow-2xl shadow-black/60 overflow-hidden"
        >
          {searchable && (
            <div className="p-2 border-b border-white/10">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-[#FFC107]/60"
              />
            </div>
          )}
          <ul role="listbox" className="max-h-64 overflow-y-auto">
            {visibleOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-600">Sin resultados</li>
            ) : (
              visibleOptions.map(opt => (
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
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Price range chip ───────────────────────────────────────────────────────────
const THUMB = [
  'absolute w-full h-full appearance-none bg-transparent',
  'focus:outline-none focus-visible:outline-none',
  '[&::-webkit-slider-runnable-track]:bg-transparent',
  '[&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px]',
  '[&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:bg-white',
  '[&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.55)]',
  '[&::-webkit-slider-thumb]:border-0',
  '[&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing',
  '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110',
  '[&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px]',
  '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white',
  '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-grab',
  '[&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.55)]',
  'pointer-events-none',
  '[&::-webkit-slider-thumb]:pointer-events-auto',
  '[&::-moz-range-thumb]:pointer-events-auto',
].join(' ')

function PriceRangeChip({ precioMin, precioMax, onChange }: {
  precioMin: string
  precioMax: string
  onChange: (min: string, max: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const minVal = precioMin ? Number(precioMin) : PRICE_ABS_MIN
  const maxVal = precioMax ? Number(precioMax) : PRICE_ABS_MAX
  const isActive = minVal > PRICE_ABS_MIN || maxVal < PRICE_ABS_MAX

  function getLabel() {
    if (!isActive) return 'Precio'
    if (minVal > PRICE_ABS_MIN && maxVal < PRICE_ABS_MAX)
      return `${formatPrecio(minVal)} – ${formatPrecio(maxVal)}`
    if (minVal > PRICE_ABS_MIN) return `Desde ${formatPrecio(minVal)}`
    return `Hasta ${formatPrecio(maxVal)}`
  }

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const leftPct  = (minVal / PRICE_ABS_MAX) * 100
  const rightPct = ((PRICE_ABS_MAX - maxVal) / PRICE_ABS_MAX) * 100

  function handleMin(v: number) {
    const clamped = Math.min(v, maxVal - PRICE_STEP)
    onChange(clamped > PRICE_ABS_MIN ? String(clamped) : '', precioMax)
  }

  function handleMax(v: number) {
    const clamped = Math.max(v, minVal + PRICE_STEP)
    onChange(precioMin, clamped < PRICE_ABS_MAX ? String(clamped) : '')
  }

  // Raise min thumb z-index when handles are very close so user can pull it back
  const minOnTop = minVal >= maxVal - PRICE_STEP

  const panelContent = (
    <>
      {/* Valores actuales */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Desde</p>
          <p className="text-sm font-bold text-[#FFC107]">{formatPrecio(minVal)}</p>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Hasta</p>
          <p className="text-sm font-bold text-[#FFC107]">
            {maxVal >= PRICE_ABS_MAX ? 'Sin límite' : formatPrecio(maxVal)}
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-10 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/12">
          <div
            className="absolute h-full rounded-full bg-[#FFC107]"
            style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
          />
        </div>
        <input
          type="range"
          min={PRICE_ABS_MIN} max={PRICE_ABS_MAX} step={PRICE_STEP}
          value={minVal}
          onChange={e => handleMin(Number(e.target.value))}
          className={`${THUMB} ${minOnTop ? 'z-[3]' : 'z-[1]'}`}
        />
        <input
          type="range"
          min={PRICE_ABS_MIN} max={PRICE_ABS_MAX} step={PRICE_STEP}
          value={maxVal}
          onChange={e => handleMax(Number(e.target.value))}
          className={`${THUMB} z-[2]`}
        />
      </div>

      {/* Extremos */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-600">$0</span>
        <span className="text-[10px] text-gray-600">$60M+</span>
      </div>

      {isActive && (
        <button
          type="button"
          onClick={() => onChange('', '')}
          className="mt-4 w-full text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Limpiar precio
        </button>
      )}
    </>
  )

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={[
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 select-none',
          isActive
            ? 'bg-[#FFC107]/15 border-[#FFC107]/50 text-[#FFC107]'
            : 'bg-white/8 border-white/15 text-white hover:bg-white/14 hover:border-white/25',
        ].join(' ')}
      >
        {getLabel()}
        <Chevron open={open} />
      </button>

      {open && (
        <>
          {/* Mobile: backdrop + bottom sheet centrado */}
          <div
            className="sm:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 pb-safe"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-md bg-[#0d2137] border border-white/15 rounded-t-2xl shadow-2xl p-5 pb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-white">Rango de precio</p>
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {panelContent}
            </div>
          </div>

          {/* Desktop: dropdown absoluto */}
          <div className="hidden sm:block absolute top-[calc(100%+6px)] left-0 z-50 w-72 bg-[#0d2137] border border-white/15 rounded-2xl shadow-2xl shadow-black/60 p-5">
            {panelContent}
          </div>
        </>
      )}
    </div>
  )
}

// ── Tipos y estado principal ───────────────────────────────────────────────────
type Filters = {
  marca:     string
  precioMin: string
  precioMax: string
  año:       string
  km:        string
  ubicacion: string
  condicion: string
  tipo:      string
}

interface FiltrosHorizontalesProps {
  sticky?: boolean
  marcas?: string[]
  ubicaciones?: string[]
}

export default function FiltrosHorizontales({ sticky = false, marcas = [], ubicaciones = [] }: FiltrosHorizontalesProps) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const MARCA_OPTS: Option[] = useMemo(() => [
    { label: 'Todas las marcas', value: '' },
    ...marcas.map(m => ({ label: m, value: m })),
  ], [marcas])

  const LOCALIDAD_OPTS: Option[] = useMemo(() => [
    { label: 'Todas las ciudades', value: '' },
    ...ubicaciones.map(u => ({ label: u, value: u })),
  ], [ubicaciones])

  const [filters, setFilters] = useState<Filters>({
    marca:     searchParams.get('marca')      ?? '',
    precioMin: searchParams.get('precio_min') ?? '',
    precioMax: searchParams.get('precio_max') ?? '',
    año:       searchParams.get('año_desde')  ?? '',
    km:        searchParams.get('km_max')     ?? '',
    ubicacion: searchParams.get('ubicacion')  ?? '',
    condicion: searchParams.get('condicion')  ?? '',
    tipo:      searchParams.get('tipo')       ?? '',
  })

  // Sincroniza estado local cuando la URL cambia externamente (ej: "Limpiar filtros" del listado)
  useEffect(() => {
    setFilters({
      marca:     searchParams.get('marca')      ?? '',
      precioMin: searchParams.get('precio_min') ?? '',
      precioMax: searchParams.get('precio_max') ?? '',
      año:       searchParams.get('año_desde')  ?? '',
      km:        searchParams.get('km_max')     ?? '',
      ubicacion: searchParams.get('ubicacion')  ?? '',
      condicion: searchParams.get('condicion')  ?? '',
      tipo:      searchParams.get('tipo')       ?? '',
    })
  }, [searchParams])

  const hasFilters = Object.values(filters).some(Boolean)

  function buildHref(f: Filters): string {
    const params = new URLSearchParams()
    if (f.marca)     params.set('marca',      f.marca)
    if (f.precioMin) params.set('precio_min', f.precioMin)
    if (f.precioMax) params.set('precio_max', f.precioMax)
    if (f.año)       params.set('año_desde',  f.año)
    if (f.km)        params.set('km_max',     f.km)
    if (f.ubicacion) params.set('ubicacion',  f.ubicacion)
    if (f.condicion) params.set('condicion',  f.condicion)
    if (f.tipo)      params.set('tipo',       f.tipo)
    const qs = params.toString()
    return `/vehiculos${qs ? '?' + qs : ''}`
  }

  function navigate(next: Filters) {
    setFilters(next)
    const href = buildHref(next)
    if (pathname === '/vehiculos') router.replace(href, { scroll: false })
    else router.push(href)
  }

  function applyFilter(key: keyof Filters, value: string) {
    navigate({ ...filters, [key]: value })
  }

  function applyPrecio(min: string, max: string) {
    navigate({ ...filters, precioMin: min, precioMax: max })
  }

  function clearAll() {
    navigate({ marca: '', precioMin: '', precioMax: '', año: '', km: '', ubicacion: '', condicion: '', tipo: '' })
  }

  return (
    <div className={sticky ? 'sticky top-14 z-40 bg-[#071526] border-b border-white/8' : ''}>
      <div className={sticky ? 'max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3' : ''}>
        <div className="flex flex-wrap items-center gap-2">

          <FilterChip
            label="Todos los tipos"
            value={filters.tipo}
            options={TIPO_OPTS}
            onChange={v => applyFilter('tipo', v)}
          />

          <FilterChip
            label="Todas las marcas"
            value={filters.marca}
            options={MARCA_OPTS}
            onChange={v => applyFilter('marca', v)}
            searchable
            searchPlaceholder="Buscar marca..."
          />

          <PriceRangeChip
            precioMin={filters.precioMin}
            precioMax={filters.precioMax}
            onChange={applyPrecio}
          />

          <FilterChip
            label="Kilómetros"
            value={filters.km}
            options={KM_OPTS}
            onChange={v => applyFilter('km', v)}
          />

          <FilterChip
            label="Cualquier año"
            value={filters.año}
            options={AÑO_OPTS}
            onChange={v => applyFilter('año', v)}
          />

          <FilterChip
            label="Condición"
            value={filters.condicion}
            options={CONDICION_OPTS}
            onChange={v => applyFilter('condicion', v)}
          />

          <FilterChip
            label="Todas las ciudades"
            value={filters.ubicacion}
            options={LOCALIDAD_OPTS}
            onChange={v => applyFilter('ubicacion', v)}
            searchable
            searchPlaceholder="Buscar ciudad..."
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
