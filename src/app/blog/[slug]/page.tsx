import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_ARTICLES } from '@/data/blogData';
import { ArrowUpRight, Clock, Crown, Sparkles } from 'lucide-react';

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

  return {
    title: article.titleUk,
    description: article.excerptUk,
    keywords: article.seoKeywords,
    alternates: {
      canonical: `https://choco-radar-ua.vercel.app/blog/${article.slug}`,
    },
    openGraph: {
      title: article.titleUk,
      description: article.excerptUk,
      url: `https://choco-radar-ua.vercel.app/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [article.heroImage],
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.titleUk,
        description: article.excerptUk,
        datePublished: article.publishedAt,
        author: {
          '@type': 'Organization',
          name: 'CraftHub Україна',
        },
        publisher: {
          '@type': 'Organization',
          name: 'CraftHub Україна',
          url: 'https://choco-radar-ua.vercel.app',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.qUk,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.aUk,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/blog" className="text-xs sm:text-sm font-bold text-[#b06a1e] hover:underline">
            ← Усі статті Блогу CraftSweets
          </Link>
          <Link
            href="/"
            className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-2 text-xs font-bold transition"
          >
            До каталогу майстрів
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#b06a1e]">
            <Link
              href={`/katalog/${article.categorySlug}`}
              className="rounded-full bg-[#f1e6da] px-3.5 py-1 text-[#302016] hover:bg-[#e5d5c3]"
            >
              {article.categoryLabelUk}
            </Link>
            <span className="flex items-center gap-1 text-[#715f53]">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} хв читання
            </span>
            <span className="text-[#715f53]">• {article.authorUk}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {article.titleUk}
          </h1>

          <p className="text-base sm:text-lg text-[#5a4638] leading-relaxed font-medium">
            {article.excerptUk}
          </p>
        </div>

        {/* Big Clear Photo Banner */}
        <div className="rounded-3xl overflow-hidden border border-[#e1d5c8] shadow-md bg-[#f1e6da] h-72 sm:h-96">
          <img
            src={article.heroImage}
            alt={article.titleUk}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Article Sections */}
        <div className="space-y-8 rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-6 sm:p-10 shadow-xs">
          {article.sections.map((sec, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#302016]">
                {sec.headingUk}
              </h2>
              <p className="text-sm sm:text-base text-[#5a4638] leading-relaxed">{sec.bodyUk}</p>
            </section>
          ))}

          {/* Native Recommendation Box for #1 Leader Crafo.com.ua */}
          <div className="rounded-2xl border-2 border-[#e39851] bg-gradient-to-r from-[#fff8ef] to-[#f4e6d4] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e39851] px-3 py-0.5 text-[11px] font-extrabold text-[#26140b]">
                <Crown className="w-3.5 h-3.5" />
                <span>Рекомендація редакції CraftHub №1</span>
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#302016]">
                CraftChoco / ChocoCraft (crafo.com.ua) — Лідер категорії Шоколад
              </h3>
              <p className="text-xs sm:text-sm text-[#5a4638]">
                Плитки шоколаду, батончики, авторські цукерки та букети з шоколадних троянд зі 100% бельгійського шоколаду Barry Callebaut. Доставка Новою Поштою по всій Україні.
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
              <span>Відповіді на часті запитання</span>
            </h2>
            {article.faq.map((f, i) => (
              <div key={i} className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base">{f.qUk}</h3>
                <p className="text-xs sm:text-sm text-[#5a4638] leading-relaxed">{f.aUk}</p>
              </div>
            ))}
          </section>
        )}
      </article>
    </div>
  );
}
