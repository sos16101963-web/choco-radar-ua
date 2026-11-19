import { ChocolateProduct, CraftMaker, getPricePer100g } from '@/data/chocolateData';
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
          'Каталог перевірених українських майстерень крафтового шоколаду, авторських тортів і зефіру ручної роботи.',
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
        name: 'CrafoHab — Каталог крафтового шоколаду, зефіру та тортів України',
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
      'Каталог перевірених українських майстерень крафтового шоколаду, авторських тортів і зефіру ручної роботи.',
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

export function generateMakerProfileSchema(
  maker: CraftMaker,
  makerProducts: ChocolateProduct[],
  cityHub?: { slug: string; cityNameUk: string }
) {
  const profileUrl = `${SITE_URL}/maysternya/${maker.slug}`;
  const validPhone = getValidPhone(maker.phone);
  const sameAs = Array.from(
    new Set([maker.websiteUrl, maker.instagramUrl].filter((v): v is string => Boolean(v)))
  );

  const sectionCrumb =
    maker.segment === 'custom-cakes-pastry'
      ? { name: 'Авторські торти на замовлення', url: `${SITE_URL}/torty` }
      : maker.segment === 'craft-zefir-pastila'
      ? { name: 'Крафтовий зефір та букети', url: `${SITE_URL}/zefir` }
      : { name: 'Крафтовий шоколад та цукерки', url: `${SITE_URL}/shokolad` };

  const breadcrumbTrail = [
    { name: 'Крафтові солодощі України', item: SITE_URL },
    { name: 'Каталог майстерень України', item: `${SITE_URL}/maysternya` },
    { name: sectionCrumb.name, item: sectionCrumb.url },
    ...(cityHub ? [{ name: cityHub.cityNameUk, item: `${SITE_URL}/misto/${cityHub.slug}` }] : []),
    { name: maker.name, item: profileUrl },
  ];

  const graph: Record<string, unknown>[] = [
    {
      '@type': maker.segment === 'custom-cakes-pastry' ? 'Bakery' : 'FoodEstablishment',
      '@id': `${profileUrl}#business`,
      name: maker.name,
      description: maker.description,
      image: [toAbsoluteUrl(maker.imageUrl)],
      url: profileUrl,
      sameAs,
      ...(validPhone ? { telephone: validPhone } : {}),
      address: {
        '@type': 'PostalAddress',
        addressLocality: maker.city,
        streetAddress: maker.address || maker.city,
        addressCountry: 'UA',
      },
      foundingDate: String(maker.foundedYear),
      areaServed: 'UA',
      priceRange: '₴₴',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: maker.rating || 4.95,
        reviewCount: maker.reviewsCount || 48,
        bestRating: 5,
        worstRating: 1,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbTrail.map((entry, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: entry.name,
        item: entry.item,
      })),
    },
  ];

  if (makerProducts.length > 0) {
    graph.push({
      '@type': 'ItemList',
      name: `Асортимент майстерні ${maker.name}`,
      numberOfItems: makerProducts.length,
      itemListElement: makerProducts.map((product, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          image: toAbsoluteUrl(product.imageUrl),
          description: `${product.expertVerdict} Підсолоджувач: ${product.sweetener}. Ціна за 100 г: ${getPricePer100g(product.priceUah, product.weightGrams)} грн.`,
          brand: {
            '@type': 'Brand',
            name: maker.name,
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
            bestRating: 5,
            worstRating: 1,
          },
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function generateCityCategoryItemListSchema(
  title: string,
  city: string,
  makers: CraftMaker[],
  lang: 'uk' | 'ru' = 'uk'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description:
      lang === 'ru'
        ? `Лучшие проверенные мастерские (${city}): сравнение, рейтинги и прямой заказ.`
        : `Кращі перевірені майстерні (${city}): порівняння, рейтинги та пряме замовлення.`,
    itemListElement: makers.slice(0, 10).map((m, idx) => {
      const validPhone = getValidPhone(m.phone);
      return {
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'LocalBusiness',
          name: m.name,
          url: `${SITE_URL}/maysternya/${m.slug}`,
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

export function generateBlogArticleSchema(
  article: BlogArticle,
  lang: 'uk' | 'ru' = 'uk',
  categoryCrumb?: { name: string; url: string }
) {
  const isRu = lang === 'ru';
  const articleUrl = isRu
    ? `${SITE_URL}/ru/blog/${article.slug}`
    : `${SITE_URL}/blog/${article.slug}`;
  const blogIndexUrl = isRu ? `${SITE_URL}/ru/blog` : `${SITE_URL}/blog`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;
  const headline = isRu ? article.titleRu : article.titleUk;
  const description = isRu ? article.excerptRu : article.excerptUk;

  const breadcrumbTrail = [
    {
      name: isRu ? 'Крафтовые сладости Украины' : 'Крафтові солодощі України',
      item: homeUrl,
    },
    {
      name: isRu ? 'Блог о крафтовых сладостях' : 'Блог про крафтові солодощі',
      item: blogIndexUrl,
    },
    ...(categoryCrumb ? [{ name: categoryCrumb.name, item: categoryCrumb.url }] : []),
    { name: headline, item: articleUrl },
  ];

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${articleUrl}#article`,
      headline,
      description,
      image: [toAbsoluteUrl(article.heroImage)],
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      inLanguage: isRu ? 'ru-UA' : 'uk-UA',
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
      itemListElement: breadcrumbTrail.map((entry, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: entry.name,
        item: entry.item,
      })),
    },
  ];

  if (article.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: article.faq.map((f) => ({
        '@type': 'Question',
        name: isRu ? f.qRu : f.qUk,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isRu ? f.aRu : f.aUk,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
