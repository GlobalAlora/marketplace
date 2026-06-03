import { createClient } from '@/lib/supabase/server'

export const PLAN_FALLBACKS: Record<string, number> = {
  particular:      3,
  agencia_basica:  10,
  agencia_premium: 30,
}

export async function getPlanLimits(): Promise<Record<string, number>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('plan_config')
    .select('role, max_publicaciones')
  if (!data?.length) return PLAN_FALLBACKS
  return Object.fromEntries(data.map(r => [r.role, r.max_publicaciones]))
}
