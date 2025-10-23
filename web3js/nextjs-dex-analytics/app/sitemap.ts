import { getSolanaDexProtocols } from '@/lib/defillama-volumes'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/swap`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tokens`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dex-analytics`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.85,
    },
  ]

  try {
    const protocols = await getSolanaDexProtocols()
    const dynamicEntries: MetadataRoute.Sitemap = (protocols || [])
      .filter((p) => !!p.slug)
      .map((p) => ({
        url: `${baseUrl}/dex-analytics/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.7,
      }))

    return [...staticEntries, ...dynamicEntries]
  } catch {
    // If fetching fails, return static entries so sitemap still works
    return staticEntries
  }
}
