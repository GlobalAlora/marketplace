'use client'

import { useState, useTransition, useRef } from 'react'
import Link from 'next/link'
import { toggleActivoVehiculo, toggleDestacado, deleteVehiculoAdmin, updatePrecioVehiculo, reorderImagenesVehiculo } from './actions'
import CustomSelect from '@/components/ui/CustomSelect'

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
  pausado_por_admin: boolean
}

const ROLE_LABEL: Record<string, string> = {
  particular: 'Particular',
  agencia_basica: 'Ag. PRIME',
  agencia_premium: 'Ag. DUX',
}

const FILTER_ESTADO_OPTS = [
  { value: 'todos', label: 'Estado: todos' },
  { value: 'activo', label: 'Activo' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'vendido', label: 'Vendido' },
]
const FILTER_DESTACADO_OPTS = [
  { value: 'todos', label: 'Destacado: todos' },
  { value: 'destacado', label: 'Vitrina ★' },
  { value: 'no_destacado', label: 'Sin vitrina' },
]
const FILTER_ROL_OPTS = [
  { value: 'todos', label: 'Vendedor: todos' },
  { value: 'particular', label: 'Particular' },
  { value: 'agencia_basica', label: 'Ag. PRIME' },
  { value: 'agencia_premium', label: 'Ag. DUX' },
]
const PAGE_SIZE = 20

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

