import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://marketplace-sigma-teal.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                 lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE_URL}/vehiculos`,  lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE_URL}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/auth/registro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    // Usar cliente directo (sin cookies) para sitemap — solo lee datos públicos
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!
    )

    const { data } = await supabase
      .from('vehiculos')
      .select('id, updated_at')
      .eq('activo', true)
      .eq('vendido', false)

    const vehiculoRoutes: MetadataRoute.Sitemap = (data ?? []).map(v => ({
      url: `${BASE_URL}/vehiculos/${v.id}`,
      lastModified: new Date(v.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...vehiculoRoutes]
  } catch {
    return staticRoutes
  }
}
