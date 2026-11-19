import { createClient, createAdminClient } from '@/lib/supabase/server'
import UsuariosAdminTable from './UsuariosAdminTable'
import CrearUsuarioModal from './CrearUsuarioModal'

export default async function AdminUsuariosPage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const [{ data: raw }, { data: vehiculosData }, { data: clicksData }] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase
      .from('profiles')
      .select('id, email, nombre, apellido, telefono, role, verificado, activo, created_at, avatar_url, logo_agencia, vehiculos!vehiculos_user_id_fkey(count)')
      .order('created_at', { ascending: false }) as any) as Promise<{ data: any[] | null }>,
    adminClient.from('vehiculos').select('id, user_id'),
    adminClient.from('metricas_vehiculos').select('vehiculo_id').eq('tipo', 'whatsapp_click').limit(50000),
  ])

  const vehiculoUserMap = new Map<string, string>()
  for (const v of (vehiculosData ?? [])) {
    vehiculoUserMap.set(v.id, v.user_id)
  }
  const userClicksMap = new Map<string, number>()
  for (const c of (clicksData ?? [])) {
    const userId = vehiculoUserMap.get(c.vehiculo_id)
    if (userId) userClicksMap.set(userId, (userClicksMap.get(userId) ?? 0) + 1)
  }

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
    avatar_url: u.logo_agencia ?? u.avatar_url ?? null,
    vehiculos_count: Array.isArray(u.vehiculos) ? (u.vehiculos[0]?.count ?? 0) : 0,
    whatsapp_clicks: userClicksMap.get(u.id) ?? 0,
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
        <CrearUsuarioModal />
      </div>

      <UsuariosAdminTable usuarios={usuarios} />
    </div>
  )
}
