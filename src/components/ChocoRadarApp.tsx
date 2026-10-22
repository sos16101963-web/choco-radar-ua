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
  ShieldCheck,
  Filter,
  Sparkles,
  Crown,
  Gift,
  Building2,
} from 'lucide-react';

interface ChocoRadarAppProps {
  initialCategory?: CategorySlug;
}

const CATEGORY_SHORT_LABELS: Record<Exclude<CategorySlug, 'all'>, { label: string; emoji: string }> = {
  'plytky-shokoladu': { label: 'Плитки шоколаду', emoji: '🍫' },
  'korpusni-ta-rozmalovani-tsukerky': { label: 'Цукерки ручної роботи', emoji: '🍬' },
  'shokoladni-kvity-ta-bukety': { label: 'Шоколадні квіти і букети', emoji: '🌹' },
  'malyna-ta-polunytsia-v-shokoladi': { label: 'Малина та полуниця в шоколаді', emoji: '🍓' },
  'horikhy-ta-sukhofrukty-v-shokoladi': { label: 'Горіхи та сухофрукти', emoji: '🌰' },
  'bez-tsukru-ta-vegan': { label: 'Без цукру / Дітям / Vegan', emoji: '🌿' },
  'kraftovyi-zefir-ta-bukety': { label: 'Зефір та зефірні букети', emoji: '🌸' },
  'avtorski-torty-ta-deserty': { label: 'Авторські торти і десерти', emoji: '🎂' },
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
  { id: 'Захід та Центри', label: 'Черкаси / Закарпаття / Кропивницький' },
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
    title: '3. Healthy / Vegan / Raw солодощі (Без білого цукру, для дітей)',
    subtitle:
      'Шоколад, пастила та цукерки на керобі, кокосовому нектарі, меду або еритритолі — без білого цукру, лактози та глютену.',
  },
  {
    id: 'flowers-berries-nuts',
    title: '4. Шоколадні квіти, ягоди та горіхи в шоколаді',
    subtitle:
      'Букети з бельгійського шоколаду, свіжа й сублімована полуниця та малина в шоколаді, чорнослив і горіхове драже.',
  },
  {
    id: 'craft-zefir-pastila',
    title: '5. Крафтовий зефір ручної роботи, зефірні букети та пастила',
    subtitle:
      'Натуральний зефір на агар-агарі з живого ягідного пюре, зефірна флористика (букети з зефірних півоній і троянд) та пастила без цукру.',
  },
  {
    id: 'custom-cakes-pastry',
    title: '6. Авторські торти на замовлення, бенто-торти та кондитерські ательє',
    subtitle:
      'Святкові, весільні, дитячі та корпоративні торти, мусові десерти в шоколадному велюрі, бенто-торти та французькі макарони.',
  },
];

