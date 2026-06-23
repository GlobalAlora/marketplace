'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') throw new Error('Sin permisos')
  return supabase
}

export async function toggleActivoVehiculo(id: string, activo: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('vehiculos').update({ activo, pausado_por_admin: !activo }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/')
}

export async function toggleDestacado(id: string, destacado: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('vehiculos').update({ destacado }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
}

export async function deleteVehiculoAdmin(id: string) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('vehiculos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
}

export async function updatePrecioVehiculo(id: string, precio: number) {
  if (!Number.isFinite(precio) || precio <= 0) throw new Error('Precio inválido')
  const supabase = await getAdminClient()
  const { error } = await supabase.from('vehiculos').update({ precio }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
}

export async function marcarVendido(id: string, vendido: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('vehiculos').update({ vendido }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
}
