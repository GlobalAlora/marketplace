'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MARCAS } from '@/lib/constants'
import LogoAutodux from '@/components/auth/LogoAutodux'
import { useAuth } from '@/lib/supabase/AuthProvider'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/vehiculos', label: 'Vehículos' },
  { href: '/panel/publicar', label: 'Publicar' },
  { href: '/#sobre-nosotros', label: 'Sobre nosotros' },
]

// Marca suggestions for search autocomplete
const SUGERENCIAS = MARCAS.map(m => ({ key: m, marca: m, modelo: '' }))

const IconSearch = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
)

function getInitials(nombre: string, apellido: string): string {
  return `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase()
}

export default function Header() {
  const [menuOpen, setMenuOpen]               = useState(false)
  const [searchOpen, setSearchOpen]           = useState(false)
  const [query, setQuery]                     = useState('')
  const [dropdownOpen, setDropdownOpen]       = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [scrolled, setScrolled]               = useState(false)

  const { user, signOut } = useAuth()

  const router           = useRouter()
  const pathname         = usePathname()
  const loginHref         = `/auth/login?redirect=${encodeURIComponent(pathname)}`
  const desktopSearchRef = useRef<HTMLDivElement>(null)

  // Links del tipo "/#anchor": si ya estamos en "/", Next no vuelve a
  // scrollear porque la URL (con el mismo hash) no cambia. Forzamos el
  // scroll manualmente en ese caso.
  function handleAnchorClick(href: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href.includes('#')) return
      const [path, anchorId] = href.split('#')
      if ((path === '' || path === '/') && pathname === '/') {
        e.preventDefault()
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', `/#${anchorId}`)
      }
    }
  }
  const userDropdownRef  = useRef<HTMLDivElement>(null)
  const mobileInputRef   = useRef<HTMLInputElement>(null)

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

  function handleSignOut() {
    setUserDropdownOpen(false)
    setMenuOpen(false)
    signOut()
  }

  // Close search dropdown when clicking outside desktop search
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
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

  // Scroll shrink effect
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur-md transition-[background-color,box-shadow] duration-300 ${scrolled ? 'bg-[#0D0F14]/95 shadow-lg shadow-black/30' : 'bg-[#0D0F14]/98'}`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className={`flex items-center gap-4 transition-[height] duration-300 ${scrolled ? 'h-14' : 'h-20'}`}>

          {/* Logo — shrinks on scroll */}
          <Link href="/" className="shrink-0 flex items-center gap-3 group">
            <LogoAutodux size={scrolled ? 22 : 30} />
            <span className={`font-extrabold tracking-tight text-white group-hover:opacity-90 transition-[font-size] duration-300 ${scrolled ? 'text-lg' : 'text-2xl'}`}>
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
                onClick={handleAnchorClick(href)}
                className="text-sm font-medium text-gray-300 hover:text-[#FFC107] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop: auth area */}
          {user ? (
            /* Logged in — avatar + dropdown */
            <div ref={userDropdownRef} className="hidden md:block relative ml-2">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(v => !v)}
                className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                aria-expanded={userDropdownOpen}
                aria-label="Menú de usuario"
              >
                {/* Avatar */}
                <span className="w-7 h-7 rounded-full bg-[#282F8F] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {getInitials(user.nombre, user.apellido)}
                </span>
                <span className="text-sm font-semibold text-white leading-none">{user.nombre}</span>
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown */}
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-[#16182a] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{user.nombre} {user.apellido}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href={user?.role === 'admin' ? '/admin' : '/panel'}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    {user?.role === 'admin' ? 'Panel Admin' : 'Mi panel'}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in — Ingresar button */
            <Link
              href={loginHref}
              className="hidden md:block text-sm font-bold px-5 py-2 rounded-md bg-[#FFC107] text-[#0D0F14] hover:bg-yellow-400 transition-colors ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0F14]"
            >
              Ingresar
            </Link>
          )}

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
                onClick={e => { handleAnchorClick(href)(e); setMenuOpen(false) }}
              >
                {label}
              </Link>
            ))}

            {user ? (
              /* Mobile: logged in */
              <>
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2.5 py-2">
                    <span className="w-8 h-8 rounded-full bg-[#282F8F] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                      {getInitials(user.nombre, user.apellido)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.nombre} {user.apellido}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={user?.role === 'admin' ? '/admin' : '/panel'}
                    className="flex items-center gap-2 py-2.5 text-sm text-gray-300 hover:text-[#FFC107] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    {user?.role === 'admin' ? 'Panel Admin' : 'Mi panel'}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              /* Mobile: not logged in */
              <Link
                href={loginHref}
                className="mt-2 text-sm font-bold px-4 py-2 rounded-md bg-[#FFC107] text-[#0D0F14] hover:bg-yellow-400 transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                Ingresar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
