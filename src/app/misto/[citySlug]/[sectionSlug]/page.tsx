import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CITY_SECTION_COMBOS } from '@/data/cityCategorySeo';
import { MAKERS, CategorySlug } from '@/data/chocolateData';
import {
  generateCityCategoryItemListSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from '@/utils/seoSchema';

interface PageProps {
  params: Promise<{
    citySlug: string;
    sectionSlug: string;
  }>;
}

export async function generateStaticParams() {
  return CITY_SECTION_COMBOS.map((combo) => ({
    citySlug: combo.citySlug,
    sectionSlug: combo.categorySlug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, sectionSlug } = await params;
  const config = CITY_SECTION_COMBOS.find(
    (c) => c.citySlug === citySlug && c.categorySlug === sectionSlug
  );

  if (!config) return {};

  return {
    title: config.titleUk,
    description: config.metaDescUk,
    alternates: {
      canonical: `https://choco-radar-ua.vercel.app/misto/${config.citySlug}/${config.categorySlug}`,
      languages: {
        'uk-UA': `https://choco-radar-ua.vercel.app/misto/${config.citySlug}/${config.categorySlug}`,
        'ru-UA': `https://choco-radar-ua.vercel.app/misto/${config.citySlug}/${config.categorySlug}?lang=ru`,
      },
    },
    openGraph: {
      title: config.titleUk,
      description: config.metaDescUk,
      url: `https://choco-radar-ua.vercel.app/misto/${config.citySlug}/${config.categorySlug}`,
      siteName: 'CrafoHub',
      locale: 'uk_UA',
      type: 'website',
    },
  };
}

export default async function CitySectionPage({ params }: PageProps) {
  const { citySlug, sectionSlug } = await params;
  const config = CITY_SECTION_COMBOS.find(
    (c) => c.citySlug === citySlug && c.categorySlug === sectionSlug
  );

  if (!config) {
    notFound();
  }

  // Filter matching makers for Schema.org ItemList
  const matchingMakers = MAKERS.filter((m) => {
    const cityMatch = (m.city || '').toLowerCase().includes(config.cityNameUk.toLowerCase());
    const catMatch =
      config.categorySlug === 'torty'
        ? m.categories.includes('avtorski-torty-ta-deserty')
        : config.categorySlug === 'zefir'
        ? m.categories.includes('kraftovyi-zefir-ta-bukety')
        : m.segment === 'bean-to-bar' ||
          m.segment === 'chocolatier-bonbons' ||
          m.segment === 'healthy-vegan' ||
          m.segment === 'flowers-berries-nuts';
    return cityMatch && catMatch;
  });

  const itemListSchema = generateCityCategoryItemListSchema(
    config.h1Uk,
    config.cityNameUk,
    matchingMakers.length > 0 ? matchingMakers : MAKERS.slice(0, 5)
  );

  const faqSchema = generateFaqSchema(config.faqUk);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'CrafoHub', url: 'https://choco-radar-ua.vercel.app' },
    { name: config.cityNameUk, url: `https://choco-radar-ua.vercel.app/misto/${config.citySlug}` },
    {
      name: config.categorySlug === 'torty' ? 'Торти' : config.categorySlug === 'zefir' ? 'Зефір' : 'Шоколад',
      url: `https://choco-radar-ua.vercel.app/misto/${config.citySlug}/${config.categorySlug}`,
    },
  ]);

  const initialCategory: CategorySlug =
    config.categorySlug === 'torty'
      ? 'avtorski-torty-ta-deserty'
      : config.categorySlug === 'zefir'
      ? 'kraftovyi-zefir-ta-bukety'
      : 'plytky-shokoladu';

  const initialSection =
    config.categorySlug === 'torty' ? 'cakes' : config.categorySlug === 'zefir' ? 'zefir' : 'chocolate';

  return (
    <>
      {/* Schema.org Rich Snippets for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <ChocoRadarApp
        initialSection={initialSection}
        initialCategory={initialCategory}
        initialCity={config.cityNameUk}
      />
    </>
  );
}
