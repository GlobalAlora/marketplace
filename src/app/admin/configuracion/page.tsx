import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSiteConfig } from '@/lib/site-config'
import ConfiguracionClient from './ConfiguracionClient'

export const dynamic = 'force-dynamic'

export default async function AdminConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const config = await getSiteConfig()

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Configuración del sitio</h1>
        <p className="text-sm text-gray-500 mt-1">
          Editá los textos e imágenes de la home. Los cambios se reflejan al instante.
        </p>
      </div>
      <ConfiguracionClient config={config} />
    </div>
  )
}
