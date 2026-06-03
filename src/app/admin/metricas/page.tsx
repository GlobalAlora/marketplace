import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface TopVehiculo {
  id: string
  titulo: string
  marca: string
  modelo: string
  count: number
}

export default async function AdminMetricasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [
    { count: totalUsuarios },
    { count: vehiculosActivos },
    { count: totalWhatsapp },
    { data: topVistasRaw },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('activo', true).eq('vendido', false),
    supabase.from('metricas_vehiculos').select('*', { count: 'exact', head: true }).eq('tipo', 'whatsapp_click'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from('vehiculos').select('id, titulo, marca, modelo, año, vistas').order('vistas', { ascending: false }).limit(5) as any) as Promise<{ data: any[] | null }>,
  ])

  // Top 5 por WhatsApp via RPC
  const { data: topWhatsappRaw } = await supabase.rpc('admin_top_whatsapp', { n: 5 })

  const topVistas: TopVehiculo[] = (topVistasRaw ?? []).map((v: any) => ({
    id: v.id,
    titulo: v.titulo,
    marca: v.marca,
    modelo: v.modelo,
    count: v.vistas,
  }))

  const topWhatsapp: TopVehiculo[] = (topWhatsappRaw ?? []).map((v: any) => ({
    id: v.vehiculo_id,
    titulo: v.titulo,
    marca: v.marca,
    modelo: v.modelo,
    count: Number(v.clicks),
  }))

  const maxVistas = Math.max(...topVistas.map(v => v.count), 1)
  const maxWhatsapp = Math.max(...topWhatsapp.map(v => v.count), 1)

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Métricas</h1>
        <p className="text-sm text-gray-500 mt-1">Datos en tiempo real de Supabase</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="Usuarios registrados" value={totalUsuarios ?? 0} color="text-white" />
        <KpiCard label="Vehículos activos" value={vehiculosActivos ?? 0} color="text-emerald-400" />
        <KpiCard label="Clicks WhatsApp" value={totalWhatsapp ?? 0} color="text-[#FFC107]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 vistas */}
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Top 5 — Más vistas</h2>
          {topVistas.length === 0 ? (
            <p className="text-sm text-gray-600">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {topVistas.map((v, i) => (
                <div key={v.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300 truncate flex-1 mr-2">
                      <span className="text-gray-600 mr-1.5">#{i + 1}</span>
                      {v.marca} {v.modelo}
                    </span>
                    <span className="text-xs font-bold text-white shrink-0">{v.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#282F8F] rounded-full" style={{ width: `${Math.round((v.count / maxVistas) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top 5 WhatsApp */}
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Top 5 — Clicks WhatsApp</h2>
          {topWhatsapp.length === 0 ? (
            <p className="text-sm text-gray-600">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {topWhatsapp.map((v, i) => (
                <div key={v.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300 truncate flex-1 mr-2">
                      <span className="text-gray-600 mr-1.5">#{i + 1}</span>
                      {v.marca} {v.modelo}
                    </span>
                    <span className="text-xs font-bold text-[#FFC107] shrink-0">{v.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFC107] rounded-full" style={{ width: `${Math.round((v.count / maxWhatsapp) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
      <p className={`text-3xl font-extrabold ${color}`}>{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
