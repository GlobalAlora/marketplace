'use client'

import { useState, useTransition } from 'react'
import { toggleActivoVehiculo, toggleDestacado, deleteVehiculoAdmin } from './actions'

interface VehiculoAdmin {
  id: string
  titulo: string
  marca: string
  modelo: string
  año: number
  precio: number
  activo: boolean
  destacado: boolean
  vendido: boolean
  vistas: number
  imagenes: string[]
  created_at: string
  seller_nombre: string
  seller_apellido: string
  seller_role: string
}

const ROLE_LABEL: Record<string, string> = {
  particular: 'Particular',
  agencia_basica: 'Ag. Básica',
  agencia_premium: 'Ag. Premium',
}

const FILTER_ESTADO = ['todos', 'activo', 'pausado', 'vendido']
const FILTER_DESTACADO = ['todos', 'destacado', 'no_destacado']
const FILTER_ROL = ['todos', 'particular', 'agencia_basica', 'agencia_premium']

function getEstado(v: VehiculoAdmin) {
  if (v.vendido) return 'vendido'
  if (!v.activo) return 'pausado'
  return 'activo'
}

const ESTADO_STYLE: Record<string, string> = {
  activo:  'text-emerald-400 bg-emerald-400/10',
  pausado: 'text-[#FFC107] bg-[#FFC107]/10',
  vendido: 'text-gray-500 bg-white/5',
}

export default function VehiculosAdminClient({ vehiculos }: { vehiculos: VehiculoAdmin[] }) {
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterDestacado, setFilterDestacado] = useState('todos')
  const [filterRol, setFilterRol] = useState('todos')
  const [search, setSearch] = useState('')

  const filtered = vehiculos.filter(v => {
    const estado = getEstado(v)
    if (filterEstado !== 'todos' && estado !== filterEstado) return false
    if (filterDestacado === 'destacado' && !v.destacado) return false
    if (filterDestacado === 'no_destacado' && v.destacado) return false
    if (filterRol !== 'todos' && v.seller_role !== filterRol) return false
    if (search && !`${v.marca} ${v.modelo} ${v.año}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function act(id: string, fn: () => Promise<void>) {
    setLoadingId(id)
    startTransition(async () => { await fn(); setLoadingId(null) })
  }

  const SELECT = 'bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FFC107] transition-colors'

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar marca, modelo…"
          className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-[#FFC107] transition-colors w-48"
        />
        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className={SELECT}>
          {FILTER_ESTADO.map(v => <option key={v} value={v}>{v === 'todos' ? 'Estado: todos' : v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
        </select>
        <select value={filterDestacado} onChange={e => setFilterDestacado(e.target.value)} className={SELECT}>
          <option value="todos">Destacado: todos</option>
          <option value="destacado">Vitrina ★</option>
          <option value="no_destacado">Sin vitrina</option>
        </select>
        <select value={filterRol} onChange={e => setFilterRol(e.target.value)} className={SELECT}>
          {FILTER_ROL.map(v => <option key={v} value={v}>{v === 'todos' ? 'Vendedor: todos' : ROLE_LABEL[v]}</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-600 self-center">{filtered.length} resultados</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">No hay vehículos que coincidan con los filtros</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(v => {
            const estado = getEstado(v)
            const isLoading = loadingId === v.id && pending
            const thumb = v.imagenes?.[0]

            return (
              <div key={v.id} className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-4 flex gap-4 items-center">
                {/* Thumb */}
                <div className="w-16 h-12 rounded-xl bg-white/5 shrink-0 overflow-hidden">
                  {thumb
                    ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-700 text-lg">◫</div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold text-white truncate">{v.marca} {v.modelo} {v.año}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ESTADO_STYLE[estado]}`}>{estado}</span>
                    {v.destacado && <span className="text-[10px] font-bold text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-full">★ Vitrina</span>}
                  </div>
                  <p className="text-xs text-gray-500">
                    ${v.precio.toLocaleString('es-AR')} · {v.vistas} vistas · {v.seller_nombre} {v.seller_apellido}
                    <span className="ml-1 text-gray-700">({ROLE_LABEL[v.seller_role] ?? v.seller_role})</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Toggle activo */}
                  {!v.vendido && (
                    <button
                      onClick={() => act(v.id, () => toggleActivoVehiculo(v.id, !v.activo))}
                      disabled={isLoading}
                      title={v.activo ? 'Pausar' : 'Activar'}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-40"
                    >
                      {v.activo
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" /></svg>
                      }
                    </button>
                  )}

                  {/* Toggle destacado */}
                  <button
                    onClick={() => act(v.id, () => toggleDestacado(v.id, !v.destacado))}
                    disabled={isLoading}
                    title={v.destacado ? 'Quitar de Vitrina' : 'Poner en Vitrina'}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${v.destacado ? 'text-[#FFC107] hover:bg-[#FFC107]/10' : 'text-gray-400 hover:text-[#FFC107] hover:bg-[#FFC107]/10'}`}
                  >
                    <svg className="w-4 h-4" fill={v.destacado ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  {confirmDelete === v.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => { act(v.id, () => deleteVehiculoAdmin(v.id)); setConfirmDelete(null) }} disabled={isLoading} className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors">
                        Confirmar
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="text-[11px] text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
