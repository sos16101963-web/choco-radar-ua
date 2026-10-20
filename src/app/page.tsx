import React from 'react';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { PRODUCTS, MAKERS, getPricePer100g } from '@/data/chocolateData';

export default function HomePage() {
  // Structured Data (Schema.org JSON-LD) for Google Rich Results & AI Search (GEO 2026-2027)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://choco-radar-ua.vercel.app/#website',
        url: 'https://choco-radar-ua.vercel.app',
        name: 'ChocoRadar UA — Навігатор крафтового шоколаду України',
        description:
          'Порівняння цін за 100 г, чистоти складу та смакових профілів крафтового шоколаду, корпусних розмальованих цукерок, горіхів та малини в шоколаді від українських виробників.',
        inLanguage: 'uk-UA',
      },
      {
        '@type': 'ItemList',
        name: 'Рейтинг крафтових шоколадних виробів України 2026',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.title,
            description: `${product.expertVerdict} Підсолоджувач: ${product.sweetener}. Ціна за 100 г: ${getPricePer100g(product.priceUah, product.weightGrams)} грн.`,
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
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Чим крафтовий шоколад Bean-to-Bar відрізняється від магазинного?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Крафтовий шоколад Bean-to-Bar («від какао-боба до плитки») виготовляється з фермерських какао-бобів Fino de Aroma або Criollo, натурального какао-масла та тростинного або кокосового цукру без пальмової олії, замінників та штучних ароматизаторів.',
            },
          },
          {
            '@type': 'Question',
            name: 'Як об’єктивно порівняти ціни на крафтовий шоколад та цукерки в Україні?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Оскільки плитки та набори мають різну вагу (від 50 г до 480 г), платформа ChocoRadar UA автоматично розраховує ціну за 100 грамів чистого продукту та оцінює індекс чистоти складу (Clean Label Score).',
            },
          },
          {
            '@type': 'Question',
            name: 'Яку малину або полуницю в шоколаді можна замовити Новою Поштою по Україні?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Для доставки по всій Україні оптимально підходить цільна сублімована малина та полуниця в подвійному шарі бельгійського шоколаду (зберігається до 6 місяців). Свіжа полуниця в шоколаді доставляється кур’єром або в термобоксах із холодоагентом.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChocoRadarApp initialCategory="all" />
    </>
  );
}
