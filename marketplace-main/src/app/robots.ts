import type { MetadataRoute } from 'next'

const BASE_URL = 'https://autodux.com.ar'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/panel/', '/api/'],
      },
      // AI crawlers — explicit allow for GEO/AE indexing
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'anthropic-ai',   allow: '/' },
      { userAgent: 'ClaudeBot',      allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' },
      { userAgent: 'cohere-ai',      allow: '/' },
      { userAgent: 'Amazonbot',      allow: '/' },
      { userAgent: 'AI2Bot',         allow: '/' },
      { userAgent: 'Googlebot-Extended', allow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
