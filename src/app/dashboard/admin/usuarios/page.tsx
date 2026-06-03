import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UsuariosTable from './UsuariosTable'

export default async function AdminUsuariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (myProfile?.role !== 'admin') redirect('/dashboard')

  const { data: usuarios } = await supabase
    .from('profiles')
    .select('id, email, nombre, apellido, telefono, role, verificado, activo, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">
            {usuarios?.length ?? 0} usuario{(usuarios?.length ?? 0) !== 1 ? 's' : ''} registrado{(usuarios?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <UsuariosTable usuarios={usuarios ?? []} />
    </div>
  )
}
