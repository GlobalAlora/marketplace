import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PerfilForm from './PerfilForm'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, apellido, telefono, role, nombre_agencia, bio, logo_agencia, avatar_url')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">
          {profile.role === 'particular' ? 'Mi perfil' : 'Perfil de agencia'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Editá tus datos de contacto y presentación</p>
      </div>
      <PerfilForm profile={profile} userId={user.id} />
    </div>
  )
}
