'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TIPOS_VEHICULO } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import ComboboxSelect from '@/components/ui/ComboboxSelect'

const PRECIOS = [
  { label: 'Sin límite', value: '' },
  { label: 'Hasta $15.000.000', value: '15000000' },
  { label: 'Hasta $20.000.000', value: '20000000' },
  { label: 'Hasta $25.000.000', value: '25000000' },
  { label: 'Hasta $30.000.000', value: '30000000' },
  { label: 'Hasta $40.000.000', value: '40000000' },
]

const AÑOS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2015', '2010', '2000']

const KMS = [
  { label: 'Sin límite', value: '' },
  { label: 'Hasta 30.000 km', value: '30000' },
  { label: 'Hasta 50.000 km', value: '50000' },
  { label: 'Hasta 80.000 km', value: '80000' },
  { label: 'Hasta 120.000 km', value: '120000' },
]

type Filters = {
  marca: string
  precio: string
  año: string
  km: string
  ubicacion: string
  tipo: string
}

const EMPTY: Filters = { marca: '', precio: '', año: '', km: '', ubicacion: '', tipo: '' }

function buildHref(f: Filters): string {
  const params = new URLSearchParams()
  if (f.marca) params.set('marca', f.marca)
  if (f.precio) params.set('precio_max', f.precio)
  if (f.año) params.set('año_desde', f.año)
  if (f.km) params.set('km_max', f.km)
  if (f.ubicacion) params.set('ubicacion', f.ubicacion)
  if (f.tipo) params.set('tipo', f.tipo)
  const qs = params.toString()
  return `/vehiculos${qs ? '?' + qs : ''}`
}

const SELECT =
  'w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#282F8F] transition-colors appearance-none cursor-pointer'

interface FilterGroupProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
}

function FilterGroup({ label, id, value, onChange, children }: FilterGroupProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={onChange} className={SELECT}>
          {children}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  )
}

export default function SidebarFiltros() {
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [marcas, setMarcas] = useState<string[]>([])
  const [localidades, setLocalidades] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('vehiculos')
      .select('marca, ubicacion')
      .eq('activo', true)
      .eq('vendido', false)
      .then(({ data }) => {
        if (!data) return
        setMarcas(Array.from(new Set(data.map(v => v.marca).filter(Boolean))).sort())
        setLocalidades(Array.from(new Set(data.map(v => v.ubicacion).filter(Boolean))).sort())
      })
  }, [])

  const set = (key: keyof Filters) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setFilters(f => ({ ...f, [key]: e.target.value }))

  const setValue = (key: keyof Filters) => (value: string) =>
    setFilters(f => ({ ...f, [key]: value }))

  const hasFilters = Object.values(filters).some(Boolean)

  function handleApply() {
    router.push(buildHref(filters))
  }

  function handleClear() {
    setFilters(EMPTY)
    router.push('/vehiculos')
  }

  // sticky top-20 es responsabilidad del wrapper en page.tsx y ListadoVehiculos.tsx.
  // Este componente renderiza solo el panel de contenido sin posicionamiento propio,
  // para que pueda coexistir en el mismo contenedor sticky junto al BannerPublicitario.
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-5rem)] bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#282F8F]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <h2 className="text-sm font-extrabold text-[#0D0F14] uppercase tracking-wider">Filtros</h2>
          </div>
          {hasFilters && (
            <button
              onClick={handleClear}
              className="text-xs text-[#282F8F] hover:text-[#FFC107] transition-colors font-semibold"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filter fields */}
        <div className="flex flex-col gap-4">
          <FilterGroup label="Tipo de vehículo" id="sf-tipo" value={filters.tipo} onChange={set('tipo')}>
            <option value="">Todos los tipos</option>
            {TIPOS_VEHICULO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </FilterGroup>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Marca</label>
            <ComboboxSelect
              theme="light"
              value={filters.marca}
              onChange={setValue('marca')}
              placeholder="Todas las marcas"
              searchPlaceholder="Buscar marca..."
              options={marcas.map(m => ({ value: m, label: m }))}
            />
          </div>

          <FilterGroup label="Precio máximo" id="sf-precio" value={filters.precio} onChange={set('precio')}>
            {PRECIOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </FilterGroup>

          <FilterGroup label="Año desde" id="sf-año" value={filters.año} onChange={set('año')}>
            <option value="">Cualquier año</option>
            {AÑOS.map(y => <option key={y} value={y}>{y}</option>)}
          </FilterGroup>

          <FilterGroup label="Kilómetros máx." id="sf-km" value={filters.km} onChange={set('km')}>
            {KMS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
          </FilterGroup>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Localidad</label>
            <ComboboxSelect
              theme="light"
              value={filters.ubicacion}
              onChange={setValue('ubicacion')}
              placeholder="Todas"
              searchPlaceholder="Buscar localidad..."
              options={localidades.map(u => ({ value: u, label: u }))}
            />
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          className="mt-5 w-full bg-[#282F8F] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1f2570] active:scale-[0.98] transition-all"
        >
          Buscar autos
        </button>
    </div>
  )
}
