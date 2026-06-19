import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PanelSidebar from './PanelSidebar'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, apellido, email, role, avatar_url')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')
  if (profile.role === 'admin') redirect('/admin')

  return (
    <div className="min-h-screen bg-[#0D0F14] flex font-[family-name:var(--font-exo2)]">
      <PanelSidebar profile={profile} />
      <main className="flex-1 min-w-0 overflow-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
