'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Profile {
  nombre: string
  apellido: string
  email: string
  role: string
  avatar_url?: string | null
}

const NAV_USER = [
  { href: '/dashboard', label: 'Inicio', icon: '⊞' },
  { href: '/dashboard/mis-publicaciones', label: 'Mis publicaciones', icon: '◫' },
]

const NAV_ADMIN = [
  { href: '/dashboard/admin/usuarios', label: 'Usuarios', icon: '◎' },
  { href: '/dashboard/admin/vehiculos', label: 'Vehículos', icon: '◈' },
  { href: '/dashboard/admin/banners', label: 'Banners', icon: '▣' },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  agencia_premium: 'Agencia Premium',
  agencia_basica: 'Agencia',
  particular: 'Particular',
}

export default function DashboardSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = profile.role === 'admin'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-60 shrink-0 bg-[#111827] border-r border-white/5 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-black tracking-widest text-white">AUTO<span className="text-[#FFC107]">DUX</span></span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_USER.map(item => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}

        {isAdmin && (
          <>
            <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              Administración
            </p>
            {NAV_ADMIN.map(item => (
              <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
            ))}
          </>
        )}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#FFC107]/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#FFC107]">
              {profile.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{profile.nombre} {profile.apellido}</p>
            <p className="text-[10px] text-gray-500 truncate">{ROLE_LABELS[profile.role] ?? profile.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <span>→</span> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </Link>
  )
}
