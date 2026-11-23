import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CATEGORIES } from '@/data/chocolateData';
import { NICHE_TREND_LANDINGS } from '@/data/programmaticSeo';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildKatalogMetadata, buildKatalogPageData } from '@/lib/seoPageBuilder';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    ...CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => ({
      slug: cat.slug,
    })),
    ...NICHE_TREND_LANDINGS.map((trend) => ({
      slug: trend.slug,
    })),
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildKatalogMetadata(slug);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const resolved = buildKatalogPageData(slug);

  if (!resolved) {
    notFound();
  }

  return (
    <>
      {resolved.schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <ChocoRadarApp
        initialSection={resolved.initialSection}
        initialCategory={resolved.initialCategory}
        initialCity={resolved.initialCity}
        initialVariantId={resolved.initialVariantId}
        initialLang={resolved.initialLang}
        initialMakers={getMakersForSection(resolved.initialSection)}
        catalogSummary={getCatalogSummary()}
        seoOverride={resolved.seoOverride}
      />
    </>
  );
}
