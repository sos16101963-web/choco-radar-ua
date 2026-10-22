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
  Star,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Globe,
  Mail,
  ShieldCheck,
  Filter,
} from 'lucide-react';

interface ChocoRadarAppProps {
  initialCategory?: CategorySlug;
}

const CATEGORY_SHORT_LABELS: Record<Exclude<CategorySlug, 'all'>, { label: string; emoji: string }> = {
  'plytky-shokoladu': { label: 'Плитки шоколаду', emoji: '🍫' },
  'korpusni-ta-rozmalovani-tsukerky': { label: 'Цукерки ручної роботи', emoji: '🍬' },
  'shokoladni-kvity-ta-bukety': { label: 'Шоколадні квіти і букети', emoji: '🌹' },
  'malyna-ta-polunytsia-v-shokoladi': { label: 'Малина та полуниця в шоколаді', emoji: '🍓' },
  'horikhy-ta-sukhofrukty-v-shokoladi': { label: 'Горіхи та сухофрукти в шоколаді', emoji: '🌰' },
  'bez-tsukru-ta-vegan': { label: 'Без цукру / Дітям / Vegan', emoji: '🌿' },
};

const CITY_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Вся Україна' },
  { id: 'Харків', label: 'Харків' },
  { id: 'Київ', label: 'Київ' },
  { id: 'Львів', label: 'Львів' },
  { id: 'Луцьк / Волинь', label: 'Луцьк / Волинь' },
  { id: 'Дніпро', label: 'Дніпро' },
  { id: 'Одеса', label: 'Одеса' },
  { id: 'Полтава / Кременчук', label: 'Полтава / Кременчук' },
  { id: 'Вінниця / Житомир', label: 'Вінниця / Житомир' },
  { id: 'Захід та Центри', label: 'Черкаси / Закарпаття / Рівне' },
];

const SEGMENT_GROUPS: { id: MakerSegment; title: string; subtitle: string }[] = [
  {
    id: 'bean-to-bar',
    title: '1. Bean-to-Bar (Від какао-боба до плитки)',
    subtitle:
      'Виробники самі закуповують фермерські какао-боби (Fino de Aroma, Criollo, Trinitario), обсмажують і перетирають їх у меланжерах.',
  },
  {
    id: 'chocolatier-bonbons',
    title: '2. Шоколатьє: плитки, цукерки ручної роботи та шоколадні квіти',
    subtitle:
      'Авторські плитки, корпусні цукерки з художнім розписом, шоколадні букети, трюфелі, сирні цукерки та фадж.',
  },
  {
    id: 'healthy-vegan',
    title: '3. Healthy / Vegan / Raw шоколад (Без білого цукру, для дітей)',
    subtitle:
      'Шоколад і цукерки на керобі, кокосовому нектарі, меду або еритритолі — без білого цукру, лактози та глютену.',
  },
  {
    id: 'flowers-berries-nuts',
    title: '4. Спеціалізовані майстерні: шоколадні квіти, ягоди та горіхи в шоколаді',
    subtitle:
      'Букети з бельгійського шоколаду, свіжа й сублімована полуниця та малина в шоколаді, чорнослив і горіхове драже.',
  },
];

