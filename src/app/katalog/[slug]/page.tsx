import React from 'react';
import { Metadata } from 'next';
import { CATEGORIES, CategorySlug } from '@/data/chocolateData';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};

  return {
    title: cat.seoH1,
    description: cat.seoDescription,
    alternates: {
      canonical: `https://choco-radar-ua.vercel.app/katalog/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) {
    notFound();
  }

  const section =
    cat.slug === 'avtorski-torty-ta-deserty'
      ? 'cakes'
      : cat.slug === 'kraftovyi-zefir-ta-bukety'
      ? 'zefir'
      : 'chocolate';

  return <ChocoRadarApp initialSection={section} initialCategory={cat.slug as CategorySlug} />;
}
