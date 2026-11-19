import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { PRODUCTS, MAKERS, getPricePer100g } from '@/data/chocolateData';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, HOME_FAQ, SITE_NAME, SITE_URL, toAbsoluteUrl } from '@/lib/siteConfig';

const title = 'CrafoHab — Все крафтовые производители шоколада, зефира и тортов Украины (2027)';
const description = `CrafoHab — сервис №1 крафтовых сладостей Украины. Плитка шоколада и батончики, конфеты ручной работы, шоколадные цветы и букеты, малина в шоколаде, изделия без сахара, сладости для детей, крафтовый зефир и авторские торты. ${MAKERS.length} проверенных мастерских, честная цена за 100 г и тендерная биржа заказов.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/ru`,
    languages: buildHreflangAlternates('/'),
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/ru`,
    siteName: SITE_NAME,
    locale: 'ru_UA',
    type: 'website',
  },
};

export default function RuHomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/ru#webpage`,
        url: `${SITE_URL}/ru`,
        name: title,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'ru-UA',
      },
      {
        '@type': 'ItemList',
        name: 'Рейтинг крафтовых производителей шоколада, зефира и тортов Украины 2027 (CrafoHab)',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: Math.min(MAKERS.length, 30),
        itemListElement: MAKERS.slice(0, 30).map((maker, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'FoodEstablishment',
            name: maker.name,
            description: maker.description,
            url: maker.websiteUrl,
            image: toAbsoluteUrl(maker.imageUrl),
            ...(maker.phone && !maker.phone.startsWith('Замовлення') ? { telephone: maker.phone } : {}),
            address: {
              '@type': 'PostalAddress',
              addressLocality: maker.city,
              addressCountry: 'UA',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: maker.rating,
              reviewCount: maker.reviewsCount,
              bestRating: '5',
              worstRating: '1',
            },
          },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Сравнение крафтовых изделий по цене за 100 г (CrafoHab)',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.title,
            image: toAbsoluteUrl(product.imageUrl),
            description: `${product.expertVerdict} Подсластитель: ${product.sweetener}. Цена за 100 г: ${getPricePer100g(product.priceUah, product.weightGrams)} грн.`,
            brand: {
              '@type': 'Brand',
              name: product.makerName,
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'UAH',
              lowPrice: product.priceUah,
              offerCount: product.offersCount,
              availability: 'https://schema.org/InStock',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewsCount,
              bestRating: '5',
              worstRating: '1',
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: HOME_FAQ.map((faq) => ({
          '@type': 'Question',
          name: faq.qRu,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.aRu,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChocoRadarApp
        initialCategory="all"
        initialLang="ru"
        initialMakers={getMakersForSection('home')}
        catalogSummary={getCatalogSummary()}
      />
    </>
  );
}