export default function ChocoRadarApp({ initialCategory = 'all' }: ChocoRadarAppProps) {
  // Primary Step-by-Step Consumer Filters
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMakerId, setSelectedMakerId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price100_asc' | 'price_asc'>('popular');

  // Quick Purpose / Dietary Filter Pills
  const [onlySugarFree, setOnlySugarFree] = useState(false);
  const [onlyBeanToBar, setOnlyBeanToBar] = useState(false);
  const [advisorGoal, setAdvisorGoal] = useState<'all' | 'gift-her' | 'gift-boss' | 'kids' | 'gourmet-self' | 'corporate'>('all');

  // Progressive Disclosure (Apple-style Expandable Drawers — closed by default so page is ultra-clean)
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [expandedMakerIds, setExpandedMakerIds] = useState<string[]>([]);
  const [groupBySegment, setGroupBySegment] = useState<boolean>(false);
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Comparison & Modals
  const [compareIds, setCompareIds] = useState<string[]>(['p-1', 'p-2', 'p-13']);
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

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  // Filtered Makers (Checks ALL categories a maker produces + City + Search + Bean-to-Bar / Sugar-Free)
  const filteredMakers = useMemo(() => {
    return MAKERS.filter((m) => {
      if (selectedCategory !== 'all' && !m.categories.includes(selectedCategory)) return false;
      if (selectedCity !== 'all' && m.regionCity !== selectedCity && !m.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }
      if (onlyBeanToBar && !m.isBeanToBar) return false;
      if (onlySugarFree && !m.categories.includes('bez-tsukru-ta-vegan')) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          m.name.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.specialty.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.websiteUrl.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedCity, onlyBeanToBar, onlySugarFree, searchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedMakerId !== 'all' && product.makerId !== selectedMakerId) return false;
      if (onlySugarFree && !product.isSugarFree) return false;
      if (onlyBeanToBar && !product.isBeanToBar) return false;
      if (advisorGoal !== 'all' && !product.bestFor.includes(advisorGoal)) return false;

      if (selectedCity !== 'all') {
        const maker = MAKERS.find((m) => m.id === product.makerId);
        const cityMatch =
          (maker && maker.regionCity === selectedCity) ||
          product.makerCity.toLowerCase().includes(selectedCity.toLowerCase());
        if (!cityMatch) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchMaker = product.makerName.toLowerCase().includes(q);
        const matchCity = product.makerCity.toLowerCase().includes(q);
        const matchNotes = product.tastingNotes.some((n) => n.toLowerCase().includes(q));
        if (!matchTitle && !matchMaker && !matchCity && !matchNotes) return false;
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
  }, [selectedCategory, selectedCity, selectedMakerId, onlySugarFree, onlyBeanToBar, advisorGoal, searchQuery, sortBy]);

  const comparedProducts = useMemo(
    () => PRODUCTS.filter((p) => compareIds.includes(p.id)),
    [compareIds]
  );

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('all');
    setSearchQuery('');
    setSelectedMakerId('all');
    setOnlySugarFree(false);
    setOnlyBeanToBar(false);
    setAdvisorGoal('all');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedMakerId !== 'all' ||
    onlySugarFree ||
    onlyBeanToBar ||
    advisorGoal !== 'all';

  // Helper to render a single clean Apple-style Maker Card
  const renderMakerCard = (maker: CraftMaker) => {
    const isExpanded = expandedMakerIds.includes(maker.id);
    const cleanDomain = maker.websiteUrl
      .replace('https://www.', '')
      .replace('https://', '')
      .replace(/\/$/, '');

    return (
      <div
        key={maker.id}
        className="bg-white border border-[#D2D2D7]/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition"
      >
        <div className="space-y-3">
          {/* Top Row: Name, Verified Icon, City & Rating */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#1D1D1F] leading-snug flex items-center gap-1.5">
                <span>{maker.name}</span>
                {maker.isVerified && (
                  <span title="Перевірений український виробник">
                    <CheckCircle2 className="w-4 h-4 text-[#0071E3] shrink-0" />
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#515154] flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                <span>{maker.city}</span>
              </p>
            </div>
            <div className="bg-[#F5F5F7] px-2.5 py-1 rounded-full text-xs font-semibold text-[#1D1D1F] flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{maker.rating}</span>
            </div>
          </div>

          {/* What they produce: Clean Multi-Category Pills (So consumer immediately sees if they make bars + candies + flowers) */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {maker.categories.map((catSlug) => {
              const info = CATEGORY_SHORT_LABELS[catSlug];
              const isSelectedCat = selectedCategory === catSlug;
              return (
                <button
                  key={catSlug}
                  onClick={() => setSelectedCategory(catSlug)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition flex items-center gap-1 ${
                    isSelectedCat
                      ? 'bg-[#0071E3] text-white font-semibold'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                  }`}
                >
                  <span>{info.emoji}</span>
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1-Sentence Specialty */}
          <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
            {maker.specialty}
          </p>

          {/* Direct Contact Summary Always Visible */}
          <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#1D1D1F]">
            {maker.phone && (
              <span className="flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                <span>{maker.phone.split(',')[0]}</span>
              </span>
            )}
          </div>

          {/* Expandable Full Details (Progressive Disclosure) */}
          {isExpanded && (
            <div className="pt-3 mt-2 border-t border-[#E8E8ED] space-y-2.5 text-xs text-[#515154]">
              <p className="text-[#1D1D1F] leading-relaxed">{maker.description}</p>
              <div className="bg-[#F5F5F7] rounded-2xl p-3.5 space-y-1.5 text-[#1D1D1F]">
                <div>
                  <strong>Адреса / Локація:</strong> {maker.address}
                </div>
                <div>
                  <strong>Телефон:</strong> {maker.phone}
                </div>
                {maker.email && (
                  <div>
                    <strong>Email:</strong> {maker.email}
                  </div>
                )}
                <div>
                  <strong>Доставка:</strong> {maker.shippingNote}
                </div>
                <div>
                  <strong>Сировина / Какао:</strong> {maker.cacaoOrigin.join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 mt-4 border-t border-[#F5F5F7] flex items-center justify-between gap-2">
          <button
            onClick={() => toggleMakerExpand(maker.id)}
            className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
          >
            <span>{isExpanded ? 'Згорнути опис' : 'Адреса та опис'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <a
            href={maker.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1D1D1F] hover:bg-[#0071E3] text-white text-xs font-semibold px-4 py-2 rounded-full transition flex items-center gap-1.5 shadow-sm"
          >
            <span>{cleanDomain.length > 22 ? 'Перейти на сайт' : cleanDomain}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      {/* Apple-Style Minimal Frosted Glass Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 border-b border-[#D2D2D7]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
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
                Всі крафтові виробники шоколаду України ({MAKERS.length} майстерень)
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#1D1D1F]/80">
            <a href="#step-1-choose" className="hover:text-[#0071E3] transition">
              1. Обрати категорію
            </a>
            <a href="#makers-section" className="hover:text-[#0071E3] transition">
              2. Виробники ({filteredMakers.length})
            </a>
            <a href="#products-section" className="hover:text-[#0071E3] transition">
              3. Порівняти ціни ({filteredProducts.length})
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMakerModalOpen(true)}
              className="text-xs font-medium text-[#1D1D1F] bg-[#E8E8ED] hover:bg-[#D2D2D7]/70 px-3.5 py-2 rounded-full transition"
            >
              + Додати виробника
            </button>
            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="text-xs font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] px-4 py-2 rounded-full transition shadow-sm"
            >
              Допомогти обрати
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* STEP 1: APPLE STORE-STYLE VISUAL PRODUCT CATEGORY SELECTOR */}
        <section id="step-1-choose" className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] leading-[1.12]">
              {currentCategoryInfo.seoH1}
            </h1>
            <p className="text-sm sm:text-base text-[#515154] max-w-2xl mx-auto">
              Крок 1: Оберіть, що саме ви хочете купити — ми одразу покажемо всіх українських виробників цієї категорії та порівняємо ціни.
            </p>
          </div>

          {/* Large Visual Category Cards (Like Apple Store Product Bar) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.slug;
              const slug = cat.slug;
              const count =
                slug === 'all'
                  ? MAKERS.length
                  : MAKERS.filter((m) => m.categories.includes(slug)).length;

              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                    active
                      ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-md'
                      : 'bg-white text-[#1D1D1F] border-[#D2D2D7]/90 hover:border-[#0071E3] hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#515154]'
                      }`}
                    >
                      {count} вир.
                    </span>
                  </div>
                  <div className="font-semibold text-xs sm:text-sm leading-tight">
                    {cat.shortTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* STEP 2: CITY + SEARCH + QUICK FILTERS IN ONE CLEAN BAR */}
          <div className="bg-white border border-[#D2D2D7]/90 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-[#86868B] absolute left-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук за назвою або смаком: crafo, sweets, Харків, букети, малина, сирні, без цукру..."
                  className="w-full bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#0071E3] rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-[#86868B] hover:text-[#1D1D1F]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Purpose Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setOnlyBeanToBar(!onlyBeanToBar)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                    onlyBeanToBar
                      ? 'bg-[#0071E3] text-white font-semibold'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                  }`}
                >
                  Bean-to-Bar
                </button>
                <button
                  onClick={() => setOnlySugarFree(!onlySugarFree)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                    onlySugarFree
                      ? 'bg-[#0071E3] text-white font-semibold'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                  }`}
                >
                  🌿 Без цукру
                </button>
                <button
                  onClick={() => setAdvisorGoal(advisorGoal === 'gift-her' ? 'all' : 'gift-her')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                    advisorGoal === 'gift-her'
                      ? 'bg-[#0071E3] text-white font-semibold'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                  }`}
                >
                  💝 На подарунок
                </button>
                <button
                  onClick={() => setAdvisorGoal(advisorGoal === 'kids' ? 'all' : 'kids')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                    advisorGoal === 'kids'
                      ? 'bg-[#0071E3] text-white font-semibold'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                  }`}
                >
                  🧸 Дітям
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-[#0071E3] hover:underline"
                  >
                    Скинути все
                  </button>
                )}
              </div>
            </div>

            {/* City Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
              <span className="text-xs font-semibold text-[#86868B] shrink-0 flex items-center gap-1 mr-1">
                <MapPin className="w-3.5 h-3.5" />
                Місто:
              </span>
              {CITY_FILTERS.map((city) => {
                const active = selectedCity === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      active
                        ? 'bg-[#1D1D1F] text-white font-semibold'
                        : 'bg-[#F5F5F7] text-[#515154] hover:bg-[#E8E8ED] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {city.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 1: MATCHING UKRAINIAN CRAFT MAKERS (Clean Grid with Multi-Category Badges & Direct Links) */}
        <section id="makers-section" className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#D2D2D7] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Крок 2 • Перевірені виробники України
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-0.5">
                {selectedCategory === 'all'
                  ? `Всі крафтові виробники шоколаду (${filteredMakers.length})`
                  : `Виробники у категорії «${currentCategoryInfo.shortTitle}» (${filteredMakers.length})`}
                {selectedCity !== 'all' ? ` — ${selectedCity}` : ''}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGroupBySegment(!groupBySegment)}
                className="text-xs font-medium bg-white border border-[#D2D2D7] hover:border-[#1D1D1F] px-3.5 py-2 rounded-full transition flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>{groupBySegment ? 'Показати єдиним списком' : 'Згрупувати за 4 типами виробництв'}</span>
              </button>
            </div>
          </div>

          {filteredMakers.length === 0 ? (
            <div className="bg-white border border-[#D2D2D7] rounded-3xl p-8 text-center space-y-3">
              <p className="text-base font-semibold text-[#1D1D1F]">
                За обраними фільтрами майстерень не знайдено
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-[#0071E3] text-white text-xs font-semibold px-4 py-2.5 rounded-full"
              >
                Показати всі {MAKERS.length} виробників України
              </button>
            </div>
          ) : groupBySegment ? (
            <div className="space-y-8">
              {SEGMENT_GROUPS.map((group) => {
                const segMakers = filteredMakers.filter((m) => m.segment === group.id);
                if (segMakers.length === 0) return null;
                return (
                  <div key={group.id} className="space-y-3">
                    <div className="bg-white border border-[#D2D2D7]/80 rounded-2xl px-5 py-3.5">
                      <h3 className="font-bold text-base text-[#1D1D1F]">
                        {group.title} ({segMakers.length})
                      </h3>
                      <p className="text-xs text-[#515154] mt-0.5">{group.subtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {segMakers.map((maker) => renderMakerCard(maker))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMakers.map((maker) => renderMakerCard(maker))}
            </div>
          )}
        </section>

        {/* SECTION 2: PRODUCT CATALOG & PRICE PER 100G COMPARISON */}
        <section id="products-section" className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D2D2D7] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Крок 3 • Порівняння виробів та ціни за 100 грамів
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-0.5">
                Популярні шоколадні вироби ({filteredProducts.length})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedMakerId}
                onChange={(e) => setSelectedMakerId(e.target.value)}
                className="bg-white border border-[#D2D2D7] rounded-full px-3.5 py-2 text-xs font-medium text-[#1D1D1F]"
              >
                <option value="all">Всі виробники</option>
                {MAKERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.city})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border border-[#D2D2D7] rounded-full px-3.5 py-2 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
              >
                <option value="popular">Сортування: За популярністю</option>
                <option value="price100_asc">Найвигідніша ціна за 100 г</option>
                <option value="price_asc">Від дешевших за упаковку</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#D2D2D7] rounded-3xl p-8 text-center space-y-3">
              <p className="text-sm text-[#515154]">
                У цій комбінації фільтрів показані картки виробників вище — перейдіть на їхній сайт або скиньте фільтр.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-[#1D1D1F] text-white text-xs font-semibold px-4 py-2 rounded-full"
              >
                Показати всі товари
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const pricePer100 = getPricePer100g(product.priceUah, product.weightGrams);
                const isExpanded = expandedProductIds.includes(product.id);
                const isCompared = compareIds.includes(product.id);
                const maker = MAKERS.find((m) => m.id === product.makerId);

                return (
                  <article
                    key={product.id}
                    className="bg-white border border-[#D2D2D7]/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-[#F5F5F7] overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/95 backdrop-blur-md text-[#1D1D1F] text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                            {product.subType}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Склад {product.cleanLabelScore}/100</span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#515154]">
                          <button
                            onClick={() => maker && setActiveMakerModal(maker)}
                            className="font-semibold text-[#0071E3] hover:underline text-left"
                          >
                            {product.makerName} ({product.makerCity})
                          </button>
                          <span className="flex items-center gap-1 font-medium text-[#1D1D1F] shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {product.rating}
                          </span>
                        </div>

                        <h3 className="font-bold text-base sm:text-lg text-[#1D1D1F] leading-snug">
                          {product.title}
                        </h3>

                        <div className="pt-1 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-bold text-[#1D1D1F]">
                              {product.priceUah} грн
                            </span>
                            <span className="text-xs text-[#86868B] ml-1.5">
                              / {product.weightGrams} г
                            </span>
                          </div>
                          <div className="bg-[#F5F5F7] px-3 py-1 rounded-full text-xs font-semibold text-[#0071E3]">
                            {pricePer100} грн за 100 г
                          </div>
                        </div>

                        <div className="pt-1">
                          <button
                            onClick={() => toggleProductExpand(product.id)}
                            className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
                          >
                            <span>
                              {isExpanded ? 'Сховати склад і смак' : 'Розгорнути склад та опис'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-[#E8E8ED] space-y-2.5 text-xs text-[#515154]">
                              <p className="text-[#1D1D1F] leading-relaxed">{product.expertVerdict}</p>
                              <div className="bg-[#F5F5F7] rounded-2xl p-3 space-y-1 text-[#1D1D1F]">
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

                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#F5F5F7] flex items-center gap-2">
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

                      {maker ? (
                        <a
                          href={maker.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold py-2.5 px-4 rounded-full text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <span>Купити на сайті</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          onClick={() => maker && setActiveMakerModal(maker)}
                          className="flex-1 bg-[#0071E3] text-white font-semibold py-2.5 px-4 rounded-full text-xs"
                        >
                          Контакти
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: COLLAPSIBLE SUMMARY PRICE TABLE */}
        <section className="bg-white border border-[#D2D2D7]/80 rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => setIsTableOpen(!isTableOpen)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-[#F5F5F7]/50 transition"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Аналітична таблиця цін за 100 г
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] mt-0.5">
                Порівняльна таблиця всіх виробів за ціною 100 г та чистотою складу
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0071E3] shrink-0">
              <span>{isTableOpen ? 'Згорнути' : 'Розгорнути таблицю'}</span>
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
                    <th className="py-3 px-3 font-semibold">Склад</th>
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

        {/* SECTION 4: COLLAPSIBLE FAQ */}
        <section className="bg-white border border-[#D2D2D7]/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
            Часті запитання покупців
          </h2>
          <div className="divide-y divide-[#E8E8ED]">
            {[
              {
                q: 'Як швидко знайти виробника шоколадних плиток, цукерок або букетів у моєму місті?',
                a: 'Натисніть на потрібну категорію зверху (наприклад, «Плитки шоколаду» або «Шоколадні квіти і букети»), а потім оберіть своє місто (Харків, Київ, Львів, Луцьк, Дніпро, Одеса тощо). На кожній картці виробника вказано прямий телефон, адресу та кнопку переходу на офіційний сайт.',
              },
              {
                q: 'Чому один виробник відображається одразу в декількох категоріях?',
                a: 'Багато українських крафтових майстерень (наприклад, crafo.com.ua чи sweets.net.ua у Харкові, Spell або CandyBuffet у Києві, Choconel у Луцьку) одночасно виготовляють і авторські шоколадні плитки, і корпусні цукерки, і шоколадні квіти. Ми позначаємо всі категорії виробника прямо на його картці.',
              },
              {
                q: 'Чим крафтовий шоколад Bean-to-Bar відрізняється від звичайного магазинного?',
                a: 'Крафтовий шоколад Bean-to-Bar («від какао-боба до плитки») готується з ароматичних фермерських какао-бобів Fino de Aroma та Criollo у кам’яних меланжерах без додавання пальмової олії, замінників какао-масла та штучних ароматизаторів.',
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
            <strong className="text-[#1D1D1F]">ChocoRadar.ua</strong> — Каталог усіх крафтових виробників шоколадних виробів України ({MAKERS.length} майстерень)
          </div>
          <div className="flex gap-5">
            <button onClick={() => setIsAddMakerModalOpen(true)} className="hover:text-[#1D1D1F]">
              + Додати виробника безкоштовно
            </button>
            <button onClick={() => setIsTenderModalOpen(true)} className="hover:text-[#1D1D1F]">
              Замовити підбір
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
                Перевірені контакти виробника:
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
              {activeMakerModal.address && (
                <div>
                  <strong>Адреса:</strong> {activeMakerModal.address}
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
                <span>Перейти на офіційний сайт</span>
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
                  placeholder="Що шукаєте? (букет, цукерки, плитки, подарунок)"
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
                <div className="font-bold text-[#1D1D1F]">Дякуємо! Майстерню додано на модерацію.</div>
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
