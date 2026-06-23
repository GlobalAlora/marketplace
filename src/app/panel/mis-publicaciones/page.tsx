import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MisPublicacionesClient from './MisPublicacionesClient'

interface Vehiculo {
  id: string
  titulo: string
  marca: string
  modelo: string
  año: number
  precio: number
  imagenes: string[]
  activo: boolean
  vendido: boolean
  created_at: string
  vistas: number
  pausado_por_admin: boolean
}

export default async function MisPublicacionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vehiculos } = await (supabase
    .from('vehiculos')
    .select('id, titulo, marca, modelo, año, precio, imagenes, activo, vendido, created_at, vistas, pausado_por_admin')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as any) as { data: Vehiculo[] | null }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Mis publicaciones</h1>
          <p className="text-sm text-gray-500 mt-1">{vehiculos?.length ?? 0} vehículos en total</p>
        </div>
        <Link
          href="/panel/publicar"
          className="flex items-center gap-2 bg-[#FFC107] hover:bg-[#e6ad00] text-[#0D0F14] text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Publicar nuevo
        </Link>
      </div>

      {!vehiculos?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-1">Todavía no publicaste ningún vehículo</p>
          <p className="text-sm text-gray-500 mb-6">Publicá tu primer auto y empezá a recibir consultas</p>
          <Link
            href="/panel/publicar"
            className="bg-[#FFC107] hover:bg-[#e6ad00] text-[#0D0F14] text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            Publicar ahora
          </Link>
        </div>
      ) : (
        <MisPublicacionesClient vehiculos={vehiculos} />
      )}
    </div>
  )
}
