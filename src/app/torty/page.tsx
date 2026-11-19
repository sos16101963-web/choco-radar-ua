import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const title = 'Авторські торти та десерти на замовлення — CrafoHab 2027';
const description =
  'Святкові та мусові торти у шоколадному велюрі, трендові бенто-торти, дитячі торти та макарони. Основні кондитерські та повний список майстерень України.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/torty`,
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/torty`,
    siteName: SITE_NAME,
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function TortyPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Авторські торти', url: `${SITE_URL}/torty` },
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
