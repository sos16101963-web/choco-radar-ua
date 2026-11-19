import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const title = 'Крафтовий зефір, зефірні букети та пастила — CrafoHab 2027';
const description =
  'Реалістичні зефірні букети з півоній і троянд, ягідний зефір на агар-агарі та зефір у шоколаді. Перевірені майстерні та прямі контакти виробників України.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/zefir`,
    languages: buildHreflangAlternates('/zefir'),
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/zefir`,
    siteName: SITE_NAME,
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function ZefirPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Крафтовий зефір та букети', url: `${SITE_URL}/zefir` },
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
        initialMakers={getMakersForSection('zefir')}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: 'Крафтовий зефір, зефірні букети та ягідна пастила України',
          h1Ru: 'Крафтовый зефир, зефирные букеты и ягодная пастила Украины',
          leadUk:
            'Натуральні їстівні букети з півоній і троянд, ягідний зефір на морському агар-агарі та зефір у бельгійському шоколаді напряму від перевірених майстерень.',
          leadRu:
            'Натуральные съедобные букеты из пионов и роз, ягодный зефир на морском агар-агаре и зефир в бельгийском шоколаде напрямую от проверенных мастерских.',
        }}
      />
    </>
  );
}
