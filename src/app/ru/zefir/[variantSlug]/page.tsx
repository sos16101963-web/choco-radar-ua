import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { ZEFIR_VARIANTS } from '@/data/sectionVariants';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

interface PageProps {
  params: Promise<{ variantSlug: string }>;
}

export async function generateStaticParams() {
  return ZEFIR_VARIANTS.map((v) => ({
    variantSlug: v.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { variantSlug } = await params;
  const variant = ZEFIR_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) return {};

  const title = `${variant.titleRu} — основные мастерские зефира Украины | CrafoHab`;
  const description = `${variant.shortDescRu} Натуральный крафтовый зефир на агар-агаре, букеты и сладости без сахара от производителей.`;
  const url = `${SITE_URL}/ru/zefir/${variant.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`/zefir/${variant.slug}`),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ru_UA',
      type: 'website',
    },
  };
}

export default async function RuZefirVariantPage({ params }: PageProps) {
  const { variantSlug } = await params;
  const variant = ZEFIR_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) {
    notFound();
  }

  const url = `${SITE_URL}/ru/zefir/${variant.slug}`;
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/ru` },
    { name: 'Крафтовый зефир', url: `${SITE_URL}/ru/zefir` },
    { name: variant.titleRu, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialSection="zefir"
        initialCategory={variant.categorySlug}
        initialVariantId={variant.id}
        initialLang="ru"
        seoOverride={{
          h1Uk: `${variant.titleUk} — кращі майстерні України`,
          h1Ru: `${variant.titleRu} — лучшие мастерские Украины`,
          leadUk: variant.shortDescUk,
          leadRu: variant.shortDescRu,
          articleTitleUk: `Гід по категорії: ${variant.titleUk}`,
          articleTitleRu: `Гид по категории: ${variant.titleRu}`,
          articleUk: `${variant.detailedAssortmentUk} Склад: ${variant.ingredientsUk} Термін зберігання: ${variant.shelfLifeUk}.`,
          articleRu: `${variant.detailedAssortmentRu} Состав: ${variant.ingredientsRu} Срок хранения: ${variant.shelfLifeRu}.`,
        }}
      />
    </>
  );
}
