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

export async function updatePlanHome(id: string, formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await getAdminClient()

    const nombre      = formData.get('nombre') as string
    const subtitulo    = formData.get('subtitulo') as string
    const precio       = formData.get('precio') as string
    const precio_sub   = formData.get('precio_sub') as string
    const destacado     = formData.get('destacado') === 'on'
    const cta_label     = formData.get('cta_label') as string
    const cta_href      = formData.get('cta_href') as string
    const cta_externo   = formData.get('cta_externo') === 'on'
    const featuresRaw   = formData.get('features') as string
    const features      = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean)

    if (!nombre.trim()) return { error: 'El nombre del plan es obligatorio' }

    const { error } = await supabase
      .from('planes_home')
      .update({ nombre, subtitulo, precio, precio_sub, destacado, cta_label, cta_href, cta_externo, features, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/planes-home')
    revalidatePath('/')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error inesperado al guardar' }
  }
}
