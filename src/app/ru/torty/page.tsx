import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const title = 'Авторские торты и десерты на заказ в Украине — CrafoHab 2027';
const description =
  'Праздничные и муссовые торты в шоколадном велюре, трендовые бенто-торты, детские торты и макароны. Основные кондитерские и полный список мастерских Украины.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/ru/torty`,
    languages: buildHreflangAlternates('/torty'),
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/ru/torty`,
    siteName: SITE_NAME,
    locale: 'ru_UA',
    type: 'website',
  },
};

export default function RuTortyPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/ru` },
    { name: 'Авторские торты', url: `${SITE_URL}/ru/torty` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialSection="cakes"
        initialCategory="avtorski-torty-ta-deserty"
        initialVariantId="cakes-custom"
        initialLang="ru"
        initialMakers={getMakersForSection('cakes')}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: 'Авторські торти та десерти на замовлення в Україні',
          h1Ru: 'Авторские торты и десерты на заказ в Украине',
          leadUk:
            'Святкові мусові та бісквітні торти, бенто-торти з вашим написом, дитячі десерти та макарони з натуральних вершків 33% та вершкового масла без рослинних замінників.',
          leadRu:
            'Праздничные муссовые и бисквитные торты, бенто-торты с вашей надписью, детские десерты и макароны из натуральных сливок 33% и сливочного масла без растительных заменителей.',
        }}
      />
    </>
  );
}
