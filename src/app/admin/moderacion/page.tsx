import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ReactivarUsuarioButton from './ReactivarUsuarioButton'
import ReactivarVehiculoButton from './ReactivarVehiculoButton'

const ROLE_LABEL: Record<string, string> = {
  particular: 'Particular',
  agencia_basica: 'Agencia PRIME',
  agencia_premium: 'Agencia DUX',
  admin: 'Admin',
}

interface Reporte {
  id: string
  motivo: string
  estado: 'pendiente' | 'revisado' | 'descartado'
  created_at: string
  vehiculo_id: string
  vehiculo_titulo: string | null
  vehiculo_marca: string | null
  vehiculo_modelo: string | null
  reporter_nombre: string | null
}

export default async function AdminModeracionPage() {
  const supabase = await createClient()

  const [
    { data: reportesRaw },
    { data: pausadosRaw },
    { data: suspendidosRaw },
  ] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase
      .from('vehiculo_reports')
      .select(`
        id, motivo, estado, created_at, vehiculo_id,
        vehiculos!vehiculo_reports_vehiculo_id_fkey(titulo, marca, modelo),
        profiles!vehiculo_reports_reporter_id_fkey(nombre)
      `)
      .order('created_at', { ascending: false })
      .limit(50) as any) as Promise<{ data: any[] | null }>,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase
      .from('vehiculos')
      .select('id, titulo, marca, modelo, año, created_at')
      .eq('activo', false)
      .eq('vendido', false)
      .order('created_at', { ascending: false })
      .limit(20) as any) as Promise<{ data: any[] | null }>,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase
      .from('profiles')
      .select('id, nombre, apellido, email, role, created_at')
      .eq('activo', false)
      .order('created_at', { ascending: false })
      .limit(50) as any) as Promise<{ data: any[] | null }>,
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportes: Reporte[] = (reportesRaw ?? []).map((r: any) => ({
    id: r.id,
    motivo: r.motivo,
    estado: r.estado,
    created_at: r.created_at,
    vehiculo_id: r.vehiculo_id,
    vehiculo_titulo: r.vehiculos?.titulo ?? null,
    vehiculo_marca: r.vehiculos?.marca ?? null,
    vehiculo_modelo: r.vehiculos?.modelo ?? null,
    reporter_nombre: r.profiles?.nombre ?? null,
  }))

  const pendientes = reportes.filter(r => r.estado === 'pendiente')
  const revisados = reportes.filter(r => r.estado !== 'pendiente')

  const ESTADO_STYLE = {
    pendiente: 'bg-red-500/10 text-red-400 border-red-500/25',
    revisado: 'bg-green-500/10 text-green-400 border-green-500/25',
    descartado: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  }

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Moderación</h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-gray-500">{reportes.length} reportes totales</span>
          {pendientes.length > 0 && (
            <span className="text-xs text-red-400 font-semibold">{pendientes.length} pendientes</span>
          )}
        </div>
      </div>

      {/* Reportes pendientes */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          Reportes pendientes
          {pendientes.length > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white rounded-full px-2 py-0.5">{pendientes.length}</span>
          )}
        </h2>

        {pendientes.length === 0 ? (
          <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-8 text-center">
            <p className="text-2xl mb-2">✓</p>
            <p className="text-sm font-semibold text-green-400">Sin reportes pendientes</p>
            <p className="text-xs text-gray-600 mt-1">Todo en orden por ahora</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-white/2 border-b border-white/6">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Vehículo reportado</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Motivo</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Reportado por</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Fecha</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Ver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendientes.map(r => (
                  <tr key={r.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">
                      {r.vehiculo_marca} {r.vehiculo_modelo}
                      {r.vehiculo_titulo && <p className="text-xs text-gray-500 font-normal truncate max-w-[200px]">{r.vehiculo_titulo}</p>}
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs max-w-[200px] truncate">{r.motivo}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{r.reporter_nombre ?? 'Anónimo'}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLE[r.estado]}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      {new Date(r.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/vehiculos/${r.vehiculo_id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        Ver
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Vehículos pausados */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-white mb-3">Vehículos pausados ({pausadosRaw?.length ?? 0})</h2>
        {!pausadosRaw || pausadosRaw.length === 0 ? (
          <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600">No hay vehículos pausados actualmente</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/6 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="bg-white/2 border-b border-white/6">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Vehículo</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Año</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Publicado</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(pausadosRaw ?? []).map((v: any) => (
                  <tr key={v.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{v.marca} {v.modelo}</p>
                      {v.titulo && <p className="text-xs text-gray-500 truncate max-w-[280px]">{v.titulo}</p>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{v.año}</td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      {new Date(v.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/vehiculos/${v.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Ver
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </Link>
                        <ReactivarVehiculoButton vehiculoId={v.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Usuarios suspendidos */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-white mb-3">Usuarios suspendidos ({suspendidosRaw?.length ?? 0})</h2>
        {!suspendidosRaw || suspendidosRaw.length === 0 ? (
          <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600">No hay usuarios suspendidos actualmente</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/6 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="bg-white/2 border-b border-white/6">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Usuario</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Rol</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Suspendido desde</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(suspendidosRaw ?? []).map((u: any) => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{u.nombre} {u.apellido}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{ROLE_LABEL[u.role] ?? u.role}</td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      {new Date(u.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/usuarios/${u.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Ver perfil
                        </Link>
                        <ReactivarUsuarioButton userId={u.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Historial de reportes */}
      {revisados.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-600 mb-3">Historial de reportes procesados ({revisados.length})</h2>
          <div className="rounded-2xl border border-white/4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm opacity-60">
              <tbody className="divide-y divide-white/3">
                {revisados.map(r => (
                  <tr key={r.id}>
                    <td className="px-5 py-3 text-gray-500">
                      {r.vehiculo_marca} {r.vehiculo_modelo}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600 truncate max-w-[180px]">{r.motivo}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${ESTADO_STYLE[r.estado]}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-700">
                      {new Date(r.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
