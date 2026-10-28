import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';
import { CATEGORIES } from '@/data/chocolateData';
import { ArrowUpRight, BookOpen, Clock, Sparkles, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Блог CrafoHub — Рейтинги, огляди та гіди з вибору крафтового шоколаду, зефіру і тортів України',
  description:
    'Експертні статті CrafoHub: як обрати справжню крафтову плитку шоколаду та батончик, шоколадні квіти Callebaut, безпечні солодощі для дітей, вироби без цукру, зефірні букети та авторські торти.',
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app/blog',
  },
};

export default function BlogIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Експертний блог CrafoHub Україна',
    url: 'https://choco-radar-ua.vercel.app/blog',
    description:
      'Огляди, рейтинги та гіди з вибору крафтового шоколаду, шоколадних квітів, виробів без цукру, солодощів для дітей, зефіру та авторських тортів в Україні.',
    blogPost: BLOG_ARTICLES.map((art) => ({
      '@type': 'BlogPosting',
      headline: art.titleUk,
      description: art.excerptUk,
      datePublished: art.publishedAt,
      url: `https://choco-radar-ua.vercel.app/blog/${art.slug}`,
      author: {
        '@type': 'Organization',
        name: 'CrafoHub Україна',
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid w-10 h-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-lg">
              🍫
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Crafo<span className="text-[#b06a1e]">Hub</span></span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#b06a1e]">
                  в Україні
                </span>
                <span className="text-xs sm:text-sm font-normal text-stone-500">• Блог</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#715f53]">
                crafohub.com.ua
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-2 text-xs font-bold transition"
          >
            ← До каталогу 105 майстерень
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e39851]/20 border border-[#b06a1e]/40 px-3.5 py-1 text-xs font-bold text-[#8c4f12]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Експертний Журнал та SEO-Навігатор CrafoHub 2027</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Блог про крафтовий шоколад, солодощі без цукру, торти та букети
          </h1>
          <p className="text-sm sm:text-base text-[#5a4638] leading-relaxed">
            Чесні розбори складу, рейтинги українських виробників, секрети вибору шоколадних квітів Callebaut, безпечних дитячих ласощів на керобі та авторських тортів.
          </p>
        </div>

        {/* Articles Grid with Large 2x Photo Windows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col"
            >
              <Link href={`/blog/${article.slug}`} className="relative h-72 sm:h-80 overflow-hidden bg-[#f1e6da] block">
                <img
                  src={article.heroImage}
                  alt={article.titleUk}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#462b1f]/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                    {article.categoryLabelUk}
                  </span>
                </div>
              </Link>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#715f53] font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#b06a1e]" />
                      {article.readTimeMinutes} хв читання
                    </span>
                    <span>•</span>
                    <span>{article.authorUk}</span>
                  </div>

                  <Link href={`/blog/${article.slug}`}>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug group-hover:text-[#b06a1e] transition">
                      {article.titleUk}
                    </h2>
                  </Link>

                  <p className="text-sm text-[#5a4638] leading-relaxed">{article.excerptUk}</p>
                </div>

                <div className="pt-3 border-t border-[#e1d5c8] flex items-center justify-between">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#b06a1e] hover:underline"
                  >
                    <span>Читати статтю повністю</span>
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
              <span>SEO-Розділи платформи за рубриками та містами України</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5a4638]">
              Прямі посадкові сторінки для швидкого пошуку перевірених крафтових виробників у вашому регіоні:
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
              Всі рубрики виробів:
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
              <span>Крафтові майстерні за містами:</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {CITY_SEO_HUBS.map((city) => (
                <Link
                  key={city.slug}
                  href={`/misto/${city.slug}`}
                  className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-1.5 text-xs font-bold transition"
                >
                  📍 {city.cityNameUk}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
