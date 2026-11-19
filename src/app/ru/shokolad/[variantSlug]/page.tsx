import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CHOCOLATE_VARIANTS } from '@/data/sectionVariants';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

interface PageProps {
  params: Promise<{ variantSlug: string }>;
}

export async function generateStaticParams() {
  return CHOCOLATE_VARIANTS.map((v) => ({
    variantSlug: v.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { variantSlug } = await params;
  const variant = CHOCOLATE_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) return {};

  const title = `${variant.titleRu} — основные производители крафтового шоколада Украины | CrafoHab`;
  const description = `${variant.shortDescRu} Сравнение состава, цены за 100 г, прямые сайты и контакты проверенных мастерских Украины.`;
  const url = `${SITE_URL}/ru/shokolad/${variant.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`/shokolad/${variant.slug}`),
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

export default async function RuChocolateVariantPage({ params }: PageProps) {
  const { variantSlug } = await params;
  const variant = CHOCOLATE_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) {
    notFound();
  }

  const url = `${SITE_URL}/ru/shokolad/${variant.slug}`;
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/ru` },
    { name: 'Шоколад и конфеты', url: `${SITE_URL}/ru/shokolad` },
    { name: variant.titleRu, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialSection="chocolate"
        initialCategory={variant.categorySlug}
        initialVariantId={variant.id}
        initialLang="ru"
        seoOverride={{
          h1Uk: `${variant.titleUk} — кращі крафтові виробники України`,
          h1Ru: `${variant.titleRu} — лучшие крафтовые производители Украины`,
          leadUk: variant.shortDescUk,
          leadRu: variant.shortDescRu,
          articleTitleUk: `Особливості вибору: ${variant.titleUk}`,
          articleTitleRu: `Особенности выбора: ${variant.titleRu}`,
          articleUk: `${variant.detailedAssortmentUk} Склад: ${variant.ingredientsUk} Термін зберігання: ${variant.shelfLifeUk}.`,
          articleRu: `${variant.detailedAssortmentRu} Состав: ${variant.ingredientsRu} Срок хранения: ${variant.shelfLifeRu}.`,
        }}
      />
    </>
  );
}
