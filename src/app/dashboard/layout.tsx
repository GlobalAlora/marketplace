import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from './DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // getUser() valida el JWT contra Supabase Auth.
  // Si falla por un error de red/mantenimiento, caemos a getSession() que lee
  // el token de las cookies localmente sin llamada de red.
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  let resolvedUser = user
  if (!resolvedUser) {
    // Fallback: leer sesión desde cookie sin validar server-side
    const { data: { session } } = await supabase.auth.getSession()
    resolvedUser = session?.user ?? null
  }

  // Redirigimos a / (no a /auth/login) para no crear un loop con el middleware:
  // middleware ve cookie activa → /auth/login → /dashboard → loop
  if (!resolvedUser) redirect('/')

  let { data: profile } = await supabase
    .from('profiles')
    .select('nombre, apellido, email, role, avatar_url')
    .eq('id', resolvedUser.id)
    .single()

  // Si el trigger no creó el profile (edge case), lo creamos ahora
  if (!profile) {
    const meta = resolvedUser.user_metadata ?? {}
    await supabase.from('profiles').upsert({
      id: resolvedUser.id,
      email: resolvedUser.email ?? '',
      nombre: meta.nombre ?? '',
      apellido: meta.apellido ?? '',
      telefono: meta.telefono ?? '',
    })
    const { data: created } = await supabase
      .from('profiles')
      .select('nombre, apellido, email, role, avatar_url')
      .eq('id', resolvedUser.id)
      .single()
    profile = created
  }

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
