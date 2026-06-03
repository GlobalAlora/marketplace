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

  return (
    <div className="min-h-screen bg-[#0D0F14] flex font-[family-name:var(--font-exo2)]">
      <AdminSidebar profile={profile} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
