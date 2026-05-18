'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MARCAS } from '@/lib/utils/mock-data'

const UBICACIONES = ['Comodoro Rivadavia', 'Rada Tilly', 'Caleta Olivia', 'Sarmiento']

const PRECIOS = [
  { label: 'Hasta $15.000.000', value: '15000000' },
  { label: 'Hasta $20.000.000', value: '20000000' },
  { label: 'Hasta $25.000.000', value: '25000000' },
  { label: 'Hasta $30.000.000', value: '30000000' },
  { label: 'Hasta $40.000.000', value: '40000000' },
]

const AÑOS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017]

const BUSQUEDAS_POPULARES = ['Volkswagen', 'Toyota', 'Ford', 'Chevrolet', 'Renault']

const SELECT_CLASS =
  'bg-[#1a1d2e] border border-white/20 text-white text-sm rounded-lg px-3 py-2.5 w-full focus:outline-none focus:border-[#FFC107]'

type Filters = {
  marca: string
  precio: string
  año: string
  ubicacion: string
}

function buildSearchHref(f: Filters): string {
  const params = new URLSearchParams()
  if (f.marca) params.set('marca', f.marca)
  if (f.precio) params.set('precio_max', f.precio)
  if (f.año) params.set('año_desde', f.año)
  if (f.ubicacion) params.set('ubicacion', f.ubicacion)
  const qs = params.toString()
  return `/vehiculos${qs ? '?' + qs : ''}`
}

export default function Hero() {
  const [filters, setFilters] = useState<Filters>({
    marca: '',
    precio: '',
    año: '',
    ubicacion: '',
  })

  const set = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters(f => ({ ...f, [key]: e.target.value }))

  return (
    <section className="bg-[#0D0F14] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Comprá y vendé<br />
            <span className="text-[#FFC107]">vehículos en Comodoro</span>
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-lg">
            El marketplace de autos, camionetas y utilitarios de la región patagónica.
          </p>

          {/* Panel de filtros */}
          <div className="mt-8 bg-white/[0.06] rounded-2xl p-4 border border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="filtro-marca" className="text-xs text-gray-400 font-medium">Marca</label>
                <select id="filtro-marca" value={filters.marca} onChange={set('marca')} className={SELECT_CLASS}>
                  <option value="">Todas las marcas</option>
                  {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="filtro-precio" className="text-xs text-gray-400 font-medium">Precio hasta</label>
                <select id="filtro-precio" value={filters.precio} onChange={set('precio')} className={SELECT_CLASS}>
                  <option value="">Cualquier precio</option>
                  {PRECIOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="filtro-año" className="text-xs text-gray-400 font-medium">Año desde</label>
                <select id="filtro-año" value={filters.año} onChange={set('año')} className={SELECT_CLASS}>
                  <option value="">Cualquier año</option>
                  {AÑOS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="filtro-ubicacion" className="text-xs text-gray-400 font-medium">Ubicación</label>
                <select id="filtro-ubicacion" value={filters.ubicacion} onChange={set('ubicacion')} className={SELECT_CLASS}>
                  <option value="">Toda la región</option>
                  {UBICACIONES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <Link
              href={buildSearchHref(filters)}
              className="mt-3 block w-full text-center bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all text-sm tracking-wide"
            >
              Buscar autos
            </Link>
          </div>

          {/* Búsquedas populares */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Populares:</span>
            {BUSQUEDAS_POPULARES.map(marca => (
              <Link
                key={marca}
                href={`/vehiculos?marca=${marca}`}
                className="text-xs px-3 py-1.5 rounded-full border border-white/20 text-gray-300 hover:border-[#FFC107] hover:text-[#FFC107] transition-colors"
              >
                {marca}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap gap-8 text-gray-400">
          <div>
            <p className="text-3xl font-extrabold text-white">+500</p>
            <p className="text-sm mt-1">Vehículos publicados</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">+200</p>
            <p className="text-sm mt-1">Vendedores activos</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">100%</p>
            <p className="text-sm mt-1">Patagónico</p>
          </div>
        </div>
      </div>
    </section>
  )
}
