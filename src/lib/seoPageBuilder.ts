import { Metadata } from 'next';
import { CATEGORIES, CategorySlug, MAKERS } from '@/data/chocolateData';
import { CITY_SECTION_COMBOS } from '@/data/cityCategorySeo';
import {
  buildGeoRelatedLinks,
  computeLandingStats,
  findGeoVariantLanding,
  findGiftLanding,
  findNicheTrendLanding,
  formatSeoStatsBanner,
  GEO_VARIANT_TEMPLATES,
  GIFT_OCCASION_LANDINGS,
  NICHE_TREND_LANDINGS,
  PROGRAMMATIC_CITIES,
} from '@/data/programmaticSeo';
import type { MacroSectionId } from '@/data/sectionVariants';
import type { PageSeoOverride } from '@/components/ChocoRadarApp';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import {
  generateBreadcrumbSchema,
  generateCityCategoryItemListSchema,
  generateFaqSchema,
} from '@/utils/seoSchema';
import type { SeoRelatedLinkGroup } from './homePreviewData';

export interface ResolvedSeoPageData {
  schemas: Record<string, unknown>[];
  initialSection: MacroSectionId;
  initialCategory: CategorySlug;
  initialCity: string;
  initialVariantId?: string;
  initialLang: 'uk' | 'ru';
  seoOverride: PageSeoOverride;
}

function getSectionMeta(categorySlug: 'shokolad' | 'torty' | 'zefir' | MacroSectionId) {
  if (categorySlug === 'torty' || categorySlug === 'cakes') {
    return {
      section: 'cakes' as const,
      defaultCat: 'avtorski-torty-ta-deserty' as CategorySlug,
      labelUk: 'Авторські торти',
      labelRu: 'Авторские торты',
      hrefUk: '/torty',
      hrefRu: '/ru/torty',
    };
  }
  if (categorySlug === 'zefir') {
    return {
      section: 'zefir' as const,
      defaultCat: 'kraftovyi-zefir-ta-bukety' as CategorySlug,
      labelUk: 'Крафтовий зефір',
      labelRu: 'Крафтовый зефир',
      hrefUk: '/zefir',
      hrefRu: '/ru/zefir',
    };
  }
  return {
    section: 'chocolate' as const,
    defaultCat: 'plytky-shokoladu' as CategorySlug,
    labelUk: 'Крафтовий шоколад',
    labelRu: 'Крафтовый шоколад',
    hrefUk: '/shokolad',
    hrefRu: '/ru/shokolad',
  };
}

export function buildGeoSectionMetadata(
  citySlug: string,
  sectionSlug: string,
  lang: 'uk' | 'ru'
): Metadata {
  const ukPath = `/misto/${citySlug}/${sectionSlug}`;
  const canonical = lang === 'ru' ? `${SITE_URL}/ru${ukPath}` : `${SITE_URL}${ukPath}`;
  const locale = lang === 'ru' ? 'ru_UA' : 'uk_UA';

  const combo = CITY_SECTION_COMBOS.find(
    (c) => c.citySlug === citySlug && c.categorySlug === sectionSlug
  );
  if (combo) {
    const title = lang === 'ru' ? combo.titleRu : combo.titleUk;
    const description = lang === 'ru' ? combo.metaDescRu : combo.metaDescUk;
    return {
      title,
      description,
      alternates: { canonical, languages: buildHreflangAlternates(ukPath) },
      openGraph: { title, description, url: canonical, siteName: SITE_NAME, locale, type: 'website' },
    };
  }

  const geoVariant = findGeoVariantLanding(citySlug, sectionSlug);
  if (geoVariant) {
    const title = lang === 'ru' ? geoVariant.titleRu : geoVariant.titleUk;
    const description = lang === 'ru' ? geoVariant.metaDescRu : geoVariant.metaDescUk;
    return {
      title,
      description,
      alternates: { canonical, languages: buildHreflangAlternates(ukPath) },
      openGraph: { title, description, url: canonical, siteName: SITE_NAME, locale, type: 'website' },
    };
  }

  return {};
}

