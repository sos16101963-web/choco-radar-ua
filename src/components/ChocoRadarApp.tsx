'use client';

import React, { useState, useMemo } from 'react';
import {
  CATEGORIES,
  MAKERS,
  PRODUCTS,
  CategorySlug,
  ChocolateProduct,
  CraftMaker,
  getPricePer100g,
} from '@/data/chocolateData';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Award,
  Flame,
  Leaf,
  CheckCircle2,
  ArrowUpRight,
  Scale,
  Snowflake,
  Gift,
  Building2,
  Star,
  MapPin,
  ChevronRight,
  Info,
  X,
  Heart,
  Zap,
  HelpCircle,
  Send,
  TrendingDown,
  Copy,
  Check,
} from 'lucide-react';

interface ChocoRadarAppProps {
  initialCategory?: CategorySlug;
}

export default function ChocoRadarApp({ initialCategory = 'all' }: ChocoRadarAppProps) {
  // Navigation & Filters State
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySugarFree, setOnlySugarFree] = useState(false);
  const [onlyVegan, setOnlyVegan] = useState(false);
  const [onlyBeanToBar, setOnlyBeanToBar] = useState(false);
  const [onlyHandPainted, setOnlyHandPainted] = useState(false);
  const [selectedMakerId, setSelectedMakerId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price100_asc' | 'clean_desc' | 'price_asc'>('popular');

  // AI Sommelier Advisor State
  const [advisorGoal, setAdvisorGoal] = useState<'all' | 'gift-her' | 'gift-boss' | 'kids' | 'gourmet-self' | 'corporate'>('all');
  const [advisorTaste, setAdvisorTaste] = useState<'all' | 'fruity' | 'nutty' | 'sweet' | 'intense'>('all');
  const [advisorMaxBudget, setAdvisorMaxBudget] = useState<number>(1000);
  const [makerSearchQuery, setMakerSearchQuery] = useState('');
  const [makerCityFilter, setMakerCityFilter] = useState<string>('all');

  // Comparison Drawer State (like Hotline/PN but for craft)
  const [compareIds, setCompareIds] = useState<string[]>(['p-1', 'p-2', 'p-3']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals State
  const [activeMakerModal, setActiveMakerModal] = useState<CraftMaker | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isAddMakerModalOpen, setIsAddMakerModalOpen] = useState(false);
  const [tenderSubmitted, setTenderSubmitted] = useState(false);
  const [makerSubmitted, setMakerSubmitted] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);

  const currentCategoryInfo = useMemo(
    () => CATEGORIES.find((c) => c.slug === selectedCategory) || CATEGORIES[0],
    [selectedCategory]
  );

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedMakerId !== 'all' && product.makerId !== selectedMakerId) return false;
      if (onlySugarFree && !product.isSugarFree) return false;
      if (onlyVegan && !product.isVegan) return false;
      if (onlyBeanToBar && !product.isBeanToBar) return false;
      if (onlyHandPainted && !product.isHandPainted) return false;
      if (product.priceUah > advisorMaxBudget) return false;

      if (advisorGoal !== 'all' && !product.bestFor.includes(advisorGoal)) return false;

      if (advisorTaste === 'fruity' && product.flavorProfile.fruityNotes < 4) return false;
      if (advisorTaste === 'nutty' && product.flavorProfile.nuttyNotes < 4) return false;
      if (advisorTaste === 'sweet' && product.flavorProfile.sweetness < 3) return false;
      if (advisorTaste === 'intense' && product.cacaoPercent < 68) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchMaker = product.makerName.toLowerCase().includes(q);
        const matchNotes = product.tastingNotes.some((n) => n.toLowerCase().includes(q));
        const matchType = product.subType.toLowerCase().includes(q);
        if (!matchTitle && !matchMaker && !matchNotes && !matchType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price100_asc') {
        return getPricePer100g(a.priceUah, a.weightGrams) - getPricePer100g(b.priceUah, b.weightGrams);
      }
      if (sortBy === 'clean_desc') {
        return b.cleanLabelScore - a.cleanLabelScore;
      }
      if (sortBy === 'price_asc') {
        return a.priceUah - b.priceUah;
      }
      return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
    });
  }, [
    selectedCategory,
    selectedMakerId,
    onlySugarFree,
    onlyVegan,
    onlyBeanToBar,
    onlyHandPainted,
    advisorMaxBudget,
    advisorGoal,
    advisorTaste,
    searchQuery,
    sortBy,
  ]);

  const comparedProducts = useMemo(
    () => PRODUCTS.filter((p) => compareIds.includes(p.id)),
    [compareIds]
  );

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setOnlySugarFree(false);
    setOnlyVegan(false);
    setOnlyBeanToBar(false);
    setOnlyHandPainted(false);
    setSelectedMakerId('all');
    setAdvisorGoal('all');
    setAdvisorTaste('all');
    setAdvisorMaxBudget(1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cacao-950 text-stone-100">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-cacao-900 via-amber-950/60 to-cacao-900 border-b border-gold-500/20 px-4 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-gold-300">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
            <span>
              <strong>Технологія 2026–2027:</strong> Розумне порівняння ціни за 100 г, аналіз чистоти складу та прямий зв’язок із крафтовими майстернями України без посередників.
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="text-amber-300 hover:text-white underline underline-offset-4 font-medium transition"
            >
              Замовити підбір / Корпоративний тендер
            </button>
            <button
              onClick={() => setIsAddMakerModalOpen(true)}
              className="bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 px-2.5 py-0.5 rounded-full text-xs font-semibold transition"
            >
              + Додати виробника безкоштовно
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-cacao-950/85 border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 flex items-center justify-center shadow-lg shadow-gold-500/20 text-cacao-950 font-black text-xl">
              CR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Choco<span className="text-gold-400">Radar</span>.ua
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest bg-stone-800 text-gold-300 px-2 py-0.5 rounded-md border border-stone-700">
                  AI Навігатор Крафту
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Незалежний гід та порівняння крафтового шоколаду України
              </p>
            </div>
          </div>

          {/* Smart Search Input */}
          <div className="flex-1 max-w-xl mx-auto w-full order-3 lg:order-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Шукати: шоколадні квіти, букети, малина в шоколаді, bean-to-bar, розписні цукерки..."
                className="w-full bg-cacao-900/90 border border-stone-700/80 focus:border-gold-400 rounded-xl pl-10 pr-9 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  aria-label="Очистити пошук"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 order-2 lg:order-3">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="relative flex items-center gap-2 bg-cacao-800 hover:bg-cacao-700 border border-stone-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition"
            >
              <Scale className="w-4 h-4 text-gold-400" />
              <span>Порівняти</span>
              {compareIds.length > 0 && (
                <span className="bg-gold-500 text-cacao-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-cacao-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-gold-500/10 transition flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4" />
              <span>Заявка всім майстрам</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar (Programmatic SEO Architecture) */}
        <div className="border-t border-stone-800/60 bg-cacao-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2 ${
                    active
                      ? 'bg-gold-500 text-cacao-950 font-bold shadow-sm'
                      : 'bg-cacao-800/70 text-stone-300 hover:bg-cacao-800 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>{cat.shortTitle}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-cacao-950/20 text-cacao-950' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {cat.slug === 'all'
                      ? PRODUCTS.length
                      : PRODUCTS.filter((p) => p.category === cat.slug).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
        {/* Hero SEO Section + Interactive AI Chocolate Advisor */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Dynamic SEO H1 & Value Proposition */}
          <div className="lg:col-span-7 bg-gradient-to-br from-cacao-900 via-cacao-900 to-cacao-800 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-300 px-3 py-1 rounded-full text-xs font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>Краще ніж прайс-агрегатори: глибока експертиза смаку та складу</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                {currentCategoryInfo.seoH1}
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {currentCategoryInfo.seoDescription}
              </p>

              {/* Expert Explanation Box (Why Google & Users love this site) */}
              <div className="bg-cacao-950/70 border border-gold-500/20 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Порада шоколадного сомельє (Як обрати найкраще):</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {currentCategoryInfo.expertGuide}
                </p>
              </div>
            </div>

            {/* Key Metrics / Trust Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-stone-800/80 relative z-10">
              <div className="bg-cacao-950/50 rounded-xl p-3 border border-stone-800/60">
                <div className="text-gold-400 font-bold text-lg sm:text-xl">Ціна / 100 г</div>
                <div className="text-xs text-stone-400">Чесне порівняння вартості чистого шоколаду</div>
              </div>
              <div className="bg-cacao-950/50 rounded-xl p-3 border border-stone-800/60">
                <div className="text-emerald-400 font-bold text-lg sm:text-xl">Clean Label</div>
                <div className="text-xs text-stone-400">Перевірка на 100% какао-масло без пальми</div>
              </div>
              <div className="bg-cacao-950/50 rounded-xl p-3 border border-stone-800/60">
                <div className="text-amber-300 font-bold text-lg sm:text-xl">0% Комісії</div>
                <div className="text-xs text-stone-400">Прямі ціни від українських майстерень</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AI Chocolate Sommelier (2026 Guided Shopping) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-amber-950/40 via-cacao-900 to-cacao-900 border border-gold-500/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base sm:text-lg text-white">
                      AI-Шоколатьє: Підбір за 10 секунд
                    </h2>
                    <p className="text-xs text-stone-400">
                      Не знаєте, що обрати? Вкажіть мету — ми відфільтруємо ідеальні позиції
                    </p>
                  </div>
                </div>
                {(advisorGoal !== 'all' || advisorTaste !== 'all' || advisorMaxBudget < 1000) && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-gold-400 hover:underline shrink-0"
                  >
                    Скинути
                  </button>
                )}
              </div>

              {/* Step 1: Goal */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  1. Кому та для чого обираємо?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Всі варіанти' },
                    { id: 'gift-her', label: '💝 На подарунок (WOW)' },
                    { id: 'gift-boss', label: '🥃 Шефу / До вина' },
                    { id: 'kids', label: '🧸 Дітям' },
                    { id: 'gourmet-self', label: '🍫 Гурману до кави' },
                    { id: 'corporate', label: '💼 Корпоративні' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAdvisorGoal(item.id as typeof advisorGoal)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition border ${
                        advisorGoal === item.id
                          ? 'bg-gold-500 text-cacao-950 border-gold-400 font-bold'
                          : 'bg-cacao-950/70 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Flavor Profile */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  2. Який смаковий профіль подобається?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'Будь-який смак' },
                    { id: 'fruity', label: '🍓 Ягідна кислинка (Малина/Фрукти)' },
                    { id: 'nutty', label: '🌰 Горіхи, Праліне та Карамель' },
                    { id: 'intense', label: '🔥 Насичений темний (68%+ какао)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAdvisorTaste(item.id as typeof advisorTaste)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition border ${
                        advisorTaste === item.id
                          ? 'bg-amber-500/20 text-gold-300 border-gold-400 font-semibold'
                          : 'bg-cacao-950/70 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Budget Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400 font-semibold uppercase tracking-wider">
                    3. Максимальний бюджет за одиницю / набір:
                  </span>
                  <span className="text-gold-400 font-bold">{advisorMaxBudget} грн</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1000}
                  step={50}
                  value={advisorMaxBudget}
                  onChange={(e) => setAdvisorMaxBudget(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>200 грн (Плитка)</span>
                  <span>500 грн (Бокс)</span>
                  <span>1000 грн (Преміум)</span>
                </div>
              </div>
            </div>

            {/* Result Counter */}
            <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between">
              <div className="text-xs text-stone-300">
                Знайдено ідеальних збігів:{' '}
                <span className="text-gold-400 font-bold text-base">{filteredProducts.length}</span>
              </div>
              <a
                href="#catalog-section"
                className="text-xs bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1"
              >
                <span>Дивитись підбірку</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Quick Faceted Filters & Sorting Bar (Like Hotline, tailored for Craft Chocolate) */}
        <section id="catalog-section" className="space-y-6">
          <div className="bg-cacao-900 border border-stone-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Dietary & Craft Checkboxes */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 mr-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-400" />
                <span>Швидкі фільтри:</span>
              </div>

              <button
                onClick={() => setOnlyBeanToBar(!onlyBeanToBar)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                  onlyBeanToBar
                    ? 'bg-amber-500/20 border-gold-400 text-gold-300'
                    : 'bg-cacao-950 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Bean-to-Bar (З какао-бобів)</span>
              </button>

              <button
                onClick={() => setOnlyHandPainted(!onlyHandPainted)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                  onlyHandPainted
                    ? 'bg-amber-500/20 border-gold-400 text-gold-300'
                    : 'bg-cacao-950 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Ручний розпис</span>
              </button>

              <button
                onClick={() => setOnlySugarFree(!onlySugarFree)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                  onlySugarFree
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-cacao-950 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Без білого цукру</span>
              </button>

              <button
                onClick={() => setOnlyVegan(!onlyVegan)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                  onlyVegan
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-cacao-950 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <span>🌱 Vegan (Без лактози)</span>
              </button>

              {/* Filter by Maker */}
              <select
                value={selectedMakerId}
                onChange={(e) => setSelectedMakerId(e.target.value)}
                aria-label="Вибір виробника"
                className="bg-cacao-950 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-gold-400"
              >
                <option value="all">Всі виробники України ({MAKERS.length})</option>
                {MAKERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-stone-400">Сортувати:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Сортування товарів"
                className="bg-cacao-950 border border-stone-700 text-gold-300 font-medium text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-gold-400"
              >
                <option value="popular">За рейтингом та відгуками</option>
                <option value="price100_asc">Найвигідніша ціна за 100 г</option>
                <option value="clean_desc">Найвищий індекс чистоти складу</option>
                <option value="price_asc">Найдешевші за упаковку</option>
              </select>
            </div>
          </div>

          {/* Product Comparison Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-cacao-900/60 border border-stone-800 rounded-3xl p-12 text-center space-y-4">
              <p className="text-lg text-stone-300 font-medium">
                За цими фільтрами не знайдено позицій.
              </p>
              <button
                onClick={resetFilters}
                className="bg-gold-500 text-cacao-950 font-bold px-5 py-2.5 rounded-xl text-sm"
              >
                Скинути всі фільтри
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const pricePer100 = getPricePer100g(product.priceUah, product.weightGrams);
                const isCompared = compareIds.includes(product.id);
                const maker = MAKERS.find((m) => m.id === product.makerId);

                return (
                  <article
                    key={product.id}
                    className="group bg-cacao-900 border border-stone-800/90 hover:border-gold-500/50 rounded-3xl overflow-hidden flex flex-col justify-between transition duration-300 shadow-lg hover:shadow-gold-500/5"
                  >
                    <div>
                      {/* Image & Top Badges */}
                      <div className="relative h-52 w-full bg-cacao-950 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={`${product.title} — ${product.makerName}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cacao-950 via-transparent to-black/40" />

                        {/* Top Left Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="bg-cacao-950/90 backdrop-blur-md border border-stone-700 text-stone-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                            {product.subType}
                          </span>
                          {product.isBeanToBar && (
                            <span className="bg-amber-500/90 text-cacao-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                              Bean-to-Bar
                            </span>
                          )}
                          {product.isSugarFree && (
                            <span className="bg-emerald-500/90 text-cacao-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                              Без цукру
                            </span>
                          )}
                        </div>

                        {/* Top Right Clean Label Score */}
                        <div
                          className="absolute top-3 right-3 bg-cacao-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1"
                          title="Індекс чистоти складу (відсутність замінників какао-масла та штучних добавок)"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Склад: {product.cleanLabelScore}/100</span>
                        </div>

                        {/* Bottom Image Overlay: Maker & Rating */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <button
                            onClick={() => maker && setActiveMakerModal(maker)}
                            className="flex items-center gap-1.5 bg-cacao-950/85 hover:bg-cacao-900 px-2.5 py-1 rounded-lg border border-stone-700/80 text-xs text-gold-300 font-medium transition"
                          >
                            <MapPin className="w-3 h-3 text-gold-400" />
                            <span>{product.makerName}</span>
                            <span className="text-stone-400">({product.makerCity})</span>
                          </button>

                          <div className="flex items-center gap-1 bg-cacao-950/85 px-2 py-1 rounded-lg text-xs font-semibold text-amber-300">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4">
                        <h3 className="font-serif font-bold text-lg text-white leading-snug group-hover:text-gold-300 transition">
                          {product.title}
                        </h3>

                        {/* Tasting Notes Pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {product.tastingNotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-cacao-800/80 text-stone-300 px-2 py-0.5 rounded-md border border-stone-800"
                            >
                              {note}
                            </span>
                          ))}
                        </div>

                        {/* Vivino-style Flavor Profile Bars */}
                        <div className="bg-cacao-950/60 border border-stone-800/80 rounded-2xl p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-stone-400">
                            <span>Профіль смаку (Сомельє):</span>
                            <span className="text-stone-300 font-medium">
                              Какао: {product.cacaoPercent}% • {product.sweetener}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <div>
                              <div className="flex justify-between text-[10px] text-stone-400 mb-1">
                                <span>Солодкість</span>
                                <span>{product.flavorProfile.sweetness}/5</span>
                              </div>
                              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full"
                                  style={{ width: `${product.flavorProfile.sweetness * 20}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-stone-400 mb-1">
                                <span>Кислинка</span>
                                <span>{product.flavorProfile.acidity}/5</span>
                              </div>
                              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-rose-400 rounded-full"
                                  style={{ width: `${product.flavorProfile.acidity * 20}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-stone-400 mb-1">
                                <span>Горіхи/Тіло</span>
                                <span>{product.flavorProfile.nuttyNotes}/5</span>
                              </div>
                              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400 rounded-full"
                                  style={{ width: `${product.flavorProfile.nuttyNotes * 20}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expert Verdict Snippet */}
                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                          <strong className="text-stone-200">Експертний висновок:</strong>{' '}
                          {product.expertVerdict}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Price Comparison & Actions */}
                    <div className="p-5 pt-3 border-t border-stone-800/80 bg-cacao-950/40 space-y-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-black text-white">
                              {product.priceUah} <span className="text-sm font-normal text-stone-400">грн</span>
                            </span>
                            <span className="text-xs text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded-md">
                              {product.weightGrams} г
                            </span>
                          </div>
                          <div className="text-xs text-gold-400 font-semibold flex items-center gap-1 mt-0.5">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>Ціна за 100 г: {pricePer100} грн</span>
                          </div>
                        </div>

                        <div className="text-right">
                          {product.thermoBoxIncluded && (
                            <div className="inline-flex items-center gap-1 text-[11px] text-sky-300 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded-md">
                              <Snowflake className="w-3 h-3" />
                              <span>Термопакування</span>
                            </div>
                          )}
                          <div className="text-[11px] text-stone-400 mt-1">
                            Пропозицій фасування: {product.offersCount}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCompare(product.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                            isCompared
                              ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                              : 'bg-cacao-900 border-stone-700 text-stone-300 hover:text-white'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{isCompared ? 'У порівнянні' : 'Порівняти'}</span>
                        </button>

                        <button
                          onClick={() => maker && setActiveMakerModal(maker)}
                          className="flex-1 bg-gold-500 hover:bg-gold-400 text-cacao-950 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <span>Купити у виробника</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Analytical Matrix Table (Google AI Overviews / SGE Magnet) */}
        <section className="bg-cacao-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-1">
                Зведена таблиця цін і характеристик (Оновлено: Жовтень 2026)
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Порівняння вартості 100 грамів та чистоти складу крафтового шоколаду
              </h2>
            </div>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="text-xs bg-cacao-800 hover:bg-cacao-700 text-gold-300 border border-gold-500/30 px-4 py-2 rounded-xl font-semibold transition"
            >
              Відкрити детальне порівняння обраних ({compareIds.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400">
                  <th className="py-3 px-3 font-semibold">Виріб та Майстерня</th>
                  <th className="py-3 px-3 font-semibold">Категорія / Тип</th>
                  <th className="py-3 px-3 font-semibold">Підсолоджувач</th>
                  <th className="py-3 px-3 font-semibold">Вага та Ціна</th>
                  <th className="py-3 px-3 font-semibold text-gold-400">Ціна за 100 г</th>
                  <th className="py-3 px-3 font-semibold">Чистота складу</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredProducts.slice(0, 8).map((item) => (
                  <tr key={item.id} className="hover:bg-cacao-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-stone-400">
                        {item.makerName} ({item.makerCity})
                      </div>
                    </td>
                    <td className="py-3 px-3 text-stone-300">{item.subType}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs ${
                          item.isSugarFree
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {item.sweetener}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-300">
                      {item.priceUah} грн / {item.weightGrams} г
                    </td>
                    <td className="py-3 px-3 font-bold text-gold-400">
                      {getPricePer100g(item.priceUah, item.weightGrams)} грн
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-bold">{item.cleanLabelScore}/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verified Ukrainian Craft Makers Directory (Full Database across Google, Instagram, TikTok, YouTube) */}
        <section id="makers-registry" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-1">
                Повний реєстр українських виробників ({MAKERS.length} майстерень з Google, Instagram, TikTok, YouTube)
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Всі крафтові виробники шоколадних виробів України
              </h2>
            </div>
            <button
              onClick={() => setIsAddMakerModalOpen(true)}
              className="bg-cacao-800 hover:bg-cacao-700 border border-gold-500/40 text-gold-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Ви виробник? Додати майстерню до каталогу</span>
            </button>
          </div>

          {/* Search & City Filter for Makers Registry */}
          <div className="bg-cacao-900 border border-stone-800 rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={makerSearchQuery}
                onChange={(e) => setMakerSearchQuery(e.target.value)}
                placeholder="Пошук майстерні за назвою, спеціалізацією, інстаграмом або містом..."
                className="w-full bg-cacao-950 border border-stone-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'Київ', 'Львів', 'Харків', 'Луцьк', 'Дніпро', 'Черкаси', 'Вінниця', 'Одеса', 'Ужгород'].map((city) => (
                <button
                  key={city}
                  onClick={() => setMakerCityFilter(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                    makerCityFilter === city
                      ? 'bg-gold-500 text-cacao-950 border-gold-400 font-bold'
                      : 'bg-cacao-950 text-stone-300 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {city === 'all' ? `Всі міста (${MAKERS.length})` : city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {MAKERS.filter((m) => {
              if (makerCityFilter !== 'all' && !m.city.toLowerCase().includes(makerCityFilter.toLowerCase())) {
                return false;
              }
              if (makerSearchQuery.trim() !== '') {
                const q = makerSearchQuery.toLowerCase();
                return (
                  m.name.toLowerCase().includes(q) ||
                  m.specialty.toLowerCase().includes(q) ||
                  m.city.toLowerCase().includes(q) ||
                  m.instagramHandle.toLowerCase().includes(q) ||
                  m.description.toLowerCase().includes(q)
                );
              }
              return true;
            }).map((maker) => (
              <div
                key={maker.id}
                className="bg-cacao-900 border border-stone-800 hover:border-gold-500/40 rounded-2xl p-5 flex flex-col justify-between transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                        <span>{maker.name}</span>
                        {maker.isVerified && (
                          <span title="Перевірений український виробник">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gold-400" />
                        <span>
                          {maker.city} • з {maker.foundedYear} р.
                        </span>
                      </p>
                    </div>
                    <div className="bg-cacao-950 px-2 py-1 rounded-lg border border-stone-800 text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{maker.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gold-300 font-medium">{maker.specialty}</p>

                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                    {maker.description}
                  </p>

                  {/* Social Channels Pills (Google / Web, Instagram, TikTok, YouTube) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    <span className="bg-pink-500/10 border border-pink-500/30 text-pink-300 px-2 py-0.5 rounded-md">
                      IG: {maker.instagramHandle}
                    </span>
                    {maker.tiktokHandle && (
                      <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-md">
                        TikTok: {maker.tiktokHandle}
                      </span>
                    )}
                    {maker.youtubeChannel && (
                      <span className="bg-red-500/10 border border-red-500/30 text-red-300 px-2 py-0.5 rounded-md">
                        YT: {maker.youtubeChannel}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {maker.badges.map((b, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-cacao-950 text-stone-300 border border-stone-800 px-2 py-0.5 rounded-md"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(maker.mainCategory);
                      setSelectedMakerId(maker.id);
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs text-stone-300 hover:text-gold-400 font-medium transition"
                  >
                    Дивитись вироби →
                  </button>
                  <button
                    onClick={() => setActiveMakerModal(maker)}
                    className="bg-cacao-800 hover:bg-gold-500 hover:text-cacao-950 text-stone-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    Профіль і контакти
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* B2B / Ego-Bait SEO Badge Generator & Platform Ecosystem (Chocolate + Home Power Stations Preview) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: SEO Ego-Bait Widget for Producers */}
          <div className="lg:col-span-7 bg-gradient-to-br from-cacao-900 to-cacao-800 border border-gold-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Для українських виробників: Програма довіри та безкоштовного трафіку</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Встановіть бейдж «Перевірений крафтяр України 2026» на свій сайт та отримуйте пріоритет у видачі
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Ми безкоштовно додаємо ваші шоколадні плитки, корпусні цукерки, горіхи та ягоди в шоколаді до всеукраїнського каталогу, перекладаємо картки під вимоги Google Schema.org та передаємо вам прямих покупців і корпоративні замовлення.
            </p>

            <div className="bg-cacao-950 border border-stone-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-amber-700 flex items-center justify-center text-cacao-950 font-black">
                  TOP
                </div>
                <div>
                  <div className="text-xs font-bold text-gold-400 uppercase">Офіційний сертифікат якості</div>
                  <div className="text-sm font-bold text-white">Рекомендовано ChocoRadar.ua • Склад 100% Какао-масло</div>
                  <div className="text-[11px] text-stone-400">Код бейджа для встановлення на сайт майстерні</div>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    '<a href="https://choco-radar-ua.vercel.app" target="_blank" rel="noopener">Перевірений крафтовий виробник шоколаду України — ChocoRadar.ua</a>'
                  );
                  setCopiedWidget(true);
                  setTimeout(() => setCopiedWidget(false), 3000);
                }}
                className="bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                {copiedWidget ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedWidget ? 'Код скопійовано!' : 'Скопіювати код бейджа'}</span>
              </button>
            </div>
          </div>

          {/* Right: Second Vertical Preview (Home Power Stations Advisor Engine) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-cacao-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 text-sky-300 px-3 py-1 rounded-full text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Наступний напрямок платформи (EnergyRadar UA)</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Архітектура розумного підбору готова до масштабування на Домашні Електростанції
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Цей самий рушій <strong className="text-white">Guided Shopping Engine</strong> дозволяє розгорнути другий незалежний проєкт для підбору зарядних станцій (EcoFlow, Bluetti, Anker), гібридних інверторів та батарей LiFePO4 з автоматичним розрахунком <strong className="text-sky-300">«Ціна за 1 кВт·год ємності»</strong> та калькулятором часу роботи квартири чи котельні.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="text-sky-400 font-bold">Приклад параметрів для модуля електростанцій:</div>
              <div className="grid grid-cols-2 gap-2 text-stone-300">
                <div>• Вартість за 1 Вт·год (грн)</div>
                <div>• Ресурс циклів LiFePO4 (4000+)</div>
                <div>• Швидкість ДБЖ (UPS &lt; 10 мс)</div>
                <div>• Чиста синусоїда для котла</div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO FAQ Section (Structured for Google Rich Snippets & AI Search) */}
        <section className="bg-cacao-900/70 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Часті запитання про крафтовий шоколад в Україні (Експертний гід)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2 bg-cacao-950/60 p-5 rounded-2xl border border-stone-800/80">
              <h3 className="font-bold text-gold-300">
                Чим крафтовий шоколад Bean-to-Bar відрізняється від магазинного?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Промисловий шоколад готується з дезодорованого какао-порошку, рафінованих олій, соєвого лецитину та штучного ваніліну. Крафтовий шоколад Bean-to-Bar («від какао-боба до плитки») містить лише 2–3 інгредієнти: фермерські какао-боби сортів Fino de Aroma або Criollo, натуральне какао-масло та тростинний/кокосовий цукор або мед.
              </p>
            </div>

            <div className="space-y-2 bg-cacao-950/60 p-5 rounded-2xl border border-stone-800/80">
              <h3 className="font-bold text-gold-300">
                Яку малину чи полуницю в шоколаді краще замовити з доставкою в інше місто?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Для доставки Новою Поштою по Україні ідеально підходить <strong>цільна сублімована малина та полуниця в подвійному шоколаді</strong> (формат Frambini). Вона зберігає форму, хрускіт і смак свіжої ягоди до 6 місяців. Свіжа ж полуниця в шоколаді доставляється кур’єром або в термобоксах і розрахована на споживання протягом 24–36 годин.
              </p>
            </div>

            <div className="space-y-2 bg-cacao-950/60 p-5 rounded-2xl border border-stone-800/80">
              <h3 className="font-bold text-gold-300">
                Як об’єктивно порівняти ціни різних виробників шоколаду?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Крафтові плитки бувають вагою 50 г, 75 г, 85 г або 110 г. Тому платформа ChocoRadar UA автоматично розраховує <strong>індекс ціни за 100 грамів чистого продукту</strong>. У середньому по Україні якісний крафтовий шоколад у 2026 році коштує від 200 до 380 грн за 100 г.
              </p>
            </div>

            <div className="space-y-2 bg-cacao-950/60 p-5 rounded-2xl border border-stone-800/80">
              <h3 className="font-bold text-gold-300">
                Як українському виробнику потрапити на дошку ChocoRadar UA?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Базове розміщення в каталозі для українських ремісничих виробників шоколаду, корпусних цукерок, горіхового драже та фруктів у шоколаді є <strong>безкоштовним</strong>. Натисніть кнопку «Додати виробника», вкажіть посилання на свій Instagram або сайт, і ми створимо вашу картку.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-cacao-950 py-10 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-400">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-serif font-bold text-base text-white">
              Choco<span className="text-gold-400">Radar</span>.ua — Всеукраїнський навігатор крафтового шоколаду
            </div>
            <p>
              Плитки Bean-to-Bar • Шоколадні квіти та букети • Розмальовані корпусні цукерки • Горіхи та сухофрукти • Малина та полуниця в шоколаді
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setIsAddMakerModalOpen(true)} className="hover:text-gold-400 transition">
              Для виробників
            </button>
            <button onClick={() => setIsTenderModalOpen(true)} className="hover:text-gold-400 transition">
              Корпоративні замовлення (B2B)
            </button>
            <button onClick={() => setIsCompareModalOpen(true)} className="hover:text-gold-400 transition">
              Таблиця порівняння
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Side-by-Side Comparison Table (Like Hotline, built for Craft Chocolate) */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cacao-900 border border-stone-700 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Детальне порівняння характеристик та ціни за 100 г
                </h2>
                <p className="text-xs text-stone-400">
                  Порівнюйте склад, підсолоджувачі, % какао та реальну вигоду
                </p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-xl bg-cacao-800 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {comparedProducts.length === 0 ? (
              <p className="text-sm text-stone-400 py-8 text-center">
                Додайте товари до порівняння, натиснувши кнопку «Порівняти» на картці товару.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-stone-800">
                      <th className="py-3 px-3 text-stone-400 w-44">Параметр</th>
                      {comparedProducts.map((p) => (
                        <th key={p.id} className="py-3 px-3 min-w-[200px]">
                          <div className="font-bold text-white">{p.title}</div>
                          <div className="text-xs text-gold-400 font-normal mt-0.5">{p.makerName}</div>
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="text-[11px] text-rose-400 hover:underline mt-1 font-normal"
                          >
                            Видалити
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/70">
                    <tr>
                      <td className="py-3 px-3 text-stone-400 font-medium">Ціна за упаковку</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold text-base text-white">
                          {p.priceUah} грн ({p.weightGrams} г)
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gold-500/5">
                      <td className="py-3 px-3 text-gold-400 font-bold">Ціна за 100 грамів</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-black text-gold-400 text-base">
                          {getPricePer100g(p.priceUah, p.weightGrams)} грн / 100 г
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-stone-400 font-medium">Індекс чистоти складу</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 text-emerald-400 font-bold">
                          {p.cleanLabelScore} / 100
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-stone-400 font-medium">Вміст та сорт какао</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 text-stone-200">
                          {p.cacaoPercent}% ({p.cacaoType})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-stone-400 font-medium">Підсолоджувач</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 text-stone-200">
                          {p.sweetener}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-stone-400 font-medium">Bean-to-Bar / Ручний розпис</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 text-stone-200">
                          {p.isBeanToBar ? '✅ Bean-to-Bar' : 'Кувертюр преміум'} •{' '}
                          {p.isHandPainted ? '🎨 Ручний розпис' : 'Класична форма'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-stone-400 font-medium">Ноти смаку</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 text-stone-300">
                          {p.tastingNotes.join(', ')}
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

      {/* MODAL 2: Craft Maker Direct Profile & Order Redirect */}
      {activeMakerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cacao-900 border border-gold-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-2xl font-bold text-white">{activeMakerModal.name}</h2>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-gold-400 mt-0.5">
                  {activeMakerModal.city} • Засновано у {activeMakerModal.foundedYear} році • Рейтинг {activeMakerModal.rating}/5
                </p>
              </div>
              <button
                onClick={() => setActiveMakerModal(null)}
                className="p-2 rounded-xl bg-cacao-800 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">{activeMakerModal.description}</p>

            <div className="bg-cacao-950 border border-stone-800 rounded-2xl p-4 space-y-2 text-xs">
              <div>
                <span className="text-stone-400">Походження какао-сировини: </span>
                <span className="text-stone-100 font-medium">{activeMakerModal.cacaoOrigin.join(', ')}</span>
              </div>
              <div>
                <span className="text-stone-400">Логістика та терморежим: </span>
                <span className="text-emerald-300 font-medium">{activeMakerModal.shippingNote}</span>
              </div>
              <div>
                <span className="text-stone-400">Instagram майстерні: </span>
                <span className="text-gold-300 font-medium">{activeMakerModal.instagramHandle}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={activeMakerModal.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gold-500 hover:bg-gold-400 text-cacao-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm text-center transition flex items-center justify-center gap-2"
              >
                <span>Перейти на офіційний сайт виробника</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setActiveMakerModal(null);
                  setIsTenderModalOpen(true);
                }}
                className="bg-cacao-800 hover:bg-cacao-700 text-stone-200 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition"
              >
                Запросити індивідуальний набір
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: One-Click Tender / Gift Box Request to All Makers */}
      {isTenderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cacao-900 border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Швидка заявка всім крафтовим шоколатьє
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Опишіть, який подарунковий бокс або корпоративне замовлення вам потрібно — перевірені виробники надішлють свої найкращі пропозиції.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsTenderModalOpen(false);
                  setTenderSubmitted(false);
                }}
                className="p-2 rounded-xl bg-cacao-800 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {tenderSubmitted ? (
              <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-lg text-white">Заявку успішно надіслано майстерням!</h3>
                <p className="text-xs text-stone-300">
                  Виробники, які відповідають вашим критеріям, зв’яжуться з вами у Telegram/Viber протягом 15–30 хвилин із фото та цінами.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTenderSubmitted(true);
                }}
                className="space-y-4 text-xs sm:text-sm"
              >
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Що саме ви шукаєте?</label>
                  <select className="w-full bg-cacao-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white">
                    <option>Шоколадний букет / Шоколадні квіти (півонії, троянди, тюльпани)</option>
                    <option>Подарунковий набір (Розмальовані цукерки / Малина в шоколаді)</option>
                    <option>Дегустаційний сет Bean-to-Bar плиток</option>
                    <option>Набір без білого цукру / Веганський / Дитячий</option>
                    <option>Корпоративне замовлення з логотипом компанії (B2B)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Орієнтовний бюджет та побажання</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Наприклад: Потрібен красивий бокс цукерок із сиром та малиною в шоколаді на подарунок до п'ятниці, бюджет до 900 грн, доставка в Київ..."
                    className="w-full bg-cacao-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Ваш телефон або нік у Telegram</label>
                  <input
                    type="text"
                    required
                    placeholder="+380... або @username"
                    className="w-full bg-cacao-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-stone-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-500 hover:bg-gold-400 text-cacao-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Отримати пропозиції від виробників</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: Add Craft Maker (Producer Onboarding) */}
      {isAddMakerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cacao-900 border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Приєднатися до ChocoRadar UA як виробник
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Безкоштовне розміщення у каталозі, автоматичний імпорт товарів з Instagram або сайту та доступ до корпоративних замовлень.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddMakerModalOpen(false);
                  setMakerSubmitted(false);
                }}
                className="p-2 rounded-xl bg-cacao-800 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {makerSubmitted ? (
              <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-lg text-white">Заявку майстерні прийнято!</h3>
                <p className="text-xs text-stone-300">
                  Ми перевіримо склад ваших виробів та опублікуємо персональну вітрину бренду в каталозі протягом 24 годин.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMakerSubmitted(true);
                }}
                className="space-y-4 text-xs sm:text-sm"
              >
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Назва бренду / Майстерні</label>
                  <input
                    type="text"
                    required
                    placeholder="Наприклад: Lviv Cacao Artisan"
                    className="w-full bg-cacao-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Місто виробництва</label>
                  <input
                    type="text"
                    required
                    placeholder="Київ, Львів, Харків, Луцьк..."
                    className="w-full bg-cacao-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Посилання на Instagram або Сайт</label>
                  <input
                    type="text"
                    required
                    placeholder="https://instagram.com/..."
                    className="w-full bg-cacao-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Основний асортимент</label>
                  <input
                    type="text"
                    required
                    placeholder="Плитки bean-to-bar, розписні цукерки, малина в шоколаді..."
                    className="w-full bg-cacao-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-500 hover:bg-gold-400 text-cacao-950 font-bold py-3 rounded-xl transition"
                >
                  Подати заявку на безкоштовне розміщення
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
