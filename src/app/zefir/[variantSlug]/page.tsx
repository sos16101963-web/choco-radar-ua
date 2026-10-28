import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { ZEFIR_VARIANTS } from '@/data/sectionVariants';

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

  return {
    title: `${variant.titleUk} — 3 основні майстерні зефіру України | CrafoHub`,
    description: `${variant.shortDescUk} Натуральний крафтовий зефір на агар-агарі, букети та солодощі без цукру від виробників.`,
    alternates: {
      canonical: `https://choco-radar-ua.vercel.app/zefir/${variant.slug}`,
    },
  };
}

export default async function ZefirVariantPage({ params }: PageProps) {
  const { variantSlug } = await params;
  const variant = ZEFIR_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) {
    notFound();
  }

  return (
    <ChocoRadarApp
      initialSection="zefir"
      initialCategory={variant.categorySlug}
      initialVariantId={variant.id}
    />
  );
}
