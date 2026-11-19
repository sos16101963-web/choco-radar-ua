import { CraftMaker } from '@/data/chocolateData';
import type { BlogArticle } from '@/data/blogData';
import { SITE_EMAIL, SITE_NAME, SITE_URL, toAbsoluteUrl } from '@/lib/siteConfig';

function getValidPhone(phone?: string): string | undefined {
  if (!phone || phone.startsWith('Замовлення')) return undefined;
  return phone;
}

export function generateGlobalEntityGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: 'CrafoHab Україна',
        url: SITE_URL,
        email: SITE_EMAIL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/crafo-collage.jpg`,
        },
        description:
          'Національний маркетплейс та гід крафтового шоколаду, авторських тортів і зефіру ручної роботи в Україні.',
        areaServed: {
          '@type': 'Country',
          name: 'Ukraine',
        },
        sameAs: ['https://crafo.com.ua', 'https://instagram.com/crafo.choco'],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+380954002027',
          email: SITE_EMAIL,
          contactType: 'customer service',
          areaServed: 'UA',
          availableLanguage: ['Ukrainian', 'Russian'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'CrafoHab — Навігатор крафтового шоколаду, зефіру та тортів України',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'uk-UA',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    email: SITE_EMAIL,
    logo: `${SITE_URL}/images/crafo-collage.jpg`,
    description:
      'Національний маркетплейс та гід крафтового шоколаду, авторських тортів і зефіру ручної роботи в Україні.',
    sameAs: ['https://crafo.com.ua', 'https://instagram.com/crafo.choco'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380954002027',
      email: SITE_EMAIL,
      contactType: 'customer service',
      areaServed: 'UA',
      availableLanguage: ['Ukrainian', 'Russian'],
    },
  };
}

export function generateLocalBusinessSchema(maker: CraftMaker) {
  const validPhone = getValidPhone(maker.phone);
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: maker.name,
    image: toAbsoluteUrl(maker.imageUrl),
    ...(validPhone ? { telephone: validPhone } : {}),
    url: maker.websiteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: maker.city,
      addressCountry: 'UA',
      streetAddress: maker.address || maker.city,
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
    itemListElement: makers.slice(0, 10).map((m, idx) => {
      const validPhone = getValidPhone(m.phone);
      return {
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'LocalBusiness',
          name: m.name,
          url: m.websiteUrl,
          image: toAbsoluteUrl(m.imageUrl),
          ...(validPhone ? { telephone: validPhone } : {}),
          address: {
            '@type': 'PostalAddress',
            addressLocality: m.city,
            addressCountry: 'UA',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: m.rating || 4.9,
            reviewCount: m.reviewsCount || 35,
            bestRating: 5,
            worstRating: 1,
          },
        },
      };
    }),
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

export function generateBlogArticleSchema(article: BlogArticle) {
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${articleUrl}#article`,
      headline: article.titleUk,
      description: article.excerptUk,
      image: [toAbsoluteUrl(article.heroImage)],
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      inLanguage: 'uk-UA',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      author: {
        '@id': `${SITE_URL}/#organization`,
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: article.titleUk, item: articleUrl },
      ],
    },
  ];

  if (article.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: article.faq.map((f) => ({
        '@type': 'Question',
        name: f.qUk,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.aUk,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