export function buildGeoSectionPageData(
  citySlug: string,
  sectionSlug: string,
  lang: 'uk' | 'ru'
): ResolvedSeoPageData | null {
  const isRu = lang === 'ru';
  const homePrefix = isRu ? `${SITE_URL}/ru` : SITE_URL;
  const combo = CITY_SECTION_COMBOS.find(
    (c) => c.citySlug === citySlug && c.categorySlug === sectionSlug
  );

  if (combo) {
    const matchingMakers = MAKERS.filter((m) => {
      const cityMatch = (m.city || '').toLowerCase().includes(combo.cityNameUk.toLowerCase());
      const catMatch =
        combo.categorySlug === 'torty'
          ? m.categories.includes('avtorski-torty-ta-deserty')
          : combo.categorySlug === 'zefir'
          ? m.categories.includes('kraftovyi-zefir-ta-bukety')
          : m.segment === 'bean-to-bar' ||
            m.segment === 'chocolatier-bonbons' ||
            m.segment === 'healthy-vegan' ||
            m.segment === 'flowers-berries-nuts';
      return cityMatch && catMatch;
    });

    const secMeta = getSectionMeta(combo.categorySlug);
    const stats = computeLandingStats(
      secMeta.defaultCat as Exclude<CategorySlug, 'all'>,
      combo.cityNameUk
    );

    const sectionLeafUk =
      combo.categorySlug === 'torty'
        ? `Торти на замовлення ${combo.cityNameUk}`
        : combo.categorySlug === 'zefir'
        ? `Крафтовий зефір ${combo.cityNameUk}`
        : `Крафтовий шоколад ${combo.cityNameUk}`;

    const sectionLeafRu =
      combo.categorySlug === 'torty'
        ? `Торты на заказ ${combo.cityNameRu}`
        : combo.categorySlug === 'zefir'
        ? `Крафтовый зефир ${combo.cityNameRu}`
        : `Крафтовый шоколад ${combo.cityNameRu}`;

    const cityVariantsLinks: SeoRelatedLinkGroup = {
      titleUk: `Вузькі категорії та подарунки у ${combo.cityNameUk}:`,
      titleRu: `Узкие категории и подарки (${combo.cityNameRu}):`,
      items: GEO_VARIANT_TEMPLATES.map((tpl) => ({
        labelUk: `${tpl.shortUk} (${combo.cityNameUk})`,
        labelRu: `${tpl.shortRu} (${combo.cityNameRu})`,
        hrefUk: `/misto/${combo.citySlug}/${tpl.variantSlug}`,
        hrefRu: `/ru/misto/${combo.citySlug}/${tpl.variantSlug}`,
      })),
    };

    const pageUrl = `${homePrefix}/misto/${combo.citySlug}/${combo.categorySlug}`;
    const schemas = [
      generateCityCategoryItemListSchema(
        isRu ? combo.h1Ru : combo.h1Uk,
        isRu ? combo.cityNameRu : combo.cityNameUk,
        matchingMakers.length > 0 ? matchingMakers : MAKERS.slice(0, 5),
        lang
      ),
      generateFaqSchema(isRu ? combo.faqRu : combo.faqUk),
      generateBreadcrumbSchema([
        { name: isRu ? 'Крафтовые сладости Украины' : 'Крафтові солодощі України', url: homePrefix },
        {
          name: isRu ? `Крафтовые сладости: ${combo.cityNameRu}` : `Крафтові солодощі: ${combo.cityNameUk}`,
          url: `${homePrefix}/misto/${combo.citySlug}`,
        },
        { name: isRu ? sectionLeafRu : sectionLeafUk, url: pageUrl },
      ]),
    ];

    return {
      schemas,
      initialSection: secMeta.section,
      initialCategory: secMeta.defaultCat,
      initialCity: combo.cityNameUk,
      initialLang: lang,
      seoOverride: {
        h1Uk: combo.h1Uk,
        h1Ru: combo.h1Ru,
        leadUk: combo.leadUk,
        leadRu: combo.leadRu,
        articleTitleUk: combo.h1Uk,
        articleTitleRu: combo.h1Ru,
        articleUk: combo.seoArticleUk,
        articleRu: combo.seoArticleRu,
        faqUk: combo.faqUk,
        faqRu: combo.faqRu,
        statsBanner: formatSeoStatsBanner(stats, { uk: combo.cityNameUk, ru: combo.cityNameRu }),
        relatedLinks: [cityVariantsLinks],
        breadcrumbs: [
          {
            labelUk: 'Крафтові солодощі України',
            labelRu: 'Крафтовые сладости Украины',
            hrefUk: '/',
            hrefRu: '/ru',
          },
          {
            labelUk: `Крафтові солодощі: ${combo.cityNameUk}`,
            labelRu: `Крафтовые сладости: ${combo.cityNameRu}`,
            hrefUk: `/misto/${combo.citySlug}`,
            hrefRu: `/ru/misto/${combo.citySlug}`,
          },
          { labelUk: sectionLeafUk, labelRu: sectionLeafRu },
        ],
      },
    };
  }

  const geoVariant = findGeoVariantLanding(citySlug, sectionSlug);
  if (!geoVariant) return null;

  const { city, template } = geoVariant;
  const stats = computeLandingStats(
    template.categorySlug,
    city.regionFilterId,
    template.priceFallbackMin,
    template.priceFallbackMax
  );
  const pageUrl = `${homePrefix}/misto/${city.slug}/${template.variantSlug}`;

  const schemas = [
    generateCityCategoryItemListSchema(
      isRu ? geoVariant.h1Ru : geoVariant.h1Uk,
      isRu ? city.nameRu : city.nameUk,
      stats.matchingMakers.slice(0, 10),
      lang
    ),
    generateFaqSchema(isRu ? geoVariant.faqRu : geoVariant.faqUk),
    generateBreadcrumbSchema([
      { name: isRu ? 'Крафтовые сладости Украины' : 'Крафтові солодощі України', url: homePrefix },
      {
        name: isRu ? `Крафтовые сладости: ${city.nameRu}` : `Крафтові солодощі: ${city.nameUk}`,
        url: `${homePrefix}/misto/${city.slug}`,
      },
      { name: isRu ? template.shortRu : template.shortUk, url: pageUrl },
    ]),
  ];

  return {
    schemas,
    initialSection: template.section,
    initialCategory: template.categorySlug,
    initialCity: stats.effectiveInitialCity,
    initialVariantId: template.variantId,
    initialLang: lang,
    seoOverride: {
      h1Uk: geoVariant.h1Uk,
      h1Ru: geoVariant.h1Ru,
      leadUk: geoVariant.leadUk,
      leadRu: geoVariant.leadRu,
      articleTitleUk: `${template.labelUk} ${city.inUk}: поради з вибору та доставки`,
      articleTitleRu: `${template.labelRu} ${city.inRu}: советы по выбору и доставке`,
      articleUk: geoVariant.articleUk,
      articleRu: geoVariant.articleRu,
      faqUk: geoVariant.faqUk,
      faqRu: geoVariant.faqRu,
      statsBanner: formatSeoStatsBanner(stats, { uk: city.nameUk, ru: city.nameRu }),
      relatedLinks: buildGeoRelatedLinks(city.slug, template.variantSlug),
      breadcrumbs: [
        {
          labelUk: 'Крафтові солодощі України',
          labelRu: 'Крафтовые сладости Украины',
          hrefUk: '/',
          hrefRu: '/ru',
        },
        {
          labelUk: `Крафтові солодощі: ${city.nameUk}`,
          labelRu: `Крафтовые сладости: ${city.nameRu}`,
          hrefUk: `/misto/${city.slug}`,
          hrefRu: `/ru/misto/${city.slug}`,
        },
        { labelUk: template.shortUk, labelRu: template.shortRu },
      ],
    },
  };
}

