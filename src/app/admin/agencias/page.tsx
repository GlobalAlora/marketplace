import { createClient } from '@/lib/supabase/server'
import AgenciasAdminClient from './AgenciasAdminClient'

export default async function AdminAgenciasPage() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: raw } = await (supabase
    .from('profiles')
    .select('id, nombre, nombre_agencia, avatar_url, logo_agencia, role, verificado, activo, created_at, vehiculos!vehiculos_user_id_fkey(count)')
    .in('role', ['agencia_basica', 'agencia_premium'])
    .order('created_at', { ascending: false }) as any) as { data: any[] | null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agencias = (raw ?? []).map((a: any) => ({
    id: a.id,
    nombre: a.nombre_agencia || a.nombre || 'Sin nombre',
    avatar_url: a.logo_agencia ?? a.avatar_url ?? null,
    role: a.role,
    verificado: a.verificado,
    activo: a.activo,
    created_at: a.created_at,
    vehiculos_count: Array.isArray(a.vehiculos) ? (a.vehiculos[0]?.count ?? 0) : 0,
  }))

  const total = agencias.length
  const primes = agencias.filter(a => a.role === 'agencia_basica').length
  const dux = agencias.filter(a => a.role === 'agencia_premium').length
  const verificadas = agencias.filter(a => a.verificado).length

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Agencias</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-gray-500">{total} total</span>
            <span className="text-xs text-blue-400">{primes} PRIME</span>
            <span className="text-xs text-[#FFC107]">{dux} DUX</span>
            <span className="text-xs text-green-400">{verificadas} verificadas</span>
          </div>
        </div>
      </div>

      <AgenciasAdminClient agencias={agencias} />
    </div>
  )
}
