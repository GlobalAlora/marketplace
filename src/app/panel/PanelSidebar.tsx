'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Role = 'particular' | 'agencia_basica' | 'agencia_premium'

interface Profile {
  nombre: string
  apellido: string
  email: string
  role: Role
  avatar_url?: string | null
}

const ROLE_LABELS: Record<Role, string> = {
  particular: 'Particular',
  agencia_basica: 'Agencia PRIME',
  agencia_premium: 'Agencia DUX',
}

const ROLE_COLORS: Record<Role, string> = {
  particular: 'bg-white/10 text-gray-400',
  agencia_basica: 'bg-[#282F8F]/30 text-[#7b85e0]',
  agencia_premium: 'bg-[#FFC107]/15 text-[#FFC107]',
}

const IconHome = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
)

const IconCar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
)

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const IconUser = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const IconChart = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

const NAV_BASE = [
  { href: '/panel',                   label: 'Inicio',        mobileLabel: 'Inicio',    icon: <IconHome />,  exact: true },
  { href: '/panel/mis-publicaciones', label: 'Mis publicaciones', mobileLabel: 'Mis autos', icon: <IconCar />,   exact: false },
  { href: '/panel/publicar',          label: 'Publicar vehículo', mobileLabel: 'Publicar', icon: <IconPlus />,  exact: false },
  { href: '/panel/perfil',            label: 'Mi perfil',     mobileLabel: 'Perfil',    icon: <IconUser />,  exact: false },
]

const NAV_AGENCIA_EXTRA = [
  { href: '/panel/metricas', label: 'Métricas', mobileLabel: 'Métricas', icon: <IconChart />, exact: false },
]

export default function PanelSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()

  const isAgencia = profile.role === 'agencia_basica' || profile.role === 'agencia_premium'
  const nav = isAgencia ? [...NAV_BASE, ...NAV_AGENCIA_EXTRA] : NAV_BASE

  const navItems = nav.map(item =>
    item.href === '/panel/perfil' && isAgencia
      ? { ...item, label: 'Perfil de agencia' }
      : item
  )

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile.nombre.charAt(0).toUpperCase()

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-[#0a0c14] border-r border-white/5 flex-col min-h-screen sticky top-0">

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-1.5">
              <span className="text-[15px] font-black tracking-widest text-white">
                AUTO<span className="text-[#FFC107]">DUX</span>
              </span>
            </a>
            <span className="text-[9px] font-bold tracking-widest bg-white/8 text-gray-400 px-2 py-0.5 rounded-full uppercase">
              Mi cuenta
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = item.exact ? pathname === item.href : (pathname === item.href || pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#282F8F]/20 text-white border border-[#282F8F]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={`w-4 h-4 [&>svg]:w-4 [&>svg]:h-4 ${active ? 'text-[#FFC107]' : ''}`}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 pt-3 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#282F8F]/30 border border-[#282F8F]/50 flex items-center justify-center shrink-0 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#FFC107]">{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{profile.nombre} {profile.apellido}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_COLORS[profile.role]}`}>
                {ROLE_LABELS[profile.role]}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0a0c14]/95 backdrop-blur border-b border-white/5 flex items-center justify-between px-4">
        <a href="/" className="text-[15px] font-black tracking-widest text-white">
          AUTO<span className="text-[#FFC107]">DUX</span>
        </a>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-white leading-none">{profile.nombre}</p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_COLORS[profile.role]}`}>
              {ROLE_LABELS[profile.role]}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#282F8F]/30 border border-[#282F8F]/50 flex items-center justify-center shrink-0 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-[#FFC107]">{initials}</span>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c14]/95 backdrop-blur border-t border-white/5 flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : (pathname === item.href || pathname.startsWith(`${item.href}/`))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] transition-colors ${
                active ? 'text-[#FFC107]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-semibold leading-none">{item.mobileLabel}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-gray-600 hover:text-red-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="text-[9px] font-semibold leading-none">Salir</span>
        </button>
      </nav>
    </>
  )
}
