import { createClient } from '@/lib/supabase/server'
import UsuariosAdminTable from './UsuariosAdminTable'

export default async function AdminUsuariosPage() {
  const supabase = await createClient()

  const { data: usuarios } = await supabase
    .from('profiles')
    .select('id, email, nombre, apellido, telefono, role, verificado, activo, created_at')
    .order('created_at', { ascending: false })

  const total = usuarios?.length ?? 0
  const activos = usuarios?.filter(u => u.activo).length ?? 0
  const verificados = usuarios?.filter(u => u.verificado).length ?? 0

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Usuarios</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-gray-500">{total} total</span>
            <span className="text-xs text-emerald-400">{activos} activos</span>
            <span className="text-xs text-blue-400">{verificados} verificados</span>
          </div>
        </div>
      </div>

      <UsuariosAdminTable usuarios={usuarios ?? []} />
    </div>
  )
}
