import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/data/chocolateData';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://choco-radar-ua.vercel.app';

  const sectionUrls: MetadataRoute.Sitemap = ['/shokolad', '/torty', '/zefir'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  const categoryUrls = CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => ({
    url: `${baseUrl}/katalog/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const cityUrls = CITY_SEO_HUBS.map((city) => ({
    url: `${baseUrl}/misto/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  const blogUrls = BLOG_ARTICLES.map((art) => ({
    url: `${baseUrl}/blog/${art.slug}`,
    lastModified: new Date(art.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...sectionUrls,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...cityUrls,
    ...blogUrls,
  ];
}
