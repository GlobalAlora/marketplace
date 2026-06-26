'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  nombre: string
  apellido: string
  email: string
  role: string
  avatar_url?: string | null
}

interface Counts {
  usuarios: number
  vehiculos: number
  pendientes: number
}

const CONTENIDO = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: '/admin/vehiculos',
    label: 'Vehículos',
    countKey: 'vehiculos' as keyof Counts,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    href: '/admin/agencias',
    label: 'Agencias',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    href: '/admin/usuarios',
    label: 'Usuarios',
    countKey: 'usuarios' as keyof Counts,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/moderacion',
    label: 'Moderación',
    countKey: 'pendientes' as keyof Counts,
    badge: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
]

const MONETIZACION = [
  {
    href: '/admin/planes',
    label: 'Planes (límites)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    href: '/admin/planes-home',
    label: 'Planes (home)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: '/admin/banners',
    label: 'Banners',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/metricas',
    label: 'Métricas',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
]

const SISTEMA = [
  {
    href: '/admin/configuracion',
    label: 'Configuración',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  countKey?: keyof Counts
  badge?: boolean
}

function NavLink({ item, pathname, counts }: { item: NavItem; pathname: string; counts: Counts }) {
  const exact = item.href === '/admin'
  const active = exact ? pathname === item.href : pathname.startsWith(item.href)
  const count = item.countKey ? counts[item.countKey] : null
  const showBadge = item.badge && count && count > 0

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-[#282F8F]/20 text-white border border-[#282F8F]/40'
          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      <span className={active ? 'text-[#FFC107]' : ''}>{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {showBadge ? (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
          {count}
        </span>
      ) : count !== null && count > 0 ? (
        <span className="text-[10px] text-gray-600 tabular-nums">{count.toLocaleString('es-AR')}</span>
      ) : null}
    </Link>
  )
}

// Los primeros 3 quedan siempre visibles en el bottom nav; el resto (incluyendo
// Usuarios y Moderación) vive en el sheet "Más" junto con Monetización y Sistema.
// El badge de pendientes de Moderación se muestra en el botón "Más" para no perderlo de vista.
const BOTTOM_NAV_PRINCIPAL = CONTENIDO.slice(0, 3)
const BOTTOM_NAV_RESTO_CONTENIDO = CONTENIDO.slice(3)

export default function AdminSidebar({ profile, counts }: { profile: Profile; counts: Counts }) {
  const pathname = usePathname()
  const router = useRouter()
  const [masOpen, setMasOpen] = useState(false)

  const pendientesBadge = counts.pendientes > 0

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
    {/* ── Mobile top bar ──────────────────────────────────────── */}
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0a0c14]/95 backdrop-blur border-b border-white/5 flex items-center justify-between px-4">
      <a href="/" className="text-[15px] font-black tracking-widest text-white">
        AUTO<span className="text-[#FFC107]">DUX</span>
      </a>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold tracking-widest bg-[#282F8F] text-white px-2 py-0.5 rounded-full uppercase">Admin</span>
        <div className="w-8 h-8 rounded-full bg-[#282F8F]/30 border border-[#282F8F]/50 flex items-center justify-center overflow-hidden">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-[#FFC107]">{profile.nombre.charAt(0).toUpperCase()}</span>
          }
        </div>
      </div>
    </header>

    {/* ── Mobile bottom nav ───────────────────────────────────── */}
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c14]/95 backdrop-blur border-t border-white/5 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {BOTTOM_NAV_PRINCIPAL.map(item => {
        const exact = item.href === '/admin'
        const active = exact ? pathname === item.href : pathname.startsWith(item.href)
        const count = item.countKey ? counts[item.countKey] : null
        return (
          <Link key={item.href} href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] transition-colors relative ${active ? 'text-[#FFC107]' : 'text-gray-500'}`}
          >
            {item.icon}
            <span className="text-[9px] font-semibold leading-none">{item.label}</span>
            {item.badge && count && count > 0 && (
              <span className="absolute top-1.5 right-[calc(50%-10px)] bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>
            )}
          </Link>
        )
      })}
      <button onClick={() => setMasOpen(true)}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-gray-500 hover:text-white transition-colors relative">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <span className="text-[9px] font-semibold leading-none">Más</span>
        {pendientesBadge && (
          <span className="absolute top-1.5 right-[calc(50%-10px)] bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{counts.pendientes}</span>
        )}
      </button>
    </nav>

    {/* ── Mobile "Más" bottom sheet ───────────────────────────── */}
    {masOpen && (
      <div
        className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60"
        onClick={() => setMasOpen(false)}
      >
        <div
          className="w-full max-h-[80vh] overflow-y-auto bg-[#0a0c14] border-t border-white/10 rounded-t-2xl shadow-2xl"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <p className="text-sm font-bold text-white">Más opciones</p>
            <button onClick={() => setMasOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-3 space-y-5 pb-2">
            {BOTTOM_NAV_RESTO_CONTENIDO.length > 0 && (
              <div>
                <p className="text-[9px] font-bold tracking-widest text-gray-700 uppercase px-3 mb-1.5">Contenido</p>
                <div className="space-y-0.5" onClick={() => setMasOpen(false)}>
                  {BOTTOM_NAV_RESTO_CONTENIDO.map(item => (
                    <NavLink key={item.href} item={item} pathname={pathname} counts={counts} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[9px] font-bold tracking-widest text-gray-700 uppercase px-3 mb-1.5">Monetización</p>
              <div className="space-y-0.5" onClick={() => setMasOpen(false)}>
                {MONETIZACION.map(item => (
                  <NavLink key={item.href} item={item} pathname={pathname} counts={counts} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold tracking-widest text-gray-700 uppercase px-3 mb-1.5">Sistema</p>
              <div className="space-y-0.5" onClick={() => setMasOpen(false)}>
                {SISTEMA.map(item => (
                  <NavLink key={item.href} item={item} pathname={pathname} counts={counts} />
                ))}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    )}

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
          <span className="text-[9px] font-bold tracking-widest bg-[#282F8F] text-white px-2 py-0.5 rounded-full uppercase">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {/* CONTENIDO */}
        <div>
          <p className="text-[9px] font-bold tracking-widest text-gray-700 uppercase px-3 mb-1.5">Contenido</p>
          <div className="space-y-0.5">
            {CONTENIDO.map(item => (
              <NavLink key={item.href} item={item} pathname={pathname} counts={counts} />
            ))}
          </div>
        </div>

        {/* MONETIZACIÓN */}
        <div>
          <p className="text-[9px] font-bold tracking-widest text-gray-700 uppercase px-3 mb-1.5">Monetización</p>
          <div className="space-y-0.5">
            {MONETIZACION.map(item => (
              <NavLink key={item.href} item={item} pathname={pathname} counts={counts} />
            ))}
          </div>
        </div>

        {/* SISTEMA */}
        <div>
          <p className="text-[9px] font-bold tracking-widest text-gray-700 uppercase px-3 mb-1.5">Sistema</p>
          <div className="space-y-0.5">
            {SISTEMA.map(item => (
              <NavLink key={item.href} item={item} pathname={pathname} counts={counts} />
            ))}
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 pb-4 pt-3 border-t border-white/5 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#282F8F]/30 border border-[#282F8F]/50 flex items-center justify-center shrink-0 overflow-hidden">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              : <span className="text-xs font-bold text-[#FFC107]">{profile.nombre.charAt(0).toUpperCase()}</span>
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{profile.nombre} {profile.apellido}</p>
            <p className="text-[10px] text-gray-600 truncate">{profile.email}</p>
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
    </>
  )
}
