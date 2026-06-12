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

export function resolveLimit(
  profile: { role: string; max_publicaciones_override?: number | null },
  planLimits: Record<string, number>
): number {
  if (profile.max_publicaciones_override != null) return profile.max_publicaciones_override
  return planLimits[profile.role] ?? PLAN_FALLBACKS[profile.role] ?? 3
}
