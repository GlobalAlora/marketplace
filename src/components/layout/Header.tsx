'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/vehiculos', label: 'Vehículos' },
  { href: '/publicar', label: 'Publicar' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0D0F14] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">
              AUTO<span className="text-[#FFC107]">DUX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-300 hover:text-[#FFC107] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/auth/login"
              className="text-sm font-bold px-5 py-2 rounded-md bg-[#FFC107] text-[#0D0F14] hover:bg-yellow-400 transition-colors"
            >
              Ingresar
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0D0F14]">
          <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Navegación móvil">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-2 text-sm font-medium text-gray-300 hover:text-[#FFC107] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="mt-2 text-sm font-bold px-4 py-2 rounded-md bg-[#FFC107] text-[#0D0F14] hover:bg-yellow-400 transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              Ingresar
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
