'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BarChart2,
  Calculator,
  CheckCircle2,
  Clock,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { CategorySlug, MAKERS } from '@/data/chocolateData';
import {
  MacroSectionId,
  ProductVariantItem,
  SECTION_VARIANTS_MAP,
} from '@/data/sectionVariants';
import { appendUtm, getMakerStats, trackMakerClick } from '@/utils/analytics';
import { extractPhoneDigits } from '@/lib/siteConfig';
import {
  CatalogCityCount,
  CatalogMaker,
  CatalogSummary,
  getMakerCategoryUrl,
  Lang,
  localizeText,
} from '@/lib/homePreviewData';
import OptimizedImage from './OptimizedImage';

interface ChocoModalsAndDrawersProps {
  lang: Lang;
  isDark: boolean;
  activeSection: MacroSectionId;
  selectedCategory: CategorySlug;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  activeVariant: ProductVariantItem;
  getVariantUrl: (variant: ProductVariantItem) => string;
  handleSelectVariant: (variant: ProductVariantItem) => void;
  catalogSummary: CatalogSummary;

  isAssortmentDrawerOpen: boolean;
  setIsAssortmentDrawerOpen: (open: boolean) => void;
  drawerSectionTab: Exclude<MacroSectionId, 'home'>;
  setDrawerSectionTab: (tab: Exclude<MacroSectionId, 'home'>) => void;

  isSommelierDrawerOpen: boolean;
  setIsSommelierDrawerOpen: (open: boolean) => void;

  activeMakerModal: CatalogMaker | null;
  setActiveMakerModal: (maker: CatalogMaker | null) => void;

  isTenderModalOpen: boolean;
  setIsTenderModalOpen: (open: boolean) => void;
  tenderCategory: 'cake' | 'zefir' | 'chocolate' | 'corporate';
  setTenderCategory: (cat: 'cake' | 'zefir' | 'chocolate' | 'corporate') => void;

  isMethodologyModalOpen: boolean;
  setIsMethodologyModalOpen: (open: boolean) => void;

  isCitySelectorModalOpen: boolean;
  setIsCitySelectorModalOpen: (open: boolean) => void;

  isAddMakerModalOpen: boolean;
  setIsAddMakerModalOpen: (open: boolean) => void;
  selectedPlanForModal: string;

  isMakerStatsModalOpen: boolean;
  setIsMakerStatsModalOpen: (open: boolean) => void;
  statsModalMaker: CatalogMaker | null;
  setStatsModalMaker: (maker: CatalogMaker | null) => void;
}

