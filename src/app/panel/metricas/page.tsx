import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface VehiculoMinimal {
  id: string
  titulo: string
  marca: string
  modelo: string
  año: number
  vistas: number
}

export default async function MetricasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'agencia_basica' && profile?.role !== 'agencia_premium') {
    redirect('/panel')
  }

  // Fetch user's vehicles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vehiculos } = await (supabase
    .from('vehiculos')
    .select('id, titulo, marca, modelo, año, vistas')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as any) as { data: VehiculoMinimal[] | null }

  const vehiculoIds = vehiculos?.map(v => v.id) ?? []

  // Fetch metrics for user's vehicles
  const { data: metricas } = vehiculoIds.length
    ? await supabase
        .from('metricas_vehiculos')
        .select('vehiculo_id, tipo')
        .in('vehiculo_id', vehiculoIds)
    : { data: [] }

  // Aggregate by vehicle + tipo
  const counts: Record<string, { views: number; whatsapp: number }> = {}
  for (const m of metricas ?? []) {
    if (!counts[m.vehiculo_id]) counts[m.vehiculo_id] = { views: 0, whatsapp: 0 }
    if (m.tipo === 'view') counts[m.vehiculo_id].views++
    else if (m.tipo === 'whatsapp_click') counts[m.vehiculo_id].whatsapp++
  }

  const totalViews    = Object.values(counts).reduce((a, c) => a + c.views, 0)
  const totalWhatsapp = Object.values(counts).reduce((a, c) => a + c.whatsapp, 0)
  const maxViews      = Math.max(...(vehiculos ?? []).map(v => counts[v.id]?.views ?? 0), 1)

  const isPremium = profile?.role === 'agencia_premium'

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Métricas</h1>
        <p className="text-sm text-gray-500 mt-1">Rendimiento de tus publicaciones</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <p className="text-3xl font-extrabold text-white">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Visualizaciones totales</p>
        </div>
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <p className="text-3xl font-extrabold text-[#FFC107]">{totalWhatsapp.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Clicks en WhatsApp</p>
        </div>
      </div>

      {/* Per-vehicle breakdown */}
      {!vehiculos?.length ? (
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-8 text-center">
          <p className="text-gray-500 text-sm">Publicá vehículos para empezar a ver métricas</p>
        </div>
      ) : (
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-bold text-white">Por publicación</h2>
          </div>
          <div className="divide-y divide-white/5">
            {vehiculos.map(v => {
              const m = counts[v.id] ?? { views: 0, whatsapp: 0 }
              const barPct = Math.round((m.views / maxViews) * 100)
              return (
                <div key={v.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm font-semibold text-white">{v.marca} {v.modelo} {v.año}</p>
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div>
                        <p className="text-sm font-bold text-white">{m.views.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-600">vistas</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#FFC107]">{m.whatsapp.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-600">WhatsApp</p>
                      </div>
                    </div>
                  </div>

                  {/* Bar chart — views */}
                  {isPremium && (
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#282F8F] rounded-full transition-all"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!isPremium && (
        <p className="text-xs text-gray-600 mt-4 text-center">
          Actualizá a Agencia DUX para ver el gráfico de rendimiento completo.
        </p>
      )}
    </div>
  )
}
