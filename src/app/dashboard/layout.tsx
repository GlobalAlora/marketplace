import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from './DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, apellido, email, role, avatar_url')
    .eq('id', user.id)
    .single()

  // Si el profile no existe redirigimos a / y no a /auth/login
  // para evitar el loop: middleware ve usuario auth → /dashboard → /auth/login → /dashboard
  if (!profile) redirect('/')

  return (
    <div className="min-h-screen bg-[#0D0F14] flex">
      <DashboardSidebar profile={profile} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
