import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const title = 'Шоколад та цукерки ручної роботи України — CrafoHab 2027';
const description =
  'Оберіть вид крафтового шоколаду: плитки шоколаду, батончики, корпусні цукерки ручної роботи, шоколадні квіти і букети, малина в шоколаді. Основні виробники та повний каталог майстерень України.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/shokolad`,
    languages: buildHreflangAlternates('/shokolad'),
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/shokolad`,
    siteName: SITE_NAME,
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function ShokoladPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Шоколад та цукерки', url: `${SITE_URL}/shokolad` },
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
        initialMakers={getMakersForSection('chocolate')}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: 'Крафтовий шоколад, плитки та цукерки ручної роботи в Україні',
          h1Ru: 'Крафтовый шоколад, плитки и конфеты ручной работы в Украине',
          leadUk:
            'Обирайте потрібний формат — від плиток bean-to-bar і корпусних цукерок до шоколадних квітів та виробів без цукру — з чесним порівнянням вартості за 100 г і прямим замовленням.',
          leadRu:
            'Выбирайте нужный формат — от плиток bean-to-bar и корпусных конфет до шоколадных цветов и изделий без сахара — с честным сравнением стоимости за 100 г и прямым заказом.',
        }}
      />
    </>
  );
}
