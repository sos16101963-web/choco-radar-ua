'use client';

import React, { useState, useMemo } from 'react';
import {
  CATEGORIES,
  MAKERS,
  PRODUCTS,
  CategorySlug,
  CraftMaker,
  MakerSegment,
  getPricePer100g,
} from '@/data/chocolateData';
import {
  Search,
  CheckCircle2,
  ArrowUpRight,
  Scale,
  Gift,
  Building2,
  Star,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Globe,
  Mail,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface ChocoRadarAppProps {
  initialCategory?: CategorySlug;
}

const SEGMENT_GROUPS: { id: MakerSegment; title: string; subtitle: string }[] = [
  {
    id: 'bean-to-bar',
    title: '1. Bean-to-Bar (Від какао-боба до плитки)',
    subtitle:
      'Найцінніший крафтовий сегмент. Виробники самі закуповують фермерські какао-боби (Fino de Aroma, Criollo, Trinitario), обсмажують і перетирають їх у меланжерах.',
  },
  {
    id: 'chocolatier-bonbons',
    title: '2. Шоколатьє, авторські плитки та корпусні цукерки ручної роботи',
    subtitle:
      'Працюють із преміальним кувертюром або власними купажами, створюючи складні начинки (ганаші, праліне, карамель, сири, фадж) та художній розпис.',
  },
  {
    id: 'healthy-vegan',
    title: '3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)',
    subtitle:
      'Шоколад і цукерки на керобі, кокосовому нектарі, меду або еритритолі — для дітей, веганів та здорового харчування.',
  },
  {
    id: 'flowers-berries-nuts',
    title: '4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді',
    subtitle:
      'Спеціалізовані майстерні шоколадної флористики (півонії, троянди), цільної сублімованої малини в шоколаді та горіхово-фруктового драже.',
  },
];

export default function ChocoRadarApp({ initialCategory = 'all' }: ChocoRadarAppProps) {
  // Primary View Mode & Filters
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMakerId, setSelectedMakerId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price100_asc' | 'price_asc'>('popular');

  // Quick Filter Pills
  const [onlySugarFree, setOnlySugarFree] = useState(false);
  const [onlyBeanToBar, setOnlyBeanToBar] = useState(false);
  const [advisorGoal, setAdvisorGoal] = useState<'all' | 'gift-her' | 'gift-boss' | 'kids' | 'gourmet-self' | 'corporate'>('all');

  // Progressive Disclosure (Apple-style Expandable Sections)
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [expandedMakerIds, setExpandedMakerIds] = useState<string[]>([]);
  const [openSegmentGroups, setOpenSegmentGroups] = useState<MakerSegment[]>([
    'bean-to-bar',
    'chocolatier-bonbons',
    'healthy-vegan',
    'flowers-berries-nuts',
  ]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Comparison & Modals
  const [compareIds, setCompareIds] = useState<string[]>(['p-1', 'p-2', 'p-3']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [activeMakerModal, setActiveMakerModal] = useState<CraftMaker | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isAddMakerModalOpen, setIsAddMakerModalOpen] = useState(false);
  const [tenderSubmitted, setTenderSubmitted] = useState(false);
  const [makerSubmitted, setMakerSubmitted] = useState(false);

  const currentCategoryInfo = useMemo(
    () => CATEGORIES.find((c) => c.slug === selectedCategory) || CATEGORIES[0],
    [selectedCategory]
  );

  const toggleProductExpand = (id: string) => {
    setExpandedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleMakerExpand = (id: string) => {
    setExpandedMakerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSegmentGroup = (seg: MakerSegment) => {
    setOpenSegmentGroups((prev) =>
      prev.includes(seg) ? prev.filter((item) => item !== seg) : [...prev, seg]
    );
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedMakerId !== 'all' && product.makerId !== selectedMakerId) return false;
      if (onlySugarFree && !product.isSugarFree) return false;
      if (onlyBeanToBar && !product.isBeanToBar) return false;
      if (advisorGoal !== 'all' && !product.bestFor.includes(advisorGoal)) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchMaker = product.makerName.toLowerCase().includes(q);
        const matchNotes = product.tastingNotes.some((n) => n.toLowerCase().includes(q));
        if (!matchTitle && !matchMaker && !matchNotes) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price100_asc') {
        return getPricePer100g(a.priceUah, a.weightGrams) - getPricePer100g(b.priceUah, b.weightGrams);
      }
      if (sortBy === 'price_asc') {
        return a.priceUah - b.priceUah;
      }
      return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
    });
  }, [selectedCategory, selectedMakerId, onlySugarFree, onlyBeanToBar, advisorGoal, searchQuery, sortBy]);

  const comparedProducts = useMemo(
    () => PRODUCTS.filter((p) => compareIds.includes(p.id)),
    [compareIds]
  );

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedMakerId('all');
    setOnlySugarFree(false);
    setOnlyBeanToBar(false);
    setAdvisorGoal('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      {/* Apple-Style Minimal Frosted Glass Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-[#D2D2D7]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] text-white flex items-center justify-center font-semibold text-sm tracking-tight">
              CR
            </div>
            <div>
              <div className="font-semibold text-base tracking-tight text-[#1D1D1F]">
                ChocoRadar <span className="text-[#86868B] font-normal">Україна</span>
              </div>
              <div className="text-[11px] text-[#86868B] hidden sm:block">
                Всі крафтові виробники шоколаду та порівняння цін
              </div>
            </div>
          </button>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#1D1D1F]/80">
            <a href="#makers-section" className="hover:text-[#0071E3] transition">
              Реєстр виробників ({MAKERS.length})
            </a>
            <a href="#products-section" className="hover:text-[#0071E3] transition">
              Каталог та ціни ({PRODUCTS.length})
            </a>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="hover:text-[#0071E3] transition flex items-center gap-1"
            >
              <span>Порівняння</span>
              <span className="bg-[#E8E8ED] text-[#1D1D1F] px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                {compareIds.length}
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMakerModalOpen(true)}
              className="text-xs font-medium text-[#1D1D1F] bg-[#E8E8ED] hover:bg-[#D2D2D7]/70 px-3.5 py-2 rounded-full transition"
            >
              + Додати майстерню
            </button>
            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="text-xs font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] px-4 py-2 rounded-full transition shadow-sm"
            >
              Замовити підбір
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container with Apple Generous Whitespace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">
        {/* Clean Apple-Style Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 bg-white border border-[#D2D2D7] px-3.5 py-1 rounded-full text-xs font-medium text-[#515154] shadow-sm">
            <span>Перевірена база крафтових виробників шоколаду України • 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] leading-[1.12]">
            {currentCategoryInfo.seoH1}
          </h1>

          <p className="text-base sm:text-lg text-[#515154] leading-relaxed font-normal">
            {currentCategoryInfo.seoDescription}
          </p>

          {/* Clean Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#86868B] absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук: Sisters A, Spell, малина в шоколаді, букети, сирні цукерки, без цукру..."
                className="w-full bg-white border border-[#D2D2D7] focus:border-[#0071E3] rounded-2xl pl-11 pr-10 py-3.5 text-sm text-[#1D1D1F] placeholder:text-[#86868B] shadow-sm focus:outline-none focus:ring-4 focus:ring-[#0071E3]/15 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-[#86868B] hover:text-[#1D1D1F]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expandable Smart Advisor Trigger (Kept clean & collapsible) */}
          <div className="pt-1">
            <button
              onClick={() => setIsAdvisorOpen(!isAdvisorOpen)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0071E3] hover:underline"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isAdvisorOpen
                  ? 'Сховати помічник швидкого підбору'
                  : 'Не знаєте, що обрати? Відкрити швидкий підбір за метою та бюджетом'}
              </span>
              {isAdvisorOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isAdvisorOpen && (
              <div className="mt-4 bg-white border border-[#D2D2D7] rounded-3xl p-6 text-left shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                    1. Кому та для чого обираємо?
                  </span>
                  {advisorGoal !== 'all' && (
                    <button
                      onClick={() => setAdvisorGoal('all')}
                      className="text-xs text-[#0071E3] hover:underline"
                    >
                      Скинути
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Всі варіанти' },
                    { id: 'gift-her', label: '💝 На подарунок' },
                    { id: 'gift-boss', label: '🥃 Шефу / До вина' },
                    { id: 'kids', label: '🧸 Дітям' },
                    { id: 'gourmet-self', label: '🍫 Гурману до кави' },
                    { id: 'corporate', label: '💼 Корпоративні' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAdvisorGoal(item.id as typeof advisorGoal)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                        advisorGoal === item.id
                          ? 'bg-[#1D1D1F] text-white'
                          : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-[#515154] bg-[#F5F5F7] p-3.5 rounded-2xl">
                  <strong>Порада сомельє:</strong> {currentCategoryInfo.expertGuide}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 1: FULL UKRAINIAN CRAFT MAKERS REGISTRY (Organized in 4 Clean Apple-Style Expandable Groups) */}
        <section id="makers-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D2D2D7] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Реєстр крафтових виробників України ({MAKERS.length} перевірені компанії)
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                Всі крафтові виробники шоколадних виробів
              </h2>
            </div>
            <p className="text-xs text-[#515154]">
              Натисніть <strong>«Детальніше та контакти»</strong> на картці майстерні, щоб розгорнути опис, телефон і сайт
            </p>
          </div>

          <div className="space-y-4">
            {SEGMENT_GROUPS.map((group) => {
              const isOpen = openSegmentGroups.includes(group.id);
              const groupMakers = MAKERS.filter((m) => {
                if (m.segment !== group.id) return false;
                if (searchQuery.trim() !== '') {
                  const q = searchQuery.toLowerCase();
                  return (
                    m.name.toLowerCase().includes(q) ||
                    m.city.toLowerCase().includes(q) ||
                    m.specialty.toLowerCase().includes(q) ||
                    m.description.toLowerCase().includes(q)
                  );
                }
                return true;
              });

              return (
                <div
                  key={group.id}
                  className="bg-white border border-[#D2D2D7]/80 rounded-3xl overflow-hidden shadow-sm"
                >
                  {/* Group Accordion Header */}
                  <button
                    onClick={() => toggleSegmentGroup(group.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[#F5F5F7]/60 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                          {group.title}
                        </h3>
                        <span className="bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {groupMakers.length}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#515154]">{group.subtitle}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Group Makers List */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#E8E8ED] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupMakers.map((maker) => {
                        const isExpanded = expandedMakerIds.includes(maker.id);
                        return (
                          <div
                            key={maker.id}
                            className="bg-[#F5F5F7]/70 hover:bg-[#F5F5F7] border border-[#D2D2D7]/70 rounded-2xl p-5 flex flex-col justify-between transition"
                          >
                            <div className="space-y-2.5">
                              {/* Top Row: Name + Rating */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-base text-[#1D1D1F] flex items-center gap-1.5">
                                    <span>{maker.name}</span>
                                    {maker.isVerified && (
                                      <span title="Перевірені контакти в Україні">
                                        <CheckCircle2 className="w-4 h-4 text-[#0071E3] shrink-0" />
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-xs text-[#515154] flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#86868B]" />
                                    <span>{maker.city}</span>
                                  </p>
                                </div>
                                <div className="bg-white px-2.5 py-1 rounded-full border border-[#D2D2D7] text-xs font-semibold text-[#1D1D1F] flex items-center gap-1 shrink-0">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{maker.rating}</span>
                                </div>
                              </div>

                              {/* Short Specialty (Always Visible) */}
                              <p className="text-xs sm:text-sm text-[#1D1D1F] font-medium leading-snug">
                                {maker.specialty}
                              </p>

                              {/* Collapsible Details & Real Verified Contacts */}
                              {isExpanded && (
                                <div className="pt-3 mt-3 border-t border-[#D2D2D7] space-y-2.5 text-xs text-[#515154] animate-fadeIn">
                                  <p className="leading-relaxed text-[#1D1D1F]">{maker.description}</p>

                                  <div className="bg-white rounded-xl p-3 border border-[#D2D2D7]/80 space-y-1.5">
                                    <div className="font-semibold text-[#1D1D1F] text-[11px] uppercase tracking-wider">
                                      Реальні контакти виробника:
                                    </div>
                                    {maker.phone && (
                                      <div className="flex items-center gap-2 text-[#1D1D1F]">
                                        <Phone className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                                        <span className="font-medium">{maker.phone}</span>
                                      </div>
                                    )}
                                    {maker.email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                                        <span>{maker.email}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Globe className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                                      <a
                                        href={maker.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0071E3] hover:underline font-medium truncate"
                                      >
                                        {maker.websiteUrl.replace('https://', '')}
                                      </a>
                                    </div>
                                    <div className="text-[11px] text-[#515154]">
                                      Instagram:{' '}
                                      <a
                                        href={maker.instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0071E3] hover:underline font-medium"
                                      >
                                        {maker.instagramHandle}
                                      </a>
                                    </div>
                                    {maker.address && (
                                      <div className="text-[11px] text-[#86868B]">{maker.address}</div>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {maker.badges.map((b, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] bg-white border border-[#D2D2D7] text-[#515154] px-2 py-0.5 rounded-full"
                                      >
                                        {b}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Card Actions */}
                            <div className="pt-3 mt-3 border-t border-[#D2D2D7]/60 flex items-center justify-between gap-2">
                              <button
                                onClick={() => toggleMakerExpand(maker.id)}
                                className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
                              >
                                <span>{isExpanded ? 'Згорнути' : 'Детальніше і контакти'}</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <a
                                href={maker.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium bg-white hover:bg-[#1D1D1F] hover:text-white text-[#1D1D1F] border border-[#D2D2D7] px-3 py-1.5 rounded-full transition flex items-center gap-1"
                              >
                                <span>Сайт</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: CLEAN PRODUCT CATALOG & PRICE PER 100G COMPARISON */}
        <section id="products-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D2D2D7] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Каталог виробів та порівняння вартості за 100 г
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                Порівняння шоколадних виробів за категоріями
              </h2>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#515154]">Сортування:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border border-[#D2D2D7] rounded-full px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
              >
                <option value="popular">За популярністю</option>
                <option value="price100_asc">Найвигідніша ціна за 100 г</option>
                <option value="price_asc">Від дешевших за упаковку</option>
              </select>
            </div>
          </div>

          {/* Apple-Style Segmented Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    active
                      ? 'bg-[#1D1D1F] text-white shadow-sm'
                      : 'bg-white text-[#1D1D1F] border border-[#D2D2D7] hover:bg-[#E8E8ED]'
                  }`}
                >
                  {cat.shortTitle}
                </button>
              );
            })}
          </div>

          {/* Minimalist Filter Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#86868B] flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Фільтри:
            </span>
            <button
              onClick={() => setOnlyBeanToBar(!onlyBeanToBar)}
              className={`px-3.5 py-1.5 rounded-full border transition ${
                onlyBeanToBar
                  ? 'bg-[#0071E3] text-white border-[#0071E3] font-semibold'
                  : 'bg-white text-[#1D1D1F] border-[#D2D2D7]'
              }`}
            >
              Bean-to-Bar
            </button>
            <button
              onClick={() => setOnlySugarFree(!onlySugarFree)}
              className={`px-3.5 py-1.5 rounded-full border transition ${
                onlySugarFree
                  ? 'bg-[#0071E3] text-white border-[#0071E3] font-semibold'
                  : 'bg-white text-[#1D1D1F] border-[#D2D2D7]'
              }`}
            >
              Без білого цукру
            </button>
            <button
              onClick={() => setAdvisorGoal(advisorGoal === 'kids' ? 'all' : 'kids')}
              className={`px-3.5 py-1.5 rounded-full border transition ${
                advisorGoal === 'kids'
                  ? 'bg-[#0071E3] text-white border-[#0071E3] font-semibold'
                  : 'bg-white text-[#1D1D1F] border-[#D2D2D7]'
              }`}
            >
              🧸 Дітям
            </button>
            <select
              value={selectedMakerId}
              onChange={(e) => setSelectedMakerId(e.target.value)}
              className="bg-white border border-[#D2D2D7] rounded-full px-3.5 py-1.5 text-[#1D1D1F]"
            >
              <option value="all">Всі виробники ({MAKERS.length})</option>
              {MAKERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.city})
                </option>
              ))}
            </select>
          </div>

          {/* Clean Apple-Style Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const pricePer100 = getPricePer100g(product.priceUah, product.weightGrams);
              const isExpanded = expandedProductIds.includes(product.id);
              const isCompared = compareIds.includes(product.id);
              const maker = MAKERS.find((m) => m.id === product.makerId);

              return (
                <article
                  key={product.id}
                  className="bg-white border border-[#D2D2D7]/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative h-52 bg-[#F5F5F7] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-white/95 backdrop-blur-md text-[#1D1D1F] text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                          {product.subType}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Склад {product.cleanLabelScore}/100</span>
                      </div>
                    </div>

                    {/* Clean Minimalist Card Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#515154]">
                        <button
                          onClick={() => maker && setActiveMakerModal(maker)}
                          className="font-semibold text-[#0071E3] hover:underline"
                        >
                          {product.makerName} ({product.makerCity})
                        </button>
                        <span className="flex items-center gap-1 font-medium text-[#1D1D1F]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {product.rating}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-[#1D1D1F] leading-snug">
                        {product.title}
                      </h3>

                      {/* Key Price & 100g Comparison Metric */}
                      <div className="pt-1 flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-bold text-[#1D1D1F]">
                            {product.priceUah} грн
                          </span>
                          <span className="text-xs text-[#86868B] ml-1.5">
                            / {product.weightGrams} г
                          </span>
                        </div>
                        <div className="bg-[#F5F5F7] px-3 py-1 rounded-full text-xs font-semibold text-[#1D1D1F]">
                          {pricePer100} грн за 100 г
                        </div>
                      </div>

                      {/* Expandable Details (Progressive Disclosure so nothing is cluttered) */}
                      <div className="pt-2">
                        <button
                          onClick={() => toggleProductExpand(product.id)}
                          className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
                        >
                          <span>
                            {isExpanded
                              ? 'Сховати характеристики та смаковий профіль'
                              : 'Розгорнути склад, смаковий профіль та опис'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#E8E8ED] space-y-3 text-xs text-[#515154]">
                            <p className="text-[#1D1D1F] leading-relaxed">{product.expertVerdict}</p>
                            <div className="bg-[#F5F5F7] rounded-2xl p-3 space-y-1.5">
                              <div>
                                <strong>Какао:</strong> {product.cacaoPercent}% ({product.cacaoType})
                              </div>
                              <div>
                                <strong>Підсолоджувач:</strong> {product.sweetener}
                              </div>
                              <div>
                                <strong>Ноти смаку:</strong> {product.tastingNotes.join(', ')}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Buttons */}
                  <div className="px-6 pb-6 pt-3 border-t border-[#F5F5F7] flex items-center gap-2">
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className={`px-3.5 py-2.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                        isCompared
                          ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                          : 'bg-[#F5F5F7] text-[#1D1D1F] border-transparent hover:bg-[#E8E8ED]'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'У порівнянні' : 'Порівняти'}</span>
                    </button>

                    <button
                      onClick={() => maker && setActiveMakerModal(maker)}
                      className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold py-2.5 px-4 rounded-full text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Контакти та сайт</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: COLLAPSIBLE SUMMARY PRICE TABLE (Clean Accordion) */}
        <section className="bg-white border border-[#D2D2D7]/80 rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => setIsTableOpen(!isTableOpen)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-[#F5F5F7]/50 transition"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Аналітична таблиця цін
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] mt-0.5">
                Зведена таблиця порівняння ціни за 100 грамів та складу
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0071E3]">
              <span>{isTableOpen ? 'Згорнути таблицю' : 'Розгорнути таблицю'}</span>
              {isTableOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isTableOpen && (
            <div className="px-6 pb-6 border-t border-[#E8E8ED] overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm mt-4">
                <thead>
                  <tr className="border-b border-[#D2D2D7] text-[#86868B]">
                    <th className="py-3 px-3 font-semibold">Виріб та виробник</th>
                    <th className="py-3 px-3 font-semibold">Підсолоджувач</th>
                    <th className="py-3 px-3 font-semibold">Ціна упаковки</th>
                    <th className="py-3 px-3 font-semibold text-[#0071E3]">Ціна за 100 г</th>
                    <th className="py-3 px-3 font-semibold">Чистота складу</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8ED]">
                  {PRODUCTS.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F5F5F7]/60">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#1D1D1F]">{item.title}</div>
                        <div className="text-xs text-[#86868B]">
                          {item.makerName} ({item.makerCity})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#515154]">{item.sweetener}</td>
                      <td className="py-3 px-3 text-[#1D1D1F]">
                        {item.priceUah} грн / {item.weightGrams} г
                      </td>
                      <td className="py-3 px-3 font-bold text-[#0071E3]">
                        {getPricePer100g(item.priceUah, item.weightGrams)} грн
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">
                        {item.cleanLabelScore}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECTION 4: APPLE-STYLE ACCORDION FAQ */}
        <section className="bg-white border border-[#D2D2D7]/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
            Часті запитання про вибір крафтового шоколаду
          </h2>
          <div className="divide-y divide-[#E8E8ED]">
            {[
              {
                q: 'Чим крафтовий шоколад Bean-to-Bar відрізняється від звичайного магазинного?',
                a: 'Промисловий шоколад готується з дезодорованого какао-порошку, соєвого лецитину та штучного ваніліну. Крафтовий шоколад Bean-to-Bar («від какао-боба до плитки») містить лише фермерські какао-боби сортів Fino de Aroma або Criollo, натуральне какао-масло та тростинний/кокосовий цукор або мед.',
              },
              {
                q: 'Як об’єктивно порівняти ціни різних виробників шоколаду в Україні?',
                a: 'Крафтові плитки та бокси мають різну вагу (від 75 г до 480 г). Тому платформа ChocoRadar UA автоматично розраховує чесний індекс ціни за 100 грамів чистого продукту.',
              },
              {
                q: 'Як замовити шоколадні букети або малину в шоколаді Новою Поштою?',
                a: 'Крафтові майстерні шоколадної флористики (наприклад, Ecojoy або ChocoLady) відправляють букети у спеціальних фіксаторах, а сублімована малина та полуниця в шоколаді (Panfruit, MasloTOM) зберігає свіжість і хрускіт до 6 місяців.',
              },
              {
                q: 'Як українському виробнику безкоштовно додати свою майстерню до каталогу?',
                a: 'Натисніть кнопку «+ Додати майстерню» у верхньому меню сайту, вкажіть назву вашого бренду, місто, телефон та посилання на сайт або Instagram.',
              },
            ].map((faq, index) => {
              const open = openFaqIndex === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setOpenFaqIndex(open ? null : index)}
                    className="w-full flex items-center justify-between text-left font-semibold text-sm sm:text-base text-[#1D1D1F] hover:text-[#0071E3] transition"
                  >
                    <span>{faq.q}</span>
                    {open ? (
                      <ChevronUp className="w-4 h-4 text-[#86868B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#86868B] shrink-0" />
                    )}
                  </button>
                  {open && (
                    <p className="mt-2 text-xs sm:text-sm text-[#515154] leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-[#D2D2D7] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868B]">
          <div>
            <strong className="text-[#1D1D1F]">ChocoRadar.ua</strong> — Всеукраїнський каталог крафтових виробників шоколадних виробів (2026)
          </div>
          <div className="flex gap-5">
            <button onClick={() => setIsAddMakerModalOpen(true)} className="hover:text-[#1D1D1F]">
              Додати виробника
            </button>
            <button onClick={() => setIsTenderModalOpen(true)} className="hover:text-[#1D1D1F]">
              Заявка на підбір
            </button>
            <button onClick={() => setIsCompareModalOpen(true)} className="hover:text-[#1D1D1F]">
              Порівняння ({compareIds.length})
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Maker Verified Contacts Modal */}
      {activeMakerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D2D2D7] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071E3]">
                  {activeMakerModal.segmentTitle}
                </span>
                <h2 className="text-2xl font-bold text-[#1D1D1F] mt-0.5">{activeMakerModal.name}</h2>
                <p className="text-xs text-[#515154]">
                  {activeMakerModal.city} • З {activeMakerModal.foundedYear} року • Рейтинг {activeMakerModal.rating}/5
                </p>
              </div>
              <button
                onClick={() => setActiveMakerModal(null)}
                className="p-2 rounded-full bg-[#F5F5F7] text-[#515154] hover:text-[#1D1D1F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#1D1D1F] leading-relaxed">{activeMakerModal.description}</p>

            <div className="bg-[#F5F5F7] rounded-2xl p-4 space-y-2 text-xs text-[#1D1D1F]">
              <div className="font-bold uppercase tracking-wider text-[#86868B] text-[11px]">
                Перевірені контакти в Україні:
              </div>
              {activeMakerModal.phone && (
                <div>
                  <strong>Телефон:</strong> {activeMakerModal.phone}
                </div>
              )}
              {activeMakerModal.email && (
                <div>
                  <strong>Email:</strong> {activeMakerModal.email}
                </div>
              )}
              <div>
                <strong>Instagram:</strong>{' '}
                <a
                  href={activeMakerModal.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071E3] hover:underline font-medium"
                >
                  {activeMakerModal.instagramHandle}
                </a>
              </div>
              {activeMakerModal.address && (
                <div>
                  <strong>Локація:</strong> {activeMakerModal.address}
                </div>
              )}
              <div>
                <strong>Доставка:</strong> {activeMakerModal.shippingNote}
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={activeMakerModal.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold py-3 px-4 rounded-full text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5"
              >
                <span>Перейти на сайт виробника</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Side-by-Side Comparison */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D2D2D7] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-4">
              <h2 className="text-xl font-bold text-[#1D1D1F]">
                Порівняння характеристик та ціни за 100 г
              </h2>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-full bg-[#F5F5F7] text-[#515154]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {comparedProducts.length === 0 ? (
              <p className="text-sm text-[#515154] py-8 text-center">
                Додайте вироби до порівняння кнопкою «Порівняти».
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#D2D2D7]">
                      <th className="py-3 px-3 text-[#86868B]">Параметр</th>
                      {comparedProducts.map((p) => (
                        <th key={p.id} className="py-3 px-3">
                          <div className="font-bold text-[#1D1D1F]">{p.title}</div>
                          <div className="text-xs text-[#0071E3] font-normal">{p.makerName}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8ED]">
                    <tr>
                      <td className="py-3 px-3 text-[#515154]">Ціна упаковки</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold">
                          {p.priceUah} грн ({p.weightGrams} г)
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-[#F5F5F7]">
                      <td className="py-3 px-3 font-bold text-[#0071E3]">Ціна за 100 г</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold text-[#0071E3]">
                          {getPricePer100g(p.priceUah, p.weightGrams)} грн / 100 г
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#515154]">Підсолоджувач</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3">
                          {p.sweetener}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#515154]">Какао</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3">
                          {p.cacaoPercent}% ({p.cacaoType})
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Tender Request */}
      {isTenderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D2D2D7] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-[#1D1D1F]">Заявка на підбір шоколаду</h2>
              <button
                onClick={() => {
                  setIsTenderModalOpen(false);
                  setTenderSubmitted(false);
                }}
                className="p-2 rounded-full bg-[#F5F5F7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {tenderSubmitted ? (
              <div className="bg-[#F5F5F7] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-[#1D1D1F]">Заявку прийнято!</div>
                <p className="text-xs text-[#515154]">
                  Перевірені виробники надішлють вам пропозиції у месенджер.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTenderSubmitted(true);
                }}
                className="space-y-3 text-xs sm:text-sm"
              >
                <input
                  type="text"
                  required
                  placeholder="Що шукаєте? (букет, цукерки, bean-to-bar, дітям)"
                  className="w-full bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl px-4 py-3 text-[#1D1D1F]"
                />
                <input
                  type="text"
                  required
                  placeholder="Ваш телефон або Telegram (@username)"
                  className="w-full bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl px-4 py-3 text-[#1D1D1F]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold py-3 rounded-full transition"
                >
                  Надіслати запит майстерням
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: Add Maker */}
      {isAddMakerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D2D2D7] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-[#1D1D1F]">Додати крафтову майстерню</h2>
              <button
                onClick={() => {
                  setIsAddMakerModalOpen(false);
                  setMakerSubmitted(false);
                }}
                className="p-2 rounded-full bg-[#F5F5F7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {makerSubmitted ? (
              <div className="bg-[#F5F5F7] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-[#1D1D1F]">Дякуємо! Майстерню відправлено на модерацію.</div>
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
                  placeholder="Назва бренду та місто"
                  className="w-full bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl px-4 py-3 text-[#1D1D1F]"
                />
                <input
                  type="text"
                  required
                  placeholder="Посилання на сайт або Instagram"
                  className="w-full bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl px-4 py-3 text-[#1D1D1F]"
                />
                <input
                  type="text"
                  required
                  placeholder="Контактний телефон"
                  className="w-full bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl px-4 py-3 text-[#1D1D1F]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#1D1D1F] hover:bg-black text-white font-semibold py-3 rounded-full transition"
                >
                  Додати безкоштовно
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
