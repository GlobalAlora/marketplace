import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPlanesHome } from '@/lib/planes-home'
import PlanesHomeForm from './PlanesHomeForm'

export default async function PlanesHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const planes = await getPlanesHome()

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Planes de la home</h1>
        <p className="text-sm text-gray-500 mt-1">
          Contenido de la sección &quot;Planes y precios&quot; que se muestra en la home. Distinto de
          /admin/planes, que define los límites técnicos (publicaciones y destacados) por rol.
        </p>
      </div>

      {planes.length === 0 ? (
        <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-8 text-center">
          <p className="text-sm text-gray-500">
            Todavía no hay planes cargados en la tabla planes_home. Corré la migración
            supabase_migration_planes_home.sql para crear los 3 planes iniciales.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {planes.map(plan => (
            <PlanesHomeForm key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  )
}
