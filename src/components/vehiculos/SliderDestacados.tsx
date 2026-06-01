'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Vehiculo } from '@/types'

interface SliderDestacadosProps {
  vehiculos: Vehiculo[]
}

function formatPrecio(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}

function formatKm(km: number): string {
  return new Intl.NumberFormat('es-AR').format(km) + ' km'
}

export default function SliderDestacados({ vehiculos }: SliderDestacadosProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = vehiculos.length

  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total])
  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, total, next])

  if (total === 0) return null

  return (
    <section
      className="bg-[#0D0F14] relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Encabezado */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 pt-10 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
            ⭐ Autos Destacados
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Seleccionados por el equipo AUTODUX
          </p>
        </div>
        <Link
          href="/vehiculos"
          className="text-sm font-semibold text-[#FFC107] hover:text-yellow-300 transition-colors shrink-0"
        >
          Ver todos →
        </Link>
      </div>

      {/* Slider track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {vehiculos.map(v => (
            <SlideItem key={v.id} vehiculo={v} />
          ))}
        </div>
      </div>

      {/* Flechas — visibles solo si hay más de 1 slide */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Slide anterior"
            className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/40 hover:bg-[#FFC107] text-white hover:text-[#0D0F14] flex items-center justify-center transition-all duration-200 border border-white/15 hover:border-[#FFC107] backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 lg:w-5 lg:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Slide siguiente"
            className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/40 hover:bg-[#FFC107] text-white hover:text-[#0D0F14] flex items-center justify-center transition-all duration-200 border border-white/15 hover:border-[#FFC107] backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 lg:w-5 lg:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicadores */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 py-6">
          {vehiculos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al auto ${i + 1}`}
              className={`transition-all duration-300 rounded-full h-2 ${
                i === current
                  ? 'w-7 bg-[#FFC107]'
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function SlideItem({ vehiculo }: { vehiculo: Vehiculo }) {
  const vendedor = vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()

  return (
    <div className="min-w-full flex flex-col lg:flex-row min-h-[320px] lg:min-h-[500px]">

      {/* Imagen — 60% en desktop, full-width en mobile */}
      <div className="relative w-full lg:w-[60%] aspect-[16/9] lg:aspect-auto overflow-hidden bg-gray-900">
        {vehiculo.imagenes[0] ? (
          <img
            src={vehiculo.imagenes[0]}
            alt={vehiculo.titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
        )}
        {/* Gradiente de blend hacia la info panel en desktop */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-[#0D0F14]" />
      </div>

      {/* Info — 40% en desktop */}
      <div className="flex flex-col justify-center w-full lg:w-[40%] px-6 py-8 lg:px-10 lg:py-12 gap-5">

        {/* Badge DESTACADO */}
        <div className="flex items-center gap-1.5 w-fit bg-[#FFC107] text-[#0D0F14] font-extrabold text-xs px-3 py-1.5 rounded-full tracking-wide shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
          </svg>
          DESTACADO
        </div>

        {/* Título */}
        <h3 className="text-white font-bold text-xl lg:text-3xl leading-tight">
          {vehiculo.titulo}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
          <span>{vehiculo.año}</span>
          <span className="text-gray-600">·</span>
          <span>{formatKm(vehiculo.kilometraje)}</span>
          <span className="text-gray-600">·</span>
          <span>{vehiculo.ubicacion}</span>
          {vehiculo.transmision && (
            <>
              <span className="text-gray-600">·</span>
              <span className="capitalize">{vehiculo.transmision}</span>
            </>
          )}
          {vehiculo.combustible && (
            <>
              <span className="text-gray-600">·</span>
              <span className="capitalize">{vehiculo.combustible}</span>
            </>
          )}
        </div>

        {/* Descripción */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 hidden sm:block">
          {vehiculo.descripcion}
        </p>

        {/* Precio */}
        <p className="text-3xl lg:text-4xl font-black text-[#FFC107] tracking-tight leading-none">
          {formatPrecio(vehiculo.precio)}
        </p>

        {/* CTA + vendedor */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link
            href={`/vehiculos/${vehiculo.id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#FFC107] text-[#0D0F14] font-extrabold text-sm px-7 py-3.5 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg hover:shadow-[0_4px_20px_rgba(255,193,7,0.4)] whitespace-nowrap"
          >
            Ver vehículo →
          </Link>
          {vendedor && (
            <span className="text-xs text-gray-500 truncate">{vendedor}</span>
          )}
        </div>

      </div>
    </div>
  )
}
