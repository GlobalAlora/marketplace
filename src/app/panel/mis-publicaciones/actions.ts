'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getDestacadosLimits } from '@/lib/plan-config'

async function getAuthClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  return { supabase, userId: user.id }
}

export async function toggleActivo(vehiculoId: string, activo: boolean) {
  const { supabase, userId } = await getAuthClient()

  if (activo) {
    const { data: row } = await supabase
      .from('vehiculos')
      .select('pausado_por_admin')
      .eq('id', vehiculoId)
      .eq('user_id', userId)
      .single()
    if (row?.pausado_por_admin) {
      throw new Error('Este vehículo fue pausado por AUTODUX. Contactanos para reactivarlo.')
    }
  }

  const { error } = await supabase
    .from('vehiculos')
    .update({ activo })
    .eq('id', vehiculoId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/panel')
}

export async function toggleDestacado(vehiculoId: string, destacado: boolean) {
  const { supabase, userId } = await getAuthClient()

  if (destacado) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    const destacadosLimits = await getDestacadosLimits()
    const limite = destacadosLimits[profile?.role ?? 'particular'] ?? 0

    const { count } = await supabase
      .from('vehiculos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('destacado', true)
      .eq('activo', true)
      .eq('vendido', false)

    if ((count ?? 0) >= limite) {
      throw new Error(
        limite === 0
          ? 'Tu plan no incluye publicaciones destacadas. Actualizá tu plan para destacar vehículos.'
          : `Alcanzaste el límite de ${limite} destacado${limite !== 1 ? 's' : ''} de tu plan.`
      )
    }
  }

  const { error } = await supabase
    .from('vehiculos')
    .update({ destacado })
    .eq('id', vehiculoId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/')
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

export async function reactivarVehiculo(vehiculoId: string) {
  const { supabase, userId } = await getAuthClient()
  const { error } = await supabase
    .from('vehiculos')
    .update({ vendido: false, activo: true })
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
