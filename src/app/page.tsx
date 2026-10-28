import React from 'react';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { PRODUCTS, MAKERS, CATEGORIES, getPricePer100g } from '@/data/chocolateData';

export default function HomePage() {
  // Google 2027 & AI Overview (GEO) Multi-Entity Schema.org JSON-LD Graph
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://choco-radar-ua.vercel.app/#organization',
        name: 'CrafoHub Україна',
        alternateName: 'CrafoHub — Платформа крафтових солодощів України',
        url: 'https://choco-radar-ua.vercel.app',
        description:
          'Всеукраїнська сервісна платформа крафтових виробників шоколаду, цукерок, зефіру та авторських тортів.',
        areaServed: 'UA',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://choco-radar-ua.vercel.app/#website',
        url: 'https://choco-radar-ua.vercel.app',
        name: 'CrafoHub — Навігатор крафтового шоколаду, зефіру та тортів України',
        publisher: {
          '@id': 'https://choco-radar-ua.vercel.app/#organization',
        },
        inLanguage: ['uk-UA', 'ru-UA'],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://choco-radar-ua.vercel.app/#breadcrumbs',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'CrafoHub Україна',
            item: 'https://choco-radar-ua.vercel.app',
          },
          ...CATEGORIES.filter((c) => c.slug !== 'all').map((cat, idx) => ({
            '@type': 'ListItem',
            position: idx + 2,
            name: cat.shortTitle,
            item: `https://choco-radar-ua.vercel.app/katalog/${cat.slug}`,
          })),
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Рейтинг крафтових виробників шоколаду, зефіру та тортів України 2027 (CrafoHub)',
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
            telephone: maker.phone,
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
        name: 'Порівняння крафтових виробів за ціною за 100 г (CrafoHub)',
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
            name: 'Чим крафтова плитка шоколаду та батончик відрізняються від мас-маркету?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Крафтова плитка шоколаду та ремісничий батончик виготовляються з натурального какао-масла та добірних какао-бобів (зокрема бельгійського кувертюру Barry Callebaut у лідера рейтингу crafo.com.ua або фермерських бобів Fino de Aroma) без пальмової олії, замінників та штучних ароматизаторів.',
            },
          },
          {
            '@type': 'Question',
            name: 'Які солодощі обрати в рубриках «Без цукру» та «Для дітей»?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'На платформі CrafoHub рубрики розділені для зручності: у розділі «Без цукру» представлені вироби на меду, кокосовому нектарі, еритритолі та стевії для веганів і діабетиків, а в окремій рубриці «Для дітей» — безпечний дитячий шоколад і батончики на керобі без кофеїну, натуральна ягідна пастила та шоколадні фігурки.',
            },
          },
          {
            '@type': 'Question',
            name: 'Як працює Тендерна біржа замовлень на торти, зефірні та шоколадні букети?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Покупець залишає одну заявку із зазначенням міста, дати та бюджету, а перевірені майстерні свого міста самі надсилають персональні пропозиції з фото та цінами напряму у Telegram або Viber.',
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
