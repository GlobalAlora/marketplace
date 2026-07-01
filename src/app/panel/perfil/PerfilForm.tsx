'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateProfile, deleteAccount } from './actions'

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors'
const LABEL = 'block text-xs font-semibold text-gray-400 mb-1.5'

interface Profile {
  nombre: string
  apellido: string
  telefono: string
  role: string
  nombre_agencia?: string | null
  bio?: string | null
  logo_agencia?: string | null
  avatar_url?: string | null
}

export default function PerfilForm({ profile, userId }: { profile: Profile; userId: string }) {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.logo_agencia ?? null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const isAgencia = profile.role === 'agencia_basica' || profile.role === 'agencia_premium'

  async function handleDeleteAccount() {
    setDeleteError(null)
    setDeleting(true)
    const result = await deleteAccount()
    if (result?.error) {
      setDeleting(false)
      setDeleteError(result.error)
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const formEl = e.currentTarget
    const fd = new FormData(formEl)
    const nombre = (fd.get('nombre') as string ?? '').trim()
    const apellido = (fd.get('apellido') as string ?? '').trim()
    const telefono = (fd.get('telefono') as string ?? '').trim()
    if (nombre.length < 2) { setError('El nombre debe tener al menos 2 caracteres'); return }
    if (nombre.length > 15) { setError('El nombre no puede superar los 15 caracteres'); return }
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nombre)) { setError('El nombre solo puede contener letras'); return }
    if (apellido.length < 2) { setError('El apellido debe tener al menos 2 caracteres'); return }
    if (apellido.length > 15) { setError('El apellido no puede superar los 15 caracteres'); return }
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(apellido)) { setError('El apellido solo puede contener letras'); return }
    if (telefono && !/^[0-9+\-\s()]+$/.test(telefono)) { setError('El teléfono solo puede contener números'); return }
    if (telefono.length > 20) { setError('El teléfono no puede superar los 20 caracteres'); return }
    if (isAgencia) {
      const nombreAgencia = (fd.get('nombre_agencia') as string ?? '').trim()
      const bio = (fd.get('bio') as string ?? '').trim()
      if (!nombreAgencia) { setError('El nombre de la agencia es obligatorio'); return }
      if (nombreAgencia.length > 30) { setError('El nombre de la agencia no puede superar los 30 caracteres'); return }
      if (bio.length > 500) { setError('La descripción no puede superar los 500 caracteres'); return }
    }
    setUploading(true)

    try {
      let logoUrl = profile.logo_agencia ?? ''

      if (logoFile) {
        const supabase = createClient()
        const ext = logoFile.name.split('.').pop()
        const path = `${userId}/logo.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('logos-agencias')
          .upload(path, logoFile, { upsert: true })
        if (uploadError) throw new Error(uploadError.message)
        const { data: { publicUrl } } = supabase.storage
          .from('logos-agencias')
          .getPublicUrl(path)
        logoUrl = publicUrl
      }

      setUploading(false)

      const fd = new FormData(formEl)
      if (logoUrl) fd.set('logo_agencia', logoUrl)

      startTransition(async () => {
        try {
          await updateProfile(fd)
          setSuccess(true)
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Error al guardar')
        }
      })
    } catch (err: unknown) {
      setUploading(false)
      setError(err instanceof Error ? err.message : 'Error al subir logo')
    }
  }

  const isLoading = uploading || pending

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* Logo agencia */}
      {isAgencia && (
        <div>
          <label className={LABEL}>Logo de la agencia</label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#FFC107]/60 cursor-pointer overflow-hidden flex items-center justify-center transition-colors"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-[#FFC107] hover:text-[#e6ad00] font-semibold transition-colors"
              >
                {logoPreview ? 'Cambiar logo' : 'Subir logo'}
              </button>
              <p className="text-[11px] text-gray-600 mt-0.5">JPG, PNG o WebP · máx 2MB</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoSelect} />
        </div>
      )}

      {/* Datos personales */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Nombre *</label>
          <input
            name="nombre"
            required
            defaultValue={profile.nombre}
            maxLength={15}
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Apellido *</label>
          <input
            name="apellido"
            required
            defaultValue={profile.apellido}
            maxLength={15}
            className={INPUT}
          />
        </div>
      </div>

      <div>
        <label className={LABEL}>Teléfono</label>
        <input
          name="telefono"
          defaultValue={profile.telefono}
          placeholder="+54 297 400-0000"
          maxLength={20}
          inputMode="tel"
          onChange={e => { e.target.value = e.target.value.replace(/[^0-9+\-\s()]/g, '') }}
          className={INPUT}
        />
      </div>

      {/* Datos agencia */}
      {isAgencia && (
        <>
          <div>
            <label className={LABEL}>Nombre de la agencia *</label>
            <input name="nombre_agencia" required defaultValue={profile.nombre_agencia ?? ''} placeholder="Automotores del Sur" maxLength={30} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Descripción</label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={profile.bio ?? ''}
              placeholder="Contanos sobre tu agencia, años de experiencia, especialidad..."
              maxLength={500}
              className={`${INPUT} resize-none`}
            />
            <p className="text-[11px] text-gray-600 mt-1">Máximo 500 caracteres</p>
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
      )}
      {success && (
        <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          Cambios guardados correctamente
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0F14] font-extrabold text-sm py-3.5 rounded-xl transition-colors"
      >
        {isLoading ? (uploading ? 'Subiendo logo…' : 'Guardando…') : 'Guardar cambios'}
      </button>

      {/* Eliminar cuenta */}
      <div className="mt-10 pt-6 border-t border-white/10">
        <h2 className="text-sm font-bold text-red-400 mb-1">Eliminar cuenta</h2>
        <p className="text-xs text-gray-500 mb-4">
          Esta acción es permanente. Se eliminarán tu perfil y todas tus publicaciones, y no podrás recuperarlos.
        </p>

        {deleteError && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-3">{deleteError}</p>
        )}

        {confirmDelete ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-500/15 hover:bg-red-500/25 disabled:opacity-50 text-red-400 font-bold text-sm px-4 py-2.5 rounded-xl border border-red-500/30 transition-colors"
            >
              {deleting ? 'Eliminando…' : 'Sí, eliminar mi cuenta definitivamente'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              className="text-sm text-gray-500 hover:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-red-400 hover:text-red-300 font-semibold px-4 py-2.5 rounded-xl border border-red-500/25 hover:bg-red-500/5 transition-colors"
          >
            Eliminar mi cuenta
          </button>
        )}
      </div>
    </form>
  )
}
