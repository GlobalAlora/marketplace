'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toggleActivo, marcarVendido, reactivarVehiculo, deleteVehiculo, toggleDestacado } from './actions'

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
  pausado_por_admin: boolean
  destacado: boolean
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

export default function MisPublicacionesClient({ vehiculos, limiteDestacados, whatsappUrl }: { vehiculos: Vehiculo[]; limiteDestacados: number; whatsappUrl: string }) {
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [tab, setTab] = useState<'todos' | 'activos' | 'pausados' | 'vendidos'>('todos')

  const destacadosActivos = vehiculos.filter(v => v.destacado && v.activo && !v.vendido).length

  const counts = {
    todos:    vehiculos.length,
    activos:  vehiculos.filter(v => v.activo && !v.vendido && !v.pausado_por_admin).length,
    pausados: vehiculos.filter(v => !v.vendido && (!v.activo || v.pausado_por_admin)).length,
    vendidos: vehiculos.filter(v => v.vendido).length,
  }

  const porTab = vehiculos.filter(v => {
    if (tab === 'activos')  return v.activo && !v.vendido && !v.pausado_por_admin
    if (tab === 'pausados') return !v.vendido && (!v.activo || v.pausado_por_admin)
    if (tab === 'vendidos') return v.vendido
    return true
  })

  const vehiculosFiltrados = busqueda.trim()
    ? porTab.filter(v =>
        `${v.titulo} ${v.marca} ${v.modelo}`.toLowerCase().includes(busqueda.trim().toLowerCase())
      )
    : porTab

  function handleDestacar(id: string, destacado: boolean) {
    setLoadingId(id)
    setActionError(null)
    startTransition(async () => {
      try {
        await toggleDestacado(id, !destacado)
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Error al destacar')
      } finally {
        setLoadingId(null)
      }
    })
  }

  function handleToggle(id: string, activo: boolean) {
    setLoadingId(id)
    setActionError(null)
    startTransition(async () => {
      try {
        await toggleActivo(id, !activo)
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Error al actualizar')
      } finally {
        setLoadingId(null)
      }
    })
  }

  function handleVendido(id: string) {
    setLoadingId(id)
    setActionError(null)
    startTransition(async () => {
      try {
        await marcarVendido(id)
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Error al marcar como vendido')
      } finally {
        setLoadingId(null)
      }
    })
  }

  function handleReactivar(id: string) {
    setLoadingId(id)
    setActionError(null)
    startTransition(async () => {
      try {
        await reactivarVehiculo(id)
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Error al reactivar')
      } finally {
        setLoadingId(null)
      }
    })
  }

  function handleDelete(id: string) {
    setLoadingId(id)
    setConfirmDelete(null)
    setActionError(null)
    startTransition(async () => {
      try {
        await deleteVehiculo(id)
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Error al eliminar')
      } finally {
        setLoadingId(null)
      }
    })
  }

  const TABS = [
    { key: 'todos',    label: 'Todos' },
    { key: 'activos',  label: 'Activos' },
    { key: 'pausados', label: 'Pausados' },
    { key: 'vendidos', label: 'Vendidos' },
  ] as const

  return (
    <div className="space-y-3">
      {actionError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-sm text-red-400">{actionError}</p>
        </div>
      )}

      {/* Pestañas */}
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setBusqueda('') }}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
              tab === t.key
                ? 'bg-[#FFC107] text-[#0D0F14]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === t.key ? 'bg-[#0D0F14]/20 text-[#0D0F14]' : 'bg-white/10 text-gray-500'
            }`}>
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por título, marca o modelo..."
          className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors"
        />
      </div>
      {limiteDestacados > 0 && (
        <p className="text-xs text-gray-500 px-1">
          Destacados: <span className="text-white font-semibold">{destacadosActivos}/{limiteDestacados}</span> de tu plan
        </p>
      )}
      {vehiculosFiltrados.length === 0 && (
        <p className="text-sm text-gray-600 text-center py-8">
          {busqueda ? `Sin resultados para "${busqueda}"` : `Sin publicaciones ${tab !== 'todos' ? `en "${TABS.find(t => t.key === tab)?.label}"` : ''}`}
        </p>
      )}
      {vehiculosFiltrados.map(v => {
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
            <Link href={`/vehiculos/${v.id}`} className="w-20 h-14 rounded-xl bg-white/5 shrink-0 overflow-hidden block">
              {thumb ? (
                <img src={thumb} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
            </Link>

            {/* Info */}
            <Link href={`/vehiculos/${v.id}`} className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-white truncate hover:text-[#FFC107] transition-colors">{v.marca} {v.modelo} {v.año}</p>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${cfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
                {v.destacado && <span className="text-[10px] font-bold text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-full shrink-0">★ Destacado</span>}
              </div>
              <p className="text-xs text-gray-500">
                ${v.precio.toLocaleString('es-AR')} · {v.vistas} vistas
              </p>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {v.vendido ? (
                /* Vendido: reactivar o eliminar */
                <>
                  <button
                    onClick={() => handleReactivar(v.id)}
                    disabled={isLoading}
                    title="Volver a publicar"
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                  {confirmDelete === v.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(v.id)} disabled={isLoading} className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors">Confirmar</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-[11px] text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(v.id)} disabled={isLoading} title="Eliminar" className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-40">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                /* No vendido: editar, pausar/activar, marcar vendido, eliminar */
                <>
                  <Link href={`/panel/editar/${v.id}`} title="Editar" className="p-2 rounded-lg text-gray-400 hover:text-[#FFC107] hover:bg-[#FFC107]/5 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </Link>
                  {!v.activo && v.pausado_por_admin ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Este vehículo fue pausado por AUTODUX — hacé click para contactarnos"
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400 bg-red-500/10 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75M6.75 10.5h10.5a2.25 2.25 0 0 1 2.25 2.25v6.75a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-6.75a2.25 2.25 0 0 1 2.25-2.25z" />
                      </svg>
                      Pausado por AUTODUX — contactanos
                    </a>
                  ) : (
                    <button onClick={() => handleToggle(v.id, v.activo)} disabled={isLoading} title={v.activo ? 'Pausar' : 'Activar'} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-40">
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
                  )}
                  <button onClick={() => handleVendido(v.id)} disabled={isLoading} title="Marcar como vendido" className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors disabled:opacity-40">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {v.activo && (
                    <button
                      onClick={() => handleDestacar(v.id, v.destacado)}
                      disabled={isLoading || (!v.destacado && destacadosActivos >= limiteDestacados)}
                      title={
                        v.destacado
                          ? 'Quitar de destacados'
                          : limiteDestacados === 0
                            ? 'Tu plan no incluye destacados'
                            : destacadosActivos >= limiteDestacados
                              ? `Alcanzaste el límite de ${limiteDestacados} destacado${limiteDestacados !== 1 ? 's' : ''} de tu plan`
                              : 'Destacar publicación'
                      }
                      className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${v.destacado ? 'text-[#FFC107] hover:bg-[#FFC107]/10' : 'text-gray-400 hover:text-[#FFC107] hover:bg-[#FFC107]/10'}`}
                    >
                      <svg className="w-4 h-4" fill={v.destacado ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                  )}
                  {confirmDelete === v.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(v.id)} disabled={isLoading} className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors">Confirmar</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-[11px] text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(v.id)} disabled={isLoading} title="Eliminar" className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-40">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
