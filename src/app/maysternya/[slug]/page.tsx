import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Award,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { CATEGORIES, MAKERS, PRODUCTS, getPricePer100g } from '@/data/chocolateData';
import { CITY_SEO_HUBS } from '@/data/blogData';
import { DISCOVERED_CATEGORY_URLS } from '@/data/categoryLinks';
import { SITE_EMAIL, SITE_NAME, SITE_URL, toAbsoluteUrl } from '@/lib/siteConfig';
import { generateMakerProfileSchema } from '@/utils/seoSchema';
import OptimizedImage from '@/components/OptimizedImage';
import MakerProfileActions from '@/components/MakerProfileActions';
import Breadcrumbs from '@/components/Breadcrumbs';
import BackToTopButton from '@/components/BackToTopButton';

interface MakerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MAKERS.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({ params }: MakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const maker = MAKERS.find((m) => m.slug === slug);
  if (!maker) return {};

  const title = `${maker.name} (${maker.city}) — відгуки, контакти, каталог`;
  const description = `${maker.specialty}. Місто: ${maker.city}. ★ ${maker.rating} (${maker.reviewsCount} відгуків). Прямий сайт, Viber та Telegram без комісій на CrafoHab.`;
  const url = `${SITE_URL}/maysternya/${maker.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'uk_UA',
      type: 'website',
      images: [toAbsoluteUrl(maker.imageUrl)],
    },
  };
}

export default async function MakerProfilePage({ params }: MakerPageProps) {
  const { slug } = await params;
  const maker = MAKERS.find((m) => m.slug === slug);
  if (!maker) {
    notFound();
  }

  const profileUrl = `${SITE_URL}/maysternya/${maker.slug}`;
  const makerProducts = PRODUCTS.filter((p) => p.makerId === maker.id);
  const cityHub = CITY_SEO_HUBS.find(
    (c) =>
      (maker.city || '').toLowerCase().includes(c.cityNameUk.toLowerCase()) ||
      (maker.regionCity || '').toLowerCase().includes(c.cityNameUk.toLowerCase())
  );
  const sectionCrumb =
    maker.segment === 'custom-cakes-pastry'
      ? { label: 'Авторські торти на замовлення', href: '/torty' }
      : maker.segment === 'craft-zefir-pastila'
      ? { label: 'Крафтовий зефір та букети', href: '/zefir' }
      : { label: 'Крафтовий шоколад та цукерки', href: '/shokolad' };
  const jsonLd = generateMakerProfileSchema(maker, makerProducts, cityHub);

  // Merge manual + auto-discovered direct category links
  const directCategoryEntries = maker.categories
    .map((catSlug) => {
      const catInfo = CATEGORIES.find((c) => c.slug === catSlug);
      const directUrl =
        maker.categoryUrls?.[catSlug] || DISCOVERED_CATEGORY_URLS[maker.id]?.[catSlug] || null;
      return {
        slug: catSlug,
        label: catInfo?.shortTitle || catSlug,
        emoji: catInfo?.emoji || '🍫',
        directUrl,
      };
    });

  // Up to 4 related makers (prefer same city, then same mainCategory)
  const relatedMakers = MAKERS.filter((m) => m.id !== maker.id)
    .sort((a, b) => {
      const aCity = (a.city || '').toLowerCase() === (maker.city || '').toLowerCase() ? 1 : 0;
      const bCity = (b.city || '').toLowerCase() === (maker.city || '').toLowerCase() ? 1 : 0;
      if (aCity !== bCity) return bCity - aCity;
      const aCat = a.mainCategory === maker.mainCategory ? 1 : 0;
      const bCat = b.mainCategory === maker.mainCategory ? 1 : 0;
      if (aCat !== bCat) return bCat - aCat;
      return b.rating - a.rating;
    })
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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

          <div className="flex items-center gap-2">
            <Link
              href="/maysternya"
              className="rounded-full border border-[#d4c3b3] bg-white hover:bg-[#f1e6da] px-3.5 py-2 text-xs font-bold transition"
            >
              Усі {MAKERS.length} майстерень
            </Link>
            <Link
              href="/"
              className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-2 text-xs font-bold transition"
            >
              На головну
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Visual Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Крафтові солодощі України', href: '/' },
            { label: 'Каталог майстерень України', href: '/maysternya' },
            { label: sectionCrumb.label, href: sectionCrumb.href },
            ...(cityHub ? [{ label: cityHub.cityNameUk, href: `/misto/${cityHub.slug}` }] : []),
            { label: maker.name },
          ]}
        />

        {/* Hero Maker Profile Card */}
        <section className="rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-5 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Image Showcase */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#e1d5c8] bg-[#f1e6da] aspect-[4/3]">
              <OptimizedImage
                src={maker.imageUrl}
                alt={maker.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                fallbackWidth={800}
                quality={80}
                className="object-cover object-center"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {maker.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#302016] shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Перевірено в каталозі</span>
                  </span>
                )}
                {maker.isBeanToBar && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#302016]/90 px-2.5 py-1 text-[11px] font-bold text-[#f5c492] shadow-sm">
                    <Award className="w-3.5 h-3.5" />
                    <span>Bean-to-Bar</span>
                  </span>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f1e6da] px-3 py-1 text-[#462b1f]">
                    <MapPin className="w-3.5 h-3.5 text-[#b06a1e]" />
                    <span>{maker.city}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8ef] border border-[#e39851]/40 px-3 py-1 text-[#8c4f12]">
                    ★ {maker.rating} ({maker.reviewsCount} відгуків)
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f1e6da]/70 px-3 py-1 text-[#5a4638]">
                    <Calendar className="w-3.5 h-3.5 text-[#b06a1e]" />
                    <span>З {maker.foundedYear} року</span>
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                  {maker.name}
                </h1>

                <p className="text-sm sm:text-base font-semibold text-[#8c4f12]">
                  {maker.specialty}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-[#5a4638]">{maker.description}</p>

              {/* Cacao / Raw Origin & Badges */}
              <div className="flex flex-wrap gap-1.5">
                {maker.cacaoOrigin.map((origin, idx) => (
                  <span
                    key={`origin-${idx}`}
                    className="rounded-full bg-[#462b1f]/10 border border-[#462b1f]/15 px-3 py-1 text-[11px] font-bold text-[#462b1f]"
                  >
                    🌱 {origin}
                  </span>
                ))}
                {maker.badges.map((badge, idx) => (
                  <span
                    key={`badge-${idx}`}
                    className="rounded-full bg-[#e39851]/15 border border-[#e39851]/30 px-3 py-1 text-[11px] font-bold text-[#8c4f12]"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Address & Delivery Card */}
              <div className="rounded-2xl bg-[#f1e6da]/70 border border-[#e1d5c8] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#b06a1e] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#302016]">Локація майстерні</div>
                    <div className="text-[#5a4638] mt-0.5">{maker.address || maker.city}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-[#b06a1e] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#302016]">Доставка та замовлення</div>
                    <div className="text-[#5a4638] mt-0.5">{maker.shippingNote}</div>
                  </div>
                </div>
              </div>

              {/* Interactive CTA, Viber & Telegram Quick Order, Copy Link */}
              <MakerProfileActions
                makerId={maker.id}
                makerSlug={maker.slug}
                makerName={maker.name}
                city={maker.city}
                mainCategory={maker.mainCategory}
                websiteUrl={maker.websiteUrl}
                instagramUrl={maker.instagramUrl}
                phone={maker.phone}
                imageUrl={maker.imageUrl}
                profileUrl={profileUrl}
              />
            </div>
          </div>
        </section>

        {/* Categories & Direct Section Links */}
        <section className="rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#b06a1e]" />
            <span>Категорії продукції майстерні</span>
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {directCategoryEntries.map((entry) => (
              <div
                key={entry.slug}
                className="inline-flex items-center rounded-full border border-[#d4c3b3] bg-[#fbf6ee] overflow-hidden text-xs font-bold"
              >
                <Link
                  href={`/katalog/${entry.slug}`}
                  className="px-3.5 py-2 hover:bg-[#f1e6da] transition flex items-center gap-1.5"
                >
                  <span>{entry.emoji}</span>
                  <span>{entry.label}</span>
                </Link>
                {entry.directUrl && (
                  <a
                    href={entry.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-l border-[#d4c3b3] bg-[#462b1f] hover:bg-[#b06a1e] text-white px-3 py-2 flex items-center gap-1 transition"
                    title={`Прямий розділ на сайті ${maker.name}`}
                  >
                    <span>На сайті</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Maker Products with Price per 100g */}
        {makerProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Популярні позиції та порівняння ціни за 100 г
              </h2>
              <span className="text-xs font-bold text-[#8c4f12]">
                Склад продукції
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {makerProducts.map((product) => {
                const pricePer100g = getPricePer100g(product.priceUah, product.weightGrams);
                return (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-[#e1d5c8] bg-[#fefbf7] overflow-hidden flex flex-col justify-between shadow-xs"
                  >
                    <div className="relative h-44 bg-[#f1e6da]">
                      <OptimizedImage
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        fallbackWidth={480}
                        className="object-cover"
                      />
                      <span className="absolute top-3 right-3 rounded-full bg-[#302016]/90 text-[#f5c492] px-2.5 py-1 text-[11px] font-extrabold">
                        {pricePer100g} ₴ / 100 г
                      </span>
                    </div>
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="font-serif text-base font-bold leading-snug">
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#5a4638] leading-relaxed">
                          {product.expertVerdict}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#e1d5c8] space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold">
                          <span>Ціна: {product.priceUah} ₴ ({product.weightGrams} г)</span>
                          <span className="text-emerald-700">Чистота {product.cleanLabelScore}/100</span>
                        </div>
                        <div className="text-[11px] text-[#6e5d50]">
                          Підсолоджувач: {product.sweetener}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Makers */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold">
            Інші перевірені майстерні поруч та у цій категорії
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedMakers.map((other) => (
              <Link
                key={other.id}
                href={`/maysternya/${other.slug}`}
                className="group rounded-2xl border border-[#e1d5c8] bg-[#fefbf7] hover:border-[#b06a1e] hover:shadow-md transition p-4 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#4a382e] truncate">📍 {other.city}</span>
                    <span className="font-extrabold text-[#8c4f12] shrink-0">★ {other.rating}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold leading-snug group-hover:text-[#b06a1e] transition line-clamp-2">
                    {other.name}
                  </h3>
                  <p className="text-xs text-[#5a4638] line-clamp-2">{other.specialty}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b06a1e] pt-1">
                  <span>Переглянути профіль</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Legal Public Source Disclaimer */}
        <section className="rounded-2xl border border-[#e1d5c8] bg-[#f1e6da]/60 p-5 text-xs leading-relaxed text-[#5a4638] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            Інформація взята з відкритих публічних джерел для ознайомлення споживачів. Якщо ви є власником майстерні та бажаєте оновити дані або видалити профіль — зв&apos;яжіться з нами:{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-bold underline hover:text-[#b06a1e]">
              {SITE_EMAIL}
            </a>
          </p>
        </section>
      </main>

      <BackToTopButton lang="uk" />

      <footer className="mt-8 border-t border-[#e1d5c8] bg-[#f1e6da] py-6 px-4 text-center text-xs text-[#4a382e] space-y-1.5">
        <div className="font-bold text-[#302016]">
          CrafoHab Україна (crafohab.com.ua) — Шоколад • Авторські торти • Крафтовий зефір
        </div>
        <div className="text-[11px] text-[#7a6858]">
          <Link href="/privacy" className="underline hover:text-[#b06a1e]">
            Політика конфіденційності та контакти
          </Link>
        </div>
      </footer>
    </div>
  );
}
