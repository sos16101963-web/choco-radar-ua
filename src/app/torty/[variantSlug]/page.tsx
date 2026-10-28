import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CAKE_VARIANTS } from '@/data/sectionVariants';

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

  return {
    title: `${variant.titleUk} — 3 основні кондитерські України | CrafoHub`,
    description: `${variant.shortDescUk} Замовлення святкових та авторських тортів напряму у перевірених майстерень без націнок.`,
    alternates: {
      canonical: `https://choco-radar-ua.vercel.app/torty/${variant.slug}`,
    },
  };
}

export default async function CakeVariantPage({ params }: PageProps) {
  const { variantSlug } = await params;
  const variant = CAKE_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) {
    notFound();
  }

  return (
    <ChocoRadarApp
      initialSection="cakes"
      initialCategory={variant.categorySlug}
      initialVariantId={variant.id}
    />
  );
}