export function buildGiftLandingMetadata(slug: string, lang: 'uk' | 'ru'): Metadata {
  const gift = findGiftLanding(slug);
  if (!gift) return {};

  const ukPath = `/podarunky/${gift.slug}`;
  const canonical = lang === 'ru' ? `${SITE_URL}/ru${ukPath}` : `${SITE_URL}${ukPath}`;
  const title = lang === 'ru' ? gift.titleRu : gift.titleUk;
  const description = lang === 'ru' ? gift.metaDescRu : gift.metaDescUk;

  return {
    title,
    description,
    alternates: { canonical, languages: buildHreflangAlternates(ukPath) },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === 'ru' ? 'ru_UA' : 'uk_UA',
      type: 'website',
    },
  };
}

export function buildGiftLandingPageData(slug: string, lang: 'uk' | 'ru'): ResolvedSeoPageData | null {
  const gift = findGiftLanding(slug);
  if (!gift) return null;

  const isRu = lang === 'ru';
  const homePrefix = isRu ? `${SITE_URL}/ru` : SITE_URL;
  const secMeta = getSectionMeta(gift.section);
  const stats = computeLandingStats(gift.categorySlug);
  const pageUrl = `${homePrefix}/podarunky/${gift.slug}`;

  const siblingGifts: SeoRelatedLinkGroup = {
    titleUk: 'Інші подарунки та приводи:',
    titleRu: 'Другие подарки и поводы:',
    items: GIFT_OCCASION_LANDINGS.filter((g) => g.slug !== gift.slug)
      .slice(0, 8)
      .map((g) => ({
        labelUk: g.crumbUk,
        labelRu: g.crumbRu,
        hrefUk: `/podarunky/${g.slug}`,
        hrefRu: `/ru/podarunky/${g.slug}`,
      })),
  };

  const cityShortcuts: SeoRelatedLinkGroup = {
    titleUk: 'Замовити з локальною доставкою у містах:',
    titleRu: 'Заказать с локальной доставкой по городам:',
    items: PROGRAMMATIC_CITIES.slice(0, 6).map((c) => ({
      labelUk: c.nameUk,
      labelRu: c.nameRu,
      hrefUk: `/misto/${c.slug}`,
      hrefRu: `/ru/misto/${c.slug}`,
    })),
  };

  const schemas = [
    generateCityCategoryItemListSchema(
      isRu ? gift.h1Ru : gift.h1Uk,
      isRu ? 'Украина' : 'Україна',
      stats.matchingMakers.slice(0, 10),
      lang
    ),
    generateFaqSchema(isRu ? gift.faqRu : gift.faqUk),
    generateBreadcrumbSchema([
      { name: isRu ? 'Крафтовые сладости Украины' : 'Крафтові солодощі України', url: homePrefix },
      { name: isRu ? secMeta.labelRu : secMeta.labelUk, url: isRu ? `${SITE_URL}${secMeta.hrefRu}` : `${SITE_URL}${secMeta.hrefUk}` },
      { name: isRu ? gift.crumbRu : gift.crumbUk, url: pageUrl },
    ]),
  ];

  return {
    schemas,
    initialSection: gift.section,
    initialCategory: gift.categorySlug,
    initialCity: 'all',
    initialVariantId: gift.variantId,
    initialLang: lang,
    seoOverride: {
      h1Uk: gift.h1Uk,
      h1Ru: gift.h1Ru,
      leadUk: gift.leadUk,
      leadRu: gift.leadRu,
      articleTitleUk: `Як обрати ${gift.crumbUk.toLowerCase()}: поради CrafoHab`,
      articleTitleRu: `Как выбрать ${gift.crumbRu.toLowerCase()}: советы CrafoHab`,
      articleUk: gift.articleUk,
      articleRu: gift.articleRu,
      faqUk: gift.faqUk,
      faqRu: gift.faqRu,
      statsBanner: formatSeoStatsBanner(stats),
      relatedLinks: [siblingGifts, cityShortcuts],
      breadcrumbs: [
        {
          labelUk: 'Крафтові солодощі України',
          labelRu: 'Крафтовые сладости Украины',
          hrefUk: '/',
          hrefRu: '/ru',
        },
        {
          labelUk: secMeta.labelUk,
          labelRu: secMeta.labelRu,
          hrefUk: secMeta.hrefUk,
          hrefRu: secMeta.hrefRu,
        },
        { labelUk: gift.crumbUk, labelRu: gift.crumbRu },
      ],
    },
  };
}

