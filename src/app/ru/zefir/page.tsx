import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const title = 'Крафтовый зефир, зефирные букеты и пастила';
const description =
  'Съедобные зефирные букеты из пионов и роз, ягодный зефир на агар-агаре и зефир в шоколаде. Проверенные мастерские и прямые контакты производителей Украины.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/ru/zefir`,
    languages: buildHreflangAlternates('/zefir'),
  },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/ru/zefir`,
    siteName: SITE_NAME,
    locale: 'ru_UA',
    type: 'website',
  },
};

export default function RuZefirPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Крафтовые сладости Украины', url: `${SITE_URL}/ru` },
    { name: 'Крафтовый зефир и букеты', url: `${SITE_URL}/ru/zefir` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialSection="zefir"
        initialCategory="kraftovyi-zefir-ta-bukety"
        initialVariantId="zefir-bouquets"
        initialLang="ru"
        initialMakers={getMakersForSection('zefir')}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: 'Крафтовий зефір, зефірні букети та ягідна пастила України',
          h1Ru: 'Крафтовый зефир, зефирные букеты и ягодная пастила Украины',
          leadUk:
            'Натуральні їстівні букети з півоній і троянд, ягідний зефір на морському агар-агарі та зефір у бельгійському шоколаді напряму від перевірених майстерень.',
          leadRu:
            'Натуральные съедобные букеты из пионов и роз, ягодный зефир на морском агар-агаре и зефир в бельгийском шоколаде напрямую от проверенных мастерских.',
          breadcrumbs: [
            { labelUk: 'Крафтові солодощі України', labelRu: 'Крафтовые сладости Украины', hrefUk: '/', hrefRu: '/ru' },
            { labelUk: 'Крафтовий зефір та букети', labelRu: 'Крафтовый зефир и букеты', hrefUk: '/zefir', hrefRu: '/ru/zefir' },
          ],
        }}
      />
    </>
  );
}
