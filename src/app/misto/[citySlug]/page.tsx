import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITY_SEO_HUBS } from '@/data/blogData';
import ChocoRadarApp from '@/components/ChocoRadarApp';

interface CityPageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateStaticParams() {
  return CITY_SEO_HUBS.map((city) => ({
    citySlug: city.slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = CITY_SEO_HUBS.find((c) => c.slug === citySlug);
  if (!city) return {};

  return {
    title: city.h1Uk,
    description: city.descriptionUk,
    alternates: {
      canonical: `https://choco-radar-ua.vercel.app/misto/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug } = await params;
  const city = CITY_SEO_HUBS.find((c) => c.slug === citySlug);
  if (!city) {
    notFound();
  }

  return <ChocoRadarApp initialCategory="all" initialCity={city.regionFilterId} />;
}
