'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { createClient } from '@/lib/supabase/client'

const INPUT_BASE =
  'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors'

const INPUT_ERROR =
  'w-full bg-white/5 border border-red-500/60 text-white text-sm rounded-xl px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-red-400 transition-colors'

const LABEL = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5'

interface FormState {
  nombre: string
  apellido: string
  email: string
  telefono: string
  password: string
  confirm: string
}

interface FormErrors {
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  password?: string
  confirm?: string
}

const EMPTY: FormState = {
  nombre: '', apellido: '', email: '', telefono: '', password: '', confirm: '',
}

export default function RegistroPage() {
  const router = useRouter()
  const [form, setForm]         = useState<FormState>(EMPTY)
  const [errors, setErrors]     = useState<FormErrors>({})
  const [showPw, setShowPw]     = useState(false)
  const [showCfm, setShowCfm]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(p => ({ ...p, [key]: undefined }))
  }

  const pwMatch = useMemo(() => {
    if (!form.password || !form.confirm) return null
    return form.password === form.confirm
  }, [form.password, form.confirm])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.nombre.trim())   next.nombre   = 'Obligatorio'
    if (!form.apellido.trim()) next.apellido  = 'Obligatorio'
    if (!form.email.trim())    next.email     = 'Obligatorio'
    if (!form.telefono.trim()) next.telefono  = 'Obligatorio'
    if (form.password.length < 6) next.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) next.confirm = 'Las contraseñas no coinciden'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
        },
      },
    })

    setLoading(false)
    if (error) {
      setServerError(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="text-lg font-extrabold text-white mb-2">¡Cuenta creada!</h2>
          <p className="text-sm text-gray-400 mb-6">
            Te enviamos un email de confirmación a <span className="text-white font-semibold">{form.email}</span>.<br />
            Revisá tu bandeja y hacé clic en el enlace para activar tu cuenta.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 px-6 rounded-xl hover:bg-yellow-400 transition-all text-sm"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8">

        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-white">Crear cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Unite a la comunidad AUTODUX</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-nombre" className={LABEL}>Nombre</label>
              <input
                id="reg-nombre"
                type="text"
                autoComplete="given-name"
                placeholder="Juan"
                value={form.nombre}
                onChange={set('nombre')}
                className={errors.nombre ? INPUT_ERROR : INPUT_BASE}
              />
              {errors.nombre && <p className="mt-1 text-xs text-red-400">{errors.nombre}</p>}
            </div>
            <div>
              <label htmlFor="reg-apellido" className={LABEL}>Apellido</label>
              <input
                id="reg-apellido"
                type="text"
                autoComplete="family-name"
                placeholder="Pérez"
                value={form.apellido}
                onChange={set('apellido')}
                className={errors.apellido ? INPUT_ERROR : INPUT_BASE}
              />
              {errors.apellido && <p className="mt-1 text-xs text-red-400">{errors.apellido}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className={LABEL}>Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={set('email')}
                className={`${errors.email ? INPUT_ERROR : INPUT_BASE} pl-10`}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="reg-telefono" className={LABEL}>Teléfono</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </span>
              <input
                id="reg-telefono"
                type="tel"
                autoComplete="tel"
                placeholder="2974 123456"
                value={form.telefono}
                onChange={set('telefono')}
                className={`${errors.telefono ? INPUT_ERROR : INPUT_BASE} pl-10`}
              />
            </div>
            {errors.telefono && <p className="mt-1.5 text-xs text-red-400">{errors.telefono}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="reg-password" className={LABEL}>Contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={set('password')}
                className={`${errors.password ? INPUT_ERROR : INPUT_BASE} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  {showPw
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    : <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                  }
                </svg>
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="reg-confirm" className={LABEL}>Confirmar contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </span>
              <input
                id="reg-confirm"
                type={showCfm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repetí tu contraseña"
                value={form.confirm}
                onChange={set('confirm')}
                className={`${errors.confirm ? INPUT_ERROR : INPUT_BASE} pl-10 pr-10`}
              />
              {/* Show/hide + match indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {pwMatch !== null && (
                  <span className={`w-2 h-2 rounded-full ${pwMatch ? 'bg-green-400' : 'bg-red-400'}`} title={pwMatch ? 'Coinciden' : 'No coinciden'} />
                )}
                <button
                  type="button"
                  onClick={() => setShowCfm(v => !v)}
                  aria-label={showCfm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    {showCfm
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      : <>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </>
                    }
                  </svg>
                </button>
              </div>
            </div>
            {errors.confirm && <p className="mt-1.5 text-xs text-red-400">{errors.confirm}</p>}
            {pwMatch === true && !errors.confirm && (
              <p className="mt-1.5 text-xs text-green-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Las contraseñas coinciden
              </p>
            )}
          </div>

          {/* Error del servidor */}
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-xs text-red-400">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 rounded-xl hover:bg-yellow-400 active:scale-[0.99] transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-xs text-gray-600 mt-2">
            Al registrarte aceptás los términos de uso de AUTODUX.
          </p>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{' '}
          <Link href="/auth/login" className="text-[#FFC107] font-semibold hover:text-yellow-300 transition-colors">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
