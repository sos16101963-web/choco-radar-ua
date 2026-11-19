import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_ARTICLES } from '@/data/blogData';
import { ArrowUpRight, Clock, Crown, Sparkles, Compass, BookOpen } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildHreflangAlternates, SITE_NAME, SITE_URL, toAbsoluteUrl } from '@/lib/siteConfig';
import { generateBlogArticleSchema } from '@/utils/seoSchema';

const CATEGORY_CRUMB_MAP: Record<string, { labelRu: string; hrefRu: string }> = {
  'shokoladni-kvity-ta-bukety': {
    labelRu: 'Шоколадные цветы и букеты',
    hrefRu: '/ru/shokolad/shokoladni-kvity',
  },
  'plytky-shokoladu': {
    labelRu: 'Плитка шоколада и батончики',
    hrefRu: '/ru/shokolad/plytky-shokoladu',
  },
  'korpusni-ta-rozmalovani-tsukerky': {
    labelRu: 'Конфеты ручной работы и трюфели',
    hrefRu: '/ru/shokolad/tsukerky-ta-tryufeli',
  },
  'malyna-ta-polunytsia-v-shokoladi': {
    labelRu: 'Малина и клубника в шоколаде',
    hrefRu: '/ru/shokolad/yagody-v-shokoladi',
  },
  'horikhy-ta-sukhofrukty-v-shokoladi': {
    labelRu: 'Орехи и сухофрукты в шоколаде',
    hrefRu: '/ru/shokolad/gorikhy-v-shokoladi',
  },
  'solodoshchi-dlia-ditei': {
    labelRu: 'Сладости для детей',
    hrefRu: '/ru/shokolad/dytiachi-solodoshchi',
  },
  'avtorski-torty-ta-deserty': {
    labelRu: 'Авторские торты и десерты',
    hrefRu: '/ru/torty',
  },
  'kraftovyi-zefir-ta-bukety': {
    labelRu: 'Крафтовый зефир и букеты',
    hrefRu: '/ru/zefir',
  },
};

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  const url = `${SITE_URL}/ru/blog/${article.slug}`;
  const ogImage = toAbsoluteUrl(article.heroImage);

  return {
    title: article.titleRu,
    description: article.excerptRu,
    keywords: article.seoKeywords,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`/blog/${article.slug}`),
    },
    openGraph: {
      title: article.titleRu,
      description: article.excerptRu,
      url,
      siteName: SITE_NAME,
      locale: 'ru_UA',
      type: 'article',
      publishedTime: article.publishedAt,
      images: [ogImage],
    },
  };
}

