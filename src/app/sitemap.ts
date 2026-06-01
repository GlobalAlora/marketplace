import type { MetadataRoute } from 'next'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

const BASE_URL = 'https://marketplace-sigma-teal.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/vehiculos`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/registro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Rutas dinámicas de vehículos
  // TODO (Supabase): reemplazar MOCK_VEHICULOS por query a Supabase
  const vehiculoRoutes: MetadataRoute.Sitemap = MOCK_VEHICULOS
    .filter(v => v.activo && !v.vendido)
    .map(v => ({
      url: `${BASE_URL}/vehiculos/${v.id}`,
      lastModified: new Date(v.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticRoutes, ...vehiculoRoutes]
}
