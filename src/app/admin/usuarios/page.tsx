import { createClient } from '@/lib/supabase/server'
import UsuariosAdminTable from './UsuariosAdminTable'

export default async function AdminUsuariosPage() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: raw } = await (supabase
    .from('profiles')
    .select('id, email, nombre, apellido, telefono, role, verificado, activo, created_at, avatar_url, vehiculos!vehiculos_user_id_fkey(count)')
    .order('created_at', { ascending: false }) as any) as { data: any[] | null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usuarios = (raw ?? []).map((u: any) => ({
    id: u.id,
    email: u.email,
    nombre: u.nombre,
    apellido: u.apellido,
    telefono: u.telefono,
    role: u.role,
    verificado: u.verificado,
    activo: u.activo,
    created_at: u.created_at,
    avatar_url: u.avatar_url ?? null,
    vehiculos_count: Array.isArray(u.vehiculos) ? (u.vehiculos[0]?.count ?? 0) : 0,
  }))

  const total = usuarios.length
  const activos = usuarios.filter(u => u.activo).length
  const verificados = usuarios.filter(u => u.verificado).length

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

      <UsuariosAdminTable usuarios={usuarios} />
    </div>
  )
}
