'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type Role = 'particular' | 'agencia_basica' | 'agencia_premium' | 'admin'

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

export async function updateRole(userId: string, role: Role) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/usuarios')
}

export async function toggleVerificado(userId: string, verificado: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ verificado })
    .eq('id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/usuarios')
}

export async function toggleActivo(userId: string, activo: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ activo })
    .eq('id', userId)
  if (error) throw new Error(error.message)

  // Al suspender un usuario, pausamos también sus publicaciones activas
  // (marcadas como pausado_por_admin para que no las pueda reactivar él
  // mismo). Al reactivar el usuario NO se reactivan automáticamente: el
  // admin debe revisarlas una por una desde /admin/vehiculos.
  if (!activo) {
    const { error: vehiculosError } = await supabase
      .from('vehiculos')
      .update({ activo: false, pausado_por_admin: true })
      .eq('user_id', userId)
      .eq('activo', true)
      .eq('vendido', false)
    if (vehiculosError) throw new Error(vehiculosError.message)
  }

  revalidatePath('/admin/usuarios')
  revalidatePath(`/admin/usuarios/${userId}`)
  revalidatePath('/admin/vehiculos')
  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/panel')
  revalidatePath('/')
}

export async function setLimiteOverride(userId: string, value: number | null) {
  const supabase = await getAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ max_publicaciones_override: value })
    .eq('id', userId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/usuarios/${userId}`)
}
