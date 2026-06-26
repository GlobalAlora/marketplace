import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDestacadosLimits, DESTACADOS_FALLBACKS } from '@/lib/plan-config'
import AgenciaDetalleClient from './AgenciaDetalleClient'

interface PageProps {
  params: Promise<{ id: string }>
}

const PLAN_LABEL: Record<string, string> = {
  agencia_basica: 'Agencia PRIME',
  agencia_premium: 'Agencia DUX',
}

export default async function AgenciaDetallePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: agencia } = await supabase
    .from('profiles')
    .select('id, nombre, apellido, email, telefono, role, avatar_url, nombre_agencia, verificado, activo, created_at, limite_destacados_custom')
    .eq('id', id)
    .in('role', ['agencia_basica', 'agencia_premium'])
    .maybeSingle()

  if (!agencia) notFound()

  const [{ count: vehiculosCount }, { count: destacadosCount }, destacadosLimits] = await Promise.all([
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('user_id', id).eq('vendido', false),
    supabase.from('vehiculos').select('*', { count: 'exact', head: true }).eq('user_id', id).eq('destacado', true).eq('activo', true).eq('vendido', false),
    getDestacadosLimits(),
  ])

  const limitePlan = destacadosLimits[agencia.role] ?? DESTACADOS_FALLBACKS[agencia.role] ?? 0

  return (
    <div className="p-8 max-w-[800px]">
      <Link href="/admin/agencias" className="text-sm text-gray-500 hover:text-white transition-colors">← Agencias</Link>

      <div className="flex items-center gap-4 mt-4 mb-7">
        <div className="w-14 h-14 rounded-xl bg-[#282F8F]/20 border border-[#282F8F]/30 flex items-center justify-center shrink-0 overflow-hidden">
          {agencia.avatar_url
            ? <img src={agencia.avatar_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-lg font-bold text-[#FFC107]">{(agencia.nombre_agencia ?? agencia.nombre).charAt(0).toUpperCase()}</span>
          }
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{agencia.nombre_agencia ?? `${agencia.nombre} ${agencia.apellido}`}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{PLAN_LABEL[agencia.role] ?? agencia.role} · {agencia.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <p className="text-2xl font-extrabold text-white">{vehiculosCount ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Vehículos publicados</p>
        </div>
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-5">
          <p className="text-2xl font-extrabold text-[#FFC107]">{destacadosCount ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Destacados activos</p>
        </div>
      </div>

      <AgenciaDetalleClient
        agenciaId={agencia.id}
        limitePlan={limitePlan}
        limiteCustom={agencia.limite_destacados_custom}
      />
    </div>
  )
}
