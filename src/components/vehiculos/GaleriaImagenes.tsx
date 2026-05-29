'use client'

import { useState, useEffect, useCallback } from 'react'

interface GaleriaImagenesProps {
  imagenes: string[]
  titulo: string
}

export default function GaleriaImagenes({ imagenes, titulo }: GaleriaImagenesProps) {
  const [indiceActivo, setIndiceActivo] = useState(0)
  const [lightboxAbierto, setLightboxAbierto] = useState(false)

  const total = imagenes.length

  const irAnterior = useCallback(() => {
    setIndiceActivo(i => (i - 1 + total) % total)
  }, [total])

  const irSiguiente = useCallback(() => {
    setIndiceActivo(i => (i + 1) % total)
  }, [total])

  const abrirLightbox = () => {
    if (total > 0) setLightboxAbierto(true)
  }

  const cerrarLightbox = () => setLightboxAbierto(false)

  // Teclado: flechas y Escape
  useEffect(() => {
    if (!lightboxAbierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarLightbox()
      if (e.key === 'ArrowLeft') irAnterior()
      if (e.key === 'ArrowRight') irSiguiente()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxAbierto, irAnterior, irSiguiente])

  // Bloquear scroll del body cuando el lightbox está abierto
  useEffect(() => {
    document.body.style.overflow = lightboxAbierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxAbierto])

  if (total === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl bg-white/5 flex items-center justify-center text-gray-600">
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.75 0 11-.75 0 .375.75 0 01.75 0z" />
        </svg>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">

        {/* Imagen principal */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black group">
          <img
            src={imagenes[indiceActivo]}
            alt={`${titulo} — foto ${indiceActivo + 1}`}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
            onClick={abrirLightbox}
          />

          {/* Overlay hint "ver foto" */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-zoom-in"
            onClick={abrirLightbox}
            aria-hidden="true"
          >
            <div className="bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              Ver en grande
            </div>
          </div>

          {/* Flechas navegación */}
          {total > 1 && (
            <>
              <button
                onClick={irAnterior}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all duration-150 backdrop-blur-sm opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={irSiguiente}
                aria-label="Foto siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all duration-150 backdrop-blur-sm opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Contador */}
          {total > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {indiceActivo + 1} / {total}
            </div>
          )}
        </div>

        {/* Miniaturas */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
            {imagenes.map((img, i) => (
              <button
                key={i}
                onClick={() => setIndiceActivo(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-pressed={i === indiceActivo}
                className={`shrink-0 snap-start w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === indiceActivo
                    ? 'border-[#FFC107] opacity-100 scale-[1.03]'
                    : 'border-white/10 opacity-55 hover:opacity-100 hover:border-white/30'
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

      {/* Lightbox */}
      {lightboxAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${titulo} — foto ${indiceActivo + 1} de ${total}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={cerrarLightbox}
        >
          {/* Imagen */}
          <div
            className="relative w-full max-w-5xl max-h-[90vh] px-4"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={imagenes[indiceActivo]}
              alt={`${titulo} — foto ${indiceActivo + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />

            {/* Contador lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              {indiceActivo + 1} / {total}
            </div>
          </div>

          {/* Flechas lightbox */}
          {total > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); irAnterior() }}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-150"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); irSiguiente() }}
                aria-label="Foto siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-150"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Botón cerrar */}
          <button
            onClick={cerrarLightbox}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Miniaturas lightbox */}
          {total > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2 pb-1">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setIndiceActivo(i) }}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === indiceActivo}
                  className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                    i === indiceActivo
                      ? 'border-[#FFC107] opacity-100'
                      : 'border-white/20 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
