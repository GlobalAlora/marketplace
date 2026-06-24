'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updatePlanLimits(formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') return { error: 'Sin permisos' }

    const updates = [
      { role: 'particular',      max_publicaciones: parseInt(formData.get('particular') as string), limite_destacados: parseInt(formData.get('destacados_particular') as string) },
      { role: 'agencia_basica',  max_publicaciones: parseInt(formData.get('agencia_basica') as string), limite_destacados: parseInt(formData.get('destacados_agencia_basica') as string) },
      { role: 'agencia_premium', max_publicaciones: parseInt(formData.get('agencia_premium') as string), limite_destacados: parseInt(formData.get('destacados_agencia_premium') as string) },
    ]

    for (const u of updates) {
      if (!u.max_publicaciones || u.max_publicaciones < 1) {
        return { error: `Valor inválido para ${u.role}` }
      }
      if (!Number.isFinite(u.limite_destacados) || u.limite_destacados < 0) {
        return { error: `Límite de destacados inválido para ${u.role}` }
      }
      const { error } = await supabase
        .from('plan_config')
        .update({ max_publicaciones: u.max_publicaciones, limite_destacados: u.limite_destacados, updated_at: new Date().toISOString() })
        .eq('role', u.role)
      if (error) return { error: error.message }
    }

    revalidatePath('/admin/planes')
    revalidatePath('/panel')
    revalidatePath('/panel/publicar')
    revalidatePath('/panel/mis-publicaciones')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error inesperado al guardar' }
  }
}
