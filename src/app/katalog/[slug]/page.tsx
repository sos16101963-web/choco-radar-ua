import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, CategorySlug } from '@/data/chocolateData';
import ChocoRadarApp from '@/components/ChocoRadarApp';
import { getCatalogSummary, getMakersForSection } from '@/lib/catalogData';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

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

  const url = `${SITE_URL}/katalog/${cat.slug}`;

  return {
    title: cat.seoH1,
    description: cat.seoDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: cat.seoH1,
      description: cat.seoDescription,
      url,
      siteName: SITE_NAME,
      locale: 'uk_UA',
      type: 'website',
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

  const parentSection =
    section === 'cakes'
      ? { label: 'Авторські торти на замовлення', href: '/torty', url: `${SITE_URL}/torty` }
      : section === 'zefir'
      ? { label: 'Крафтовий зефір та букети', href: '/zefir', url: `${SITE_URL}/zefir` }
      : { label: 'Крафтовий шоколад та цукерки', href: '/shokolad', url: `${SITE_URL}/shokolad` };

  const url = `${SITE_URL}/katalog/${cat.slug}`;
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Крафтові солодощі України', url: SITE_URL },
    { name: parentSection.label, url: parentSection.url },
    { name: cat.shortTitle, url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ChocoRadarApp
        initialSection={section}
        initialCategory={cat.slug as CategorySlug}
        initialMakers={getMakersForSection(section)}
        catalogSummary={getCatalogSummary()}
        seoOverride={{
          h1Uk: cat.seoH1,
          leadUk: cat.seoDescription,
          articleTitleUk: cat.titleUk,
          articleUk: cat.expertGuide,
          breadcrumbs: [
            { labelUk: 'Крафтові солодощі України', hrefUk: '/' },
            { labelUk: parentSection.label, hrefUk: parentSection.href },
            { labelUk: cat.shortTitle },
          ],
        }}
      />
    </>
  );
}
