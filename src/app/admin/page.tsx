import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    { count: totalUsuarios },
    { count: vehiculosActivos },
    { count: clicksHoy },
    { count: usuariosNuevos },
    { data: ultimosVehiculos },
    { data: ultimosUsuarios },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('activo', true).eq('vendido', false),
    supabase.from('metricas_vehiculos').select('*', { count: 'exact', head: true })
      .eq('tipo', 'whatsapp_click')
      .gte('created_at', today.toISOString()),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString()),
    supabase.from('vehiculos')
      .select('id, titulo, marca, modelo, precio, activo, destacado, created_at, profiles(nombre, apellido, role)')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('profiles')
      .select('id, nombre, apellido, email, role, verificado, activo, created_at')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const metrics = [
    {
      label: 'Usuarios registrados',
      value: totalUsuarios ?? 0,
      icon: '👥',
      color: 'from-[#282F8F]/20 to-[#282F8F]/5',
      border: 'border-[#282F8F]/30',
      href: '/admin/usuarios',
    },
    {
      label: 'Vehículos activos',
      value: vehiculosActivos ?? 0,
      icon: '🚗',
      color: 'from-[#FFC107]/15 to-[#FFC107]/5',
      border: 'border-[#FFC107]/25',
      href: '/admin/vehiculos',
    },
    {
      label: 'Clicks WhatsApp hoy',
      value: clicksHoy ?? 0,
      icon: '💬',
      color: 'from-green-500/15 to-green-500/5',
      border: 'border-green-500/25',
      href: '/admin/metricas',
    },
    {
      label: 'Nuevos usuarios (7d)',
      value: usuariosNuevos ?? 0,
      icon: '✨',
      color: 'from-purple-500/15 to-purple-500/5',
      border: 'border-purple-500/25',
      href: '/admin/usuarios',
    },
  ]

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Panel de control</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(m => (
          <Link
            key={m.label}
            href={m.href}
            className={`bg-gradient-to-br ${m.color} border ${m.border} rounded-2xl p-5 hover:scale-[1.02] transition-transform`}
          >
            <div className="text-2xl mb-3">{m.icon}</div>
            <p className="text-3xl font-extrabold text-white tabular-nums">{m.value.toLocaleString('es-AR')}</p>
            <p className="text-xs text-gray-400 mt-1.5 leading-tight">{m.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Últimas publicaciones */}
        <div className="bg-[#111827] border border-white/6 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <h2 className="text-sm font-bold text-white">Últimas publicaciones</h2>
            <Link href="/admin/vehiculos" className="text-xs text-[#FFC107] hover:text-yellow-300 transition-colors">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {(ultimosVehiculos ?? []).length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-600">Sin publicaciones aún</p>
            ) : (
              (ultimosVehiculos ?? []).map((v: any) => (
                <div key={v.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#282F8F]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs">🚗</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{v.titulo}</p>
                    <p className="text-xs text-gray-500">
                      {v.profiles?.nombre} {v.profiles?.apellido} · {new Date(v.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#FFC107]">
                      ${(v.precio / 1_000_000).toFixed(1)}M
                    </p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${v.activo ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-gray-500'}`}>
                      {v.activo ? 'activo' : 'inactivo'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos usuarios */}
        <div className="bg-[#111827] border border-white/6 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <h2 className="text-sm font-bold text-white">Últimos usuarios</h2>
            <Link href="/admin/usuarios" className="text-xs text-[#FFC107] hover:text-yellow-300 transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {(ultimosUsuarios ?? []).length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-600">Sin usuarios aún</p>
            ) : (
              (ultimosUsuarios ?? []).map((u: any) => (
                <Link
                  key={u.id}
                  href={`/admin/usuarios/${u.id}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#282F8F]/20 border border-[#282F8F]/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#FFC107]">{u.nombre.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.nombre} {u.apellido}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: 'bg-purple-500/15 text-purple-400',
    agencia_premium: 'bg-[#FFC107]/15 text-[#FFC107]',
    agencia_basica: 'bg-blue-500/15 text-blue-400',
    particular: 'bg-gray-500/15 text-gray-400',
  }
  const labels: Record<string, string> = {
    admin: 'Admin',
    agencia_premium: 'Premium',
    agencia_basica: 'Agencia',
    particular: 'Particular',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${styles[role] ?? 'bg-gray-500/15 text-gray-400'}`}>
      {labels[role] ?? role}
    </span>
  )
}
