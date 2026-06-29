'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSiteConfig(data: Record<string, string>): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Sin permisos' }

  for (const [key, value] of Object.entries(data)) {
    const { error } = await supabase
      .from('site_config')
      .upsert({ key, value }, { onConflict: 'key' })
    if (error) return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/configuracion')
  return {}
}
