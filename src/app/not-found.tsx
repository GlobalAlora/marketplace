import Link from 'next/link'
import LogoAutodux from '@/components/auth/LogoAutodux'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0F14] flex flex-col items-center justify-center px-4 text-center">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-12 group" aria-label="AUTODUX — volver al inicio">
        <LogoAutodux size={32} />
        <span className="text-2xl font-extrabold tracking-tight text-white group-hover:opacity-90 transition-opacity">
          AUTO<span className="text-[#FFC107]">DUX</span>
        </span>
      </Link>

      {/* 404 */}
      <div className="relative mb-6 select-none" aria-hidden="true">
        <span className="text-[160px] sm:text-[220px] font-extrabold leading-none text-[#FFC107] opacity-15 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
          404
        </span>
        <span className="relative text-[80px] sm:text-[120px] font-extrabold leading-none text-[#FFC107]">
          404
        </span>
      </div>

      {/* Texto */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
        Esta página no existe
      </h1>
      <p className="text-gray-400 text-base sm:text-lg max-w-md leading-relaxed mb-10">
        El vehículo que buscás puede haber sido vendido o eliminado.
        <br className="hidden sm:block" />
        Explorá el resto del catálogo.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3 bg-[#FFC107] text-[#0D0F14] font-extrabold text-sm rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all duration-150 text-center"
        >
          Volver al inicio
        </Link>
        <Link
          href="/vehiculos"
          className="w-full sm:w-auto px-8 py-3 border border-white/15 text-white font-semibold text-sm rounded-xl hover:border-white/30 hover:bg-white/5 active:scale-[0.98] transition-all duration-150 text-center"
        >
          Ver vehículos
        </Link>
      </div>

    </div>
  )
}
