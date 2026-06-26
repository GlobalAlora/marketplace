import { createClient } from '@/lib/supabase/server'

export interface PlanHome {
  id: string
  orden: number
  nombre: string
  subtitulo: string
  precio: string
  precio_sub: string
  destacado: boolean
  features: string[]
  cta_label: string
  cta_href: string
  cta_externo: boolean
}

export async function getPlanesHome(): Promise<PlanHome[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('planes_home')
    .select('id, orden, nombre, subtitulo, precio, precio_sub, destacado, features, cta_label, cta_href, cta_externo')
    .order('orden', { ascending: true })
  return data ?? []
}
