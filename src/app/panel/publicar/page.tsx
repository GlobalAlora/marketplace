import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PublicarForm from './PublicarForm'
import { getPlanLimits } from '@/lib/plan-config'

export default async function PublicarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const planLimits = await getPlanLimits()
  const limite = planLimits[profile?.role ?? 'particular'] ?? 3
  const { count } = await supabase
    .from('vehiculos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('vendido', false)

  const usadas = count ?? 0
  const canPublish = usadas < limite

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Publicar vehículo</h1>
        <p className="text-sm text-gray-500 mt-1">
          {canPublish
            ? `Usás ${usadas} de ${limite} publicaciones de tu plan`
            : `Límite alcanzado: ${usadas}/${limite} publicaciones`}
        </p>
      </div>

      {!canPublish ? (
        <div className="bg-[#1a1a2e] border border-[#FFC107]/30 rounded-2xl p-6 text-center">
          <p className="text-[#FFC107] font-semibold mb-2">Límite de plan alcanzado</p>
          <p className="text-sm text-gray-400">
            Pausá o eliminá una publicación existente para poder publicar una nueva,
            o actualizá tu plan.
          </p>
        </div>
      ) : (
        <PublicarForm userId={user.id} />
      )}
    </div>
  )
}
