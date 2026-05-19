'use client'

import { useState } from 'react'

interface GaleriaImagenesProps {
  imagenes: string[]
  titulo: string
}

export default function GaleriaImagenes({ imagenes, titulo }: GaleriaImagenesProps) {
  const [indiceActivo, setIndiceActivo] = useState(0)

  if (imagenes.length === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl bg-white/5 flex items-center justify-center text-gray-600">
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
        <img
          src={imagenes[indiceActivo]}
          alt={titulo}
          className="w-full h-full object-cover"
        />
        {imagenes.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
            {indiceActivo + 1} / {imagenes.length}
          </div>
        )}
      </div>

      {/* Miniaturas — solo cuando hay más de 1 imagen */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndiceActivo(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === indiceActivo
                  ? 'border-[#FFC107] opacity-100'
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
              }`}
            >
              <img
                src={img}
                alt={`${titulo} — foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
