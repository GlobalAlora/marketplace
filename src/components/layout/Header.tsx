'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/vehiculos', label: 'Vehículos' },
  { href: '/publicar', label: 'Publicar' },
]

function CarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875H3a3 3 0 106 0h3.75a3 3 0 106 0h.375a1.875 1.875 0 001.875-1.875V15h-7.5z" />
      <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm9 0a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm3.75-9l-1.5-4.5h-15L3 10.5h18z" />
    </svg>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2 text-brand-500">
            <CarIcon />
            <span className="font-semibold text-gray-900 text-lg">
              Marketplace <span className="text-brand-500">Comodoro</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-600 hover:text-brand-500 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/auth/login"
              className="text-sm font-medium px-4 py-2 rounded-md border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white transition-colors"
            >
              Ingresar
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
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
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Navegación móvil">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-2 text-sm font-medium text-gray-700 hover:text-brand-500 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="mt-2 text-sm font-medium px-4 py-2 rounded-md border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white transition-colors text-center"
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
