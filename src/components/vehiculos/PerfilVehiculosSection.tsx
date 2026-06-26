'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import GrillaConPaginacion from './GrillaConPaginacion'
import type { Vehiculo } from '@/types'

// ── Precio ────────────────────────────────────────────────────────────────────
const PRICE_ABS_MIN = 0
const PRICE_ABS_MAX = 60_000_000
const PRICE_STEP    = 500_000

function formatPrecio(val: number): string {
  if (val === 0) return '$0'
  if (val < 1_000_000) return `$${val / 1_000}K`
  const m = val / 1_000_000
  return `$${m % 1 === 0 ? m : m.toFixed(1)}M`
}

// ── Opciones estáticas ────────────────────────────────────────────────────────
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

// ── Chevron ───────────────────────────────────────────────────────────────────
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

// ── Dropdown chip ─────────────────────────────────────────────────────────────
function FilterChip({ label, value, options, onChange }: {
  label: string
  value: string
  options: Option[]
  onChange: (v: string) => void
}) {
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
        <Chevron open={open} />
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

// ── Price range chip ──────────────────────────────────────────────────────────
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
  const minOnTop = minVal >= maxVal - PRICE_STEP

  function handleMin(v: number) {
    const clamped = Math.min(v, maxVal - PRICE_STEP)
    onChange(clamped > PRICE_ABS_MIN ? String(clamped) : '', precioMax)
  }

  function handleMax(v: number) {
    const clamped = Math.max(v, minVal + PRICE_STEP)
    onChange(precioMin, clamped < PRICE_ABS_MAX ? String(clamped) : '')
  }

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
            className="sm:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60"
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

// ── Componente principal ──────────────────────────────────────────────────────
interface Props {
  vehiculos: Vehiculo[]
  emptyText?: string
  pageSize?: number
  sticky?: boolean
}

export default function PerfilVehiculosSection({
  vehiculos,
  emptyText = 'Este vendedor no tiene vehículos disponibles.',
  pageSize = 9,
  sticky = false,
}: Props) {
  const [marca,     setMarca]     = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [año,       setAño]       = useState('')
  const [km,        setKm]        = useState('')
  const [condicion, setCondicion] = useState('')

  const marcasDisponibles = useMemo(() => {
    const set = new Set(vehiculos.map(v => v.marca))
    return Array.from(set).sort()
  }, [vehiculos])

  const MARCA_OPTS: Option[] = useMemo(() => [
    { label: 'Todas las marcas', value: '' },
    ...marcasDisponibles.map(m => ({ label: m, value: m })),
  ], [marcasDisponibles])

  const filtered = useMemo(() => vehiculos.filter(v => {
    if (marca     && v.marca        !== marca)          return false
    if (precioMin && v.precio        < Number(precioMin)) return false
    if (precioMax && v.precio        > Number(precioMax)) return false
    if (año       && v.año           < Number(año))       return false
    if (km        && v.kilometraje   > Number(km))        return false
    if (condicion && v.condicion    !== condicion)        return false
    return true
  }), [vehiculos, marca, precioMin, precioMax, año, km, condicion])

  const hasFilters = !!(marca || precioMin || precioMax || año || km || condicion)

  function clearAll() {
    setMarca(''); setPrecioMin(''); setPrecioMax('')
    setAño(''); setKm(''); setCondicion('')
  }

  if (vehiculos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-gray-500">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <p className="text-white font-bold mb-1">Sin publicaciones activas</p>
        <p className="text-sm text-gray-400">{emptyText}</p>
      </div>
    )
  }

  // Solo mostrar filtros si hay suficientes vehículos para que sean útiles
  const showFilters = vehiculos.length >= 4

  return (
    <div>
      {showFilters && (
        <div className={
          sticky
            ? 'sticky top-14 z-40 bg-[#071526] border-b border-white/8 flex flex-wrap items-center gap-2 py-3 mb-5'
            : 'flex flex-wrap items-center gap-2 mb-5 pb-5 border-b border-white/6'
        }>
          {marcasDisponibles.length > 1 && (
            <FilterChip
              label="Todas las marcas"
              value={marca}
              options={MARCA_OPTS}
              onChange={setMarca}
            />
          )}
          <PriceRangeChip
            precioMin={precioMin}
            precioMax={precioMax}
            onChange={(min, max) => { setPrecioMin(min); setPrecioMax(max) }}
          />
          <FilterChip
            label="Kilómetros"
            value={km}
            options={KM_OPTS}
            onChange={setKm}
          />
          <FilterChip
            label="Cualquier año"
            value={año}
            options={AÑO_OPTS}
            onChange={setAño}
          />
          <FilterChip
            label="Condición"
            value={condicion}
            options={CONDICION_OPTS}
            onChange={setCondicion}
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
      )}

      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-gray-400 font-medium">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          {hasFilters && ` de ${vehiculos.length}`}
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-[#FFC107] hover:text-white transition-colors underline underline-offset-2"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <GrillaConPaginacion vehiculos={filtered} initialLimit={pageSize} pageSize={pageSize} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-white font-bold mb-1">Sin resultados</p>
          <p className="text-sm text-gray-400 mb-4">Ningún vehículo coincide con los filtros seleccionados.</p>
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-bold text-[#FFC107] hover:text-white transition-colors"
          >
            Ver todos los vehículos →
          </button>
        </div>
      )}
    </div>
  )
}
