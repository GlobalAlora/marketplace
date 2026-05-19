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

const AÑOS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2015, 2012, 2010, 2005, 2000]

const BUSQUEDAS_POPULARES = ['Volkswagen', 'Toyota', 'Ford', 'Chevrolet', 'Renault']

const SELECT_LIGHT =
  'bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 w-full focus:outline-none focus:border-[#FFC107]'

type Filters = { marca: string; precio: string; año: string; ubicacion: string }

function buildSearchHref(f: Filters): string {
  const params = new URLSearchParams()
  if (f.marca) params.set('marca', f.marca)
  if (f.precio) params.set('precio_max', f.precio)
  if (f.año) params.set('año_desde', f.año)
  if (f.ubicacion) params.set('ubicacion', f.ubicacion)
  const qs = params.toString()
  return `/vehiculos${qs ? '?' + qs : ''}`
}

interface HeroProps {
  panelLogin?: React.ReactNode
}

export default function Hero({ panelLogin }: HeroProps) {
  const [filters, setFilters] = useState<Filters>({
    marca: '', precio: '', año: '', ubicacion: '',
  })

  const set = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters(f => ({ ...f, [key]: e.target.value }))

  return (
    <section className="relative bg-[#0D0F14] text-white overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600)' }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0D0F14]/78" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">

          {/* ── Left column: headline + filtros ── */}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Conectamos lo que buscas,<br />
              <span className="text-[#FFC107]">con lo que se vende.</span>
            </h1>

            <div className="mt-4 flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 text-[#FFC107] shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.076 3.218-4.688 3.218-7.327 0-5.19-4.054-9-9-9s-9 3.81-9 9c0 2.639 1.274 5.251 3.218 7.327a19.579 19.579 0 002.682 2.282 16.944 16.944 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <p className="text-base text-gray-300 max-w-sm leading-relaxed">
                La plataforma líder para comprar y vender autos nuevos y 0 km en Comodoro Rivadavia y alrededores.
              </p>
            </div>

            {/* Panel de filtros — fondo blanco sobre hero oscuro */}
            <div className="mt-7 bg-white rounded-2xl p-4 shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="filtro-marca" className="text-xs text-gray-500 font-semibold">Marca</label>
                  <select id="filtro-marca" value={filters.marca} onChange={set('marca')} className={SELECT_LIGHT}>
                    <option value="">Todas las marcas</option>
                    {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="filtro-precio" className="text-xs text-gray-500 font-semibold">Precio hasta</label>
                  <select id="filtro-precio" value={filters.precio} onChange={set('precio')} className={SELECT_LIGHT}>
                    <option value="">Sin límite</option>
                    {PRECIOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="filtro-año" className="text-xs text-gray-500 font-semibold">Año desde</label>
                  <select id="filtro-año" value={filters.año} onChange={set('año')} className={SELECT_LIGHT}>
                    <option value="">1990</option>
                    {AÑOS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="filtro-ubicacion" className="text-xs text-gray-500 font-semibold">Ubicación</label>
                  <select id="filtro-ubicacion" value={filters.ubicacion} onChange={set('ubicacion')} className={SELECT_LIGHT}>
                    <option value="">Comodoro Rivadavia</option>
                    {UBICACIONES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <Link
                href={buildSearchHref(filters)}
                className="mt-3 flex items-center justify-center gap-2 w-full bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all text-sm tracking-wide"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Buscar autos
              </Link>
            </div>

            {/* Búsquedas populares */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Búsquedas populares:</span>
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

          {/* ── Right column: panel de login ── */}
          {panelLogin && (
            <div className="w-full lg:w-[360px] lg:shrink-0">
              {panelLogin}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
