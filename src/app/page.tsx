import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { PRODUCTS, MAKERS, getPricePer100g } from '@/data/chocolateData';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, HOME_FAQ, SITE_NAME, SITE_URL, toAbsoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    languages: buildHreflangAlternates('/'),
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${SITE_NAME} — Кращі, перевірені виробники крафтової продукції в Україні`,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'uk-UA',
      },
      {
        '@type': 'ItemList',
        name: 'Каталог крафтових виробників шоколаду, зефіру та тортів України (CrafoHab)',
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
        name: 'Порівняння крафтових виробів за ціною за 100 г (CrafoHab)',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.title,
            image: toAbsoluteUrl(product.imageUrl),
            description: `${product.expertVerdict} Підсолоджувач: ${product.sweetener}. Ціна за 100 г: ${getPricePer100g(product.priceUah, product.weightGrams)} грн.`,
            brand: {
              '@type': 'Brand',
              name: product.makerName,
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'UAH',
              lowPrice: product.priceUah,
              highPrice: Math.round(product.priceUah * (product.offersCount > 1 ? 1.35 : 1.15)),
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
          name: faq.qUk,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.aUk,
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
        initialMakers={getMakersForSection('home')}
        catalogSummary={getCatalogSummary()}
      />
    </>
  );
}
