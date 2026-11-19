import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITY_SEO_HUBS } from '@/data/blogData';
import { MAKERS } from '@/data/chocolateData';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import {
  generateCityCategoryItemListSchema,
  generateBreadcrumbSchema,
} from '@/utils/seoSchema';

interface CityPageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateStaticParams() {
  return CITY_SEO_HUBS.map((city) => ({
    citySlug: city.slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = CITY_SEO_HUBS.find((c) => c.slug === citySlug);
  if (!city) return {};

  const url = `${SITE_URL}/ru/misto/${city.slug}`;

  return {
    title: city.h1Ru,
    description: city.descriptionRu,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`/misto/${city.slug}`),
    },
    openGraph: {
      title: city.h1Ru,
      description: city.descriptionRu,
      url,
      siteName: SITE_NAME,
      locale: 'ru_UA',
      type: 'website',
    },
  };
}

export default async function RuCityPage({ params }: CityPageProps) {
  const { citySlug } = await params;
  const city = CITY_SEO_HUBS.find((c) => c.slug === citySlug);
  if (!city) {
    notFound();
  }

  const cityMakers = MAKERS.filter(
    (m) =>
      (m.city || '').toLowerCase().includes(city.cityNameUk.toLowerCase()) ||
      (m.regionCity || '').toLowerCase().includes(city.cityNameUk.toLowerCase())
  );

  const url = `${SITE_URL}/ru/misto/${city.slug}`;

  const itemListSchema = generateCityCategoryItemListSchema(
    city.h1Ru,
    city.cityNameRu,
    cityMakers.length > 0 ? cityMakers : MAKERS.slice(0, 5),
    'ru'
  );

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/ru` },
    { name: `Мастерские: ${city.cityNameRu}`, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialCategory="all"
        initialCity={city.regionFilterId}
        initialLang="ru"
        seoOverride={{
          h1Uk: city.h1Uk,
          h1Ru: city.h1Ru,
          leadUk: city.descriptionUk,
          leadRu: city.descriptionRu,
          articleTitleUk: `Крафтові солодощі: ${city.cityNameUk}`,
          articleTitleRu: `Крафтовые сладости: ${city.cityNameRu}`,
          articleUk: city.seoTextUk,
          articleRu: city.seoTextRu,
        }}
      />
    </>
  );
}
