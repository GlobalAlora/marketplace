'use client'

import Link from 'next/link'

export default function PanelLoginHero() {
  return (
    <div className="bg-[#0F172A]/95 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">

      {/* Título */}
      <h2 className="text-xl font-extrabold text-white">
        Bienvenido a <span className="text-[#FFC107]">AUTODUX</span>
      </h2>
      <p className="text-sm text-gray-400 mt-0.5">Iniciá sesión para continuar</p>

      {/* Formulario */}
      <div className="mt-5 space-y-3">

        {/* Email */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Tu email"
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107]"
          />
        </div>

        {/* Contraseña */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <input
            type="password"
            placeholder="Tu contraseña"
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-10 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107]"
          />
        </div>

        {/* Recordarme + olvidé */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
            <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#FFC107]" />
            Recordarme
          </label>
          <Link href="/auth/reset" className="text-xs text-gray-400 hover:text-[#FFC107] transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón principal */}
        <Link
          href="/auth/login"
          className="block w-full text-center bg-[#FFC107] text-[#0D0F14] font-extrabold py-3 rounded-lg hover:bg-yellow-400 active:scale-[0.99] transition-all text-sm"
        >
          Iniciar sesión
        </Link>
      </div>

      {/* Separador */}
      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-gray-500">o continuá con</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Google */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 bg-white text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continuar con Google
      </button>

      {/* Registrate */}
      <p className="mt-4 text-center text-xs text-gray-400">
        ¿No tenés cuenta?{' '}
        <Link href="/auth/register" className="text-white font-semibold hover:text-[#FFC107] transition-colors">
          Registrate
        </Link>
      </p>

      {/* Bloque agencia */}
      <div className="mt-4 rounded-xl border border-[#282F8F]/50 bg-[#282F8F]/15 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-[#282F8F]/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#6B84FF]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-white">¿Tenés una agencia?</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Publicá tu stock, recibí consultas reales y gestioná tus autos desde un panel profesional.
            </p>
          </div>
        </div>
        <Link
          href="/agencias"
          className="mt-3 block w-full text-center border border-[#FFC107] text-[#FFC107] text-xs font-bold py-2.5 rounded-lg hover:bg-[#FFC107] hover:text-[#0D0F14] transition-colors"
        >
          Quiero publicar mi stock
        </Link>
      </div>

    </div>
  )
}
