'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function marcarPasswordCambiado(): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }
    const { error } = await supabase.from('profiles').update({ debe_cambiar_password: false }).eq('id', user.id)
    if (error) return { error: error.message }
    revalidatePath('/auth/primer-acceso')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error inesperado' }
  }
}

export async function aceptarTerminos(): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }
    const { error } = await supabase.from('profiles').update({ terminos_aceptados: true }).eq('id', user.id)
    if (error) return { error: error.message }
    revalidatePath('/auth/primer-acceso')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error inesperado' }
  }
}

export async function cambiarPasswordPrimerAcceso(newPassword: string): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    const adminClient = createAdminClient()
    const { error: authError } = await adminClient.auth.admin.updateUserById(user.id, { password: newPassword })
    if (authError) return { error: authError.message }

    const { error: profileError } = await supabase.from('profiles').update({ debe_cambiar_password: false }).eq('id', user.id)
    if (profileError) return { error: profileError.message }

    revalidatePath('/auth/primer-acceso')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al cambiar la contraseña' }
  }
}
