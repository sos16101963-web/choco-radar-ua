import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const title = 'Авторські торти та десерти на замовлення';
const description =
  'Святкові та мусові торти у шоколадному велюрі, бенто-торти з вашим написом, дитячі торти та макарони. Перевірені кондитерські майстерні України.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/torty`,
    languages: buildHreflangAlternates('/torty'),
  },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/torty`,
    siteName: SITE_NAME,
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function TortyPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Крафтові солодощі України', url: SITE_URL },
    { name: 'Авторські торти на замовлення', url: `${SITE_URL}/torty` },
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
        initialMakers={getMakersForSection('cakes')}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: 'Авторські торти та десерти на замовлення в Україні',
          h1Ru: 'Авторские торты и десерты на заказ в Украине',
          leadUk:
            'Святкові мусові та бісквітні торти, бенто-торти з вашим написом, дитячі десерти та макарони з натуральних вершків 33% та вершкового масла без рослинних замінників.',
          leadRu:
            'Праздничные муссовые и бисквитные торты, бенто-торты с вашей надписью, детские десерты и макароны из натуральных сливок 33% и сливочного масла без растительных заменителей.',
          breadcrumbs: [
            { labelUk: 'Крафтові солодощі України', labelRu: 'Крафтовые сладости Украины', hrefUk: '/', hrefRu: '/ru' },
            { labelUk: 'Авторські торти на замовлення', labelRu: 'Авторские торты на заказ', hrefUk: '/torty', hrefRu: '/ru/torty' },
          ],
        }}
      />
    </>
  );
}