export default async function RuBlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const catCrumb = CATEGORY_CRUMB_MAP[article.categorySlug] || {
    labelRu: article.categoryLabelRu,
    hrefRu: '/ru/shokolad',
  };
  const jsonLd = generateBlogArticleSchema(article, 'ru', {
    name: catCrumb.labelRu,
    url: `${SITE_URL}${catCrumb.hrefRu}`,
  });
  const otherArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 gap-3">
          <Link href="/ru/blog" className="text-xs sm:text-sm font-bold text-[#b06a1e] hover:underline">
            ← Все статьи Блога CrafoHab
          </Link>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-full p-0.5 border border-[#d4c3b3] bg-[#f1e6da] text-[11px] font-extrabold">
              <Link
                href={`/blog/${article.slug}`}
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
              В каталог мастеров
            </Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-10 sm:px-6 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Крафтовые сладости Украины', href: '/ru' },
            { label: 'Блог о крафтовых сладостях', href: '/ru/blog' },
            { label: catCrumb.labelRu, href: catCrumb.hrefRu },
            { label: article.titleRu },
          ]}
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#b06a1e]">
            <Link
              href={catCrumb.hrefRu}
              className="rounded-full bg-[#f1e6da] px-3.5 py-1 text-[#302016] hover:bg-[#e5d5c3]"
            >
              {article.categoryLabelRu}
            </Link>
            <span className="flex items-center gap-1 text-[#715f53]">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} мин чтения
            </span>
            <span className="text-[#715f53]">• {article.authorRu}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {article.titleRu}
          </h1>

          <p className="text-base sm:text-lg text-[#5a4638] leading-relaxed font-medium">
            {article.excerptRu}
          </p>
        </div>

        {/* Big Clear Photo Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#e1d5c8] shadow-md bg-[#f1e6da] h-72 sm:h-96">
          <OptimizedImage
            src={article.heroImage}
            alt={article.titleRu}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 896px"
            fallbackWidth={800}
            className="object-cover object-center"
          />
        </div>

        {/* Article Sections */}
        <div className="space-y-8 rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-6 sm:p-10 shadow-xs">
          {article.sections.map((sec, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#302016]">
                {sec.headingRu}
              </h2>
              <p className="text-sm sm:text-base text-[#5a4638] leading-relaxed">{sec.bodyRu}</p>
            </section>
          ))}

          {/* Related Category & City Links */}
          {article.relatedLinks && article.relatedLinks.length > 0 && (
            <div className="rounded-2xl border border-[#e1d5c8] bg-[#fbf6ee] p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
                <Compass className="w-4 h-4" />
                <span>Полезные разделы каталога</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.relatedLinks.map((link) => (
                  <Link
                    key={link.hrefRu || link.hrefUk}
                    href={link.hrefRu || link.hrefUk}
                    className="inline-flex items-center gap-1 rounded-full bg-white border border-[#d4c3b3] hover:border-[#b06a1e] hover:text-[#b06a1e] px-4 py-2 text-xs font-bold transition"
                  >
                    <span>{link.labelRu}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Native Recommendation Box for Crafo.com.ua */}
          <div className="rounded-2xl border-2 border-[#e39851] bg-gradient-to-r from-[#fff8ef] to-[#f4e6d4] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e39851] px-3 py-0.5 text-[11px] font-extrabold text-[#26140b]">
                <Crown className="w-3.5 h-3.5" />
                <span>Проверенная мастерская в каталоге</span>
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#302016]">
                Crafo (crafo.com.ua) — Харьковская мастерская шоколада
              </h3>
              <p className="text-xs sm:text-sm text-[#5a4638]">
                Плитки шоколада, батончики, авторские конфеты и букеты из шоколадных роз из 100% бельгийского шоколада Barry Callebaut. Доставка Новой Почтой по всей Украине.
              </p>
            </div>
            <a
              href="https://crafo.com.ua"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-sm transition"
            >
              <span>Перейти на crafo.com.ua</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* FAQ Block */}
        {article.faq.length > 0 && (
          <section className="rounded-3xl border border-[#e1d5c8] bg-[#f1e6da]/60 p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#b06a1e]" />
              <span>Ответы на частые вопросы</span>
            </h2>
            {article.faq.map((f, i) => (
              <div key={i} className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base">{f.qRu}</h3>
                <p className="text-xs sm:text-sm text-[#5a4638] leading-relaxed">{f.aRu}</p>
              </div>
            ))}
          </section>
        )}

        {/* Other Blog Articles */}
        <section className="space-y-4 pt-2">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#b06a1e]" />
            <span>Другие статьи блога</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherArticles.map((other) => (
              <Link
                key={other.slug}
                href={`/ru/blog/${other.slug}`}
                className="rounded-2xl border border-[#e1d5c8] bg-[#fefbf7] hover:border-[#b06a1e] p-4 flex flex-col justify-between space-y-2 transition"
              >
                <div className="text-[11px] font-bold text-[#b06a1e]">{other.categoryLabelRu}</div>
                <h3 className="font-serif text-sm font-bold leading-snug">{other.titleRu}</h3>
                <span className="text-xs font-semibold text-[#5a4638] inline-flex items-center gap-1">
                  Читать <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
