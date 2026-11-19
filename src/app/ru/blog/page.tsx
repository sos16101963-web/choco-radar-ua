import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';
import { CATEGORIES, MAKERS } from '@/data/chocolateData';
import { ArrowUpRight, BookOpen, Clock, Sparkles, MapPin } from 'lucide-react';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';
import { buildHreflangAlternates, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

export const metadata: Metadata = {
  title: 'Блог CrafoHab — Рейтинги, обзоры и гиды по выбору крафтового шоколада, зефира и тортов Украины',
  description:
    'Экспертные статьи CrafoHab: как выбрать настоящую крафтовую плитку шоколада и батончик, шоколадные цветы Callebaut, безопасные сладости для детей, изделия без сахара, зефирные букеты и авторские торты.',
  alternates: {
    canonical: `${SITE_URL}/ru/blog`,
    languages: buildHreflangAlternates('/blog'),
  },
  openGraph: {
    title: 'Блог CrafoHab — Экспертные рейтинги и гиды покупателя',
    description:
      'Обзоры, рейтинги и гиды по выбору крафтового шоколада, шоколадных цветов, изделий без сахара, сладостей для детей, зефира и авторских тортов в Украине.',
    url: `${SITE_URL}/ru/blog`,
    siteName: SITE_NAME,
    locale: 'ru_UA',
    type: 'website',
  },
};

export default function RuBlogIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Экспертный блог CrafoHab Украина',
    url: `${SITE_URL}/ru/blog`,
    inLanguage: 'ru-UA',
    description:
      'Обзоры, рейтинги и гиды по выбору крафтового шоколада, шоколадных цветов, изделий без сахара, сладостей для детей, зефира и авторских тортов в Украине.',
    blogPost: BLOG_ARTICLES.map((art) => ({
      '@type': 'BlogPosting',
      headline: art.titleRu,
      description: art.excerptRu,
      datePublished: art.publishedAt,
      url: `${SITE_URL}/ru/blog/${art.slug}`,
      author: {
        '@id': `${SITE_URL}/#organization`,
      },
    })),
  };

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/ru` },
    { name: 'Блог', url: `${SITE_URL}/ru/blog` },
  ]);

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
          <Link href="/ru" className="flex items-center gap-2.5">
            <span className="grid w-10 h-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-lg">
              🍫
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Crafo<span className="text-[#b06a1e]">Hab</span></span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#b06a1e]">
                  в Украине
                </span>
                <span className="text-xs sm:text-sm font-normal text-stone-500">• Блог</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#4a382e]">
                crafohab.com.ua
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-full p-0.5 border border-[#d4c3b3] bg-[#f1e6da] text-[11px] font-extrabold">
              <Link
                href="/blog"
                className="rounded-full px-2.5 py-1 text-[#4a382e] hover:text-[#1a100c] transition"
              >
                УКР
              </Link>
              <span className="rounded-full px-2.5 py-1 bg-[#462b1f] text-[#faf4eb]">
                РУС
              </span>
            </div>

            <Link
              href="/ru"
              className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-2 text-xs font-bold transition"
            >
              ← В каталог {MAKERS.length} мастерских
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e39851]/20 border border-[#b06a1e]/40 px-3.5 py-1 text-xs font-bold text-[#8c4f12]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Экспертный Журнал и SEO-Навигатор CrafoHab 2027</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Блог о крафтовом шоколаде, сладостях без сахара, тортах и букетах
          </h1>
          <p className="text-sm sm:text-base text-[#5a4638] leading-relaxed">
            Честные разборы состава, рейтинги украинских производителей, секреты выбора шоколадных цветов Callebaut, безопасных детских лакомств на кэробе и авторских тортов.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col"
            >
              <Link href={`/ru/blog/${article.slug}`} className="relative h-72 sm:h-80 overflow-hidden bg-[#f1e6da] block">
                <img
                  src={getOptimizedImageUrl(article.heroImage, 600, 75)}
                  alt={article.titleRu}
                  width={600}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#462b1f]/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                    {article.categoryLabelRu}
                  </span>
                </div>
              </Link>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#715f53] font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#b06a1e]" />
                      {article.readTimeMinutes} мин чтения
                    </span>
                    <span>•</span>
                    <span>{article.authorRu}</span>
                  </div>

                  <Link href={`/ru/blog/${article.slug}`}>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug group-hover:text-[#b06a1e] transition">
                      {article.titleRu}
                    </h2>
                  </Link>

                  <p className="text-sm text-[#5a4638] leading-relaxed">{article.excerptRu}</p>
                </div>

                <div className="pt-3 border-t border-[#e1d5c8] flex items-center justify-between">
                  <Link
                    href={`/ru/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#b06a1e] hover:underline"
                  >
                    <span>Читать статью полностью</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/katalog/${article.categorySlug}`}
                    className="text-xs font-semibold text-[#715f53] hover:text-[#302016]"
                  >
                    Перейти в рубрику →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SEO Navigation Hub: Categories & Cities */}
        <section className="rounded-3xl border border-[#e1d5c8] bg-[#f1e6da]/60 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#b06a1e]" />
              <span>SEO-разделы платформы по рубрикам и городам Украины</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5a4638]">
              Прямые посадочные страницы для быстрого поиска проверенных крафтовых производителей в вашем регионе:
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
              Все рубрики изделий:
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/katalog/${cat.slug}`}
                  className="rounded-full bg-[#fefbf7] border border-[#d4c3b3] hover:border-[#b06a1e] px-3.5 py-1.5 text-xs font-bold transition"
                >
                  {cat.emoji} {cat.shortTitle}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Крафтовые мастерские по городам:</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {CITY_SEO_HUBS.map((city) => (
                <Link
                  key={city.slug}
                  href={`/ru/misto/${city.slug}`}
                  className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-1.5 text-xs font-bold transition"
                >
                  📍 {city.cityNameRu}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
