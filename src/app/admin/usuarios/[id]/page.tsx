import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import RoleSelector from './RoleSelector'

export default async function UsuarioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: perfil }, { data: vehiculos }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('vehiculos')
      .select('id, titulo, marca, modelo, año, precio, activo, vendido, destacado, vistas, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!perfil) notFound()

  const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrador',
    agencia_premium: 'Agencia Premium',
    agencia_basica: 'Agencia Básica',
    particular: 'Particular',
  }

  const ROLE_BADGE: Record<string, string> = {
    admin: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    agencia_premium: 'bg-[#FFC107]/15 text-[#FFC107] border-[#FFC107]/25',
    agencia_basica: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    particular: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }

  return (
    <div className="p-8 max-w-[900px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-7">
        <Link href="/admin" className="hover:text-gray-400 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/usuarios" className="hover:text-gray-400 transition-colors">Usuarios</Link>
        <span>/</span>
        <span className="text-gray-400">{perfil.nombre} {perfil.apellido}</span>
      </div>

      {/* Header del usuario */}
      <div className="bg-[#111827] border border-white/6 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#282F8F]/20 border border-[#282F8F]/30 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-[#FFC107]">{perfil.nombre.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-extrabold text-white">{perfil.nombre} {perfil.apellido}</h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ROLE_BADGE[perfil.role] ?? ROLE_BADGE.particular}`}>
                {ROLE_LABELS[perfil.role] ?? perfil.role}
              </span>
              {perfil.verificado && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/25">
                  ✓ Verificado
                </span>
              )}
              {!perfil.activo && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/25">
                  Suspendido
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">{perfil.email}</p>
            {perfil.telefono && <p className="text-sm text-gray-500">{perfil.telefono}</p>}
            <p className="text-xs text-gray-600 mt-2">
              Registrado el {new Date(perfil.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-5 pt-5 border-t border-white/6 flex flex-wrap gap-3">
          <RoleSelector userId={perfil.id} currentRole={perfil.role} />
        </div>
      </div>

      {/* Vehículos publicados */}
      <div className="bg-[#111827] border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">
            Vehículos publicados
            <span className="ml-2 text-xs font-normal text-gray-500">{vehiculos?.length ?? 0}</span>
          </h2>
        </div>

        {(vehiculos ?? []).length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-600">Sin publicaciones</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Vehículo</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Precio</th>
                <th className="text-center px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Vistas</th>
                <th className="text-center px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(vehiculos ?? []).map((v: any) => (
                <tr key={v.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-white">{v.titulo}</p>
                    <p className="text-xs text-gray-500">{v.año} · {new Date(v.created_at).toLocaleDateString('es-AR')}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-[#FFC107]">
                    ${(v.precio / 1_000_000).toFixed(1)}M
                  </td>
                  <td className="px-5 py-3.5 text-center text-xs text-gray-400">{v.vistas ?? 0}</td>
                  <td className="px-5 py-3.5 text-center">
                    {v.vendido ? (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-500/10 text-gray-500">Vendido</span>
                    ) : v.activo ? (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">Activo</span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-red-500/10 text-red-400">Inactivo</span>
                    )}
                    {v.destacado && (
                      <span className="ml-1.5 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#FFC107]/15 text-[#FFC107]">★ Destacado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