function ImagenesReorderPanel({ vehiculoId, imagenes, onClose }: { vehiculoId: string; imagenes: string[]; onClose: () => void }) {
  const [items, setItems] = useState<string[]>(imagenes)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  function onDragStart(i: number) { dragIndex.current = i }
  function onDragOver(e: React.DragEvent, i: number) { e.preventDefault(); setDragOver(i) }
  function onDrop(i: number) {
    const from = dragIndex.current
    if (from === null || from === i) { setDragOver(null); return }
    setItems(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(i, 0, moved)
      return next
    })
    dragIndex.current = null
    setDragOver(null)
  }
  function onDragEnd() { dragIndex.current = null; setDragOver(null) }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await reorderImagenesVehiculo(vehiculoId, items)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-white/8">
      <p className="text-xs font-semibold text-gray-400 mb-2">Reordenar fotos <span className="text-gray-600 font-normal">(la primera es la portada)</span></p>
      <div className="flex flex-wrap gap-2 mb-3">
        {items.map((src, i) => (
          <div
            key={src}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => onDragOver(e, i)}
            onDrop={() => onDrop(i)}
            onDragEnd={onDragEnd}
            className={`relative w-20 h-14 rounded-lg overflow-hidden border transition-all cursor-grab active:cursor-grabbing select-none
              ${dragOver === i ? 'border-[#FFC107] scale-105 opacity-70' : 'border-white/10'}`}
          >
            <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" />
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 text-[8px] font-bold text-center bg-[#FFC107] text-[#0D0F14] py-0.5">
                PORTADA
              </span>
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
      <div className="flex items-center gap-2">
        <button onClick={handleSave} disabled={saving} className="text-xs font-bold text-[#0D0F14] bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
          {saving ? 'Guardando…' : 'Guardar orden'}
        </button>
        <button onClick={onClose} disabled={saving} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function VehiculosAdminClient({ vehiculos }: { vehiculos: VehiculoAdmin[] }) {
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterDestacado, setFilterDestacado] = useState('todos')
  const [filterRol, setFilterRol] = useState('todos')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editPrecioId, setEditPrecioId] = useState<string | null>(null)
  const [precioInput, setPrecioInput] = useState('')
  const [editImagesId, setEditImagesId] = useState<string | null>(null)

  const filtered = vehiculos.filter(v => {
    const estado = getEstado(v)
    if (filterEstado !== 'todos' && estado !== filterEstado) return false
    if (filterDestacado === 'destacado' && !v.destacado) return false
    if (filterDestacado === 'no_destacado' && v.destacado) return false
    if (filterRol !== 'todos' && v.seller_role !== filterRol) return false
    if (search && !`${v.marca} ${v.modelo} ${v.año} ${v.seller_nombre} ${v.seller_apellido}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetPage() { setPage(1) }

  function act(id: string, fn: () => Promise<void>) {
    setLoadingId(id)
    startTransition(async () => { await fn(); setLoadingId(null) })
  }

  function startEditPrecio(v: VehiculoAdmin) {
    setEditPrecioId(v.id)
    setPrecioInput(String(v.precio))
  }

  function savePrecio(id: string) {
    const precio = Number(precioInput.replace(/\D/g, ''))
    if (!precio || precio <= 0) { setEditPrecioId(null); return }
    act(id, () => updatePrecioVehiculo(id, precio))
    setEditPrecioId(null)
  }

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); resetPage() }}
          placeholder="Buscar marca, modelo, vendedor…"
          className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-[#FFC107] transition-colors w-56"
        />
        <div className="w-44">
          <CustomSelect
            options={FILTER_ESTADO_OPTS}
            value={filterEstado}
            onChange={v => { setFilterEstado(v); resetPage() }}
          />
        </div>
        <div className="w-44">
          <CustomSelect
            options={FILTER_DESTACADO_OPTS}
            value={filterDestacado}
            onChange={v => { setFilterDestacado(v); resetPage() }}
          />
        </div>
        <div className="w-44">
          <CustomSelect
            options={FILTER_ROL_OPTS}
            value={filterRol}
            onChange={v => { setFilterRol(v); resetPage() }}
          />
        </div>
        <span className="ml-auto text-xs text-gray-600 self-center">{filtered.length} resultados</span>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">No hay vehículos que coincidan con los filtros</div>
      ) : (
        <div className="space-y-2">
          {paginated.map(v => {
            const estado = getEstado(v)
            const isLoading = loadingId === v.id && pending
            const thumb = v.imagenes?.[0]
            const editingPrecio = editPrecioId === v.id

            return (
              <div key={v.id} className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex gap-3 sm:gap-4 items-start sm:items-center flex-1 min-w-0">
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ESTADO_STYLE[estado]}`}>{estado}</span>
                      {v.destacado && <span className="text-[10px] font-bold text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-full shrink-0">★ Vitrina</span>}
                      {v.pausado_por_admin && <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full shrink-0">Pausado por admin</span>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      {editingPrecio ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">$</span>
                          <input
                            type="text"
                            value={precioInput}
                            onChange={e => setPrecioInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') savePrecio(v.id); if (e.key === 'Escape') setEditPrecioId(null) }}
                            autoFocus
                            className="w-28 bg-white/10 border border-[#FFC107]/40 text-white text-xs rounded-lg px-2 py-0.5 focus:outline-none"
                          />
                          <button onClick={() => savePrecio(v.id)} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded transition-colors">OK</button>
                          <button onClick={() => setEditPrecioId(null)} className="text-[10px] text-gray-500 hover:text-gray-300 px-1 py-0.5 rounded transition-colors">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditPrecio(v)}
                          title="Editar precio"
                          className="text-gray-400 sm:text-gray-500 hover:text-white flex items-center gap-1 group transition-colors shrink-0"
                        >
                          ${v.precio.toLocaleString('es-AR')}
                          <svg className="w-3 h-3 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                      )}
                      <span className="text-gray-700 hidden sm:inline">·</span>
                      <span className="text-gray-500">{v.vistas} vistas</span>
                      <span className="text-gray-700">·</span>
                      <span className="text-gray-500 truncate">{v.seller_nombre} {v.seller_apellido}</span>
                      <span className="text-[10px] text-gray-700 shrink-0">({ROLE_LABEL[v.seller_role] ?? v.seller_role})</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-wrap justify-end sm:justify-start sm:shrink-0 -mx-1 sm:mx-0">
                  {/* Ver publicación */}
                  <Link
                    href={`/vehiculos/${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver publicación"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </Link>

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

                  {/* Editar fotos */}
                  {v.imagenes?.length > 1 && (
                    <button
                      onClick={() => setEditImagesId(editImagesId === v.id ? null : v.id)}
                      title="Reordenar fotos"
                      className={`p-2 rounded-lg transition-colors ${editImagesId === v.id ? 'text-[#FFC107] bg-[#FFC107]/10' : 'text-gray-400 hover:text-white hover:bg-white/8'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
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
              {editImagesId === v.id && (
                <ImagenesReorderPanel
                  vehiculoId={v.id}
                  imagenes={v.imagenes ?? []}
                  onClose={() => setEditImagesId(null)}
                />
              )}
              </div>
            )
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-600">
            Página {page} de {totalPages} · {filtered.length} resultados
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
