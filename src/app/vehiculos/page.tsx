import { Suspense } from 'react'
import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'
import ListadoVehiculos from './ListadoVehiculos'
import { createClient } from '@/lib/supabase/server'
import { getBanners } from '@/lib/banners'
import type { Vehiculo } from '@/types'

export const metadata: Metadata = {
  title: 'Todos los vehículos — AUTODUX | Comodoro Rivadavia',
  description: 'Explorá todos los autos disponibles en Comodoro Rivadavia y la región patagónica.',
}

export const revalidate = 60

export default async function VehiculosPage() {
  const supabase = await createClient()

  const [{ data: raw }, banners] = await Promise.all([
    supabase
      .from('vehiculos')
      .select('*, profiles!vehiculos_user_id_fkey(id,nombre,apellido,telefono,role,nombre_agencia,verificado,activo)')
      .eq('activo', true)
      .eq('vendido', false)
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false }),

    getBanners(['vehiculos_top', 'vehiculos_mid', 'sidebar_derecho_1', 'sidebar_derecho_2', 'sidebar_derecho_3']),
  ])

  const vehiculos = (raw ?? []) as unknown as Vehiculo[]

  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen bg-[#071526]" />}>
        <ListadoVehiculos vehiculos={vehiculos} banners={banners} />
      </Suspense>
    </MainLayout>
  )
}
