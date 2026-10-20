import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/data/chocolateData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://choco-radar-ua.vercel.app';

  const categoryUrls = CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => ({
    url: `${baseUrl}/katalog/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryUrls,
  ];
}
