import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CAKE_VARIANTS } from '@/data/sectionVariants';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

interface PageProps {
  params: Promise<{ variantSlug: string }>;
}

export async function generateStaticParams() {
  return CAKE_VARIANTS.map((v) => ({
    variantSlug: v.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { variantSlug } = await params;
  const variant = CAKE_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) return {};

  const title = `${variant.titleRu} — проверенные кондитерские Украины`;
  const description = `${variant.shortDescRu} Заказ праздничных и авторских тортов напрямую у мастерских без наценок.`;
  const url = `${SITE_URL}/ru/torty/${variant.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`/torty/${variant.slug}`),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ru_UA',
      type: 'website',
    },
  };
}

export default async function RuCakeVariantPage({ params }: PageProps) {
  const { variantSlug } = await params;
  const variant = CAKE_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) {
    notFound();
  }

  const url = `${SITE_URL}/ru/torty/${variant.slug}`;
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/ru` },
    { name: 'Авторские торты', url: `${SITE_URL}/ru/torty` },
    { name: variant.titleRu, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialSection="cakes"
        initialCategory={variant.categorySlug}
        initialVariantId={variant.id}
        initialLang="ru"
        initialMakers={getMakersForSection('cakes')}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: `${variant.titleUk} — перевірені кондитерські України`,
          h1Ru: `${variant.titleRu} — проверенные кондитерские Украины`,
          leadUk: variant.shortDescUk,
          leadRu: variant.shortDescRu,
          articleTitleUk: `Про формат: ${variant.titleUk}`,
          articleTitleRu: `О формате: ${variant.titleRu}`,
          articleUk: `${variant.detailedAssortmentUk} Склад: ${variant.ingredientsUk} Термін зберігання: ${variant.shelfLifeUk}.`,
          articleRu: `${variant.detailedAssortmentRu} Состав: ${variant.ingredientsRu} Срок хранения: ${variant.shelfLifeRu}.`,
        }}
      />
    </>
  );
}