export default function ChocoModalsAndDrawers({
  lang,
  isDark,
  activeSection,
  selectedCategory,
  selectedCity,
  setSelectedCity,
  activeVariant,
  getVariantUrl,
  handleSelectVariant,
  catalogSummary,
  isAssortmentDrawerOpen,
  setIsAssortmentDrawerOpen,
  drawerSectionTab,
  setDrawerSectionTab,
  isSommelierDrawerOpen,
  setIsSommelierDrawerOpen,
  activeMakerModal,
  setActiveMakerModal,
  isTenderModalOpen,
  setIsTenderModalOpen,
  tenderCategory,
  setTenderCategory,
  isMethodologyModalOpen,
  setIsMethodologyModalOpen,
  isCitySelectorModalOpen,
  setIsCitySelectorModalOpen,
  isAddMakerModalOpen,
  setIsAddMakerModalOpen,
  selectedPlanForModal,
  isMakerStatsModalOpen,
  setIsMakerStatsModalOpen,
  statsModalMaker,
  setStatsModalMaker,
}: ChocoModalsAndDrawersProps) {
  // Interactive Sommelier & Calculator inside the Right Drawer
  const [activeEngagementTab, setActiveEngagementTab] = useState<'quiz' | 'calculator'>('quiz');
  const [quizRecipient, setQuizRecipient] = useState<'her' | 'kids' | 'boss' | 'self'>('her');
  const [quizDiet, setQuizDiet] = useState<'classic' | 'sugarfree' | 'kids_safe'>('classic');
  const [quizFormat, setQuizFormat] = useState<'bars' | 'flowers' | 'candies' | 'cakes_zefir'>('flowers');
  const [guestsCount, setGuestsCount] = useState<number>(12);

  // Modal internal states
  const [cityFilterSearch, setCityFilterSearch] = useState('');
  const [tenderSubmitted, setTenderSubmitted] = useState(false);
  const [makerSubmitted, setMakerSubmitted] = useState(false);
  const [statsPinInput, setStatsPinInput] = useState('');
  const [statsUnlocked, setStatsUnlocked] = useState(false);
  const [statsError, setStatsError] = useState('');

  const quizRecommendedMakers = useMemo(() => {
    return MAKERS.filter((m) => {
      if (m.id === 'crafo-kharkiv' && quizFormat !== 'cakes_zefir') return true;
      if (quizDiet === 'sugarfree' && !m.categories.includes('bez-tsukru-ta-vegan')) return false;
      if (quizDiet === 'kids_safe' && !m.categories.includes('solodoshchi-dlia-ditei')) return false;
      if (quizFormat === 'bars' && !m.categories.includes('plytky-shokoladu')) return false;
      if (quizFormat === 'flowers' && !m.categories.includes('shokoladni-kvity-ta-bukety'))
        return false;
      if (quizFormat === 'candies' && !m.categories.includes('korpusni-ta-rozmalovani-tsukerky'))
        return false;
      if (
        quizFormat === 'cakes_zefir' &&
        !m.categories.includes('avtorski-torty-ta-deserty') &&
        !m.categories.includes('kraftovyi-zefir-ta-bukety')
      ) {
        return false;
      }
      return true;
    })
      .sort((a, b) => {
        if (a.id === 'crafo-kharkiv') return -1;
        if (b.id === 'crafo-kharkiv') return 1;
        return b.rating - a.rating;
      })
      .slice(0, 3);
  }, [quizDiet, quizFormat]);

  const calculatedWeightKg = useMemo(() => {
    return Math.max(1, Math.round(((guestsCount * 160) / 1000) * 10) / 10);
  }, [guestsCount]);

  return (
    <>
      {/* RIGHT SLIDE-OVER DRAWER 1: ASSORTMENT GUIDE */}
      {isAssortmentDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsAssortmentDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-6 sm:pl-8">
            <div
              className={`w-screen max-w-md sm:max-w-lg flex flex-col shadow-2xl border-l animate-slide-in-right ${
                isDark
                  ? 'bg-[#1e1510] border-white/15 text-[#eee7dd]'
                  : 'bg-[#fefbf7] border-[#d9c8b8] text-[#302016]'
              }`}
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#e1d5c8] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b06a1e]">
                    {lang === 'uk' ? 'Гід по продукції CrafoHab' : 'Гид по продукции CrafoHab'}
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">
                    {lang === 'uk'
                      ? '📋 Весь асортимент продукції'
                      : '📋 Весь ассортимент продукции'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsAssortmentDrawerOpen(false)}
                  aria-label={lang === 'uk' ? 'Закрити меню асортименту' : 'Закрыть меню ассортимента'}
                  className="w-9 h-9 rounded-full bg-[#f1e6da] text-[#302016] flex items-center justify-center hover:bg-[#e39851] transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Section Tabs inside Drawer */}
              <div className="px-4 pt-3 pb-2 border-b border-[#e1d5c8] flex gap-1.5">
                {[
                  { id: 'chocolate', uk: '🍫 Шоколад (7)', ru: '🍫 Шоколад (7)' },
                  { id: 'cakes', uk: '🎂 Торти (4)', ru: '🎂 Торты (4)' },
                  { id: 'zefir', uk: '🌸 Зефір (3)', ru: '🌸 Зефир (3)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerSectionTab(tab.id as Exclude<MacroSectionId, 'home'>)}
                    className={`flex-1 rounded-xl py-2 px-2 text-xs font-extrabold transition ${
                      drawerSectionTab === tab.id
                        ? 'bg-[#462b1f] text-white shadow-xs'
                        : isDark
                        ? 'bg-[#261b16] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    {lang === 'uk' ? tab.uk : tab.ru}
                  </button>
                ))}
              </div>

              {/* Drawer Scrollable List of Detailed Products */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {SECTION_VARIANTS_MAP[drawerSectionTab].map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 space-y-3 transition ${
                      activeVariant.id === item.id && activeSection !== 'home'
                        ? 'border-2 border-[#e39851] bg-[#e39851]/10'
                        : isDark
                        ? 'bg-[#261b16] border-white/15'
                        : 'bg-white border-[#e1d5c8] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#e1d5c8] bg-[#f1e6da]">
                        <OptimizedImage
                          src={item.imageUrl}
                          alt={lang === 'uk' ? item.titleUk : item.titleRu}
                          fill
                          sizes="80px"
                          fallbackWidth={160}
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-serif font-bold text-sm sm:text-base flex items-center gap-1.5">
                          <span>{item.emoji}</span>
                          <span>{lang === 'uk' ? item.titleUk : item.titleRu}</span>
                        </div>
                        <p className="text-xs opacity-85 mt-1 leading-relaxed">
                          {lang === 'uk' ? item.detailedAssortmentUk : item.detailedAssortmentRu}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`rounded-xl p-3 text-xs space-y-1.5 ${
                        isDark ? 'bg-[#1a120e]' : 'bg-[#f1e6da]/60'
                      }`}
                    >
                      <div>
                        <strong className="text-[#b06a1e]">
                          {lang === 'uk' ? 'Склад та сировина:' : 'Состав и сырье:'}
                        </strong>{' '}
                        {lang === 'uk' ? item.ingredientsUk : item.ingredientsRu}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#b06a1e] shrink-0" />
                        <span>
                          <strong>{lang === 'uk' ? 'Термін зберігання:' : 'Срок хранения:'}</strong>{' '}
                          {lang === 'uk' ? item.shelfLifeUk : item.shelfLifeRu}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={getVariantUrl(item)}
                      onClick={() => handleSelectVariant(item)}
                      className="w-full rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white font-extrabold py-2.5 px-4 text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <span>
                        {lang === 'uk'
                          ? 'Обрати та показати 3 основні виробники →'
                          : 'Выбрать и показать 3 основных производителя →'}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SLIDE-OVER DRAWER 2: SOMMELIER & CALCULATOR */}
      {isSommelierDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsSommelierDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-6 sm:pl-8">
            <div
              className={`w-screen max-w-md sm:max-w-lg flex flex-col shadow-2xl border-l animate-slide-in-right ${
                isDark
                  ? 'bg-[#1e1510] border-white/15 text-[#eee7dd]'
                  : 'bg-[#fefbf7] border-[#d9c8b8] text-[#302016]'
              }`}
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#e1d5c8] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b06a1e]">
                    {lang === 'uk'
                      ? 'Інтерактивний помічник CrafoHab 2027'
                      : 'Интерактивный помощник CrafoHab 2027'}
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">
                    {lang === 'uk'
                      ? '🪄 Сомельє подарунків та Калькулятор'
                      : '🪄 Сомелье подарков и Калькулятор'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsSommelierDrawerOpen(false)}
                  aria-label={lang === 'uk' ? 'Закрити помічник сомельє' : 'Закрыть помощник сомелье'}
                  className="w-9 h-9 rounded-full bg-[#f1e6da] text-[#302016] flex items-center justify-center hover:bg-[#e39851] transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Switcher inside Drawer */}
              <div className="px-4 pt-3 pb-2 border-b border-[#e1d5c8] flex gap-2">
                <button
                  onClick={() => setActiveEngagementTab('quiz')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-extrabold transition ${
                    activeEngagementTab === 'quiz'
                      ? 'bg-[#462b1f] text-white'
                      : 'bg-[#f1e6da] text-[#302016]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Підбір подарунка' : 'Подбор подарка'}</span>
                </button>
                <button
                  onClick={() => setActiveEngagementTab('calculator')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-extrabold transition ${
                    activeEngagementTab === 'calculator'
                      ? 'bg-[#462b1f] text-white'
                      : 'bg-[#f1e6da] text-[#302016]'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Калькулятор торта' : 'Калькулятор торта'}</span>
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {activeEngagementTab === 'quiz' ? (
                  <>
                    {/* Step 1 */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-extrabold text-[#b06a1e]">
                        {lang === 'uk' ? '1. Для кого обираємо?' : '1. Для кого выбираем?'}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'her', uk: '💝 На подарунок', ru: '💝 На подарок' },
                          { id: 'kids', uk: '🧸 Для дитини', ru: '🧸 Для ребенка' },
                          { id: 'boss', uk: '👑 Керівнику / VIP', ru: '👑 Руководителю / VIP' },
                          { id: 'self', uk: '☕ Для себе до кави', ru: '☕ Для себя к кофе' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setQuizRecipient(opt.id as typeof quizRecipient);
                              if (opt.id === 'kids') setQuizDiet('kids_safe');
                            }}
                            className={`rounded-xl border px-3 py-2 text-xs font-bold text-left transition ${
                              quizRecipient === opt.id
                                ? 'bg-[#462b1f] text-white border-[#462b1f]'
                                : isDark
                                ? 'bg-[#261b16] border-white/15'
                                : 'bg-white border-[#e1d5c8]'
                            }`}
                          >
                            {lang === 'uk' ? opt.uk : opt.ru}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-extrabold text-[#b06a1e]">
                        {lang === 'uk' ? '2. Побажання до складу:' : '2. Пожелания к составу:'}
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          {
                            id: 'classic',
                            uk: '🍫 Класичний бельгійський / крафтовий',
                            ru: '🍫 Классический бельгийский / крафтовый',
                          },
                          {
                            id: 'sugarfree',
                            uk: '🌿 Без цукру (Мед / Стевія / Vegan)',
                            ru: '🌿 Без сахара (Мед / Стевия / Vegan)',
                          },
                          {
                            id: 'kids_safe',
                            uk: '🧸 Для дітей (Натуральний / Без хімії)',
                            ru: '🧸 Для детей (Натуральный / Без химии)',
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setQuizDiet(opt.id as typeof quizDiet)}
                            className={`rounded-xl border px-3 py-2 text-xs font-bold text-left transition ${
                              quizDiet === opt.id
                                ? 'bg-[#462b1f] text-white border-[#462b1f]'
                                : isDark
                                ? 'bg-[#261b16] border-white/15'
                                : 'bg-white border-[#e1d5c8]'
                            }`}
                          >
                            {lang === 'uk' ? opt.uk : opt.ru}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-extrabold text-[#b06a1e]">
                        {lang === 'uk' ? '3. Який формат виробу?' : '3. Какой формат изделия?'}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            id: 'flowers',
                            uk: '🌹 Шоколадні квіти',
                            ru: '🌹 Шоколадные цветы',
                          },
                          {
                            id: 'bars',
                            uk: '🍫 Плитка / Батончик',
                            ru: '🍫 Плитка / Батончик',
                          },
                          {
                            id: 'candies',
                            uk: '🍬 Цукерки в боксі',
                            ru: '🍬 Конфеты в боксе',
                          },
                          {
                            id: 'cakes_zefir',
                            uk: '🎂 Торт / Зефір',
                            ru: '🎂 Торт / Зефир',
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setQuizFormat(opt.id as typeof quizFormat)}
                            className={`rounded-xl border px-3 py-2 text-xs font-bold text-left transition ${
                              quizFormat === opt.id
                                ? 'bg-[#462b1f] text-white border-[#462b1f]'
                                : isDark
                                ? 'bg-[#261b16] border-white/15'
                                : 'bg-white border-[#e1d5c8]'
                            }`}
                          >
                            {lang === 'uk' ? opt.uk : opt.ru}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TOP-3 RECOMMENDED PRODUCERS IN DRAWER */}
                    <div
                      className={`rounded-2xl p-4 border space-y-3 ${
                        isDark ? 'bg-[#261b16] border-white/15' : 'bg-white border-[#e1d5c8]'
                      }`}
                    >
                      <div className="text-xs font-extrabold uppercase text-[#b06a1e]">
                        {lang === 'uk'
                          ? '🎯 Ваші 3 основні виробники:'
                          : '🎯 Ваши 3 основных производителя:'}
                      </div>

                      <div className="space-y-2.5">
                        {quizRecommendedMakers.map((m, idx) => {
                          const targetCat: CategorySlug =
                            quizFormat === 'flowers'
                              ? 'shokoladni-kvity-ta-bukety'
                              : quizFormat === 'bars'
                              ? 'plytky-shokoladu'
                              : quizFormat === 'candies'
                              ? 'korpusni-ta-rozmalovani-tsukerky'
                              : 'avtorski-torty-ta-deserty';
                          const directUrl =
                            getMakerCategoryUrl(m, targetCat) || m.websiteUrl;

                          return (
                            <div
                              key={m.id}
                              className={`flex items-center justify-between gap-2.5 rounded-xl p-2.5 border ${
                                idx === 0
                                  ? 'border-[#e39851] bg-[#e39851]/10'
                                  : isDark
                                  ? 'border-white/10 bg-[#1a120e]'
                                  : 'border-[#e1d5c8] bg-[#fbf6ee]'
                              }`}
                            >
                              {m.imageUrl && (
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#e1d5c8] bg-[#3a2113]">
                                  <OptimizedImage
                                    src={m.imageUrl}
                                    alt={m.name}
                                    fill
                                    sizes="48px"
                                    fallbackWidth={100}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/maysternya/${m.slug}`}
                                  onClick={() => setIsSommelierDrawerOpen(false)}
                                  className="font-bold text-xs truncate block hover:text-[#b06a1e]"
                                >
                                  #{idx + 1} {localizeText(m.name, lang)}
                                </Link>
                                <div className="text-[11px] opacity-75 truncate">
                                  {localizeText(m.city, lang)} • ★ {m.rating}
                                </div>
                              </div>
                              <a
                                href={directUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-3 py-1.5 text-[11px] font-bold flex items-center gap-1"
                              >
                                <span>{lang === 'uk' ? 'На сайт' : 'На сайт'}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Calculator inside Drawer */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#b06a1e] mb-2">
                        {lang === 'uk'
                          ? `Кількість гостей: ${guestsCount} осіб`
                          : `Количество гостей: ${guestsCount} чел.`}
                      </label>
                      <input
                        type="range"
                        min={4}
                        max={100}
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="w-full accent-[#b06a1e]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f1e6da] p-3 text-[#302016]">
                        <div className="text-[11px] opacity-75">
                          {lang === 'uk' ? 'Вага торта:' : 'Вес торта:'}
                        </div>
                        <div className="text-xl font-extrabold text-[#462b1f]">
                          {calculatedWeightKg} кг
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#f1e6da] p-3 text-[#302016]">
                        <div className="text-[11px] opacity-75">
                          {lang === 'uk' ? 'Подарункових боксів:' : 'Подарочных боксов:'}
                        </div>
                        <div className="text-xl font-extrabold text-[#b06a1e]">
                          {guestsCount} шт
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsSommelierDrawerOpen(false);
                        setIsTenderModalOpen(true);
                      }}
                      className="w-full rounded-full bg-[#b06a1e] text-white font-extrabold py-3 text-xs"
                    >
                      {lang === 'uk'
                        ? 'Залишити заявку майстрам під цей розрахунок →'
                        : 'Оставить заявку мастерам под этот расчет →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Maker Details */}
      {activeMakerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold">
                  {localizeText(activeMakerModal.name, lang)}
                </h2>
                <p className="text-xs text-[#4a382e]">
                  {localizeText(activeMakerModal.city, lang)} • ★ {activeMakerModal.rating}
                </p>
              </div>
              <button
                onClick={() => setActiveMakerModal(null)}
                aria-label={lang === 'uk' ? 'Закрити деталі майстерні' : 'Закрыть детали мастерской'}
                className="p-2 rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {activeMakerModal.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden h-64 border border-[#e1d5c8] bg-[#f1e6da]">
                <OptimizedImage
                  src={activeMakerModal.imageUrl}
                  alt={activeMakerModal.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 500px"
                  fallbackWidth={600}
                  quality={80}
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-xs sm:text-sm leading-relaxed">
              {localizeText(activeMakerModal.description, lang)}
            </p>
            <div className="bg-[#f1e6da] rounded-2xl p-3.5 text-xs space-y-1">
              <div>
                <strong>{lang === 'uk' ? 'Телефон:' : 'Телефон:'}</strong> {activeMakerModal.phone}
              </div>
              {activeMakerModal.address && (
                <div>
                  <strong>{lang === 'uk' ? 'Адреса:' : 'Адрес:'}</strong>{' '}
                  {localizeText(activeMakerModal.address, lang)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={appendUtm(
                  getMakerCategoryUrl(activeMakerModal, selectedCategory) ||
                    getMakerCategoryUrl(activeMakerModal, activeMakerModal.mainCategory) ||
                    activeMakerModal.websiteUrl,
                  activeMakerModal.id
                )}
                onClick={() => {
                  trackMakerClick(activeMakerModal.id, 'website', {
                    category: activeMakerModal.mainCategory,
                    city: activeMakerModal.city,
                  });
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#462b1f] hover:bg-[#b06a1e] text-white font-bold py-3 px-4 rounded-full text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <span>{lang === 'uk' ? 'Перейти на сайт виробника' : 'Перейти на сайт производителя'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setStatsModalMaker(activeMakerModal);
                  setStatsPinInput('');
                  setStatsUnlocked(false);
                  setStatsError('');
                  setIsMakerStatsModalOpen(true);
                }}
                aria-label={lang === 'uk' ? 'Статистика переходів для майстерні' : 'Статистика переходов для мастерской'}
                className="p-3 rounded-full border border-[#d4c3b3] bg-white text-[#4a382e] hover:text-[#b06a1e] hover:border-[#b06a1e] transition shrink-0"
                title={lang === 'uk' ? 'Статистика переходів для майстерні' : 'Статистика переходов для мастерской'}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <Link
                href={`/maysternya/${activeMakerModal.slug}`}
                onClick={() => setActiveMakerModal(null)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#b06a1e] hover:underline"
              >
                <span>{lang === 'uk' ? 'Відкрити повний профіль майстерні →' : 'Открыть полный профиль мастерской →'}</span>
              </Link>
            </div>

            {/* Quick Order: Viber & Telegram in Modal */}
            {(() => {
              const modalPhone = extractPhoneDigits(activeMakerModal.phone);
              return modalPhone ? (
                <div className="flex items-center gap-2 pt-1 text-xs text-[#6e5d50]">
                  <span className="text-[11px] font-medium shrink-0">
                    {lang === 'uk' ? 'Швидке замовлення:' : 'Быстрый заказ:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`viber://chat?number=%2B${modalPhone}`}
                      onClick={() =>
                        trackMakerClick(activeMakerModal.id, 'phone', {
                          category: activeMakerModal.mainCategory,
                          city: activeMakerModal.city,
                        })
                      }
                      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold bg-[#7360f2]/15 text-[#5e35b1] hover:bg-[#7360f2] hover:text-white border border-[#7360f2]/30 transition"
                      title="Viber"
                    >
                      Viber
                    </a>
                    <a
                      href={`https://t.me/+${modalPhone}`}
                      onClick={() =>
                        trackMakerClick(activeMakerModal.id, 'phone', {
                          category: activeMakerModal.mainCategory,
                          city: activeMakerModal.city,
                        })
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold bg-[#229ed9]/15 text-[#0088cc] hover:bg-[#229ed9] hover:text-white border border-[#229ed9]/30 transition"
                      title="Telegram"
                    >
                      Telegram
                    </a>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Legal note in modal */}
            <p className="text-[10px] leading-relaxed italic text-[#7a6858] pt-2 border-t border-[#e1d5c8]/60">
              {lang === 'uk'
                ? "Інформація взята з відкритих публічних джерел для ознайомлення споживачів. Якщо ви є власником майстерні та бажаєте оновити дані або видалити профіль — зв'яжіться з нами: "
                : 'Информация взята из открытых публичных источников для ознакомления потребителей. Если вы являетесь владельцем мастерской и желаете обновить данные или удалить профиль — свяжитесь с нами: '}
              <a href="mailto:editor@crafohab.com.ua" className="font-bold underline hover:text-[#b06a1e]">
                editor@crafohab.com.ua
              </a>
            </p>
          </div>
        </div>
      )}

      {/* MODAL 2: Upgraded Tender Request */}
      {isTenderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl my-auto">
            <div className="flex items-start justify-between border-b border-[#e1d5c8] pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b06a1e]">
                  {lang === 'uk' ? 'Тендерна біржа CrafoHab 2027' : 'Тендерная биржа CrafoHab 2027'}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                  {lang === 'uk'
                    ? 'Запит на індивідуальне замовлення'
                    : 'Запрос на индивидуальный заказ'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsTenderModalOpen(false);
                  setTenderSubmitted(false);
                }}
                aria-label={lang === 'uk' ? 'Закрити форму замовлення' : 'Закрыть форму заказа'}
                className="p-2 rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {tenderSubmitted ? (
              <div className="bg-[#f1e6da] rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="font-serif text-lg font-bold">
                  {lang === 'uk' ? 'Ваш запит успішно зареєстровано!' : 'Ваш запрос успешно зарегистрирован!'}
                </div>
                <p className="text-xs sm:text-sm text-[#5a4638] leading-relaxed">
                  {lang === 'uk'
                    ? 'Ми надіслали бриф вільним перевіреним майстерням вашого міста. Очікуйте 3–5 персональних пропозицій з фото та цінами у Telegram/Viber протягом 1 години.'
                    : 'Мы отправили бриф свободным проверенным мастерским вашего города. Ожидайте 3–5 персональных предложений с фото и ценами в Telegram/Viber в течение 1 часа.'}
                </p>
                <button
                  onClick={() => {
                    setIsTenderModalOpen(false);
                    setTenderSubmitted(false);
                  }}
                  className="rounded-full bg-[#462b1f] text-white px-5 py-2 text-xs font-bold"
                >
                  {lang === 'uk' ? 'Зрозуміло, дякую!' : 'Понятно, спасибо!'}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTenderSubmitted(true);
                }}
                className="space-y-3 text-xs sm:text-sm"
              >
                {/* Category selector */}
                <div>
                  <label className="block text-[11px] font-bold text-[#4a382e] mb-1.5">
                    {lang === 'uk' ? 'Що потрібно виготовити?' : 'Что необходимо изготовить?'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'cake', uk: '🎂 Торт на свято', ru: '🎂 Торт на праздник' },
                      { id: 'zefir', uk: '🌸 Зефірний букет', ru: '🌸 Зефирный букет' },
                      { id: 'chocolate', uk: '🍫 Шоколадний набір', ru: '🍫 Шоколадный набор' },
                      { id: 'corporate', uk: '🎁 Корпоративне', ru: '🎁 Корпоративное' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setTenderCategory(
                            tab.id as 'cake' | 'zefir' | 'chocolate' | 'corporate'
                          )
                        }
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                          tenderCategory === tab.id
                            ? 'bg-[#462b1f] text-white border-[#462b1f]'
                            : 'bg-white border-[#d4c3b3] text-[#302016] hover:bg-[#fff8ef]'
                        }`}
                      >
                        {lang === 'uk' ? tab.uk : tab.ru}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4a382e] mb-1">
                      {lang === 'uk' ? 'Місто доставки/самовивозу' : 'Город доставки/самовывоза'}
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={selectedCity !== 'all' ? selectedCity : ''}
                      placeholder={lang === 'uk' ? 'Наприклад: Харків' : 'Например: Харьков'}
                      className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#4a382e] mb-1">
                      {lang === 'uk' ? 'Дата події / дедлайн' : 'Дата события / дедлайн'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'uk' ? 'Наприклад: 20 травня' : 'Например: 20 мая'}
                      className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4a382e] mb-1">
                    {lang === 'uk' ? 'Опис замовлення (вага, кількість гостей, ідея)' : 'Описание заказа (вес, число гостей, идея)'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder={
                      lang === 'uk'
                        ? 'Наприклад: торт на 15 людей, начинка манго-маракуйя або шоколадний велюр...'
                        : 'Например: торт на 15 человек, начинка манго-маракуйя или шоколадный велюр...'
                    }
                    className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2 outline-none focus:border-[#b06a1e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4a382e] mb-1">
                    {lang === 'uk' ? 'Куди надіслати пропозиції (Телефон / Telegram / Viber)' : 'Куда прислать предложения (Телефон / Telegram / Viber)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+38 (0XX) XXX-XX-XX або @username"
                    className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 text-white font-extrabold py-3.5 rounded-full shadow-md transition"
                >
                  {lang === 'uk' ? '🎯 Отримати 3–5 розрахунків безкоштовно' : '🎯 Получить 3–5 расчетов бесплатно'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Methodology & Trust Standard 2027 */}
      {isMethodologyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-start justify-between border-b border-[#e1d5c8] pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-extrabold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Стандарт прозорості CrafoHab 2027</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1.5">
                  {lang === 'uk'
                    ? 'Методологія відбору та верифікації майстерень'
                    : 'Методология отбора и верификации мастерских'}
                </h2>
              </div>
              <button
                onClick={() => setIsMethodologyModalOpen(false)}
                aria-label={lang === 'uk' ? 'Закрити вікно методології' : 'Закрыть окно методологии'}
                className="p-2 rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#4a3b32]">
              <p className="font-medium text-[#2d1f17]">
                {lang === 'uk'
                  ? 'CrafoHab — це національний гід та незалежний навігатор крафтових солодощів України. Наша мета на 2027 рік — надати українцям сервіс найвищого світового рівня для замовлення справжнього шоколаду, авторських тортів та натурального зефіру.'
                  : 'CrafoHab — это национальный гид и независимый навигатор крафтовых сладостей Украины. Наша цель на 2027 год — предоставить украинцам сервис высшего мирового уровня для заказа настоящего шоколада, авторских тортов и натурального зефира.'}
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-base font-bold text-[#302016]">
                  {lang === 'uk' ? '5 обов’язкових критеріїв перевірки кожної майстерні:' : '5 обязательных критериев проверки каждой мастерской:'}
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#fff8ef] border border-[#e8d5c4] space-y-1">
                    <div className="font-bold text-[#b06a1e] flex items-center gap-1.5">
                      <span>1. 100% Чистий склад (Clean Label)</span>
                    </div>
                    <p className="text-[12px] sm:text-xs">
                      {lang === 'uk'
                        ? 'Тільки справжнє какао-масло (Fino de Aroma, Barry Callebaut, Cacao Barry). Категорична заборона пальмової олії, гідрогенізованих кондитерських жирів та замінників какао-масла (CBS/CBR). У зефірі — натуральне ягідне або яблучне пюре та агар-агар.'
                        : 'Только настоящее какао-масло (Fino de Aroma, Barry Callebaut, Cacao Barry). Категорический запрет пальмового масла, гидрогенизированных кондитерских жиров и заменителей какао-масла (CBS/CBR). В зефире — натуральное ягодное или яблочное пюре и агар-агар.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#fff8ef] border border-[#e8d5c4] space-y-1">
                    <div className="font-bold text-[#b06a1e] flex items-center gap-1.5">
                      <span>2. Свіжість партій та контроль логістики</span>
                    </div>
                    <p className="text-[12px] sm:text-xs">
                      {lang === 'uk'
                        ? 'Продукція не зберігається місяцями на складах супермаркетів. Майстри виготовляють десерти безпосередньо під замовлення або свіжими лімітованими партіями (24–48 годин) з термопакуванням.'
                        : 'Продукция не хранится месяцами на складах супермаркетов. Мастера изготавливают десерты непосредственно под заказ или свежими лимитированными партиями (24–48 часов) с термоупаковкой.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#fff8ef] border border-[#e8d5c4] space-y-1">
                    <div className="font-bold text-[#b06a1e] flex items-center gap-1.5">
                      <span>3. Прозоре порівняння ціни за 100 грамів</span>
                    </div>
                    <p className="text-[12px] sm:text-xs">
                      {lang === 'uk'
                        ? 'Ми виступаем проти оманливого зменшення ваги упаковки. Каталог розраховує ціну за 100 грамів, щоб ви завжди знали реальну собівартість виробу.'
                        : 'Мы выступаем против обманчивого уменьшения веса упаковки. Каталог рассчитывает цену за 100 граммов, чтобы вы всегда знали реальную себестоимость изделия.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#fff8ef] border border-[#e8d5c4] space-y-1">
                    <div className="font-bold text-[#b06a1e] flex items-center gap-1.5">
                      <span>4. Репутаційний аудит та реальні відгуки</span>
                    </div>
                    <p className="text-[12px] sm:text-xs">
                      {lang === 'uk'
                        ? 'Кожна майстерня проходить перевірку відкритих відгуків у Google Maps, Instagram та маркетплейсах. Середній рейтинг має бути не нижче 4.8/5.0.'
                        : 'Каждая мастерская проходит проверку открытых отзывов в Google Maps, Instagram и маркетплейсах. Средний рейтинг должен быть не ниже 4.8/5.0.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#fff8ef] border border-[#e8d5c4] space-y-1">
                    <div className="font-bold text-[#b06a1e] flex items-center gap-1.5">
                      <span>5. Чесна реклама та відкритість партнерств</span>
                    </div>
                    <p className="text-[12px] sm:text-xs">
                      {lang === 'uk'
                        ? 'Майстерні розміщуються в каталозі безкоштовно за умови відповідності стандартам якості. Спеціальні виділення позначаються бейджем «Партнер платформи / Вибір редакції» відповідно до закону України «Про рекламу».'
                        : 'Мастерские размещаются в каталоге бесплатно при условии соответствия стандартам качества. Специальные выделения маркируются бейджем «Партнер платформы / Выбор редакции» в соответствии с законом Украины «О рекламе».'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e1d5c8] pt-4 space-y-1">
                <div className="font-bold text-[#302016]">Контакти редакції та служби верифікації:</div>
                <div className="text-xs text-[#4a382e]">
                  Електронна пошта: <a href="mailto:editor@crafohab.com.ua" className="underline text-[#b06a1e]">editor@crafohab.com.ua</a> | Підтримка: <a href="https://t.me/crafohab_ua" target="_blank" rel="noopener noreferrer" className="underline text-[#b06a1e]">Telegram @crafohab_ua</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: City Selector with Search */}
      {isCitySelectorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#e1d5c8] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#b06a1e]" />
                <h2 className="font-serif text-xl font-bold">
                  {lang === 'uk' ? 'Оберіть місто' : 'Выберите город'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsCitySelectorModalOpen(false);
                  setCityFilterSearch('');
                }}
                aria-label={lang === 'uk' ? 'Закрити вибір міста' : 'Закрыть выбор города'}
                className="p-1.5 rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8c6b54] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityFilterSearch}
                onChange={(e) => setCityFilterSearch(e.target.value)}
                placeholder={lang === 'uk' ? 'Швидкий пошук міста...' : 'Быстрый поиск города...'}
                className="w-full bg-white border border-[#d4c3b3] rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-[#b06a1e]"
              />
            </div>

            {/* City Grid */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-80">
              <button
                onClick={() => {
                  setSelectedCity('all');
                  setIsCitySelectorModalOpen(false);
                  setCityFilterSearch('');
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                  selectedCity === 'all'
                    ? 'bg-[#462b1f] text-white'
                    : 'bg-[#fff8ef] hover:bg-[#f1e6da] text-[#302016]'
                }`}
              >
                <span>🇺🇦 {lang === 'uk' ? 'Вся Україна (Всі міста)' : 'Вся Украина (Все города)'}</span>
                <span className="opacity-70 text-xs">
                  {catalogSummary.totalMakersCount} {lang === 'uk' ? 'майстерень' : 'мастерских'}
                </span>
              </button>

              {catalogSummary.popularCities
                .filter((c: CatalogCityCount) => c.id !== 'all')
                .filter(
                  (c: CatalogCityCount) =>
                    !cityFilterSearch ||
                    c.uk.toLowerCase().includes(cityFilterSearch.toLowerCase()) ||
                    c.ru.toLowerCase().includes(cityFilterSearch.toLowerCase())
                )
                .map((city: CatalogCityCount) => {
                  const active = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.id);
                        setIsCitySelectorModalOpen(false);
                        setCityFilterSearch('');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                        active
                          ? 'bg-[#b06a1e] text-white'
                          : 'bg-[#fff8ef] hover:bg-[#f1e6da] text-[#302016]'
                      }`}
                    >
                      <span>📍 {lang === 'uk' ? city.uk : city.ru}</span>
                      <span className="opacity-70 text-xs">
                        {city.count} {lang === 'uk' ? 'майстерень' : 'мастерских'}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Maker */}
      {isAddMakerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#b06a1e]">
                  {selectedPlanForModal}
                </span>
                <h2 className="font-serif text-xl font-bold">
                  {lang === 'uk' ? 'Додати майстерню у CrafoHab' : 'Добавить мастерскую в CrafoHab'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsAddMakerModalOpen(false);
                  setMakerSubmitted(false);
                }}
                aria-label={lang === 'uk' ? 'Закрити форму додавання майстерні' : 'Закрыть форму добавления мастерской'}
                className="p-2 rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {makerSubmitted ? (
              <div className="bg-[#f1e6da] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold">
                  {lang === 'uk' ? 'Заявку прийнято!' : 'Заявка принята!'}
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMakerSubmitted(true);
                }}
                className="space-y-3 text-xs sm:text-sm"
              >
                <input
                  type="text"
                  required
                  placeholder={lang === 'uk' ? 'Назва майстерні' : 'Название мастерской'}
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder={lang === 'uk' ? 'Посилання на сайт або Instagram' : 'Ссылка на сайт или Instagram'}
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder={lang === 'uk' ? 'Телефон для зв’язку' : 'Телефон для связи'}
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <button
                  type="submit"
                  className="w-full bg-[#462b1f] hover:bg-[#b06a1e] text-white font-bold py-3 rounded-full"
                >
                  {lang === 'uk' ? 'Відправити' : 'Отправить'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: Discreet Maker Statistics Modal */}
      {isMakerStatsModalOpen && statsModalMaker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#261b16] text-[#eee7dd] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e39851] to-[#b06a1e] text-[#26140b] flex items-center justify-center font-bold shadow">
                  📊
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#f0a556]">
                    CrafoHab Partner Analytics
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    Статистика переходів покупців
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsMakerStatsModalOpen(false)}
                aria-label={lang === 'uk' ? 'Закрити кабінет статистики' : 'Закрыть кабинет статистики'}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Maker info header */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1a120e] border border-white/10">
              {statsModalMaker.imageUrl ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-[#3a2113]">
                  <OptimizedImage
                    src={statsModalMaker.imageUrl}
                    alt={statsModalMaker.name}
                    fill
                    sizes="48px"
                    fallbackWidth={100}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#3a2113] flex items-center justify-center text-xl">
                  🍫
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white text-sm truncate">
                  {statsModalMaker.name}
                </div>
                <div className="text-[11px] text-[#d4c9be]">
                  {statsModalMaker.city} • Рейтинг: ★ {statsModalMaker.rating}
                </div>
              </div>
            </div>

            {!statsUnlocked ? (
              <div className="space-y-4 py-2">
                <div className="text-center space-y-1">
                  <p className="text-xs text-[#c2b6a9] leading-relaxed">
                    Статистика є конфіденційною інформацією виробника. Введіть персональний PIN або пароль адміністратора для перегляду.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const cleanPin = statsPinInput.trim().toLowerCase();
                    if (
                      cleanPin === '2027' ||
                      cleanPin === 'crafo2027' ||
                      cleanPin === statsModalMaker.id.toLowerCase() ||
                      cleanPin === statsModalMaker.slug.toLowerCase() ||
                      cleanPin === `${statsModalMaker.slug}-2027`
                    ) {
                      setStatsUnlocked(true);
                      setStatsError('');
                    } else {
                      setStatsError('Невірний PIN-код. Для отримання доступу зв’яжіться з хабом.');
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#d4c9be] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={statsPinInput}
                      onChange={(e) => setStatsPinInput(e.target.value)}
                      placeholder="Введіть PIN майстерні..."
                      autoFocus
                      required
                      className="w-full bg-[#1a120e] border border-white/20 focus:border-[#f0a556] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white outline-none"
                    />
                  </div>
                  {statsError && (
                    <p className="text-xs text-rose-400 font-medium">
                      {statsError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#f0a556] hover:bg-[#e39851] text-[#26140b] font-extrabold py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Відкрити показники</span>
                  </button>
                </form>

                <p className="text-[11px] text-center text-[#d4c9be] pt-1">
                  Майстерня ще не підключила особистий кабінет?{' '}
                  <a
                    href="https://t.me/crafohab_ua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f0a556] underline"
                  >
                    Отримати PIN у Telegram
                  </a>
                </p>
              </div>
            ) : (
              (() => {
                const s = getMakerStats(statsModalMaker.id);
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-[#1a120e] p-3 rounded-xl border border-white/10 space-y-0.5">
                        <div className="text-[10px] uppercase font-bold text-[#f0a556]">
                          Всього лідів
                        </div>
                        <div className="text-2xl font-serif font-extrabold text-white">
                          {s.totalLeads}
                        </div>
                        <p className="text-[10px] text-[#d4c9be]">Звернень з хабу</p>
                      </div>

                      <div className="bg-[#1a120e] p-3 rounded-xl border border-white/10 space-y-0.5">
                        <div className="text-[10px] uppercase font-bold text-emerald-400">
                          На сайт / магазин
                        </div>
                        <div className="text-2xl font-serif font-extrabold text-white">
                          {s.websiteClicks}
                        </div>
                        <p className="text-[10px] text-[#d4c9be]">З UTM-міткою crafohab</p>
                      </div>

                      <div className="bg-[#1a120e] p-3 rounded-xl border border-white/10 space-y-0.5">
                        <div className="text-[10px] uppercase font-bold text-pink-400">
                          В Instagram
                        </div>
                        <div className="text-2xl font-serif font-extrabold text-white">
                          {s.instagramClicks}
                        </div>
                        <p className="text-[10px] text-[#d4c9be]">Кліків у Direct / сторінку</p>
                      </div>

                      <div className="bg-[#1a120e] p-3 rounded-xl border border-white/10 space-y-0.5">
                        <div className="text-[10px] uppercase font-bold text-amber-400">
                          Дзвінки / Контакти
                        </div>
                        <div className="text-2xl font-serif font-extrabold text-white">
                          {s.phoneClicks}
                        </div>
                        <p className="text-[10px] text-[#d4c9be]">Прямих наборів номера</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#302016] to-[#1f140e] border border-[#e39851]/40 text-xs text-[#c2b6a9] space-y-1.5 leading-relaxed">
                      <div className="font-bold text-[#f0a556] flex items-center gap-1.5">
                        <span>💡 Для виробника:</span>
                      </div>
                      <p>
                        Всі клієнти переходять безпосередньо у ваш кошик або Instagram-діалог за вашими роздрібними цінами без комісії платформи.
                      </p>
                      <div className="text-[10px] text-[#d4c9be] pt-0.5">
                        Останній зафіксований перехід: <strong className="text-white">{s.lastClickDate}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href="/partner/stats"
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
                      >
                        Повна аналітика хабу →
                      </Link>
                      <button
                        onClick={() => setIsMakerStatsModalOpen(false)}
                        className="py-2 px-4 rounded-xl bg-[#f0a556] text-[#26140b] text-xs font-extrabold hover:brightness-110 transition"
                      >
                        Закрити
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </>
  );
}
