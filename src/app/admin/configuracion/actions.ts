'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSiteConfig(data: Record<string, string>) {
  const supabase = createAdminClient()

  const updates = Object.entries(data).map(([key, value]) =>
    supabase
      .from('site_config')
      .update({ value })
      .eq('key', key)
  )

  await Promise.all(updates)

  revalidatePath('/')
  revalidatePath('/admin/configuracion')
}
