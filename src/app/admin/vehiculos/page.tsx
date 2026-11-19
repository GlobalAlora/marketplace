import { createClient, createAdminClient } from '@/lib/supabase/server'
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
  moneda: string
  activo: boolean
  destacado: boolean
  vendido: boolean
  vistas: number
  imagenes: string[]
  created_at: string
  seller_nombre: string
  seller_apellido: string
  seller_role: string
  seller_telefono: string
  pausado_por_admin: boolean
  tipo_vehiculo: string
  condicion: string
  ciudad: string
  provincia: string
  kilometraje: number
  whatsapp_clicks: number
}

export default async function AdminVehiculosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminClient = createAdminClient()

  const [{ data: raw }, { data: clicksData }] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase
      .from('vehiculos')
      .select('*, profiles!vehiculos_user_id_fkey(nombre, apellido, role, telefono)')
      .order('created_at', { ascending: false }) as any) as Promise<{ data: any[] | null }>,
    adminClient
      .from('metricas_vehiculos')
      .select('vehiculo_id')
      .eq('tipo', 'whatsapp_click')
      .limit(50000),
  ])

  const clicksMap = new Map<string, number>()
  for (const c of (clicksData ?? [])) {
    clicksMap.set(c.vehiculo_id, (clicksMap.get(c.vehiculo_id) ?? 0) + 1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vehiculos: VehiculoAdmin[] = (raw ?? []).map((v: any) => ({
    id: v.id,
    titulo: v.titulo,
    marca: v.marca,
    modelo: v.modelo,
    año: v.año,
    precio: v.precio,
    moneda: v.moneda ?? 'ARS',
    activo: v.activo,
    destacado: v.destacado,
    vendido: v.vendido,
    vistas: v.vistas,
    imagenes: v.imagenes ?? [],
    created_at: v.created_at,
    seller_nombre: v.profiles?.nombre ?? '',
    seller_apellido: v.profiles?.apellido ?? '',
    seller_role: v.profiles?.role ?? '',
    seller_telefono: v.profiles?.telefono ?? '',
    pausado_por_admin: v.pausado_por_admin ?? false,
    tipo_vehiculo: v.tipo_vehiculo ?? '',
    condicion: v.condicion ?? '',
    ciudad: v.ciudad ?? '',
    provincia: v.provincia ?? '',
    kilometraje: v.kilometraje ?? 0,
    whatsapp_clicks: clicksMap.get(v.id) ?? 0,
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
