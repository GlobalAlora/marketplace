'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/vehiculos', label: 'Vehículos' },
  { href: '/publicar', label: 'Publicar' },
]

// Deduplicated marca+modelo pairs for autocomplete
const SUGERENCIAS = Array.from(
  new Map(
    MOCK_VEHICULOS.map(v => [
      `${v.marca}|${v.modelo}`,
      { key: `${v.marca}|${v.modelo}`, marca: v.marca, modelo: v.modelo },
    ])
  ).values()
)

const IconSearch = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const suggestions = query.trim().length > 1
    ? SUGERENCIAS.filter(s =>
        `${s.marca} ${s.modelo}`.toLowerCase().includes(query.toLowerCase().trim())
      ).slice(0, 5)
    : []

  function handleSelect(marca: string, modelo: string) {
    const term = `${marca} ${modelo}`
    setQuery(term)
    setDropdownOpen(false)
    setSearchOpen(false)
    router.push(`/vehiculos?q=${encodeURIComponent(term)}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      setDropdownOpen(false)
      setSearchOpen(false)
      router.push(`/vehiculos?q=${encodeURIComponent(q)}`)
    }
  }

  // Close dropdown when clicking outside desktop search
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-focus mobile input when search panel opens
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => mobileInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [searchOpen])

  return (
    <header className="sticky top-0 z-50 bg-[#0D0F14] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-extrabold text-xl tracking-tight text-white">
              AUTO<span className="text-[#FFC107]">DUX</span>
            </span>
          </Link>

          {/* Desktop search bar */}
          <div ref={desktopSearchRef} className="hidden md:block relative w-72 xl:w-80">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setDropdownOpen(true) }}
                  onFocus={() => { if (query.trim().length > 1) setDropdownOpen(true) }}
                  placeholder="Buscar marca, modelo..."
                  className="w-full bg-[#1a1a2e] border border-white/15 text-white text-sm placeholder:text-gray-500 rounded-lg pl-9 pr-3 py-[7px] focus:outline-none focus:border-[#FFC107]/50 transition-colors"
                />
              </div>
            </form>

            {dropdownOpen && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1.5 left-0 right-0 bg-[#16182a] border border-white/15 rounded-xl overflow-hidden shadow-2xl z-50">
                {suggestions.map(s => (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => handleSelect(s.marca, s.modelo)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-white/10 transition-colors"
                    >
                      <IconSearch className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>
                        <span className="font-semibold text-white">{s.marca}</span>
                        {' '}
                        <span className="text-gray-400">{s.modelo}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 ml-auto" aria-label="Navegación principal">
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

          {/* Desktop: Ingresar */}
          <Link
            href="/auth/login"
            className="hidden md:block text-sm font-bold px-5 py-2 rounded-md bg-[#FFC107] text-[#0D0F14] hover:bg-yellow-400 transition-colors ml-2"
          >
            Ingresar
          </Link>

          {/* Mobile: search icon + hamburger */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            <button
              className="p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => { setSearchOpen(v => !v); setMenuOpen(false) }}
              aria-label="Buscar"
            >
              <IconSearch className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-300 hover:text-white"
              onClick={() => { setMenuOpen(v => !v); setSearchOpen(false) }}
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
      </div>

      {/* Mobile: expandable search panel */}
      {searchOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0D0F14] px-4 py-3">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setDropdownOpen(true) }}
                placeholder="Buscar marca, modelo..."
                className="w-full bg-[#1a1a2e] border border-white/15 text-white text-sm placeholder:text-gray-500 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#FFC107]/50"
              />
            </div>
          </form>
          {dropdownOpen && suggestions.length > 0 && (
            <ul className="mt-2 bg-[#16182a] border border-white/15 rounded-xl overflow-hidden shadow-xl">
              {suggestions.map(s => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => handleSelect(s.marca, s.modelo)}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-left text-sm hover:bg-white/10 transition-colors"
                  >
                    <span className="font-semibold text-white">{s.marca}</span>
                    <span className="text-gray-400">{s.modelo}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mobile: nav menu */}
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
