'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { MAKERS } from '@/data/chocolateData';
import { ALL_SECTION_VARIANTS } from '@/data/sectionVariants';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';
import { cleanDisplayName, Lang, localizeText } from '@/lib/homePreviewData';
import {
  getRecentMakers,
  RecentMakerEntry,
  recordRecentMaker,
} from '@/lib/uxStorage';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  isDark: boolean;
}

interface SearchHit {
  key: string;
  group: 'variants' | 'makers' | 'cities' | 'articles' | 'recent';
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
  emoji?: string;
  makerEntry?: RecentMakerEntry;
}

const POPULAR_QUERIES = [
  { uk: 'Дубайський шоколад', ru: 'Дубайский шоколад' },
  { uk: 'Шоколадні квіти', ru: 'Шоколадные цветы' },
  { uk: 'Бенто-торт', ru: 'Бенто-торт' },
  { uk: 'Зефірні букети', ru: 'Зефирные букеты' },
  { uk: 'Без цукру', ru: 'Без сахара' },
  { uk: 'Київ', ru: 'Киев' },
  { uk: 'Харків', ru: 'Харьков' },
  { uk: 'Львів', ru: 'Львов' },
];

export default function CommandPaletteModal({
  isOpen,
  onClose,
  lang,
  isDark,
}: CommandPaletteModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentMakers, setRecentMakers] = useState<RecentMakerEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setRecentMakers(getRecentMakers());
      const id = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  const prefix = lang === 'ru' ? '/ru' : '';

  const groupedResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      const recentHits: SearchHit[] = recentMakers.slice(0, 4).map((m) => ({
        key: `recent-${m.id}`,
        group: 'recent',
        title: cleanDisplayName(localizeText(m.name, lang)),
        subtitle: localizeText(m.city, lang),
        href: `/maysternya/${m.slug}`,
        makerEntry: m,
      }));
      return {
        recent: recentHits,
        variants: [] as SearchHit[],
        makers: [] as SearchHit[],
        cities: [] as SearchHit[],
        articles: [] as SearchHit[],
      };
    }

    const variants: SearchHit[] = ALL_SECTION_VARIANTS.filter((v) => {
      return (
        v.titleUk.toLowerCase().includes(q) ||
        v.titleRu.toLowerCase().includes(q) ||
        v.shortDescUk.toLowerCase().includes(q) ||
        v.shortDescRu.toLowerCase().includes(q) ||
        v.slug.toLowerCase().includes(q)
      );
    })
      .slice(0, 5)
      .map((v) => {
        const sectionPath =
          v.section === 'chocolate'
            ? '/shokolad'
            : v.section === 'cakes'
            ? '/torty'
            : '/zefir';
        return {
          key: `var-${v.id}`,
          group: 'variants' as const,
          emoji: v.emoji,
          title: lang === 'uk' ? v.titleUk : v.titleRu,
          subtitle: lang === 'uk' ? v.shortDescUk : v.shortDescRu,
          href: `${prefix}${sectionPath}/${v.slug}`,
        };
      });

    const makers: SearchHit[] = MAKERS.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.regionCity.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    })
      .sort((a, b) => {
        if (a.id === 'crafo-kharkiv') return -1;
        if (b.id === 'crafo-kharkiv') return 1;
        return b.rating - a.rating;
      })
      .slice(0, 8)
      .map((m) => ({
        key: `maker-${m.id}`,
        group: 'makers' as const,
        title: cleanDisplayName(localizeText(m.name, lang)),
        subtitle: `${localizeText(m.city, lang)} • ${localizeText(m.specialty, lang)}`,
        badge: `★ ${m.rating}`,
        href: `/maysternya/${m.slug}`,
        makerEntry: {
          id: m.id,
          slug: m.slug,
          name: m.name,
          city: m.city,
          imageUrl: m.imageUrl,
        },
      }));

    const cities: SearchHit[] = CITY_SEO_HUBS.filter((c) => {
      return (
        c.cityNameUk.toLowerCase().includes(q) ||
        c.cityNameRu.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
      );
    })
      .slice(0, 4)
      .map((c) => ({
        key: `city-${c.slug}`,
        group: 'cities' as const,
        title: lang === 'uk' ? c.cityNameUk : c.cityNameRu,
        subtitle: lang === 'uk' ? c.descriptionUk : c.descriptionRu,
        href: `${prefix}/misto/${c.slug}`,
      }));

    const articles: SearchHit[] = BLOG_ARTICLES.filter((a) => {
      return (
        a.titleUk.toLowerCase().includes(q) ||
        a.titleRu.toLowerCase().includes(q) ||
        a.excerptUk.toLowerCase().includes(q) ||
        a.excerptRu.toLowerCase().includes(q) ||
        a.seoKeywords.some((k) => k.toLowerCase().includes(q))
      );
    })
      .slice(0, 4)
      .map((a) => ({
        key: `art-${a.slug}`,
        group: 'articles' as const,
        title: lang === 'uk' ? a.titleUk : a.titleRu,
        subtitle: `${a.readTimeMinutes} ${lang === 'uk' ? 'хв читання' : 'мин чтения'}`,
        href: `${prefix}/blog/${a.slug}`,
      }));

    return { recent: [] as SearchHit[], variants, makers, cities, articles };
  }, [query, recentMakers, lang, prefix]);

  const flatHits = useMemo(() => {
    return [
      ...groupedResults.recent,
      ...groupedResults.variants,
      ...groupedResults.makers,
      ...groupedResults.cities,
      ...groupedResults.articles,
    ];
  }, [groupedResults]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const navigateToHit = (hit: SearchHit) => {
    if (hit.makerEntry) {
      recordRecentMaker(hit.makerEntry);
    }
    onClose();
    router.push(hit.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (flatHits.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatHits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatHits.length) % flatHits.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = flatHits[activeIndex];
      if (target) navigateToHit(target);
    }
  };

  if (!isOpen) return null;

  const hasQuery = query.trim() !== '';
  const noMatches = hasQuery && flatHits.length === 0;

  let offset = 0;
  const renderSection = (
    items: SearchHit[],
    headingUk: string,
    headingRu: string,
    icon: React.ReactNode
  ) => {
    if (items.length === 0) return null;
    const sectionStart = offset;
    offset += items.length;
    return (
      <div className="space-y-1">
        <div
          className={`px-3 pt-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-[#e39851]' : 'text-[#8c4f12]'
          }`}
        >
          {icon}
          <span>{lang === 'uk' ? headingUk : headingRu}</span>
        </div>
        {items.map((hit, idx) => {
          const flatIdx = sectionStart + idx;
          const active = flatIdx === activeIndex;
          return (
            <button
              key={hit.key}
              type="button"
              onMouseEnter={() => setActiveIndex(flatIdx)}
              onClick={() => navigateToHit(hit)}
              className={`w-full text-left rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-3 transition ${
                active
                  ? isDark
                    ? 'bg-[#3d281c] text-white'
                    : 'bg-[#f1e6da] text-[#302016]'
                  : isDark
                  ? 'text-[#eee7dd] hover:bg-white/5'
                  : 'text-[#302016] hover:bg-[#faf2e6]'
              }`}
            >
              <div className="min-w-0 flex-1 flex items-center gap-2.5">
                {hit.emoji && <span className="text-base shrink-0">{hit.emoji}</span>}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs sm:text-sm truncate">{hit.title}</div>
                  <div
                    className={`text-[11px] truncate ${
                      isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                    }`}
                  >
                    {hit.subtitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hit.badge && (
                  <span className="rounded-full bg-[#e39851]/20 px-2 py-0.5 text-[11px] font-bold text-[#b06a1e]">
                    {hit.badge}
                  </span>
                )}
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-opacity ${
                    active ? 'opacity-100 text-[#b06a1e]' : 'opacity-40'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'uk' ? 'Швидкий пошук по каталогу' : 'Быстрый поиск по каталогу'}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-10 sm:pt-20 px-3 sm:px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[82vh] ${
          isDark
            ? 'bg-[#1f140e] border-white/15 text-[#eee7dd]'
            : 'bg-[#fefbf7] border-[#d9c8b8] text-[#302016]'
        }`}
      >
        {/* Search Bar */}
        <div
          className={`flex items-center gap-3 px-4 py-3.5 border-b ${
            isDark ? 'border-white/10' : 'border-[#e1d5c8]'
          }`}
        >
          <Search className="w-5 h-5 text-[#b06a1e] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'uk'
                ? 'Пошук майстерень, міст, солодощів та статей...'
                : 'Поиск мастерских, городов, сладостей и статей...'
            }
            className={`w-full bg-transparent text-sm sm:text-base outline-none ${
              isDark
                ? 'text-white placeholder:text-[#8c7a6b]'
                : 'text-[#302016] placeholder:text-[#8c7a6b]'
            }`}
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label={lang === 'uk' ? 'Очистити' : 'Очистить'}
              className="rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold shrink-0 ${
              isDark
                ? 'border-white/20 bg-white/5 text-[#d4c9be]'
                : 'border-[#d4c3b3] bg-white text-[#5a4638]'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-4">
          {!hasQuery && (
            <>
              {renderSection(
                groupedResults.recent,
                'Нещодавно переглянуті',
                'Недавно просмотренные',
                <Clock className="w-3.5 h-3.5" />
              )}

              <div className="space-y-2 px-1">
                <div
                  className={`px-2 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-[#e39851]' : 'text-[#8c4f12]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Популярні запити' : 'Популярные запросы'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {POPULAR_QUERIES.map((chip) => {
                    const label = lang === 'uk' ? chip.uk : chip.ru;
                    return (
                      <button
                        key={chip.uk}
                        type="button"
                        onClick={() => {
                          setQuery(label);
                          inputRef.current?.focus();
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                          isDark
                            ? 'bg-[#2a1b13] border-white/15 text-[#eee7dd] hover:border-[#e39851]'
                            : 'bg-white border-[#e1d5c8] text-[#302016] hover:border-[#b06a1e] hover:bg-[#fff8ef]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {noMatches && (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-bold">
                {lang === 'uk'
                  ? `За запитом «${query}» нічого не знайдено`
                  : `По запросу «${query}» ничего не найдено`}
              </p>
              <p className="text-xs opacity-70">
                {lang === 'uk'
                  ? 'Спробуйте інше слово, наприклад: шоколад, Київ, бенто-торт або букет'
                  : 'Попробуйте другое слово, например: шоколад, Киев, бенто-торт или букет'}
              </p>
            </div>
          )}

          {hasQuery && !noMatches && (
            <div className="space-y-3">
              {renderSection(
                groupedResults.variants,
                'Формати та розділи',
                'Форматы и разделы',
                <Layers className="w-3.5 h-3.5" />
              )}
              {renderSection(
                groupedResults.makers,
                'Перевірені майстерні',
                'Проверенные мастерские',
                <Store className="w-3.5 h-3.5" />
              )}
              {renderSection(
                groupedResults.cities,
                'Міста України',
                'Города Украины',
                <MapPin className="w-3.5 h-3.5" />
              )}
              {renderSection(
                groupedResults.articles,
                'Гіди та статті',
                'Гиды и статьи',
                <BookOpen className="w-3.5 h-3.5" />
              )}
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div
          className={`hidden sm:flex items-center justify-between px-4 py-2.5 border-t text-[11px] font-medium ${
            isDark
              ? 'border-white/10 bg-[#170f0b] text-[#a89b8f]'
              : 'border-[#e1d5c8] bg-[#f7efe4] text-[#6e5d50]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span>↑↓ {lang === 'uk' ? 'навігація' : 'навигация'}</span>
            <span>Enter {lang === 'uk' ? 'відкрити' : 'открыть'}</span>
            <span>ESC {lang === 'uk' ? 'закрити' : 'закрыть'}</span>
          </div>
          <span>CrafoHab</span>
        </div>
      </div>
    </div>
  );
}
