import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  const [{ count: totalUsers }, { count: totalVehiculos }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">
          Hola, {profile?.nombre} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenido al panel de AUTODUX</p>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Usuarios registrados" value={totalUsers ?? 0} />
          <StatCard label="Vehículos publicados" value={totalVehiculos ?? 0} />
        </div>
      )}

      {isAdmin && (
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickLink href="/dashboard/admin/usuarios" label="Gestionar usuarios" desc="Roles, verificación y estado" />
            <QuickLink href="/dashboard/admin/vehiculos" label="Gestionar vehículos" desc="Destacados y moderación" />
            <QuickLink href="/dashboard/admin/banners" label="Gestionar banners" desc="Publicidad del sitio" />
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function QuickLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link href={href} className="block bg-white/3 hover:bg-white/6 border border-white/8 rounded-xl p-4 transition-colors group">
      <p className="text-sm font-semibold text-white group-hover:text-[#FFC107] transition-colors">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </Link>
  )
}
