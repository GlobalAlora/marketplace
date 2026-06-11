'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAuthClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  return { supabase, userId: user.id }
}

export async function toggleActivo(vehiculoId: string, activo: boolean) {
  const { supabase, userId } = await getAuthClient()
  const { error } = await supabase
    .from('vehiculos')
    .update({ activo })
    .eq('id', vehiculoId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/panel')
}

export async function marcarVendido(vehiculoId: string) {
  const { supabase, userId } = await getAuthClient()
  const { error } = await supabase
    .from('vehiculos')
    .update({ vendido: true, activo: false })
    .eq('id', vehiculoId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/panel')
}

export async function deleteVehiculo(vehiculoId: string) {
  const { supabase, userId } = await getAuthClient()
  const { error } = await supabase
    .from('vehiculos')
    .delete()
    .eq('id', vehiculoId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/panel')
}
