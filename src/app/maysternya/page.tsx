import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';
import { MAKERS, MakerSegment, CraftMaker } from '@/data/chocolateData';
import { SITE_EMAIL, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';

const pageTitle = `Усі ${MAKERS.length} перевірених крафтових майстерень України — каталог CrafoHab 2027`;
const pageDescription = `Повний довідник перевірених крафтових виробників шоколаду, цукерок ручної роботи, шоколадних квітів, авторських тортів та зефіру в Україні (${MAKERS.length} майстерень). Прямі контакти, рейтинги та сайти без комісії.`;
const pageUrl = `${SITE_URL}/maysternya`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: SITE_NAME,
    locale: 'uk_UA',
    type: 'website',
  },
};

const SEGMENT_GROUPS: { id: MakerSegment; title: string; emoji: string }[] = [
  { id: 'chocolatier-bonbons', title: 'Шоколатьє, корпусні цукерки та авторські плитки', emoji: '🍬' },
  { id: 'bean-to-bar', title: 'Ремісничий шоколад Bean-to-Bar', emoji: '🍫' },
  { id: 'flowers-berries-nuts', title: 'Шоколадні квіти, ягоди та горіхи в шоколаді', emoji: '🌹' },
  { id: 'healthy-vegan', title: 'Вироби без цукру, веган та для дітей', emoji: '🌿' },
  { id: 'craft-zefir-pastila', title: 'Крафтовий зефір, зефірні букети та пастила', emoji: '🌸' },
  { id: 'custom-cakes-pastry', title: 'Авторські торти, бенто та кондитерські ательє', emoji: '🎂' },
];

export default function MakersDirectoryPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Майстерні України', url: pageUrl },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        inLanguage: 'uk-UA',
      },
      {
        '@type': 'ItemList',
        name: `Каталог крафтових майстерень України (${MAKERS.length})`,
        numberOfItems: Math.min(MAKERS.length, 30),
        itemListElement: MAKERS.slice(0, 30).map((m, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${SITE_URL}/maysternya/${m.slug}`,
          name: m.name,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid w-9 h-9 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-base">
              🍫
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight">
                Crafo<span className="text-[#b06a1e]">Hab</span>
              </span>
              <span className="text-[10px] font-medium text-[#4a382e]">crafohab.com.ua</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 text-xs font-bold">
            <Link href="/shokolad" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              🍫 Шоколад
            </Link>
            <Link href="/torty" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              🎂 Торти
            </Link>
            <Link href="/zefir" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              🌸 Зефір
            </Link>
            <Link href="/blog" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              📖 Блог
            </Link>
          </nav>

          <Link
            href="/"
            className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-2 text-xs font-bold transition shrink-0"
          >
            ← На головну
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Header */}
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e39851]/20 border border-[#b06a1e]/40 px-3.5 py-1 text-xs font-extrabold text-[#8c4f12]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Національний реєстр CrafoHab 2027 • {MAKERS.length} майстерень</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Каталог крафтових майстерень України — {MAKERS.length} перевірених виробників
          </h1>
          <p className="text-sm sm:text-base text-[#5a4638] leading-relaxed">
            Персональні профілі українських шоколатьє, кондитерських студій та майстерень зефірної флористики. Обирайте виробника за спеціалізацією та містом і переходьте на пряме замовлення без комісії.
          </p>
        </div>

        {/* Grouped Directory */}
        <div className="space-y-12">
          {SEGMENT_GROUPS.map((group) => {
            const makersInGroup: CraftMaker[] = MAKERS.filter((m) => m.segment === group.id);
            if (makersInGroup.length === 0) return null;

            return (
              <section key={group.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#e1d5c8] pb-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <span>{group.emoji}</span>
                    <span>{group.title}</span>
                  </h2>
                  <span className="rounded-full bg-[#f1e6da] px-3 py-1 text-xs font-extrabold text-[#462b1f] shrink-0">
                    {makersInGroup.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {makersInGroup.map((maker) => (
                    <Link
                      key={maker.id}
                      href={`/maysternya/${maker.slug}`}
                      className="group rounded-2xl border border-[#e1d5c8] bg-[#fefbf7] hover:border-[#b06a1e] hover:shadow-lg transition p-4 flex items-start gap-3.5"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#f1e6da] border border-[#e1d5c8]">
                        <img
                          src={getOptimizedImageUrl(maker.imageUrl, 160, 75)}
                          alt={maker.name}
                          width={64}
                          height={64}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-sm sm:text-base font-bold leading-snug group-hover:text-[#b06a1e] transition line-clamp-1">
                            {maker.name}
                          </h3>
                          <span className="shrink-0 text-[11px] font-bold text-[#8c4f12]">
                            ★ {maker.rating}
                          </span>
                        </div>

                        <p className="flex items-center gap-1 text-xs font-medium text-[#4a382e]">
                          <MapPin className="w-3 h-3 text-[#b06a1e] shrink-0" />
                          <span className="truncate">{maker.city}</span>
                          {maker.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                          )}
                        </p>

                        <p className="text-xs text-[#5a4638] line-clamp-2 leading-relaxed">
                          {maker.specialty}
                        </p>

                        <div className="pt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#b06a1e]">
                          <span>Профіль та контакти</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Footer with Legal Disclaimer */}
      <footer className="mt-12 border-t border-[#e1d5c8] bg-[#f1e6da] py-8 px-4 text-center text-xs text-[#4a382e] space-y-4">
        <div className="font-bold text-[#302016]">
          CrafoHab Україна (crafohab.com.ua • 2027) — Усі {MAKERS.length} перевірених майстерень
        </div>
        <p className="max-w-3xl mx-auto text-[11px] leading-relaxed text-[#7a6858]">
          Інформація взята з відкритих публічних джерел для ознайомлення споживачів. Якщо ви є власником майстерні та бажаєте оновити дані або видалити профіль — зв&apos;яжіться з нами:{' '}
          <a href={`mailto:${SITE_EMAIL}`} className="font-bold underline hover:text-[#b06a1e]">
            {SITE_EMAIL}
          </a>
        </p>
      </footer>
    </div>
  );
}
