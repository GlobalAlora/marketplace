import type { ReactNode } from 'react'
import Link from 'next/link'
import LogoAutodux from './LogoAutodux'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0D0F14] flex flex-col items-center justify-center px-4 py-12">

      {/* Logo mark + wordmark */}
      <Link
        href="/"
        className="mb-8 flex flex-col items-center gap-2.5 group focus:outline-none"
        aria-label="AUTODUX — volver al inicio"
      >
        <LogoAutodux size={42} />
        <span className="text-2xl font-extrabold tracking-tight text-white group-hover:opacity-90 transition-opacity">
          AUTO<span className="text-[#FFC107]">DUX</span>
        </span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-[420px]">
        {children}
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="mt-8 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