// Live Buyer Requests ("Тендерна біржа замовлень" — головний магніт для виробників)
const LIVE_BUYER_REQUESTS = [
  {
    id: 'req-1',
    city: 'Київ / Доставка НП',
    categoryLabel: '🍫 Корпоративні шоколадні та зефірні бокси',
    budget: '42 000 грн (60 наборів)',
    timeAgo: '18 хв тому',
    status: 'Активний тендер (3 пропозиції)',
  },
  {
    id: 'req-2',
    city: 'Харків',
    categoryLabel: '🎂 Авторський торт + букет шоколадних квітів на ювілей',
    budget: '3 800 грн',
    timeAgo: '45 хв тому',
    status: 'Чекає пропозицій майстерень',
  },
  {
    id: 'req-3',
    city: 'Львів / Вся Україна',
    categoryLabel: '🌸 Зефірні букети та цукерки ручної роботи (до свята)',
    budget: '14 500 грн (15 букетів)',
    timeAgo: '1 год тому',
    status: 'Активний тендер (4 пропозиції)',
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

  // Progressive Disclosure (Expandable Drawers — closed by default so page is ultra-clean)
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [expandedMakerIds, setExpandedMakerIds] = useState<string[]>([]);
  const [groupBySegment, setGroupBySegment] = useState<boolean>(false);
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
  const [isB2BOpen, setIsB2BOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Comparison & Modals
  const [compareIds, setCompareIds] = useState<string[]>(['p-1', 'p-2', 'p-17']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [activeMakerModal, setActiveMakerModal] = useState<CraftMaker | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isAddMakerModalOpen, setIsAddMakerModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string>('Безкоштовний старт');
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

  // Filtered Makers
  const filteredMakers = useMemo(() => {
    return MAKERS.filter((m) => {
      if (selectedCategory !== 'all' && !m.categories.includes(selectedCategory)) return false;
      if (
        selectedCity !== 'all' &&
        m.regionCity !== selectedCity &&
        !m.city.toLowerCase().includes(selectedCity.toLowerCase())
      ) {
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

  // Helper to render a single Warm Cocoa-Cream Maker Card
  const renderMakerCard = (maker: CraftMaker) => {
    const isExpanded = expandedMakerIds.includes(maker.id);
    const cleanDomain = maker.websiteUrl
      .replace('https://www.', '')
      .replace('https://', '')
      .replace(/\/$/, '');

    return (
      <div
        key={maker.id}
        className="bg-white border border-[#E6DCD2] rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#B86B35]/60 transition"
      >
        <div className="space-y-3">
          {/* Top Row: Name, Verified Icon, City & Rating */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#2C1810] leading-snug flex items-center gap-1.5">
                <span>{maker.name}</span>
                {maker.isVerified && (
                  <span title="Перевірений український виробник">
                    <CheckCircle2 className="w-4 h-4 text-[#B86B35] shrink-0" />
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#6E5648] flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#B86B35] shrink-0" />
                <span>{maker.city}</span>
              </p>
            </div>
            <div className="bg-[#FAF6F0] border border-[#E6DCD2] px-2.5 py-1 rounded-full text-xs font-semibold text-[#2C1810] flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{maker.rating}</span>
            </div>
          </div>

          {/* What they produce: Clean Multi-Category Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {maker.categories.map((catSlug) => {
              const info = CATEGORY_SHORT_LABELS[catSlug];
              if (!info) return null;
              const isSelectedCat = selectedCategory === catSlug;
              return (
                <button
                  key={catSlug}
                  onClick={() => setSelectedCategory(catSlug)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition flex items-center gap-1 ${
                    isSelectedCat
                      ? 'bg-[#B86B35] text-white font-semibold shadow-sm'
                      : 'bg-[#FAF6F0] text-[#3A2318] border border-[#E6DCD2]/80 hover:bg-[#F3ECE3]'
                  }`}
                >
                  <span>{info.emoji}</span>
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1-Sentence Specialty */}
          <p className="text-xs sm:text-sm text-[#5C4438] leading-relaxed">
            {maker.specialty}
          </p>

          {/* Direct Contact Summary Always Visible */}
          <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#2C1810]">
            {maker.phone && (
              <span className="flex items-center gap-1.5 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#B86B35] shrink-0" />
                <span>{maker.phone.split(',')[0]}</span>
              </span>
            )}
          </div>

          {/* Expandable Full Details (Progressive Disclosure) */}
          {isExpanded && (
            <div className="pt-3 mt-2 border-t border-[#EFE6DD] space-y-2.5 text-xs text-[#5C4438]">
              <p className="text-[#2C1810] leading-relaxed">{maker.description}</p>
              <div className="bg-[#FAF6F0] border border-[#E6DCD2] rounded-2xl p-3.5 space-y-1.5 text-[#2C1810]">
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
                  <strong>Сировина / Основа:</strong> {maker.cacaoOrigin.join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 mt-4 border-t border-[#F3ECE3] flex items-center justify-between gap-2">
          <button
            onClick={() => toggleMakerExpand(maker.id)}
            className="text-xs font-semibold text-[#B86B35] hover:underline flex items-center gap-1"
          >
            <span>{isExpanded ? 'Згорнути опис' : 'Адреса та опис'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <a
            href={maker.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#3A2318] hover:bg-[#B86B35] text-white text-xs font-semibold px-4 py-2 rounded-full transition flex items-center gap-1.5 shadow-sm"
          >
            <span>{cleanDomain.length > 22 ? 'Перейти на сайт' : cleanDomain}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2C1810]">
      {/* Warm Chocolate-Cream Frosted Glass Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FAF6F0]/90 border-b border-[#E6DCD2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#3A2318] text-[#FAF6F0] flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              CR
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-[#2C1810]">
                ChocoRadar <span className="text-[#8C705F] font-normal">Україна</span>
              </div>
              <div className="text-[11px] text-[#6E5648] hidden sm:block">
                Шоколад • Цукерки • Букети • Зефір • Авторські торти ({MAKERS.length} майстерень)
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-[#5C4438]">
            <a href="#step-1-choose" className="hover:text-[#B86B35] transition">
              1. Категорії
            </a>
            <a href="#makers-section" className="hover:text-[#B86B35] transition">
              2. Виробники ({filteredMakers.length})
            </a>
            <a href="#products-section" className="hover:text-[#B86B35] transition">
              3. Порівняти ціни ({filteredProducts.length})
            </a>
            <a href="#b2b-partner-section" className="text-[#B86B35] hover:underline flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>Виробникам (PRO)</span>
            </a>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="hover:text-[#B86B35] transition flex items-center gap-1"
            >
              <span>Порівняння</span>
              <span className="bg-[#EFE6DD] text-[#2C1810] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {compareIds.length}
              </span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedPlanForModal('Безкоштовний або PRO');
                setIsAddMakerModalOpen(true);
              }}
              className="text-xs font-semibold text-[#2C1810] bg-[#EFE6DD] hover:bg-[#E6DCD2] px-3.5 py-2 rounded-full transition"
            >
              + Додати майстерню
            </button>
            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="text-xs font-semibold text-white bg-[#B86B35] hover:bg-[#9E5827] px-4 py-2 rounded-full transition shadow-sm"
            >
              Замовити торт / подарунок
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
        {/* STEP 1: WARM APPLE-STYLE VISUAL PRODUCT CATEGORY SELECTOR (9 Cards including Zefir & Cakes) */}
        <section id="step-1-choose" className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#F3ECE3] border border-[#E6DCD2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#6E5648]">
              <span>Всеукраїнський навігатор крафтового шоколаду, зефіру та авторських тортів • {MAKERS.length} перевірених майстерень</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1810] leading-[1.12]">
              {currentCategoryInfo.seoH1}
            </h1>
            <p className="text-sm sm:text-base text-[#5C4438] max-w-2xl mx-auto">
              Крок 1: Оберіть категорію солодощів — система миттєво покаже всіх реальних виробників України з телефонами та порівняє ціни.
            </p>
          </div>

          {/* Visual Category Grid (9 Categories: All + 6 Chocolate + Zefir + Cakes) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
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
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                    active
                      ? 'bg-[#3A2318] text-[#FAF6F0] border-[#3A2318] shadow-md'
                      : 'bg-white text-[#2C1810] border-[#E6DCD2] hover:border-[#B86B35] hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-[#FAF6F0] text-[#6E5648]'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <div className="font-semibold text-xs leading-tight">
                    {cat.shortTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* STEP 2: CITY + SEARCH + QUICK FILTERS IN ONE WARM BAR */}
          <div className="bg-white border border-[#E6DCD2] rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-[#8C705F] absolute left-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук: crafo, sweets, зефірний букет, торт на замовлення, Харків, малина, без цукру..."
                  className="w-full bg-[#FAF6F0] border border-[#E6DCD2] focus:bg-white focus:border-[#B86B35] rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#2C1810] placeholder:text-[#8C705F] focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-[#8C705F] hover:text-[#2C1810]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Purpose Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setOnlyBeanToBar(!onlyBeanToBar)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    onlyBeanToBar
                      ? 'bg-[#B86B35] text-white'
                      : 'bg-[#FAF6F0] text-[#2C1810] border border-[#E6DCD2] hover:bg-[#F3ECE3]'
                  }`}
                >
                  Bean-to-Bar
                </button>
                <button
                  onClick={() => setOnlySugarFree(!onlySugarFree)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    onlySugarFree
                      ? 'bg-[#B86B35] text-white'
                      : 'bg-[#FAF6F0] text-[#2C1810] border border-[#E6DCD2] hover:bg-[#F3ECE3]'
                  }`}
                >
                  🌿 Без цукру
                </button>
                <button
                  onClick={() => setAdvisorGoal(advisorGoal === 'gift-her' ? 'all' : 'gift-her')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    advisorGoal === 'gift-her'
                      ? 'bg-[#B86B35] text-white'
                      : 'bg-[#FAF6F0] text-[#2C1810] border border-[#E6DCD2] hover:bg-[#F3ECE3]'
                  }`}
                >
                  💝 На подарунок
                </button>
                <button
                  onClick={() => setAdvisorGoal(advisorGoal === 'kids' ? 'all' : 'kids')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    advisorGoal === 'kids'
                      ? 'bg-[#B86B35] text-white'
                      : 'bg-[#FAF6F0] text-[#2C1810] border border-[#E6DCD2] hover:bg-[#F3ECE3]'
                  }`}
                >
                  🧸 Дітям
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-[#B86B35] hover:underline"
                  >
                    Скинути все
                  </button>
                )}
              </div>
            </div>

            {/* City Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
              <span className="text-xs font-bold text-[#8C705F] shrink-0 flex items-center gap-1 mr-1">
                <MapPin className="w-3.5 h-3.5 text-[#B86B35]" />
                Місто:
              </span>
              {CITY_FILTERS.map((city) => {
                const active = selectedCity === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      active
                        ? 'bg-[#3A2318] text-white shadow-sm'
                        : 'bg-[#FAF6F0] text-[#5C4438] border border-[#E6DCD2]/70 hover:bg-[#F3ECE3] hover:text-[#2C1810]'
                    }`}
                  >
                    {city.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 1: MATCHING UKRAINIAN CRAFT MAKERS */}
        <section id="makers-section" className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E6DCD2] pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B86B35]">
                Крок 2 • Перевірені виробники України (Шоколад • Зефір • Торти)
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C1810] mt-0.5">
                {selectedCategory === 'all'
                  ? `Всі крафтові виробники та кондитерські (${filteredMakers.length})`
                  : `Виробники у категорії «${currentCategoryInfo.shortTitle}» (${filteredMakers.length})`}
                {selectedCity !== 'all' ? ` — ${selectedCity}` : ''}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGroupBySegment(!groupBySegment)}
                className="text-xs font-semibold bg-white border border-[#E6DCD2] hover:border-[#3A2318] px-3.5 py-2 rounded-full transition flex items-center gap-1.5 text-[#2C1810]"
              >
                <Filter className="w-3.5 h-3.5 text-[#B86B35]" />
                <span>{groupBySegment ? 'Показати єдиним списком' : 'Згрупувати за 6 напрямками'}</span>
              </button>
            </div>
          </div>

          {filteredMakers.length === 0 ? (
            <div className="bg-white border border-[#E6DCD2] rounded-3xl p-8 text-center space-y-3">
              <p className="text-base font-bold text-[#2C1810]">
                За обраними фільтрами майстерень не знайдено
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-[#B86B35] text-white text-xs font-semibold px-4 py-2.5 rounded-full"
              >
                Показати всі {MAKERS.length} майстерень України
              </button>
            </div>
          ) : groupBySegment ? (
            <div className="space-y-8">
              {SEGMENT_GROUPS.map((group) => {
                const segMakers = filteredMakers.filter((m) => m.segment === group.id);
                if (segMakers.length === 0) return null;
                return (
                  <div key={group.id} className="space-y-3">
                    <div className="bg-white border border-[#E6DCD2] rounded-2xl px-5 py-3.5">
                      <h3 className="font-bold text-base text-[#2C1810]">
                        {group.title} ({segMakers.length})
                      </h3>
                      <p className="text-xs text-[#6E5648] mt-0.5">{group.subtitle}</p>
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
        <section id="products-section" className="space-y-5 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DCD2] pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B86B35]">
                Крок 3 • Порівняння виробів та ціни за 100 грамів
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C1810] mt-0.5">
                Популярні вироби для порівняння ({filteredProducts.length})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedMakerId}
                onChange={(e) => setSelectedMakerId(e.target.value)}
                className="bg-white border border-[#E6DCD2] rounded-full px-3.5 py-2 text-xs font-semibold text-[#2C1810]"
              >
                <option value="all">Всі виробники ({MAKERS.length})</option>
                {MAKERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.city})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border border-[#E6DCD2] rounded-full px-3.5 py-2 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#B86B35]"
              >
                <option value="popular">Сортування: За популярністю</option>
                <option value="price100_asc">Найвигідніша ціна за 100 г</option>
                <option value="price_asc">Від дешевших за упаковку</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E6DCD2] rounded-3xl p-8 text-center space-y-3">
              <p className="text-sm text-[#5C4438]">
                У цій комбінації фільтрів показані картки виробників вище — перейдіть на їхній сайт або скиньте фільтр.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-[#3A2318] text-white text-xs font-semibold px-4 py-2 rounded-full"
              >
                Показати всі вироби
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
                    className="bg-white border border-[#E6DCD2] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-[#F3ECE3] overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#FAF6F0]/95 backdrop-blur-md text-[#2C1810] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm border border-[#E6DCD2]">
                            {product.subType}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-[#FAF6F0]/95 backdrop-blur-md text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-[#E6DCD2]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Склад {product.cleanLabelScore}/100</span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#6E5648]">
                          <button
                            onClick={() => maker && setActiveMakerModal(maker)}
                            className="font-bold text-[#B86B35] hover:underline text-left"
                          >
                            {product.makerName} ({product.makerCity})
                          </button>
                          <span className="flex items-center gap-1 font-bold text-[#2C1810] shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {product.rating}
                          </span>
                        </div>

                        <h3 className="font-bold text-base sm:text-lg text-[#2C1810] leading-snug">
                          {product.title}
                        </h3>

                        <div className="pt-1 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-bold text-[#2C1810]">
                              {product.priceUah} грн
                            </span>
                            <span className="text-xs text-[#8C705F] ml-1.5">
                              / {product.weightGrams} г
                            </span>
                          </div>
                          <div className="bg-[#FAF6F0] border border-[#E6DCD2] px-3 py-1 rounded-full text-xs font-bold text-[#B86B35]">
                            {pricePer100} грн за 100 г
                          </div>
                        </div>

                        <div className="pt-1">
                          <button
                            onClick={() => toggleProductExpand(product.id)}
                            className="text-xs font-semibold text-[#B86B35] hover:underline flex items-center gap-1"
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
                            <div className="mt-3 pt-3 border-t border-[#EFE6DD] space-y-2.5 text-xs text-[#5C4438]">
                              <p className="text-[#2C1810] leading-relaxed">{product.expertVerdict}</p>
                              <div className="bg-[#FAF6F0] border border-[#E6DCD2] rounded-2xl p-3 space-y-1 text-[#2C1810]">
                                <div>
                                  <strong>Основа / Сировина:</strong>{' '}
                                  {product.cacaoPercent > 0
                                    ? `${product.cacaoPercent}% (${product.cacaoType})`
                                    : product.cacaoType}
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

                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#F3ECE3] flex items-center gap-2">
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className={`px-3.5 py-2.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                          isCompared
                            ? 'bg-[#3A2318] text-white border-[#3A2318]'
                            : 'bg-[#FAF6F0] text-[#2C1810] border-[#E6DCD2] hover:bg-[#F3ECE3]'
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
                          className="flex-1 bg-[#B86B35] hover:bg-[#9E5827] text-white font-semibold py-2.5 px-4 rounded-full text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <span>Купити на сайті</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          onClick={() => maker && setActiveMakerModal(maker)}
                          className="flex-1 bg-[#B86B35] text-white font-semibold py-2.5 px-4 rounded-full text-xs"
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

        {/* SECTION 3: LIVE BUYER TENDER BOARD & B2B MONETIZATION HUB (Why Producers Beg to Join & Pay) */}
        <section
          id="b2b-partner-section"
          className="bg-gradient-to-br from-[#3A2318] to-[#24140D] text-[#FAF6F0] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-[#B86B35]/30 border border-[#D49B6A]/40 text-[#F5D0A9] text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Біржа замовлень на торти, подарункові набори та корпоративні бокси</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Шукаєте торт на свято, зефірний букет або 100 корпоративних подарунків?
              </h2>
              <p className="text-xs sm:text-sm text-[#E6DCD2] leading-relaxed">
                Залиште 1 заявку за 30 секунд — перевірені шоколатьє, зефірні майстри та кондитерські вашого міста самі надішлють вам варіанти з цінами та фото у Telegram або Viber.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => setIsTenderModalOpen(true)}
                className="bg-[#B86B35] hover:bg-[#C97B42] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition shadow-md flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Розмістити замовлення (Безкоштовно)</span>
              </button>
              <button
                onClick={() => setIsB2BOpen(!isB2BOpen)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-full transition flex items-center gap-1.5"
              >
                <Crown className="w-4 h-4 text-[#F5D0A9]" />
                <span>{isB2BOpen ? 'Сховати тарифи для виробників' : 'Для виробників: Як отримувати клієнтів'}</span>
                {isB2BOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Live Orders Ticker (Creates FOMO for makers visiting the site) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {LIVE_BUYER_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="bg-white/10 border border-white/15 rounded-2xl p-4 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between text-[11px] text-[#F5D0A9]">
                  <span className="font-semibold">{req.city}</span>
                  <span>{req.timeAgo}</span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-white leading-snug">
                  {req.categoryLabel}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                  <span className="font-bold text-[#F5D0A9]">Бюджет: {req.budget}</span>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('PRO Виробник (Доступ до замовлень)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="text-[11px] underline text-white hover:text-[#F5D0A9]"
                  >
                    Взяти замовлення →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Collapsible B2B Tariffs Drawer for Makers */}
          {isB2BOpen && (
            <div className="pt-4 border-t border-white/15 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#F5D0A9]" />
                  <span>Умови підключення для виробників шоколаду, зефіру та кондитерських</span>
                </h3>
                <span className="text-xs text-[#E6DCD2]">
                  Обирайте тариф та отримуйте прямі роздрібні й корпоративні замовлення
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6DCD2]">
                      Базовий профіль
                    </span>
                    <div className="text-xl font-bold text-white">0 грн / міс</div>
                    <ul className="text-xs text-[#E6DCD2] space-y-1.5 pt-2">
                      <li>• Картка компанії у загальному списку</li>
                      <li>• Посилання на сайт та телефон</li>
                      <li>• Присутність у фільтрі за містом</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('Базовий (Безкоштовно)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-full transition"
                  >
                    Додати безкоштовно
                  </button>
                </div>

                <div className="bg-[#B86B35]/25 border-2 border-[#F5D0A9] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5D0A9]">
                        PRO Майстерня • Хіт
                      </span>
                      <span className="bg-[#F5D0A9] text-[#2C1810] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Окупається з 1 замовлення
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white">990 грн / міс</div>
                    <ul className="text-xs text-white space-y-1.5 pt-2">
                      <li>• <strong>Закріплення у ТОП-3</strong> вашого міста та категорії</li>
                      <li>• <strong>Миттєві контакти замовників</strong> із біржі тортів і подарунків у Telegram</li>
                      <li>• Розміщення до 10 товарів у порівнянні цін</li>
                      <li>• Значок «Перевірений виробник Clean Label»</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('PRO Майстерня (990 грн/міс)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-[#F5D0A9] hover:bg-white text-[#2C1810] text-xs font-bold py-2.5 rounded-full transition"
                  >
                    Підключити PRO-статус
                  </button>
                </div>

                <div className="bg-white/5 border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5D0A9]">
                      B2B Корпоративний Партнер
                    </span>
                    <div className="text-xl font-bold text-white">2 490 грн / міс</div>
                    <ul className="text-xs text-[#E6DCD2] space-y-1.5 pt-2">
                      <li>• Пріоритетний доступ до корпоративних тендерів (від 20 до 500 боксів)</li>
                      <li>• Спецрозміщення перед святами (Миколая, Новий рік, 14 лютого, 8 березня)</li>
                      <li>• Персональний менеджер замовлень</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('B2B Корпоративний (2490 грн/міс)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-full transition"
                  >
                    Стати B2B-партнером
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4: COLLAPSIBLE SUMMARY PRICE TABLE */}
        <section className="bg-white border border-[#E6DCD2] rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => setIsTableOpen(!isTableOpen)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-[#FAF6F0] transition"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B86B35]">
                Аналітична таблиця цін за 100 г
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-[#2C1810] mt-0.5">
                Порівняльна таблиця всіх виробів (Шоколад • Зефір • Авторські торти)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#B86B35] shrink-0">
              <span>{isTableOpen ? 'Згорнути' : 'Розгорнути таблицю'}</span>
              {isTableOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isTableOpen && (
            <div className="px-6 pb-6 border-t border-[#EFE6DD] overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm mt-4">
                <thead>
                  <tr className="border-b border-[#E6DCD2] text-[#8C705F]">
                    <th className="py-3 px-3 font-semibold">Виріб та виробник</th>
                    <th className="py-3 px-3 font-semibold">Підсолоджувач</th>
                    <th className="py-3 px-3 font-semibold">Ціна упаковки</th>
                    <th className="py-3 px-3 font-semibold text-[#B86B35]">Ціна за 100 г</th>
                    <th className="py-3 px-3 font-semibold">Склад</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE6DD]">
                  {PRODUCTS.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF6F0]">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#2C1810]">{item.title}</div>
                        <div className="text-xs text-[#8C705F]">
                          {item.makerName} ({item.makerCity})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#5C4438]">{item.sweetener}</td>
                      <td className="py-3 px-3 text-[#2C1810]">
                        {item.priceUah} грн / {item.weightGrams} г
                      </td>
                      <td className="py-3 px-3 font-bold text-[#B86B35]">
                        {getPricePer100g(item.priceUah, item.weightGrams)} грн
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-800">
                        {item.cleanLabelScore}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECTION 5: COLLAPSIBLE FAQ */}
        <section className="bg-white border border-[#E6DCD2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C1810]">
            Часті запитання покупців та виробників
          </h2>
          <div className="divide-y divide-[#EFE6DD]">
            {[
              {
                q: 'Як швидко знайти виробника шоколадних плиток, зефірного букета або авторського торта у моєму місті?',
                a: 'Натисніть на потрібну категорію зверху (наприклад, «Шоколадні квіти і букети», «Зефір та зефірні букети» або «Авторські торти і десерти»), а потім оберіть своє місто (Харків, Київ, Львів, Дніпро, Одеса тощо). На кожній картці вказано прямий телефон, адресу та кнопку переходу на сайт.',
              },
              {
                q: 'Як працює безкоштовний тендер на замовлення торта чи корпоративних подарунків?',
                a: 'Натисніть кнопку «Замовити торт / подарунок», вкажіть ваше місто, бажану дату та бюджет. Перевірені кондитерські та шоколадні майстерні самі надішлють вам свої варіанти у Telegram або Viber без посередників.',
              },
              {
                q: 'Як виробнику шоколаду, зефіру або кондитерській потрапити в ТОП своєї категорії?',
                a: 'Натисніть «+ Додати майстерню» у верхньому меню або відкрийте розділ «Для виробників (PRO)» — ви можете додати майстерню безкоштовно або підключити тариф PRO для закріплення у ТОП-3 вашого міста та отримання прямих заявок клієнтів.',
              },
            ].map((faq, index) => {
              const open = openFaqIndex === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setOpenFaqIndex(open ? null : index)}
                    className="w-full flex items-center justify-between text-left font-semibold text-sm sm:text-base text-[#2C1810] hover:text-[#B86B35] transition"
                  >
                    <span>{faq.q}</span>
                    {open ? (
                      <ChevronUp className="w-4 h-4 text-[#8C705F] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8C705F] shrink-0" />
                    )}
                  </button>
                  {open && (
                    <p className="mt-2 text-xs sm:text-sm text-[#5C4438] leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Warm Footer */}
      <footer className="bg-white border-t border-[#E6DCD2] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E5648]">
          <div>
            <strong className="text-[#2C1810]">ChocoRadar.ua</strong> — Всеукраїнська платформа виробників крафтового шоколаду, зефіру та авторських тортів ({MAKERS.length} майстерень)
          </div>
          <div className="flex gap-5 font-semibold">
            <button
              onClick={() => {
                setSelectedPlanForModal('Безкоштовний або PRO');
                setIsAddMakerModalOpen(true);
              }}
              className="hover:text-[#B86B35]"
            >
              + Додати виробника
            </button>
            <button onClick={() => setIsTenderModalOpen(true)} className="hover:text-[#B86B35]">
              Тендер на замовлення
            </button>
            <button onClick={() => setIsCompareModalOpen(true)} className="hover:text-[#B86B35]">
              Порівняння ({compareIds.length})
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Maker Verified Contacts Modal */}
      {activeMakerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border border-[#E6DCD2] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B86B35]">
                  {activeMakerModal.segmentTitle}
                </span>
                <h2 className="text-2xl font-bold text-[#2C1810] mt-0.5">{activeMakerModal.name}</h2>
                <p className="text-xs text-[#6E5648]">
                  {activeMakerModal.city} • З {activeMakerModal.foundedYear} року • Рейтинг {activeMakerModal.rating}/5
                </p>
              </div>
              <button
                onClick={() => setActiveMakerModal(null)}
                className="p-2 rounded-full bg-white text-[#6E5648] hover:text-[#2C1810]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#2C1810] leading-relaxed">{activeMakerModal.description}</p>

            <div className="bg-white border border-[#E6DCD2] rounded-2xl p-4 space-y-2 text-xs text-[#2C1810]">
              <div className="font-bold uppercase tracking-wider text-[#8C705F] text-[11px]">
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
                className="flex-1 bg-[#B86B35] hover:bg-[#9E5827] text-white font-semibold py-3 px-4 rounded-full text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border border-[#E6DCD2] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E6DCD2] pb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">
                Порівняння характеристик та ціни за 100 г
              </h2>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-full bg-white text-[#6E5648]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {comparedProducts.length === 0 ? (
              <p className="text-sm text-[#6E5648] py-8 text-center">
                Додайте вироби до порівняння кнопкою «Порівняти».
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#E6DCD2]">
                      <th className="py-3 px-3 text-[#8C705F]">Параметр</th>
                      {comparedProducts.map((p) => (
                        <th key={p.id} className="py-3 px-3">
                          <div className="font-bold text-[#2C1810]">{p.title}</div>
                          <div className="text-xs text-[#B86B35] font-semibold">{p.makerName}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DCD2]">
                    <tr>
                      <td className="py-3 px-3 text-[#6E5648]">Ціна упаковки</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold">
                          {p.priceUah} грн ({p.weightGrams} г)
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-3 font-bold text-[#B86B35]">Ціна за 100 г</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold text-[#B86B35]">
                          {getPricePer100g(p.priceUah, p.weightGrams)} грн / 100 г
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#6E5648]">Підсолоджувач</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3">
                          {p.sweetener}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#6E5648]">Основа / Какао</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3">
                          {p.cacaoPercent > 0 ? `${p.cacaoPercent}% (${p.cacaoType})` : p.cacaoType}
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

      {/* MODAL 3: Tender Request (Cake / Gift / Corporate Order) */}
      {isTenderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border border-[#E6DCD2] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B86B35]">
                  Швидкий тендер замовлень
                </span>
                <h2 className="text-xl font-bold text-[#2C1810]">Замовити торт, букет чи набір</h2>
              </div>
              <button
                onClick={() => {
                  setIsTenderModalOpen(false);
                  setTenderSubmitted(false);
                }}
                className="p-2 rounded-full bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {tenderSubmitted ? (
              <div className="bg-white border border-[#E6DCD2] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-[#2C1810]">Заявку опубліковано на біржі!</div>
                <p className="text-xs text-[#6E5648]">
                  Перевірені шоколатьє та кондитерські вашого міста надішлють вам пропозиції з фото та цінами.
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
                  placeholder="Ваше місто (наприклад: Харків, Київ, Львів)"
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810]"
                />
                <input
                  type="text"
                  required
                  placeholder="Що потрібно? (авторський торт, зефірний букет, шоколад)"
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810]"
                />
                <input
                  type="text"
                  placeholder="Орієнтовний бюджет та дата"
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810]"
                />
                <input
                  type="text"
                  required
                  placeholder="Ваш телефон або Telegram (@username)"
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#B86B35] hover:bg-[#9E5827] text-white font-bold py-3 rounded-full transition"
                >
                  Отримати пропозиції від майстерень
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: Add Maker / Connect PRO */}
      {isAddMakerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border border-[#E6DCD2] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B86B35]">
                  Тариф: {selectedPlanForModal}
                </span>
                <h2 className="text-xl font-bold text-[#2C1810]">Підключити майстерню в каталог</h2>
              </div>
              <button
                onClick={() => {
                  setIsAddMakerModalOpen(false);
                  setMakerSubmitted(false);
                }}
                className="p-2 rounded-full bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {makerSubmitted ? (
              <div className="bg-white border border-[#E6DCD2] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-[#2C1810]">Дякуємо! Заявку прийнято.</div>
                <p className="text-xs text-[#6E5648]">
                  Ми перевіримо контакти та активуємо вашу сторінку і доступ до замовлень.
                </p>
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
                  placeholder="Назва бренду та місто (напр., Шоколад / Зефір / Торти)"
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810]"
                />
                <input
                  type="text"
                  required
                  placeholder="Посилання на сайт або Instagram"
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810]"
                />
                <input
                  type="text"
                  required
                  placeholder="Контактний телефон (Telegram / Viber)"
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810]"
                />
                <select
                  value={selectedPlanForModal}
                  onChange={(e) => setSelectedPlanForModal(e.target.value)}
                  className="w-full bg-white border border-[#E6DCD2] rounded-2xl px-4 py-3 text-[#2C1810] font-semibold"
                >
                  <option value="Базовий (Безкоштовно)">Базовий профіль (0 грн)</option>
                  <option value="PRO Майстерня (990 грн/міс)">PRO Майстерня — ТОП-3 у місті + Замовлення (990 грн/міс)</option>
                  <option value="B2B Корпоративний (2490 грн/міс)">B2B Корпоративний Партнер (2490 грн/міс)</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-[#3A2318] hover:bg-[#B86B35] text-white font-bold py-3 rounded-full transition"
                >
                  Відправити заявку
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
