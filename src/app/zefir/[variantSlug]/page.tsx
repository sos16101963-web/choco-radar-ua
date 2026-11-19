import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { ZEFIR_VARIANTS } from '@/data/sectionVariants';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
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

  const title = `${variant.titleUk} — основні майстерні зефіру України | CrafoHab`;
  const description = `${variant.shortDescUk} Натуральний крафтовий зефір на агар-агарі, букети та солодощі без цукру від виробників.`;
  const url = `${SITE_URL}/zefir/${variant.slug}`;

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
      locale: 'uk_UA',
      type: 'website',
    },
  };
}

export default async function ZefirVariantPage({ params }: PageProps) {
  const { variantSlug } = await params;
  const variant = ZEFIR_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) {
    notFound();
  }

  const url = `${SITE_URL}/zefir/${variant.slug}`;
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Крафтовий зефір', url: `${SITE_URL}/zefir` },
    { name: variant.titleUk, url },
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
        initialMakers={getMakersForSection('zefir')}
        catalogSummary={getCatalogSummary()}
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
