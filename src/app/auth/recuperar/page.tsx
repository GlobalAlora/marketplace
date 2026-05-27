'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'

export default function RecuperarPage() {
  const [email, setEmail]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError('Ingresá tu email para continuar')
      return
    }
    setError('')
    setLoading(true)
    // TODO: Replace with real Supabase auth (resetPasswordForEmail)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1200)
  }

  return (
    <AuthLayout>
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8">

        {!sent ? (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#282F8F]/30 border border-[#282F8F]/40 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#FFC107]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h1 className="text-xl font-extrabold text-white">Recuperar contraseña</h1>
              <p className="text-sm text-gray-500 mt-1">
                Te enviamos un link para restablecer tu acceso.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="rec-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Email de tu cuenta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    id="rec-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    className={`w-full bg-white/5 border ${error ? 'border-red-500/60' : 'border-white/10'} text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors`}
                  />
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
                {loading ? 'Enviando...' : 'Enviar link de recuperación'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              ¿Recordaste tu contraseña?{' '}
              <Link href="/auth/login" className="text-[#FFC107] font-semibold hover:text-yellow-300 transition-colors">
                Iniciá sesión
              </Link>
            </p>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-white mb-2">¡Email enviado!</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[280px] mx-auto">
              Revisá tu bandeja de entrada en{' '}
              <span className="text-white font-semibold">{email}</span>.
              El link expira en 24 horas.
            </p>
            <p className="mt-3 text-xs text-gray-600">
              ¿No llegó? Revisá la carpeta de spam.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block text-sm font-bold text-[#FFC107] hover:text-yellow-300 transition-colors"
            >
              ← Volver al login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
