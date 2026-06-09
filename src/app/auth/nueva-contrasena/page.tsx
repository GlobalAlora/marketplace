'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { createClient } from '@/lib/supabase/client'

type Stage = 'loading' | 'ready' | 'success' | 'expired'

export default function NuevaContrasenaPage() {
  const router = useRouter()

  const [stage, setStage]         = useState<Stage>('loading')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [showCf, setShowCf]       = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  // Supabase envía el link con un hash: #access_token=...&type=recovery
  // El browser client lo detecta y emite PASSWORD_RECOVERY en onAuthStateChange
  useEffect(() => {
    const supabase = createClient()

    const timeout = setTimeout(() => {
      // Si en 6 segundos no llegó el evento, el token es inválido/expirado
      setStage(prev => prev === 'loading' ? 'expired' : prev)
    }, 6000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        clearTimeout(timeout)
        setStage('ready')
      }
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message || 'No se pudo actualizar la contraseña. Intentá de nuevo.')
      return
    }

    setStage('success')
    // Redirigir al login tras 3 segundos
    setTimeout(() => router.push('/auth/login'), 3000)
  }

  return (
    <AuthLayout>
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8">

        {/* ── Loading ── */}
        {stage === 'loading' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full border-2 border-[#FFC107]/30 border-t-[#FFC107] animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Verificando tu link de recuperación…</p>
          </div>
        )}

        {/* ── Expirado / inválido ── */}
        {stage === 'expired' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-white mb-2">Link inválido o expirado</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[280px] mx-auto">
              Este link de recuperación ya no es válido. Los links expiran a las 24 horas de su envío.
            </p>
            <Link
              href="/auth/recuperar"
              className="mt-6 inline-flex items-center gap-2 bg-[#FFC107] text-[#0D0F14] font-extrabold text-sm px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Solicitar nuevo link
            </Link>
          </div>
        )}

        {/* ── Formulario nueva contraseña ── */}
        {stage === 'ready' && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#282F8F]/30 border border-[#282F8F]/40 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#FFC107]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h1 className="text-xl font-extrabold text-white">Nueva contraseña</h1>
              <p className="text-sm text-gray-500 mt-1">Elegí una contraseña segura de al menos 8 caracteres.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Nueva contraseña */}
              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 pr-11 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPw ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showCf ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repetí la contraseña"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError('') }}
                    className={`w-full bg-white/5 border ${error ? 'border-red-500/60' : 'border-white/10'} text-white text-sm rounded-xl px-4 py-3 pr-11 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCf(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label={showCf ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showCf ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 rounded-xl hover:bg-yellow-400 active:scale-[0.99] transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
              </button>
            </form>
          </>
        )}

        {/* ── Éxito ── */}
        {stage === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-white mb-2">¡Contraseña actualizada!</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu contraseña fue cambiada correctamente.<br />
              Redirigiendo al login…
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block text-sm font-bold text-[#FFC107] hover:text-yellow-300 transition-colors"
            >
              Ir al login ahora →
            </Link>
          </div>
        )}

      </div>
    </AuthLayout>
  )
}
