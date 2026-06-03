import { createClient } from './supabase/server'
import type { Banner } from '@/types'

export async function getBanners(
  posiciones: string[]
): Promise<Record<string, Banner | null>> {
  const supabase = await createClient()
  const result: Record<string, Banner | null> = {}
  posiciones.forEach(p => { result[p] = null })

  const { data } = await supabase
    .from('banners')
    .select('id, imagen_url, link_url, posicion, activo, created_at')
    .in('posicion', posiciones)
    .eq('activo', true)

  for (const b of data ?? []) {
    if (!result[b.posicion]) result[b.posicion] = b as Banner
  }
  return result
}
