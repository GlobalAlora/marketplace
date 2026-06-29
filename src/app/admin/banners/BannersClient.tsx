'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createBanner, updateBanner, deleteBanner, toggleActivoBanner } from './actions'
import CustomSelect from '@/components/ui/CustomSelect'

interface Banner {
  id: string
  imagen_url: string
  link_url: string
  posicion: string
  activo: boolean
  created_at: string
}

const POSICIONES = [
  { value: 'home_top',    label: 'Inicio — Arriba' },
  { value: 'home_bottom', label: 'Inicio — Abajo' },
  { value: 'sidebar',     label: 'Sidebar' },
]

const ESTADOS = [
  { value: 'true',  label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
]

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-[#FFC107] transition-colors'

async function uploadImagen(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabase.storage.from('banners').upload(path, file, { upsert: true })
  if (uploadError) throw new Error(uploadError.message)
  const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(path)
  return publicUrl
}

function BannerForm({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial?: Banner
  onSubmit: (fd: FormData) => void
  onCancel?: () => void
  pending: boolean
}) {
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initial?.imagen_url ?? null)
  const [posicion, setPosicion] = useState(initial?.posicion ?? 'home_top')
  const [activo, setActivo] = useState(initial ? String(initial.activo) : 'true')
  const [linkUrl, setLinkUrl] = useState(initial?.link_url ?? '')
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagenFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!imagenFile && !initial?.imagen_url) {
      setError('Subí una imagen para el banner')
      return
    }

    setUploading(true)
    try {
      const imagenUrl = imagenFile ? await uploadImagen(imagenFile) : initial!.imagen_url
      const fd = new FormData()
      fd.set('imagen_url', imagenUrl)
      fd.set('link_url', linkUrl)
      fd.set('posicion', posicion)
      fd.set('activo', activo)
      setUploading(false)
      onSubmit(fd)
    } catch (err) {
      setUploading(false)
      setError(err instanceof Error ? err.message : 'Error al subir la imagen')
    }
  }

  const isPending = pending || uploading

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">{error}</p>
      )}

      <div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 hover:border-[#FFC107]/40 transition-colors"
        >
          {preview ? (
            <img src={preview} alt="" className="w-16 h-9 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-16 h-9 rounded-lg bg-white/5 shrink-0" />
          )}
          <span className="text-sm text-gray-400">{imagenFile ? imagenFile.name : preview ? 'Cambiar imagen' : 'Subir imagen…'}</span>
        </button>
      </div>

      <input
        value={linkUrl}
        onChange={e => setLinkUrl(e.target.value)}
        placeholder="Link destino (opcional)"
        className={INPUT}
      />

      <div className="grid grid-cols-2 gap-3">
        <CustomSelect options={POSICIONES} value={posicion} onChange={setPosicion} />
        <CustomSelect options={ESTADOS} value={activo} onChange={setActivo} />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 text-[#0D0F14] text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors">
          {uploading ? 'Subiendo…' : isPending ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear banner'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs text-gray-500 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default function BannersClient({ banners: initial }: { banners: Banner[] }) {
  const [pending, startTransition] = useTransition()
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  function act(id: string | null, fn: () => Promise<{ error?: string } | void>) {
    setActionError(null)
    setLoadingId(id)
    startTransition(async () => {
      const result = await fn()
      if (result?.error) setActionError(result.error)
      setLoadingId(null)
    })
  }

  function handleCreate(fd: FormData) {
    act(null, async () => {
      const result = await createBanner(fd)
      if (!result.error) setShowCreate(false)
      return result
    })
  }

  function handleUpdate(id: string, fd: FormData) {
    act(id, async () => {
      const result = await updateBanner(id, fd)
      if (!result.error) setEditingId(null)
      return result
    })
  }

  function handleDelete(id: string) {
    act(id, async () => {
      const result = await deleteBanner(id)
      if (!result.error) setConfirmDelete(null)
      return result
    })
  }

  const POSICION_LABEL = Object.fromEntries(POSICIONES.map(p => [p.value, p.label]))

  return (
    <div>
      {actionError && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          {actionError}
        </div>
      )}

      {/* Crear */}
      <div className="mb-6">
        {showCreate ? (
          <div className="bg-[#1a1a2e] border border-[#282F8F]/40 rounded-2xl p-4 sm:p-5">
            <p className="text-sm font-bold text-white mb-4">Nuevo banner</p>
            <BannerForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} pending={pending && !loadingId} />
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#FFC107] hover:bg-[#e6ad00] text-[#0D0F14] text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo banner
          </button>
        )}
      </div>

      {/* Lista */}
      {initial.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">No hay banners aún</div>
      ) : (
        <div className="space-y-4 sm:space-y-3">
          {initial.map(b => {
            const isLoading = loadingId === b.id && pending

            return (
              <div key={b.id} className="bg-[#1a1a2e] border border-white/8 rounded-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center p-4">
                  <div className="flex gap-3 items-center">
                    {/* Preview */}
                    <div className="w-20 h-12 sm:w-24 sm:h-14 rounded-xl bg-white/5 shrink-0 overflow-hidden">
                      <img src={b.imagen_url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2' }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                          {POSICION_LABEL[b.posicion] ?? b.posicion}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.activo ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-500 bg-white/5'}`}>
                          {b.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-none">{b.link_url || 'Sin link'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto sm:ml-auto">
                    {/* Toggle activo */}
                    <button
                      onClick={() => act(b.id, () => toggleActivoBanner(b.id, !b.activo))}
                      disabled={isLoading}
                      title={b.activo ? 'Desactivar' : 'Activar'}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${b.activo ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                      </svg>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditingId(editingId === b.id ? null : b.id)}
                      disabled={isLoading}
                      title="Editar"
                      className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${editingId === b.id ? 'text-[#FFC107] bg-[#FFC107]/10' : 'text-gray-400 hover:text-white hover:bg-white/8'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>

                    {/* Delete */}
                    {confirmDelete === b.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(b.id)} disabled={isLoading} className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors">
                          Confirmar
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="text-[11px] text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(b.id)} disabled={isLoading} title="Eliminar" className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-40">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit form inline */}
                {editingId === b.id && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/5">
                    <BannerForm
                      initial={b}
                      onSubmit={fd => handleUpdate(b.id, fd)}
                      onCancel={() => setEditingId(null)}
                      pending={isLoading}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
