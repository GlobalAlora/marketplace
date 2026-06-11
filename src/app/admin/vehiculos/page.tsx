import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VehiculosAdminClient from './VehiculosAdminClient'

export const dynamic = 'force-dynamic'

interface VehiculoAdmin {
  id: string
  titulo: string
  marca: string
  modelo: string
  año: number
  precio: number
  activo: boolean
  destacado: boolean
  vendido: boolean
  vistas: number
  imagenes: string[]
  created_at: string
  seller_nombre: string
  seller_apellido: string
  seller_role: string
}

export default async function AdminVehiculosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: raw } = await (supabase
    .from('vehiculos')
    .select('*, profiles!vehiculos_user_id_fkey(nombre, apellido, role)')
    .order('created_at', { ascending: false }) as any) as { data: any[] | null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vehiculos: VehiculoAdmin[] = (raw ?? []).map((v: any) => ({
    id: v.id,
    titulo: v.titulo,
    marca: v.marca,
    modelo: v.modelo,
    año: v.año,
    precio: v.precio,
    activo: v.activo,
    destacado: v.destacado,
    vendido: v.vendido,
    vistas: v.vistas,
    imagenes: v.imagenes ?? [],
    created_at: v.created_at,
    seller_nombre: v.profiles?.nombre ?? '',
    seller_apellido: v.profiles?.apellido ?? '',
    seller_role: v.profiles?.role ?? '',
  }))

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Vehículos</h1>
        <p className="text-sm text-gray-500 mt-1">{vehiculos.length} publicaciones en total</p>
      </div>
      <VehiculosAdminClient vehiculos={vehiculos} />
    </div>
  )
}
