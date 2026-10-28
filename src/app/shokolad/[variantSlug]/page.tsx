import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CHOCOLATE_VARIANTS } from '@/data/sectionVariants';

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

  return {
    title: `${variant.titleUk} — 3 основні виробники крафтового шоколаду України | CrafoHub`,
    description: `${variant.shortDescUk} Порівняння складу, ціни за 100 г, прямі сайти та контакти перевірених майстерень України.`,
    alternates: {
      canonical: `https://choco-radar-ua.vercel.app/shokolad/${variant.slug}`,
    },
  };
}

export default async function ChocolateVariantPage({ params }: PageProps) {
  const { variantSlug } = await params;
  const variant = CHOCOLATE_VARIANTS.find((v) => v.slug === variantSlug || v.id === variantSlug);
  if (!variant) {
    notFound();
  }

  return (
    <ChocoRadarApp
      initialSection="chocolate"
      initialCategory={variant.categorySlug}
      initialVariantId={variant.id}
    />
  );
}
