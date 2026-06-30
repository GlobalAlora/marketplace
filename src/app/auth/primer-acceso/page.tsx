'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { createClient } from '@/lib/supabase/client'
import { marcarPasswordCambiado, aceptarTerminos } from './actions'

type Step = 'loading' | 'password' | 'terminos' | 'done'

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors'

export default function PrimerAccesoPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('loading')
  const [role, setRole] = useState<string>('')

  // Password step
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [showCf, setShowCf]     = useState(false)
  const [pwError, setPwError]   = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  // Términos step
  const [accepted, setAccepted]     = useState(false)
  const [termsError, setTermsError] = useState('')
  const [isPendingTerm, startTerm]  = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/auth/login'); return }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, debe_cambiar_password, terminos_aceptados')
        .eq('id', user.id)
        .single()
      setRole(profile?.role ?? '')
      if (profile?.debe_cambiar_password) {
        setStep('password')
      } else if (!profile?.terminos_aceptados) {
        setStep('terminos')
      } else {
        setStep('done')
      }
    })
  }, [router])

  useEffect(() => {
    if (step === 'done') {
      window.location.href = role === 'admin' ? '/admin' : '/panel'
    }
  }, [step, role])

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (password.length < 8) { setPwError('La contraseña debe tener al menos 8 caracteres'); return }
    if (password !== confirm) { setPwError('Las contraseñas no coinciden'); return }

    setPwLoading(true)
    try {
      // Change password client-side — preserves the session
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        const msg = updateError.message.toLowerCase()
        if (msg.includes('different from the old password') || msg.includes('same as the old password') || msg.includes('should be different')) {
          setPwError('La nueva contraseña debe ser diferente a la contraseña temporal')
        } else {
          setPwError(updateError.message)
        }
        return
      }

      // Mark flag in DB via server action
      const result = await marcarPasswordCambiado()
      if (result?.error) { setPwError(result.error); return }

      // Check if terms step is needed
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setPwError('Sesión expirada, volvé a iniciar sesión'); return }
      const { data: profile } = await supabase
        .from('profiles')
        .select('terminos_aceptados')
        .eq('id', user.id)
        .single()
      setStep(!profile?.terminos_aceptados ? 'terminos' : 'done')
    } finally {
      setPwLoading(false)
    }
  }

  function handleTermsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTermsError('')
    if (!accepted) { setTermsError('Debés aceptar los términos para continuar'); return }
    startTerm(async () => {
      const result = await aceptarTerminos()
      if (result?.error) { setTermsError(result.error); return }
      setStep('done')
    })
  }

  if (step === 'loading' || step === 'done') {
    return (
      <AuthLayout>
        <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8 text-center py-12">
          <div className="w-12 h-12 rounded-full border-2 border-[#FFC107]/30 border-t-[#FFC107] animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">{step === 'done' ? 'Redirigiendo…' : 'Cargando…'}</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-7">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${step === 'password' ? 'bg-[#FFC107] text-[#0D0F14]' : 'bg-green-500 text-white'}`}>
            {step === 'password' ? '1' : '✓'}
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${step === 'terminos' ? 'bg-[#FFC107] text-[#0D0F14]' : 'bg-white/10 text-gray-500'}`}>
            2
          </div>
        </div>

        {/* ── Paso 1: Cambiar contraseña ── */}
        {step === 'password' && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#282F8F]/30 border border-[#282F8F]/40 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#FFC107]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h1 className="text-xl font-extrabold text-white">Configurá tu contraseña</h1>
              <p className="text-sm text-gray-500 mt-1">Tu cuenta fue creada por un administrador. Elegí una contraseña personal antes de continuar.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setPwError('') }}
                    className={`${INPUT} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" aria-label="Mostrar/ocultar">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showCf ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repetí la contraseña"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setPwError('') }}
                    className={`${INPUT} pr-11 ${pwError ? 'border-red-500/60' : ''}`}
                  />
                  <button type="button" onClick={() => setShowCf(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" aria-label="Mostrar/ocultar">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                </div>
                {pwError && <p className="mt-1.5 text-xs text-red-400">{pwError}</p>}
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 rounded-xl hover:bg-yellow-400 active:scale-[0.99] transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {pwLoading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {pwLoading ? 'Guardando…' : 'Continuar →'}
              </button>
            </form>
          </>
        )}

        {/* ── Paso 2: Aceptar términos ── */}
        {step === 'terminos' && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#282F8F]/30 border border-[#282F8F]/40 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#FFC107]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h1 className="text-xl font-extrabold text-white">Términos y condiciones</h1>
              <p className="text-sm text-gray-500 mt-1">Leé y aceptá los términos para acceder a la plataforma.</p>
            </div>

            <div className="bg-[#0D0F14] border border-white/10 rounded-xl p-4 h-48 overflow-y-auto text-xs text-gray-400 leading-relaxed mb-5 space-y-2">
              <p className="font-bold text-white">Términos y condiciones de uso — AUTODUX</p>
              <p>Al acceder y utilizar la plataforma AUTODUX, aceptás los siguientes términos y condiciones. La plataforma es operada por Abril Duarte (CUIT 27-46465111-5), con domicilio en Calle 3117 N° 756, Comodoro Rivadavia, Provincia de Chubut, República Argentina.</p>
              <p>AUTODUX es un marketplace de compra y venta de vehículos. No actuamos como vendedor ni comprador en ninguna transacción. Nos limitamos a proveer el espacio digital para que usuarios y agencias publiquen y encuentren vehículos.</p>
              <p>Al registrarte o ser dado de alta como usuario, te comprometés a: proporcionar información veraz y actualizada, no publicar contenido falso, engañoso o ilegal, respetar los derechos de otros usuarios y terceros, y cumplir con toda la normativa vigente aplicable.</p>
              <p>Las publicaciones son responsabilidad exclusiva de quien las crea. AUTODUX no garantiza la exactitud de la información contenida en las publicaciones ni la disponibilidad de los vehículos listados.</p>
              <p>AUTODUX se reserva el derecho de suspender o eliminar cuentas que incumplan estos términos, sin previo aviso.</p>
              <p>Para más información, consultá los <a href="/terminos" target="_blank" rel="noopener noreferrer" className="text-[#FFC107] hover:underline">términos completos</a> y la <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#FFC107] hover:underline">política de privacidad</a>.</p>
            </div>

            <form onSubmit={handleTermsSubmit} noValidate className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input type="checkbox" checked={accepted} onChange={e => { setAccepted(e.target.checked); setTermsError('') }} className="sr-only" />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${accepted ? 'bg-[#FFC107] border-[#FFC107]' : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}>
                    {accepted && <svg className="w-3 h-3 text-[#0D0F14]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </div>
                </div>
                <span className="text-sm text-gray-300">
                  Leí y acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" className="text-[#FFC107] hover:underline">términos y condiciones</a> y la <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#FFC107] hover:underline">política de privacidad</a> de AUTODUX.
                </span>
              </label>
              {termsError && <p className="text-xs text-red-400">{termsError}</p>}

              <button
                type="submit"
                disabled={isPendingTerm}
                className="w-full bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 rounded-xl hover:bg-yellow-400 active:scale-[0.99] transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPendingTerm && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {isPendingTerm ? 'Guardando…' : 'Aceptar y continuar →'}
              </button>
            </form>
          </>
        )}

      </div>
    </AuthLayout>
  )
}
