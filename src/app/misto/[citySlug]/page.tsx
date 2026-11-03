import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITY_SEO_HUBS } from '@/data/blogData';
import { MAKERS } from '@/data/chocolateData';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import {
  generateCityCategoryItemListSchema,
  generateBreadcrumbSchema,
} from '@/utils/seoSchema';

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

  const cityMakers = MAKERS.filter(
    (m) =>
      (m.city || '').toLowerCase().includes(city.cityNameUk.toLowerCase()) ||
      (m.regionCity || '').toLowerCase().includes(city.cityNameUk.toLowerCase())
  );

  const itemListSchema = generateCityCategoryItemListSchema(
    city.h1Uk,
    city.cityNameUk,
    cityMakers.length > 0 ? cityMakers : MAKERS.slice(0, 5)
  );

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'CrafoHub', url: 'https://choco-radar-ua.vercel.app' },
    { name: `Майстерні: ${city.cityNameUk}`, url: `https://choco-radar-ua.vercel.app/misto/${city.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp initialCategory="all" initialCity={city.regionFilterId} />
    </>
  );
}
