import { CraftMaker } from '@/data/chocolateData';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CrafoHub',
    url: 'https://choco-radar-ua.vercel.app',
    logo: 'https://choco-radar-ua.vercel.app/images/crafo-collage.jpg',
    description:
      'Національний маркетплейс та гід крафтового шоколаду, авторських тортів і зефіру ручної роботи в Україні.',
    sameAs: ['https://crafo.com.ua', 'https://instagram.com/crafo.choco'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380954002027',
      contactType: 'customer service',
      areaServed: 'UA',
      availableLanguage: ['Ukrainian', 'Russian'],
    },
  };
}

export function generateLocalBusinessSchema(maker: CraftMaker) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: maker.name,
    image: maker.imageUrl || 'https://choco-radar-ua.vercel.app/images/crafo-collage.jpg',
    telephone: maker.phone,
    url: maker.websiteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: maker.city,
      addressCountry: 'UA',
      streetAddress: maker.address || maker.city,
    },
    geo: {
      '@type': 'GeoCoordinates',
      addressCountry: 'UA',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: maker.rating || 4.95,
      reviewCount: maker.reviewsCount || 48,
      bestRating: 5,
      worstRating: 1,
    },
    priceRange: '₴₴',
  };
}

export function generateCityCategoryItemListSchema(title: string, city: string, makers: CraftMaker[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: `Кращі перевірені майстерні (${city}): порівняння, рейтинги та пряме замовлення.`,
    itemListElement: makers.slice(0, 10).map((m, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'LocalBusiness',
        name: m.name,
        url: m.websiteUrl,
        image: m.imageUrl,
        telephone: m.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: m.city,
          addressCountry: 'UA',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: m.rating || 4.9,
          reviewCount: m.reviewsCount || 35,
        },
      },
    })),
  };
}

export function generateFaqSchema(faqList: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
