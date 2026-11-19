import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const title = 'Шоколад и конфеты ручной работы Украины';
const description =
  'Крафтовые плитки шоколада, батончики, корпусные конфеты ручной работы, шоколадные цветы и букеты, малина в шоколаде. Проверенные мастерские Украины с прямыми контактами.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/ru/shokolad`,
    languages: buildHreflangAlternates('/shokolad'),
  },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/ru/shokolad`,
    siteName: SITE_NAME,
    locale: 'ru_UA',
    type: 'website',
  },
};

export default function RuShokoladPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Крафтовые сладости Украины', url: `${SITE_URL}/ru` },
    { name: 'Крафтовый шоколад и конфеты', url: `${SITE_URL}/ru/shokolad` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialSection="chocolate"
        initialCategory="plytky-shokoladu"
        initialVariantId="choco-bars"
        initialLang="ru"
        initialMakers={getMakersForSection('chocolate')}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: 'Крафтовий шоколад, плитки та цукерки ручної роботи в Україні',
          h1Ru: 'Крафтовый шоколад, плитки и конфеты ручной работы в Украине',
          leadUk:
            'Обирайте потрібний формат — від плиток bean-to-bar і корпусних цукерок до шоколадних квітів та виробів без цукру — з чесним порівнянням вартості за 100 г і прямим замовленням.',
          leadRu:
            'Выбирайте нужный формат — от плиток bean-to-bar и корпусных конфет до шоколадных цветов и изделий без сахара — с честным сравнением стоимости за 100 г и прямым заказом.',
          breadcrumbs: [
            { labelUk: 'Крафтові солодощі України', labelRu: 'Крафтовые сладости Украины', hrefUk: '/', hrefRu: '/ru' },
            { labelUk: 'Крафтовий шоколад та цукерки', labelRu: 'Крафтовый шоколад и конфеты', hrefUk: '/shokolad', hrefRu: '/ru/shokolad' },
          ],
        }}
      />
    </>
  );
}
