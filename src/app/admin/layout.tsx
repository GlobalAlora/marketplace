import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, apellido, email, role, avatar_url')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  const [
    { count: totalUsuarios },
    { count: totalVehiculos },
    { count: vehiculosPendientes },
    { count: reportesPendientes },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('activo', true).eq('vendido', false),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('activo', false).eq('vendido', false),
    supabase.from('vehiculo_reports').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
  ])

  const counts = {
    usuarios: totalUsuarios ?? 0,
    vehiculos: totalVehiculos ?? 0,
    pendientes: (vehiculosPendientes ?? 0) + (reportesPendientes ?? 0),
  }

  return (
    <div className="min-h-screen bg-[#0D0F14] flex font-[family-name:var(--font-exo2)]">
      <AdminSidebar profile={profile} counts={counts} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
