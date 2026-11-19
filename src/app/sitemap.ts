import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/data/chocolateData';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';
import { CITY_SECTION_COMBOS } from '@/data/cityCategorySeo';
import { CAKE_VARIANTS, CHOCOLATE_VARIANTS, ZEFIR_VARIANTS } from '@/data/sectionVariants';
import { SITE_LAST_UPDATED, SITE_URL } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const stableDate = new Date(SITE_LAST_UPDATED);

  const sectionUrls: MetadataRoute.Sitemap = ['/shokolad', '/torty', '/zefir'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: stableDate,
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  const chocolateVariantUrls: MetadataRoute.Sitemap = CHOCOLATE_VARIANTS.map((v) => ({
    url: `${SITE_URL}/shokolad/${v.slug}`,
    lastModified: stableDate,
    changeFrequency: 'daily' as const,
    priority: 0.92,
  }));

  const cakeVariantUrls: MetadataRoute.Sitemap = CAKE_VARIANTS.map((v) => ({
    url: `${SITE_URL}/torty/${v.slug}`,
    lastModified: stableDate,
    changeFrequency: 'daily' as const,
    priority: 0.92,
  }));

  const zefirVariantUrls: MetadataRoute.Sitemap = ZEFIR_VARIANTS.map((v) => ({
    url: `${SITE_URL}/zefir/${v.slug}`,
    lastModified: stableDate,
    changeFrequency: 'daily' as const,
    priority: 0.92,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.filter((c) => c.slug !== 'all').map(
    (cat) => ({
      url: `${SITE_URL}/katalog/${cat.slug}`,
      lastModified: stableDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })
  );

  const cityUrls: MetadataRoute.Sitemap = CITY_SEO_HUBS.map((city) => ({
    url: `${SITE_URL}/misto/${city.slug}`,
    lastModified: stableDate,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  const cityCategoryUrls: MetadataRoute.Sitemap = CITY_SECTION_COMBOS.map((combo) => ({
    url: `${SITE_URL}/misto/${combo.citySlug}/${combo.categorySlug}`,
    lastModified: stableDate,
    changeFrequency: 'daily' as const,
    priority: 0.88,
  }));

  const blogUrls: MetadataRoute.Sitemap = BLOG_ARTICLES.map((art) => ({
    url: `${SITE_URL}/blog/${art.slug}`,
    lastModified: new Date(art.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: stableDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...sectionUrls,
    ...chocolateVariantUrls,
    ...cakeVariantUrls,
    ...zefirVariantUrls,
    {
      url: `${SITE_URL}/blog`,
      lastModified: stableDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/for-makers`,
      lastModified: stableDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...categoryUrls,
    ...cityUrls,
    ...cityCategoryUrls,
    ...blogUrls,
  ];
}
