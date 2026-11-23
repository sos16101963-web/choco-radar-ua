import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { CITY_SECTION_COMBOS } from '@/data/cityCategorySeo';
import { GEO_VARIANT_LANDINGS } from '@/data/programmaticSeo';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildGeoSectionMetadata, buildGeoSectionPageData } from '@/lib/seoPageBuilder';

interface PageProps {
  params: Promise<{
    citySlug: string;
    sectionSlug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    ...CITY_SECTION_COMBOS.map((combo) => ({
      citySlug: combo.citySlug,
      sectionSlug: combo.categorySlug,
    })),
    ...GEO_VARIANT_LANDINGS.map((entry) => ({
      citySlug: entry.citySlug,
      sectionSlug: entry.sectionSlug,
    })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, sectionSlug } = await params;
  return buildGeoSectionMetadata(citySlug, sectionSlug, 'uk');
}

export default async function CitySectionPage({ params }: PageProps) {
  const { citySlug, sectionSlug } = await params;
  const resolved = buildGeoSectionPageData(citySlug, sectionSlug, 'uk');

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
