import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BannersClient from './BannersClient'

export default async function AdminBannersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: banners } = await supabase
    .from('banners')
    .select('id, imagen_url, link_url, posicion, activo, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Banners</h1>
        <p className="text-sm text-gray-500 mt-1">
          {banners?.length ?? 0} banners · {banners?.filter(b => b.activo).length ?? 0} activos
        </p>
      </div>
      <BannersClient banners={banners ?? []} />
    </div>
  )
}
