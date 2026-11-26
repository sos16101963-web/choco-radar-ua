import { MetadataRoute } from 'next';
import { CATEGORIES, MAKERS } from '@/data/chocolateData';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';
import { CITY_SECTION_COMBOS } from '@/data/cityCategorySeo';
import {
  GEO_VARIANT_LANDINGS,
  GIFT_OCCASION_LANDINGS,
  NICHE_TREND_LANDINGS,
} from '@/data/programmaticSeo';
import { CAKE_VARIANTS, CHOCOLATE_VARIANTS, ZEFIR_VARIANTS } from '@/data/sectionVariants';
import { buildHreflangAlternates, SITE_LAST_UPDATED, SITE_URL } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const stableDate = new Date(SITE_LAST_UPDATED);

  const makeBilingualPair = (
    ukPath: string,
    priority: number,
    lastModified: Date = stableDate,
    changeFrequency: 'daily' | 'weekly' = 'daily'
  ): MetadataRoute.Sitemap => {
    const normalized = ukPath === '/' ? '' : ukPath;
    const languages = buildHreflangAlternates(ukPath);
    return [
      {
        url: `${SITE_URL}${normalized}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages },
      },
      {
        url: `${SITE_URL}/ru${normalized}`,
        lastModified,
        changeFrequency,
        priority: Math.max(0.5, Number((priority - 0.05).toFixed(2))),
        alternates: { languages },
      },
    ];
  };

  const bilingualEntries: MetadataRoute.Sitemap = [
    ...makeBilingualPair('/', 1),
    ...makeBilingualPair('/shokolad', 0.95),
    ...makeBilingualPair('/torty', 0.95),
    ...makeBilingualPair('/zefir', 0.95),
    ...CHOCOLATE_VARIANTS.flatMap((v) => makeBilingualPair(`/shokolad/${v.slug}`, 0.92)),
    ...CAKE_VARIANTS.flatMap((v) => makeBilingualPair(`/torty/${v.slug}`, 0.92)),
    ...ZEFIR_VARIANTS.flatMap((v) => makeBilingualPair(`/zefir/${v.slug}`, 0.92)),
    ...makeBilingualPair('/blog', 0.9),
    ...BLOG_ARTICLES.flatMap((art) =>
      makeBilingualPair(`/blog/${art.slug}`, 0.85, new Date(art.publishedAt), 'weekly')
    ),
    ...CITY_SEO_HUBS.flatMap((city) => makeBilingualPair(`/misto/${city.slug}`, 0.85)),
    ...CITY_SECTION_COMBOS.flatMap((combo) =>
      makeBilingualPair(`/misto/${combo.citySlug}/${combo.categorySlug}`, 0.88)
    ),
    ...GEO_VARIANT_LANDINGS.flatMap((entry) =>
      makeBilingualPair(`/misto/${entry.citySlug}/${entry.sectionSlug}`, 0.86)
    ),
    ...GIFT_OCCASION_LANDINGS.flatMap((gift) =>
      makeBilingualPair(`/podarunky/${gift.slug}`, 0.88)
    ),
  ];

  const categoryUrls: MetadataRoute.Sitemap = [
    ...CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => ({
      url: `${SITE_URL}/katalog/${cat.slug}`,
      lastModified: stableDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
    ...NICHE_TREND_LANDINGS.map((trend) => ({
      url: `${SITE_URL}/katalog/${trend.slug}`,
      lastModified: stableDate,
      changeFrequency: 'daily' as const,
      priority: 0.88,
    })),
  ];

  const makerDirectoryUrl: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/maysternya`,
    lastModified: stableDate,
    changeFrequency: 'daily',
    priority: 0.92,
  };

  const makerProfileUrls: MetadataRoute.Sitemap = MAKERS.map((maker) => ({
    url: `${SITE_URL}/maysternya/${maker.slug}`,
    lastModified: stableDate,
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }));

  return [
    ...bilingualEntries,
    {
      url: `${SITE_URL}/for-makers`,
      lastModified: stableDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...categoryUrls,
    makerDirectoryUrl,
    ...makerProfileUrls,
  ];
}
