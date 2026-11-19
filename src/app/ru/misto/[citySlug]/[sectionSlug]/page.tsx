import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CITY_SECTION_COMBOS } from '@/data/cityCategorySeo';
import { MAKERS, CategorySlug } from '@/data/chocolateData';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
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

  const url = `${SITE_URL}/ru/misto/${config.citySlug}/${config.categorySlug}`;

  return {
    title: config.titleRu,
    description: config.metaDescRu,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`/misto/${config.citySlug}/${config.categorySlug}`),
    },
    openGraph: {
      title: config.titleRu,
      description: config.metaDescRu,
      url,
      siteName: SITE_NAME,
      locale: 'ru_UA',
      type: 'website',
    },
  };
}

export default async function RuCitySectionPage({ params }: PageProps) {
  const { citySlug, sectionSlug } = await params;
  const config = CITY_SECTION_COMBOS.find(
    (c) => c.citySlug === citySlug && c.categorySlug === sectionSlug
  );

  if (!config) {
    notFound();
  }

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
    config.h1Ru,
    config.cityNameRu,
    matchingMakers.length > 0 ? matchingMakers : MAKERS.slice(0, 5),
    'ru'
  );

  const faqSchema = generateFaqSchema(config.faqRu);

  const sectionLeafUk =
    config.categorySlug === 'torty'
      ? `Торти на замовлення ${config.cityNameUk}`
      : config.categorySlug === 'zefir'
      ? `Крафтовий зефір ${config.cityNameUk}`
      : `Крафтовий шоколад ${config.cityNameUk}`;

  const sectionLeafRu =
    config.categorySlug === 'torty'
      ? `Торты на заказ ${config.cityNameRu}`
      : config.categorySlug === 'zefir'
      ? `Крафтовый зефир ${config.cityNameRu}`
      : `Крафтовый шоколад ${config.cityNameRu}`;

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Крафтовые сладости Украины', url: `${SITE_URL}/ru` },
    { name: `Крафтовые сладости: ${config.cityNameRu}`, url: `${SITE_URL}/ru/misto/${config.citySlug}` },
    {
      name: sectionLeafRu,
      url: `${SITE_URL}/ru/misto/${config.citySlug}/${config.categorySlug}`,
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
        initialLang="ru"
        initialMakers={getMakersForSection(initialSection)}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: config.h1Uk,
          h1Ru: config.h1Ru,
          leadUk: config.leadUk,
          leadRu: config.leadRu,
          articleTitleUk: config.h1Uk,
          articleTitleRu: config.h1Ru,
          articleUk: config.seoArticleUk,
          articleRu: config.seoArticleRu,
          faqUk: config.faqUk,
          faqRu: config.faqRu,
          breadcrumbs: [
            { labelUk: 'Крафтові солодощі України', labelRu: 'Крафтовые сладости Украины', hrefUk: '/', hrefRu: '/ru' },
            { labelUk: `Крафтові солодощі: ${config.cityNameUk}`, labelRu: `Крафтовые сладости: ${config.cityNameRu}`, hrefUk: `/misto/${config.citySlug}`, hrefRu: `/ru/misto/${config.citySlug}` },
            { labelUk: sectionLeafUk, labelRu: sectionLeafRu },
          ],
        }}
      />
    </>
  );
}
