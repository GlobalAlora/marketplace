'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toggleActivo, marcarVendido, deleteVehiculo } from './actions'

interface Vehiculo {
  id: string
  titulo: string
  marca: string
  modelo: string
  año: number
  precio: number
  imagenes: string[]
  activo: boolean
  vendido: boolean
  created_at: string
  vistas: number
}

const ESTADO_CONFIG = {
  activo:  { label: 'Activo',   dot: 'bg-emerald-400', text: 'text-emerald-400' },
  pausado: { label: 'Pausado',  dot: 'bg-[#FFC107]',   text: 'text-[#FFC107]' },
  vendido: { label: 'Vendido',  dot: 'bg-gray-500',    text: 'text-gray-500' },
}

function getEstado(v: Vehiculo) {
  if (v.vendido) return 'vendido'
  if (!v.activo) return 'pausado'
  return 'activo'
}

export default function MisPublicacionesClient({ vehiculos }: { vehiculos: Vehiculo[] }) {
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function handleToggle(id: string, activo: boolean) {
    setLoadingId(id)
    startTransition(async () => {
      await toggleActivo(id, !activo)
      setLoadingId(null)
    })
  }

  function handleVendido(id: string) {
    setLoadingId(id)
    startTransition(async () => {
      await marcarVendido(id)
      setLoadingId(null)
    })
  }

  function handleDelete(id: string) {
    setLoadingId(id)
    setConfirmDelete(null)
    startTransition(async () => {
      await deleteVehiculo(id)
      setLoadingId(null)
    })
  }

  return (
    <div className="space-y-3">
      {vehiculos.map(v => {
        const estado = getEstado(v)
        const cfg = ESTADO_CONFIG[estado]
        const isLoading = loadingId === v.id && pending
        const thumb = v.imagenes?.[0]

        return (
          <div
            key={v.id}
            className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-4 flex gap-4 items-center"
          >
            {/* Thumbnail */}
            <div className="w-20 h-14 rounded-xl bg-white/5 shrink-0 overflow-hidden">
              {thumb ? (
                <img src={thumb} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-white truncate">{v.marca} {v.modelo} {v.año}</p>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${cfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                ${v.precio.toLocaleString('es-AR')} · {v.vistas} vistas
              </p>
            </div>

            {/* Actions */}
            {!v.vendido && (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/panel/editar/${v.id}`}
                  title="Editar"
                  className="p-2 rounded-lg text-gray-400 hover:text-[#FFC107] hover:bg-[#FFC107]/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleToggle(v.id, v.activo)}
                  disabled={isLoading}
                  title={v.activo ? 'Pausar' : 'Activar'}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-40"
                >
                  {v.activo ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => handleVendido(v.id)}
                  disabled={isLoading}
                  title="Marcar como vendido"
                  className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors disabled:opacity-40"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {confirmDelete === v.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(v.id)}
                      disabled={isLoading}
                      className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-[11px] text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(v.id)}
                    disabled={isLoading}
                    title="Eliminar"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
