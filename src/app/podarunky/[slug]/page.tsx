import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { GIFT_OCCASION_LANDINGS } from '@/data/programmaticSeo';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { buildGiftLandingMetadata, buildGiftLandingPageData } from '@/lib/seoPageBuilder';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GIFT_OCCASION_LANDINGS.map((gift) => ({
    slug: gift.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildGiftLandingMetadata(slug, 'uk');
}

export default async function GiftOccasionPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = buildGiftLandingPageData(slug, 'uk');

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