export function buildKatalogMetadata(slug: string): Metadata {
  const url = `${SITE_URL}/katalog/${slug}`;
  const cat = CATEGORIES.find((c) => c.slug === slug && c.slug !== 'all');
  if (cat) {
    return {
      title: cat.seoH1,
      description: cat.seoDescription,
      alternates: { canonical: url },
      openGraph: {
        title: cat.seoH1,
        description: cat.seoDescription,
        url,
        siteName: SITE_NAME,
        locale: 'uk_UA',
        type: 'website',
      },
    };
  }

  const trend = findNicheTrendLanding(slug);
  if (trend) {
    return {
      title: trend.titleUk,
      description: trend.metaDescUk,
      alternates: { canonical: url },
      openGraph: {
        title: trend.titleUk,
        description: trend.metaDescUk,
        url,
        siteName: SITE_NAME,
        locale: 'uk_UA',
        type: 'website',
      },
    };
  }

  return {};
}

export function buildKatalogPageData(slug: string): ResolvedSeoPageData | null {
  const url = `${SITE_URL}/katalog/${slug}`;
  const cat = CATEGORIES.find((c) => c.slug === slug && c.slug !== 'all');

  if (cat) {
    const section =
      cat.slug === 'avtorski-torty-ta-deserty'
        ? 'cakes'
        : cat.slug === 'kraftovyi-zefir-ta-bukety'
        ? 'zefir'
        : 'chocolate';
    const secMeta = getSectionMeta(section);
    const stats = computeLandingStats(cat.slug as Exclude<CategorySlug, 'all'>);

    const trendCrossLinks: SeoRelatedLinkGroup = {
      titleUk: 'Спеціалізовані підбірки та тренди:',
      titleRu: 'Специализированные подборки и тренды:',
      items: NICHE_TREND_LANDINGS.slice(0, 6).map((t) => ({
        labelUk: t.crumbUk,
        labelRu: t.crumbUk,
        hrefUk: `/katalog/${t.slug}`,
      })),
    };

    return {
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Крафтові солодощі України', url: SITE_URL },
          { name: secMeta.labelUk, url: `${SITE_URL}${secMeta.hrefUk}` },
          { name: cat.shortTitle, url },
        ]),
      ],
      initialSection: section,
      initialCategory: cat.slug as CategorySlug,
      initialCity: 'all',
      initialLang: 'uk',
      seoOverride: {
        h1Uk: cat.seoH1,
        leadUk: cat.seoDescription,
        articleTitleUk: cat.titleUk,
        articleUk: cat.expertGuide,
        statsBanner: formatSeoStatsBanner(stats),
        relatedLinks: [trendCrossLinks],
        breadcrumbs: [
          { labelUk: 'Крафтові солодощі України', hrefUk: '/' },
          { labelUk: secMeta.labelUk, hrefUk: secMeta.hrefUk },
          { labelUk: cat.shortTitle },
        ],
      },
    };
  }

  const trend = findNicheTrendLanding(slug);
  if (!trend) return null;

  const secMeta = getSectionMeta(trend.section);
  const stats = computeLandingStats(trend.categorySlug);

  const siblingTrends: SeoRelatedLinkGroup = {
    titleUk: 'Схожі спеціалізовані підбірки:',
    titleRu: 'Похожие специализированные подборки:',
    items: NICHE_TREND_LANDINGS.filter((t) => t.slug !== trend.slug)
      .slice(0, 7)
      .map((t) => ({
        labelUk: t.crumbUk,
        labelRu: t.crumbUk,
        hrefUk: `/katalog/${t.slug}`,
      })),
  };

  const giftSuggestions: SeoRelatedLinkGroup = {
    titleUk: 'Популярні подарункові набори:',
    titleRu: 'Популярные подарочные наборы:',
    items: GIFT_OCCASION_LANDINGS.slice(0, 5).map((g) => ({
      labelUk: g.crumbUk,
      labelRu: g.crumbRu,
      hrefUk: `/podarunky/${g.slug}`,
      hrefRu: `/ru/podarunky/${g.slug}`,
    })),
  };

  return {
    schemas: [
      generateCityCategoryItemListSchema(
        trend.h1Uk,
        'Україна',
        stats.matchingMakers.slice(0, 10),
        'uk'
      ),
      generateFaqSchema(trend.faqUk),
      generateBreadcrumbSchema([
        { name: 'Крафтові солодощі України', url: SITE_URL },
        { name: secMeta.labelUk, url: `${SITE_URL}${secMeta.hrefUk}` },
        { name: trend.crumbUk, url },
      ]),
    ],
    initialSection: trend.section,
    initialCategory: trend.categorySlug,
    initialCity: 'all',
    initialVariantId: trend.variantId,
    initialLang: 'uk',
    seoOverride: {
      h1Uk: trend.h1Uk,
      leadUk: trend.leadUk,
      articleTitleUk: trend.articleTitleUk,
      articleUk: trend.articleUk,
      faqUk: trend.faqUk,
      statsBanner: formatSeoStatsBanner(stats),
      relatedLinks: [siblingTrends, giftSuggestions],
      breadcrumbs: [
        { labelUk: 'Крафтові солодощі України', hrefUk: '/' },
        { labelUk: secMeta.labelUk, hrefUk: secMeta.hrefUk },
        { labelUk: trend.crumbUk },
      ],
    },
  };
}
