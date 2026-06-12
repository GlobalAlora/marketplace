import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getPlanLimits, resolveLimit } from '@/lib/plan-config'

export default async function PanelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, role, max_publicaciones_override')
    .eq('id', user.id)
    .single()

  const [
    { count: activas },
    { count: pausadas },
    { count: vendidas },
    { count: total },
  ] = await Promise.all([
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('activo', true).eq('vendido', false),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('activo', false).eq('vendido', false),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('vendido', true),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('vendido', false),
  ])

  const planLimits = await getPlanLimits()
  const role = profile?.role ?? 'particular'
  const limite = resolveLimit(profile ?? { role }, planLimits)
  const usadas = total ?? 0
  const pct = Math.min(100, Math.round((usadas / limite) * 100))
  const isAgencia = role === 'agencia_basica' || role === 'agencia_premium'

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">
          Hola, {profile?.nombre} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenido a tu panel de AUTODUX</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Activas" value={activas ?? 0} color="text-emerald-400" />
        <StatCard label="Pausadas" value={pausadas ?? 0} color="text-[#FFC107]" />
        <StatCard label="Vendidas" value={vendidas ?? 0} color="text-gray-400" />
      </div>

      {/* Plan usage */}
      <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Publicaciones del plan</p>
          <span className={`text-sm font-bold ${pct >= 80 ? 'text-[#FFC107]' : 'text-gray-400'}`}>
            {usadas} / {limite}
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-[#FFC107]' : 'bg-[#282F8F]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct >= 80 && (
          <p className="text-[11px] text-[#FFC107] mt-2">
            Estás cerca del límite de tu plan.{' '}
            {role === 'particular' && 'Considerá actualizar a Agencia PRIME.'}
            {role === 'agencia_basica' && 'Considerá actualizar a Agencia DUX.'}
          </p>
        )}
      </div>

      {/* Accesos rápidos */}
      <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLink
            href="/panel/publicar"
            label="Publicar vehículo"
            desc={usadas >= limite ? 'Límite de plan alcanzado' : `${limite - usadas} publicaciones disponibles`}
            disabled={usadas >= limite}
          />
          <QuickLink href="/panel/mis-publicaciones" label="Ver mis publicaciones" desc={`${activas ?? 0} activas ahora`} />
          <QuickLink href="/panel/perfil" label={isAgencia ? 'Perfil de agencia' : 'Mi perfil'} desc="Editá tus datos" />
          {isAgencia && (
            <QuickLink href="/panel/metricas" label="Métricas" desc="Visualizaciones y clicks" />
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function QuickLink({ href, label, desc, disabled }: { href: string; label: string; desc: string; disabled?: boolean }) {
  return (
    <Link
      href={disabled ? '#' : href}
      className={`block border rounded-xl p-4 transition-colors group ${
        disabled
          ? 'bg-white/2 border-white/5 cursor-not-allowed opacity-50'
          : 'bg-white/3 hover:bg-white/6 border-white/8'
      }`}
    >
      <p className="text-sm font-semibold text-white group-hover:text-[#FFC107] transition-colors">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </Link>
  )
}
