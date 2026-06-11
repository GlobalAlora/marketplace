import { createClient } from './supabase/server'

export type SiteConfig = Record<string, string>

export async function getSiteConfig(): Promise<SiteConfig> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_config').select('key, value')
  const config: SiteConfig = {}
  for (const row of data ?? []) {
    config[row.key] = row.value
  }
  return config
}
