import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from './DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  let { data: profile } = await supabase
    .from('profiles')
    .select('nombre, apellido, email, role, avatar_url')
    .eq('id', user.id)
    .single()

  // Si el trigger no creó el profile (edge case), lo creamos ahora
  if (!profile) {
    const meta = user.user_metadata ?? {}
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email ?? '',
      nombre: meta.nombre ?? '',
      apellido: meta.apellido ?? '',
      telefono: meta.telefono ?? '',
    })
    const { data: created } = await supabase
      .from('profiles')
      .select('nombre, apellido, email, role, avatar_url')
      .eq('id', user.id)
      .single()
    profile = created
  }

  if (!profile) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-[#0D0F14] flex">
      <DashboardSidebar profile={profile} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
