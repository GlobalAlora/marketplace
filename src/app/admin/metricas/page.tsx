import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MetricasChart from './MetricasChart'
import ExportarExcelButton from './ExportarExcelButton'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

interface TopItem {
  id: string
  marca: string
  modelo: string
  count: number
}

interface TopAgencia {
  id: string
  nombre: string
  avatar_url: string | null
  role: string
  count: number
}

interface DayData {
  fecha: string
  registros: number
}

export default async function AdminMetricasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const now = new Date()
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0)
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const startOf30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    { count: totalUsuarios },
    { count: usuariosHoy },
    { count: usuariosSemana },
    { count: usuariosMes },
    { count: vehiculosActivos },
    { count: vehiculosPausados },
    { count: vehiculosVendidos },
    { count: totalWhatsapp },
    { count: totalVistas },
    { data: perfiles30dRaw },
    { data: agenciasRaw },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday.toISOString()),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek.toISOString()),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('activo', true).eq('vendido', false),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('activo', false).eq('vendido', false),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('vendido', true),
    supabase.from('metricas_vehiculos').select('*', { count: 'exact', head: true }).eq('tipo', 'whatsapp_click'),
    supabase.from('metricas_vehiculos').select('*', { count: 'exact', head: true }).eq('tipo', 'view'),
    supabase.from('profiles').select('created_at').gte('created_at', startOf30d.toISOString()),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from('profiles').select('id, nombre, nombre_agencia, avatar_url, role, vehiculos!vehiculos_user_id_fkey(count)').in('role', ['agencia_basica', 'agencia_premium']) as any) as Promise<{ data: AnyRecord[] | null }>,
  ])

  // Top 5 por vistas y por WhatsApp desde metricas_vehiculos
  const [{ data: topVistasRaw }, { data: topWhatsappRaw }] = await Promise.all([
    supabase.rpc('admin_top_views', { n: 5 }),
    supabase.rpc('admin_top_whatsapp', { n: 5 }),
  ])

  const topVistas: TopItem[] = (topVistasRaw ?? []).map((v: AnyRecord) => ({
    id: v.vehiculo_id, marca: v.marca, modelo: v.modelo, count: Number(v.views ?? 0),
  }))

  const topWhatsapp: TopItem[] = (topWhatsappRaw ?? []).map((v: AnyRecord) => ({
    id: v.vehiculo_id, marca: v.marca, modelo: v.modelo, count: Number(v.clicks ?? 0),
  }))

  // Top 5 agencias por vehículos publicados
  const topAgencias: TopAgencia[] = (agenciasRaw ?? [])
    .map((a: AnyRecord) => ({
      id: a.id,
      nombre: a.nombre_agencia || a.nombre || 'Sin nombre',
      avatar_url: a.avatar_url ?? null,
      role: a.role,
      count: Array.isArray(a.vehiculos) ? (a.vehiculos[0]?.count ?? 0) : 0,
    }))
    .sort((a: TopAgencia, b: TopAgencia) => b.count - a.count)
    .slice(0, 5)

  // Agrupar por día para el gráfico (registros de usuarios)
  const dayKeys: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dayKeys.push(d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }))
  }
  const dayMap = new Map<string, number>(dayKeys.map(k => [k, 0]))
  for (const p of (perfiles30dRaw ?? [])) {
    const d = new Date(p.created_at)
    const key = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
  }
  const chartData: DayData[] = Array.from(dayMap.entries()).map(([fecha, registros]) => ({ fecha, registros }))

  // ── Datos extra para la exportación a Excel ────────────────────────────────
  const topVistasIds = topVistas.map(v => v.id)
  const topAgenciasIds = topAgencias.map(a => a.id)

  const [{ data: clicksTopVistasRaw }, { data: vendidosTopAgenciasRaw }, { data: metricas30dRaw }] = await Promise.all([
    supabase.from('metricas_vehiculos').select('vehiculo_id').in('vehiculo_id', topVistasIds.length ? topVistasIds : ['']).eq('tipo', 'whatsapp_click'),
    supabase.from('vehiculos').select('user_id').eq('vendido', true).in('user_id', topAgenciasIds.length ? topAgenciasIds : ['']),
    supabase.from('metricas_vehiculos').select('created_at, tipo').gte('created_at', startOf30d.toISOString()),
  ])

  const clicksPorVehiculo = new Map<string, number>()
  for (const c of clicksTopVistasRaw ?? []) {
    clicksPorVehiculo.set(c.vehiculo_id, (clicksPorVehiculo.get(c.vehiculo_id) ?? 0) + 1)
  }

  const vendidosPorAgencia = new Map<string, number>()
  for (const v of vendidosTopAgenciasRaw ?? []) {
    vendidosPorAgencia.set(v.user_id, (vendidosPorAgencia.get(v.user_id) ?? 0) + 1)
  }

  const vistasPorDia = new Map<string, number>(dayKeys.map(k => [k, 0]))
  const whatsappPorDia = new Map<string, number>(dayKeys.map(k => [k, 0]))
  for (const m of metricas30dRaw ?? []) {
    const key = new Date(m.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    if (m.tipo === 'view' && vistasPorDia.has(key)) vistasPorDia.set(key, (vistasPorDia.get(key) ?? 0) + 1)
    if (m.tipo === 'whatsapp_click' && whatsappPorDia.has(key)) whatsappPorDia.set(key, (whatsappPorDia.get(key) ?? 0) + 1)
  }

  const resumenExport = {
    totalUsuarios: totalUsuarios ?? 0,
    usuariosHoy: usuariosHoy ?? 0,
    usuariosSemana: usuariosSemana ?? 0,
    usuariosMes: usuariosMes ?? 0,
    vehiculosActivos: vehiculosActivos ?? 0,
    vehiculosPausados: vehiculosPausados ?? 0,
    vehiculosVendidos: vehiculosVendidos ?? 0,
    totalVistas: totalVistas ?? 0,
    totalWhatsapp: totalWhatsapp ?? 0,
  }

  const topVehiculosExport = topVistas.map(v => ({
    titulo: `${v.marca} ${v.modelo}`,
    marca: v.marca,
    modelo: v.modelo,
    views: v.count,
    clicks: clicksPorVehiculo.get(v.id) ?? 0,
  }))

  const topAgenciasExport = topAgencias.map(a => ({
    nombre: a.nombre,
    vehiculosPublicados: a.count,
    vehiculosVendidos: vendidosPorAgencia.get(a.id) ?? 0,
  }))

  const actividadExport = dayKeys.map(fecha => ({
    fecha,
    nuevosUsuarios: dayMap.get(fecha) ?? 0,
    vistas: vistasPorDia.get(fecha) ?? 0,
    whatsapp: whatsappPorDia.get(fecha) ?? 0,
  }))

  const maxVistas = Math.max(...topVistas.map(v => v.count), 1)
  const maxWhatsapp = Math.max(...topWhatsapp.map(v => v.count), 1)
  const maxAgencia = Math.max(...topAgencias.map(a => a.count), 1)

  const PLAN_LABEL: Record<string, string> = { agencia_basica: 'PRIME', agencia_premium: 'DUX' }
  const PLAN_COLOR: Record<string, string> = {
    agencia_basica: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    agencia_premium: 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/20',
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Métricas</h1>
          <p className="text-sm text-gray-500 mt-1">Datos en tiempo real de Supabase</p>
        </div>
        <ExportarExcelButton
          resumen={resumenExport}
          topVehiculos={topVehiculosExport}
          topAgencias={topAgenciasExport}
          actividad={actividadExport}
        />
      </div>

      {/* KPIs fila 1: Usuarios */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Usuarios registrados</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Total" value={totalUsuarios ?? 0} color="text-white" />
          <KpiCard label="Hoy" value={usuariosHoy ?? 0} color="text-[#FFC107]" suffix="nuevo/s" />
          <KpiCard label="Última semana" value={usuariosSemana ?? 0} color="text-[#FFC107]" />
          <KpiCard label="Último mes" value={usuariosMes ?? 0} color="text-[#FFC107]" />
        </div>
      </div>

      {/* KPIs fila 2: Vehículos + WhatsApp */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-2 mt-4">Vehículos</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Activos" value={vehiculosActivos ?? 0} color="text-emerald-400" />
          <KpiCard label="Pausados" value={vehiculosPausados ?? 0} color="text-gray-400" />
          <KpiCard label="Vendidos" value={vehiculosVendidos ?? 0} color="text-blue-400" />
          <KpiCard label="Clicks WhatsApp" value={totalWhatsapp ?? 0} color="text-green-400" />
        </div>
      </div>

      {/* Gráfico de registros 30 días */}
      <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-bold text-white mb-4">Registros últimos 30 días</h2>
        <MetricasChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top 5 vistas */}
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Top 5 — Más vistas</h2>
          <BarList items={topVistas} max={maxVistas} barColor="bg-[#282F8F]" valueColor="text-white" />
        </div>

        {/* Top 5 WhatsApp */}
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Top 5 — Clicks WhatsApp</h2>
          <BarList items={topWhatsapp} max={maxWhatsapp} barColor="bg-[#FFC107]" valueColor="text-[#FFC107]" />
        </div>

        {/* Top 5 agencias */}
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Top 5 — Agencias por autos</h2>
          {topAgencias.length === 0 ? (
            <p className="text-sm text-gray-600">Sin agencias registradas</p>
          ) : (
            <div className="space-y-3">
              {topAgencias.map((a, i) => (
                <div key={a.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                      <span className="text-gray-600 text-xs shrink-0">#{i + 1}</span>
                      <div className="w-5 h-5 rounded-full bg-[#282F8F]/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {a.avatar_url
                          ? <img src={a.avatar_url} alt="" className="w-full h-full object-cover" />
                          : <span className="text-[9px] font-bold text-[#FFC107]">{a.nombre.charAt(0)}</span>
                        }
                      </div>
                      <span className="text-xs text-gray-300 truncate">{a.nombre}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${PLAN_COLOR[a.role] ?? ''}`}>
                        {PLAN_LABEL[a.role] ?? a.role}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 shrink-0">{a.count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((a.count / maxAgencia) * 100)}%` }} />
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

function KpiCard({ label, value, color, suffix }: { label: string; value: number; color: string; suffix?: string }) {
  return (
    <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-4">
      <p className={`text-2xl font-extrabold tabular-nums ${color}`}>{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">{label}{suffix && value === 1 ? ` (${suffix})` : ''}</p>
    </div>
  )
}

function BarList({ items, max, barColor, valueColor }: { items: TopItem[]; max: number; barColor: string; valueColor: string }) {
  if (items.length === 0) return <p className="text-sm text-gray-600">Sin datos aún</p>
  return (
    <div className="space-y-3">
      {items.map((v, i) => (
        <div key={v.id}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-300 truncate flex-1 mr-2">
              <span className="text-gray-600 mr-1.5">#{i + 1}</span>
              {v.marca} {v.modelo}
            </span>
            <span className={`text-xs font-bold shrink-0 ${valueColor}`}>{v.count.toLocaleString()}</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.round((v.count / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
