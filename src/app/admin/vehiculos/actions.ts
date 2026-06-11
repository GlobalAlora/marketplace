'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Sin permisos')
}

export async function toggleActivoVehiculo(id: string, activo: boolean) {
  await assertAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('vehiculos').update({ activo }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
}

export async function toggleDestacado(id: string, destacado: boolean) {
  await assertAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('vehiculos').update({ destacado }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
}

export async function deleteVehiculoAdmin(id: string) {
  await assertAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('vehiculos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vehiculos')
}
