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
  Tag,
  Instagram,
  Moon,
  Sun,
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
  { id: 'Київ', label: 'Київ' },
  { id: 'Харків', label: 'Харків' },
  { id: 'Львів', label: 'Львів' },
  { id: 'Дніпро', label: 'Дніпро' },
  { id: 'Одеса / Південь', label: 'Одеса • Миколаїв' },
  { id: 'Луцьк / Волинь', label: 'Луцьк • Волинь' },
  { id: 'Вінниця / Хмельницький / Житомир', label: 'Вінниця • Хмельницький • Житомир' },
  { id: 'Полтава / Суми / Запоріжжя', label: 'Полтава • Суми • Запоріжжя' },
  { id: 'Черкаси / Захід та Центри', label: 'Черкаси • Ужгород • Чернівці' },
];

const SEGMENT_GROUPS: { id: MakerSegment; title: string; subtitle: string; gradient: string }[] = [
  {
    id: 'bean-to-bar',
    title: '1. Bean-to-Bar (Від какао-боба до плитки)',
    subtitle:
      'Виробники самі закуповують фермерські какао-боби (Fino de Aroma, Criollo, Trinitario), обсмажують і перетирають їх у меланжерах.',
    gradient: 'linear-gradient(135deg, #7a4a2b 0%, #3a2113 100%)',
  },
  {
    id: 'chocolatier-bonbons',
    title: '2. Шоколатьє: плитки, цукерки ручної роботи та шоколадні квіти',
    subtitle:
      'Авторські плитки, корпусні цукерки з художнім розписом, шоколадні букети, трюфелі, сирні цукерки та фадж.',
    gradient: 'linear-gradient(135deg, #8b4d27 0%, #462b1f 100%)',
  },
  {
    id: 'healthy-vegan',
    title: '3. Healthy / Vegan / Raw солодощі (Без білого цукру, для дітей)',
    subtitle:
      'Шоколад, пастила та цукерки на керобі, кокосовому нектарі, меду або еритритолі — без білого цукру, лактози та глютену.',
    gradient: 'linear-gradient(135deg, #3c7a47 0%, #1f4728 100%)',
  },
  {
    id: 'flowers-berries-nuts',
    title: '4. Шоколадні квіти, букети, ягоди та горіхи в шоколаді',
    subtitle:
      'Букети з бельгійського шоколаду, свіжа й сублімована полуниця та малина в шоколаді, чорнослив і горіхове драже.',
    gradient: 'linear-gradient(135deg, #b53f61 0%, #6b1d35 100%)',
  },
  {
    id: 'craft-zefir-pastila',
    title: '5. Крафтовий зефір ручної роботи, зефірні букети та пастила',
    subtitle:
      'Натуральний зефір на агар-агарі з живого ягідного пюре, зефірна флористика (букети з зефірних півоній і троянд) та пастила без цукру.',
    gradient: 'linear-gradient(135deg, #e0a866 0%, #b06a1e 100%)',
  },
  {
    id: 'custom-cakes-pastry',
    title: '6. Авторські торти на замовлення, бенто-торти та кондитерські ательє',
    subtitle:
      'Святкові, весільні, дитячі та корпоративні торти, мусові десерти в шоколадному велюрі, бенто-торти та французькі макарони.',
    gradient: 'linear-gradient(135deg, #c75b7a 0%, #8e2f4a 100%)',
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
  },
  {
    id: 'req-2',
    city: 'Харків',
    categoryLabel: '🎂 Авторський торт + букет шоколадних квітів на ювілей',
    budget: '3 800 грн',
    timeAgo: '45 хв тому',
  },
  {
    id: 'req-3',
    city: 'Львів / Вся Україна',
    categoryLabel: '🌸 Зефірні букети та цукерки ручної роботи (до свята)',
    budget: '14 500 грн (15 букетів)',
    timeAgo: '1 год тому',
  },
];

export default function ChocoRadarApp({ initialCategory = 'all' }: ChocoRadarAppProps) {
  // Theme state (Warm Saturated Light or Rich Dark Espresso)
  const [isDark, setIsDark] = useState(false);

  // Primary Step-by-Step Consumer Filters
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMakerId, setSelectedMakerId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price100_asc' | 'price_asc'>('popular');
  const [visibleMakersLimit, setVisibleMakersLimit] = useState<number>(24);

  // Quick Purpose / Dietary Filter Pills
  const [onlySugarFree, setOnlySugarFree] = useState(false);
  const [onlyBeanToBar, setOnlyBeanToBar] = useState(false);
  const [advisorGoal, setAdvisorGoal] = useState<
    'all' | 'gift-her' | 'gift-boss' | 'kids' | 'gourmet-self' | 'corporate'
  >('all');

  // Progressive Disclosure
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [expandedMakerIds, setExpandedMakerIds] = useState<string[]>([]);
  const [groupBySegment, setGroupBySegment] = useState<boolean>(false);
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
  const [isB2BOpen, setIsB2BOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Comparison & Modals
  const [compareIds, setCompareIds] = useState<string[]>(['p-13', 'p-2', 'p-1']);
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

  // Macro Pillar counts (like on reference site: Chocolate, Cakes, Zephyr)
  const chocolateMakersCount = useMemo(
    () =>
      MAKERS.filter(
        (m) =>
          m.segment === 'bean-to-bar' ||
          m.segment === 'chocolatier-bonbons' ||
          m.segment === 'healthy-vegan' ||
          m.segment === 'flowers-berries-nuts'
      ).length,
    []
  );
  const cakeMakersCount = useMemo(
    () => MAKERS.filter((m) => m.categories.includes('avtorski-torty-ta-deserty')).length,
    []
  );
  const zefirMakersCount = useMemo(
    () => MAKERS.filter((m) => m.categories.includes('kraftovyi-zefir-ta-bukety')).length,
    []
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

  // Filtered Makers (Crafo.com.ua is always pinned #1 in chocolate categories)
  const filteredMakers = useMemo(() => {
    return MAKERS.filter((m) => {
      if (selectedCategory !== 'all' && !m.categories.includes(selectedCategory)) return false;
      if (
        selectedCity !== 'all' &&
        m.regionCity !== selectedCity &&
        !m.city.toLowerCase().includes(selectedCity.split('•')[0].trim().toLowerCase())
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
          m.websiteUrl.toLowerCase().includes(q) ||
          (m.instagramHandle && m.instagramHandle.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (a.id === 'crafo-kharkiv') return -1;
      if (b.id === 'crafo-kharkiv') return 1;
      return b.rating - a.rating;
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
          product.makerCity.toLowerCase().includes(selectedCity.split('•')[0].trim().toLowerCase());
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
      if (a.makerId === 'crafo-kharkiv' && b.makerId !== 'crafo-kharkiv') return -1;
      if (b.makerId === 'crafo-kharkiv' && a.makerId !== 'crafo-kharkiv') return 1;
      return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
    });
  }, [
    selectedCategory,
    selectedCity,
    selectedMakerId,
    onlySugarFree,
    onlyBeanToBar,
    advisorGoal,
    searchQuery,
    sortBy,
  ]);

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
    setVisibleMakersLimit(24);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedMakerId !== 'all' ||
    onlySugarFree ||
    onlyBeanToBar ||
    advisorGoal !== 'all';

  // Helper to get rich gradient banner for maker card based on segment
  const getMakerHeaderStyle = (maker: CraftMaker) => {
    if (maker.segment === 'custom-cakes-pastry') {
      return {
        gradient: 'linear-gradient(135deg, #c75b7a 0%, #8e2f4a 100%)',
        emoji: '🎂',
        pill: 'Торти та десерти',
      };
    }
    if (maker.segment === 'craft-zefir-pastila') {
      return {
        gradient: 'linear-gradient(135deg, #e0a866 0%, #b06a1e 100%)',
        emoji: '🌸',
        pill: 'Крафтовий зефір',
      };
    }
    if (maker.segment === 'flowers-berries-nuts') {
      return {
        gradient: 'linear-gradient(135deg, #b53f61 0%, #5a182c 100%)',
        emoji: '🌹',
        pill: 'Квіти та ягоди в шоколаді',
      };
    }
    if (maker.segment === 'healthy-vegan') {
      return {
        gradient: 'linear-gradient(135deg, #3c7a47 0%, #1d3f24 100%)',
        emoji: '🌿',
        pill: 'Без цукру / Vegan',
      };
    }
    return {
      gradient: 'linear-gradient(135deg, #7a4a2b 0%, #3a2113 100%)',
      emoji: '🍫',
      pill: maker.isBeanToBar ? 'Bean-to-Bar Шоколад' : 'Крафтовий шоколад',
    };
  };

  // Render a single Rich Saturated Maker Card (matching reference site style)
  const renderMakerCard = (maker: CraftMaker) => {
    const isExpanded = expandedMakerIds.includes(maker.id);
    const isLeader = maker.id === 'crafo-kharkiv';
    const headerMeta = getMakerHeaderStyle(maker);
    const cleanDomain = maker.websiteUrl
      .replace('https://www.', '')
      .replace('https://', '')
      .replace(/\/$/, '');

    return (
      <article
        key={maker.id}
        className={`group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
          isLeader
            ? 'border-2 border-[#e39851] ring-2 ring-[#e39851]/30 shadow-lg'
            : 'border'
        } ${
          isDark
            ? 'bg-[#261b16] border-white/15 hover:border-[#f0a556]'
            : 'bg-[#fefbf7] border-[#e1d5c8] hover:border-[#b06a1e] shadow-sm'
        }`}
      >
        {/* Rich Saturated Top Banner (Image or Vibrant Gradient like reference site) */}
        <div
          className="relative h-36 overflow-hidden cursor-pointer"
          style={{ background: headerMeta.gradient }}
          onClick={() => setActiveMakerModal(maker)}
        >
          {maker.imageUrl ? (
            <>
              <img
                src={maker.imageUrl}
                alt={maker.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30" />
            </>
          ) : (
            <span className="absolute -right-3 -top-4 select-none text-7xl opacity-30 transition-transform duration-300 group-hover:scale-110">
              {headerMeta.emoji}
            </span>
          )}

          {/* Top Left Pills */}
          <div className="absolute left-4 top-3.5 z-10 flex flex-wrap items-center gap-1.5">
            {isLeader ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e39851] to-[#b06a1e] px-3 py-1 text-xs font-extrabold text-[#26140b] shadow-md">
                <Crown className="w-3.5 h-3.5" />
                <span>№1 Лідер категорії Шоколад</span>
              </span>
            ) : (
              <span className="rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                {headerMeta.pill}
              </span>
            )}
            {maker.rating >= 4.95 && (
              <span className="rounded-full bg-[#fff8ef] px-2.5 py-0.5 text-[11px] font-bold text-[#302016] shadow-sm">
                ★ {maker.rating}
              </span>
            )}
          </div>

          {/* Bottom Left Verified Badge */}
          <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2">
            {maker.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-[#302016] shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Перевірений виробник</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3
              onClick={() => setActiveMakerModal(maker)}
              className={`font-serif text-lg font-bold leading-snug cursor-pointer hover:text-[#b06a1e] transition ${
                isDark ? 'text-[#eee7dd]' : 'text-[#302016]'
              }`}
            >
              {maker.name}
            </h3>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                isDark ? 'text-[#a79d91]' : 'text-[#715f53]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#b06a1e] shrink-0" />
              <span>{maker.city}</span>
            </p>
          </div>

          {/* Multi-Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {maker.categories.map((catSlug) => {
              const info = CATEGORY_SHORT_LABELS[catSlug];
              if (!info) return null;
              const isSelectedCat = selectedCategory === catSlug;
              return (
                <button
                  key={catSlug}
                  onClick={() => setSelectedCategory(catSlug)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                    isSelectedCat
                      ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                      : isDark
                      ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                      : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
                  }`}
                >
                  <span>{info.emoji}</span>
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* 2-line Description */}
          <p
            className={`line-clamp-2 text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
            }`}
          >
            {maker.description || maker.specialty}
          </p>

          {/* Verified Contact / Phone & Domain Row (Replaced wide per-kg price range) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs font-bold">
            {maker.phone && !maker.phone.startsWith('Замовлення') ? (
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#eee7dd]' : 'text-[#302016]'}`}>
                <Phone className="w-3.5 h-3.5 text-[#b06a1e] shrink-0" />
                <span>{maker.phone.split(',')[0]}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#b06a1e]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Активна сторінка • Щоденна відправка</span>
              </div>
            )}
            {maker.instagramHandle && (
              <span className="text-[11px] font-semibold text-[#b06a1e]">
                {maker.instagramHandle}
              </span>
            )}
          </div>

          {/* Expandable Full Details */}
          {isExpanded && (
            <div
              className={`pt-3 mt-1 border-t space-y-2 text-xs ${
                isDark ? 'border-white/10 text-[#eee7dd]' : 'border-[#e1d5c8] text-[#302016]'
              }`}
            >
              <p className="leading-relaxed">{maker.description}</p>
              <div
                className={`rounded-xl p-3 space-y-1 ${
                  isDark ? 'bg-[#1a120e]' : 'bg-[#f1e6da]/70'
                }`}
              >
                <div>
                  <strong>Контакт / Телефон:</strong> {maker.phone}
                </div>
                {maker.address && (
                  <div>
                    <strong>Локація:</strong> {maker.address}
                  </div>
                )}
                {maker.instagramHandle && (
                  <div>
                    <strong>Instagram:</strong> {maker.instagramHandle}
                  </div>
                )}
                <div>
                  <strong>Доставка:</strong> {maker.shippingNote}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="mt-auto flex items-center gap-1.5 pt-2">
            <a
              href={maker.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs ${
                isDark
                  ? 'bg-[#f0a556] text-[#26160e] hover:bg-[#e39851]'
                  : 'bg-[#462b1f] text-[#faf4eb] hover:bg-[#b06a1e]'
              }`}
            >
              <span>{cleanDomain.includes('instagram.com') ? 'Instagram' : 'Сайт'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {maker.instagramUrl && !cleanDomain.includes('instagram.com') && (
              <a
                href={maker.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={maker.instagramHandle || 'Instagram'}
                className={`inline-flex items-center justify-center rounded-full p-2 text-xs font-semibold border transition ${
                  isDark
                    ? 'border-white/15 text-[#eee7dd] hover:bg-white/10'
                    : 'border-[#e1d5c8] bg-white text-[#302016] hover:bg-[#f1e6da]'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => toggleMakerExpand(maker.id)}
              className={`ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                isDark
                  ? 'text-[#f0a556] hover:bg-white/10'
                  : 'text-[#7a4a2b] hover:bg-[#f1e6da]'
              }`}
            >
              <span>{isExpanded ? 'Згорнути' : 'Докладніше'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#1a120e] text-[#eee7dd]' : 'bg-[#fbf6ee] text-[#302016]'
      }`}
    >
      {/* Top Sticky Header (Matching reference site's rich chocolate-caramel header) */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl ${
          isDark
            ? 'border-white/15 bg-[#1a120e]/85'
            : 'border-[#e1d5c8] bg-[#fbf6ee]/90'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-2.5 text-left outline-none"
          >
            <span className="grid w-10 h-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-lg">
              🍫
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-serif text-lg font-bold tracking-tight">
                ChocoRadar <span className="text-[#b06a1e]">Крафти</span>
              </span>
              <span className={`text-[11px] font-medium ${isDark ? 'text-[#a79d91]' : 'text-[#715f53]'}`}>
                Дошка солодощів України • {MAKERS.length} майстрів
              </span>
            </span>
          </button>

          {/* Top Quick Macro Navigation */}
          <nav className="ml-3 hidden items-center gap-1.5 lg:flex">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              Усі ({MAKERS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('plytky-shokoladu')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'plytky-shokoladu'
                  ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🍫 Шоколад
            </button>
            <button
              onClick={() => setSelectedCategory('avtorski-torty-ta-deserty')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'avtorski-torty-ta-deserty'
                  ? 'bg-[#8e2f4a] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#8e2f4a]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🎂 Торти ({cakeMakersCount})
            </button>
            <button
              onClick={() => setSelectedCategory('kraftovyi-zefir-ta-bukety')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'kraftovyi-zefir-ta-bukety'
                  ? 'bg-[#b06a1e] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#b06a1e]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🌸 Зефір ({zefirMakersCount})
            </button>
            <button
              onClick={() => setSelectedCategory('shokoladni-kvity-ta-bukety')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'shokoladni-kvity-ta-bukety'
                  ? 'bg-[#b53f61] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🌹 Букети
            </button>
          </nav>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Перемкнути тему"
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${
                isDark
                  ? 'border-white/20 bg-[#362820] text-[#f0a556]'
                  : 'border-[#e1d5c8] bg-[#f1e6da] text-[#462b1f]'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#b06a1e] hover:bg-[#965715] px-4 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Замовити підбір</span>
            </button>

            <button
              onClick={() => {
                setSelectedPlanForModal('Безкоштовний або PRO');
                setIsAddMakerModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#462b1f] to-[#3a2113] hover:from-[#5c3929] hover:to-[#462b1f] px-4 py-2 text-xs font-bold text-[#faf4eb] shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e39851]" />
              <span>Заявити про себе</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION (Rich Gradients, Floating Icons & 3 Big Pillar Cards like https://e11za873zg41-d.space-z.ai) */}
        <section
          className={`relative overflow-hidden border-b ${
            isDark
              ? 'border-white/10 bg-gradient-to-b from-[#2f2018] via-[#1a120e] to-[#1a120e]'
              : 'border-[#e1d5c8] bg-gradient-to-b from-[#f1e6da]/80 via-[#fbf6ee] to-[#fbf6ee]'
          }`}
        >
          {/* Ambient radial glow blobs */}
          <div
            className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full opacity-35 blur-3xl"
            style={{ background: 'radial-gradient(circle, #b06a1e, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #c75b7a, transparent 70%)' }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b06a1e]/40 bg-[#e39851]/20 px-4 py-1.5 text-xs font-bold text-[#8c4f12] dark:text-[#f0a556] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Крафтові солодощі України • {MAKERS.length} перевірених виробників</span>
              </span>

              <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Знайди свого{' '}
                <span className="bg-gradient-to-r from-[#7a4a2b] via-[#b06a1e] to-[#c75b7a] bg-clip-text text-transparent">
                  крафтового майстра
                </span>{' '}
                солодощів
              </h1>

              <p
                className={`mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                }`}
              >
                Всеукраїнська платформа, де покупці знаходять найкращий крафтовий шоколад, шоколадні й зефірні букети та авторські торти напряму у виробників, а майстри отримують замовлення.
              </p>

              {/* Big Search Bar */}
              <div className="mx-auto mt-7 flex max-w-xl items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 w-5 h-5 -translate-y-1/2 text-[#715f53]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Шоколад, торт, зефір, букет, малина, Харків, Київ..."
                    className={`w-full h-13 rounded-full border pl-12 pr-10 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b06a1e] ${
                      isDark
                        ? 'bg-[#261b16] border-white/20 text-[#eee7dd] placeholder:text-[#a79d91]'
                        : 'bg-[#fefbf7] border-[#d4c3b3] text-[#302016] placeholder:text-[#715f53]'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#715f53] hover:text-[#302016]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <a
                  href="#makers-section"
                  className="h-13 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#462b1f] to-[#3a2113] hover:from-[#5c3929] hover:to-[#462b1f] px-6 text-sm font-bold text-[#faf4eb] shadow-md transition"
                >
                  Знайти
                </a>
              </div>

              {/* 3 Macro Pillar Cards (Chocolate / Cakes / Zephyr — with Rich Gradients) */}
              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => setSelectedCategory('plytky-shokoladu')}
                  className={`group rounded-2xl border p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    selectedCategory === 'plytky-shokoladu' || selectedCategory === 'korpusni-ta-rozmalovani-tsukerky'
                      ? 'border-[#7a4a2b] ring-2 ring-[#7a4a2b]/30 bg-[#f1e6da]'
                      : isDark
                      ? 'border-white/15 bg-[#261b16]/90'
                      : 'border-[#e1d5c8] bg-[#fefbf7]/95'
                  }`}
                >
                  <div
                    className="mx-auto grid w-12 h-12 place-items-center rounded-xl text-2xl text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #7a4a2b 0%, #3a2113 100%)' }}
                  >
                    🍫
                  </div>
                  <div className="mt-2.5 font-serif text-2xl font-bold sm:text-3xl">
                    {chocolateMakersCount}
                  </div>
                  <div className={`text-xs font-bold sm:text-sm ${isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'}`}>
                    Шоколад і цукерки
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCategory('avtorski-torty-ta-deserty')}
                  className={`group rounded-2xl border p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    selectedCategory === 'avtorski-torty-ta-deserty'
                      ? 'border-[#c75b7a] ring-2 ring-[#c75b7a]/30 bg-[#f1e6da]'
                      : isDark
                      ? 'border-white/15 bg-[#261b16]/90'
                      : 'border-[#e1d5c8] bg-[#fefbf7]/95'
                  }`}
                >
                  <div
                    className="mx-auto grid w-12 h-12 place-items-center rounded-xl text-2xl text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #c75b7a 0%, #8e2f4a 100%)' }}
                  >
                    🎂
                  </div>
                  <div className="mt-2.5 font-serif text-2xl font-bold sm:text-3xl">
                    {cakeMakersCount}
                  </div>
                  <div className={`text-xs font-bold sm:text-sm ${isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'}`}>
                    Авторські торти
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCategory('kraftovyi-zefir-ta-bukety')}
                  className={`group rounded-2xl border p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    selectedCategory === 'kraftovyi-zefir-ta-bukety'
                      ? 'border-[#b06a1e] ring-2 ring-[#b06a1e]/30 bg-[#f1e6da]'
                      : isDark
                      ? 'border-white/15 bg-[#261b16]/90'
                      : 'border-[#e1d5c8] bg-[#fefbf7]/95'
                  }`}
                >
                  <div
                    className="mx-auto grid w-12 h-12 place-items-center rounded-xl text-2xl text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #e0a866 0%, #b06a1e 100%)' }}
                  >
                    🌸
                  </div>
                  <div className="mt-2.5 font-serif text-2xl font-bold sm:text-3xl">
                    {zefirMakersCount}
                  </div>
                  <div className={`text-xs font-bold sm:text-sm ${isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'}`}>
                    Зефір і букети
                  </div>
                </button>
              </div>
            </div>

            {/* Detailed 9 Sub-Category Filter Buttons */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
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
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                      active
                        ? 'bg-gradient-to-br from-[#462b1f] to-[#3a2113] text-[#faf4eb] border-[#3a2113] shadow-md'
                        : isDark
                        ? 'bg-[#261b16] text-[#eee7dd] border-white/15 hover:border-[#f0a556]'
                        : 'bg-[#fefbf7] text-[#302016] border-[#d9c8b8] hover:border-[#b06a1e] hover:bg-[#f1e6da]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{cat.emoji}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          active
                            ? 'bg-[#e39851] text-[#2e190d]'
                            : isDark
                            ? 'bg-[#362820] text-[#eee7dd]'
                            : 'bg-[#f1e6da] text-[#3e281b]'
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                    <div className="font-bold text-xs leading-tight">{cat.shortTitle}</div>
                  </button>
                );
              })}
            </div>

            {/* City & Dietary Filter Bar */}
            <div
              className={`mt-4 rounded-2xl border p-4 shadow-sm space-y-3 ${
                isDark ? 'bg-[#261b16] border-white/15' : 'bg-[#fefbf7] border-[#d9c8b8]'
              }`}
            >
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-[#b06a1e] shrink-0 flex items-center gap-1 mr-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Місто:
                </span>
                {CITY_FILTERS.map((city) => {
                  const active = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                        active
                          ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                          : isDark
                          ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                          : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e3d2c0]'
                      }`}
                    >
                      {city.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#e1d5c8]/60">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setOnlyBeanToBar(!onlyBeanToBar)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      onlyBeanToBar
                        ? 'bg-[#b06a1e] text-white'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    🍫 Bean-to-Bar
                  </button>
                  <button
                    onClick={() => setOnlySugarFree(!onlySugarFree)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      onlySugarFree
                        ? 'bg-[#b06a1e] text-white'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    🌿 Без білого цукру / Vegan
                  </button>
                  <button
                    onClick={() => setAdvisorGoal(advisorGoal === 'gift-her' ? 'all' : 'gift-her')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      advisorGoal === 'gift-her'
                        ? 'bg-[#c75b7a] text-white'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    💝 На подарунок
                  </button>
                  <button
                    onClick={() => setAdvisorGoal(advisorGoal === 'kids' ? 'all' : 'kids')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      advisorGoal === 'kids'
                        ? 'bg-[#b06a1e] text-white'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    🧸 Дітям
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-[#c75b7a] hover:underline"
                  >
                    Скинути всі фільтри ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT CONTAINER */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-14">
          {/* SECTION 1: ALL 274 UKRAINIAN CRAFT MAKERS */}
          <section id="makers-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e1d5c8] pb-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b06a1e]">
                  <Sparkles className="w-4 h-4" />
                  <span>Каталог перевірених виробників України</span>
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  {selectedCategory === 'all'
                    ? `Усі крафтові майстри та виробництва (${filteredMakers.length})`
                    : `${currentCategoryInfo.shortTitle} — виробники (${filteredMakers.length})`}
                  {selectedCity !== 'all' ? ` • ${selectedCity}` : ''}
                </h2>
              </div>

              <button
                onClick={() => setGroupBySegment(!groupBySegment)}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition flex items-center gap-1.5 self-start sm:self-auto ${
                  isDark
                    ? 'bg-[#261b16] border-white/20 text-[#eee7dd]'
                    : 'bg-[#f1e6da] border-[#d4c3b3] text-[#302016] hover:bg-[#e5d5c3]'
                }`}
              >
                <Filter className="w-3.5 h-3.5 text-[#b06a1e]" />
                <span>{groupBySegment ? 'Показати єдиною сіткою' : 'Згрупувати за 6 напрямками'}</span>
              </button>
            </div>

            {filteredMakers.length === 0 ? (
              <div className="rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-10 text-center space-y-3">
                <p className="text-lg font-bold text-[#302016]">
                  За обраними фільтрами майстерень не знайдено
                </p>
                <button
                  onClick={resetAllFilters}
                  className="rounded-full bg-[#462b1f] px-5 py-2.5 text-xs font-bold text-white"
                >
                  Показати всі {MAKERS.length} майстерень України
                </button>
              </div>
            ) : groupBySegment ? (
              <div className="space-y-10">
                {SEGMENT_GROUPS.map((group) => {
                  const segMakers = filteredMakers.filter((m) => m.segment === group.id);
                  if (segMakers.length === 0) return null;
                  return (
                    <div key={group.id} className="space-y-4">
                      <div
                        className="rounded-2xl p-5 text-white shadow-sm"
                        style={{ background: group.gradient }}
                      >
                        <h3 className="font-serif text-lg sm:text-xl font-bold">
                          {group.title} ({segMakers.length})
                        </h3>
                        <p className="text-xs sm:text-sm text-white/90 mt-1">{group.subtitle}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {segMakers.map((maker) => renderMakerCard(maker))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredMakers.slice(0, visibleMakersLimit).map((maker) => renderMakerCard(maker))}
                </div>

                {filteredMakers.length > visibleMakersLimit && (
                  <div className="pt-4 text-center">
                    <button
                      onClick={() => setVisibleMakersLimit((prev) => prev + 36)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#462b1f] to-[#3a2113] hover:from-[#5c3929] hover:to-[#462b1f] px-7 py-3.5 text-sm font-bold text-[#faf4eb] shadow-md transition"
                    >
                      <span>
                        Показати ще виробників (залишилось {filteredMakers.length - visibleMakersLimit} із{' '}
                        {filteredMakers.length})
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* SECTION 2: PRODUCT CATALOG & PRICE PER 100G COMPARISON */}
          <section id="products-section" className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e1d5c8] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#b06a1e]">
                  Порівняння цін за 100 грамів та чистоти складу
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  Флагманські вироби для порівняння ({filteredProducts.length})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold ${
                    isDark
                      ? 'bg-[#261b16] border-white/20 text-[#eee7dd]'
                      : 'bg-[#fefbf7] border-[#d4c3b3] text-[#302016]'
                  }`}
                >
                  <option value="popular">Сортування: За популярністю</option>
                  <option value="price100_asc">Найвигідніша ціна за 100 г</option>
                  <option value="price_asc">Від дешевших за упаковку</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const pricePer100 = getPricePer100g(product.priceUah, product.weightGrams);
                const isExpanded = expandedProductIds.includes(product.id);
                const isCompared = compareIds.includes(product.id);
                const maker = MAKERS.find((m) => m.id === product.makerId);

                return (
                  <article
                    key={product.id}
                    className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between ${
                      isDark ? 'bg-[#261b16] border-white/15' : 'bg-[#fefbf7] border-[#e1d5c8]'
                    }`}
                  >
                    <div>
                      <div className="relative h-48 bg-[#f1e6da] overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#462b1f]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                            {product.subType}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Склад {product.cleanLabelScore}/100</span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <button
                            onClick={() => maker && setActiveMakerModal(maker)}
                            className="font-bold text-[#b06a1e] hover:underline text-left"
                          >
                            {product.makerName} ({product.makerCity})
                          </button>
                          <span className="flex items-center gap-1 font-bold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {product.rating}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base sm:text-lg leading-snug">
                          {product.title}
                        </h3>

                        <div className="pt-1 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-bold">{product.priceUah} грн</span>
                            <span className="text-xs opacity-70 ml-1.5">/ {product.weightGrams} г</span>
                          </div>
                          <div className="bg-[#f1e6da] text-[#3e281b] px-3 py-1 rounded-full text-xs font-bold">
                            {pricePer100} грн за 100 г
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => toggleProductExpand(product.id)}
                            className="text-xs font-bold text-[#b06a1e] hover:underline flex items-center gap-1"
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
                            <div className="mt-3 pt-3 border-t border-[#e1d5c8] space-y-2 text-xs">
                              <p className="leading-relaxed">{product.expertVerdict}</p>
                              <div className="bg-[#f1e6da]/60 rounded-xl p-3 space-y-1 text-[#302016]">
                                <div>
                                  <strong>Основа:</strong>{' '}
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

                    <div className="px-5 pb-5 pt-3 border-t border-[#e1d5c8]/60 flex items-center gap-2">
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
                          isCompared
                            ? 'bg-[#462b1f] text-white border-[#462b1f]'
                            : 'bg-[#f1e6da] text-[#3e281b] border-transparent hover:bg-[#e5d5c3]'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{isCompared ? 'У порівнянні' : 'Порівняти'}</span>
                      </button>

                      {maker && (
                        <a
                          href={maker.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#b06a1e] hover:bg-[#965715] text-white font-bold py-2 px-4 rounded-full text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <span>Купити</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: LIVE BUYER TENDER BOARD & PRODUCER MONETIZATION BANNER */}
          <section
            id="b2b-partner-section"
            className="rounded-3xl bg-gradient-to-br from-[#462b1f] via-[#3a2113] to-[#26140b] text-[#faf4eb] p-6 sm:p-10 shadow-xl space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-[#e39851]/25 border border-[#e39851]/40 text-[#f5c492] text-xs font-bold px-3.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Біржа замовлень на торти, зефірні букети та шоколадні набори</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                  Замовте торт, букет чи корпоративні подарунки напряму у майстрів
                </h2>
                <p className="text-xs sm:text-sm text-[#e1d5c8] leading-relaxed">
                  Опишіть, що вам потрібно, за 30 секунд — перевірені кондитерські, зефірні флористи та шоколатьє вашого міста самі надішлють вам пропозиції з цінами у Telegram або Viber.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={() => setIsTenderModalOpen(true)}
                  className="bg-[#e39851] hover:bg-[#f0a556] text-[#2e190d] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition shadow-md flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Залишити заявку на підбір</span>
                </button>
                <button
                  onClick={() => setIsB2BOpen(!isB2BOpen)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full transition flex items-center gap-1.5"
                >
                  <Crown className="w-4 h-4 text-[#e39851]" />
                  <span>{isB2BOpen ? 'Сховати тарифи PRO' : 'Виробникам: Підключити PRO'}</span>
                </button>
              </div>
            </div>

            {/* Live Buyer Requests Ticker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {LIVE_BUYER_REQUESTS.map((req) => (
                <div
                  key={req.id}
                  className="bg-white/10 border border-white/15 rounded-2xl p-4 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#f5c492]">
                    <span className="font-bold">{req.city}</span>
                    <span>{req.timeAgo}</span>
                  </div>
                  <div className="font-bold text-sm text-white leading-snug">
                    {req.categoryLabel}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="font-bold text-[#e39851]">Бюджет: {req.budget}</span>
                    <button
                      onClick={() => {
                        setSelectedPlanForModal('PRO Майстерня (990 грн/міс)');
                        setIsAddMakerModalOpen(true);
                      }}
                      className="text-[11px] font-bold underline text-white hover:text-[#e39851]"
                    >
                      Взяти замовлення →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Expandable Tariffs for Producers */}
            {isB2BOpen && (
              <div className="pt-6 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-[#e1d5c8]">Базовий старт</span>
                    <div className="text-2xl font-bold">0 грн / міс</div>
                    <p className="text-xs text-[#e1d5c8]">
                      Розміщення у каталозі, пряме посилання на сайт та Instagram.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('Базовий (Безкоштовно)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-full"
                  >
                    Додати безкоштовно
                  </button>
                </div>

                <div className="bg-[#e39851]/20 border-2 border-[#e39851] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-[#f5c492]">
                      ★ Рекомендуємо • PRO Майстер
                    </span>
                    <div className="text-2xl font-bold">990 грн / міс</div>
                    <p className="text-xs text-white">
                      Закріплення у ТОП-3 вашого міста, бейдж «★ Рекомендуємо» та миттєві контакти замовників тортів і букетів у Telegram.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('PRO Майстерня (990 грн/міс)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-[#e39851] hover:bg-[#f0a556] text-[#2e190d] text-xs font-bold py-2.5 rounded-full"
                  >
                    Підключити PRO
                  </button>
                </div>

                <div className="bg-white/5 border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-[#f5c492]">
                      B2B Корпоративний
                    </span>
                    <div className="text-2xl font-bold">2 490 грн / міс</div>
                    <p className="text-xs text-[#e1d5c8]">
                      Пріоритетний доступ до оптових та корпоративних замовлень (від 30 до 500 подарункових наборів).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('B2B Корпоративний (2490 грн/міс)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-full"
                  >
                    Стати B2B-партнером
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Rich Footer */}
      <footer
        className={`border-t py-8 px-4 sm:px-6 ${
          isDark ? 'bg-[#140d0a] border-white/10 text-[#a79d91]' : 'bg-[#f1e6da] border-[#e1d5c8] text-[#5a4638]'
        }`}
      >
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div>
            <strong className={isDark ? 'text-white' : 'text-[#302016]'}>
              ChocoRadar Крафти України
            </strong>{' '}
            — {MAKERS.length} перевірених виробників шоколаду, зефіру та авторських тортів (2026)
          </div>
          <div className="flex gap-5 font-bold">
            <button
              onClick={() => {
                setSelectedPlanForModal('Безкоштовний або PRO');
                setIsAddMakerModalOpen(true);
              }}
              className="hover:text-[#b06a1e]"
            >
              + Заявити про себе
            </button>
            <button onClick={() => setIsTenderModalOpen(true)} className="hover:text-[#b06a1e]">
              Замовити торт / букет
            </button>
            <button onClick={() => setIsCompareModalOpen(true)} className="hover:text-[#b06a1e]">
              Порівняння ({compareIds.length})
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Maker Details */}
      {activeMakerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b06a1e]">
                  {activeMakerModal.segmentTitle}
                </span>
                <h2 className="font-serif text-2xl font-bold mt-0.5">{activeMakerModal.name}</h2>
                <p className="text-xs text-[#715f53]">
                  {activeMakerModal.city} • Рейтинг {activeMakerModal.rating}/5
                </p>
              </div>
              <button
                onClick={() => setActiveMakerModal(null)}
                className="p-2 rounded-full bg-[#f1e6da] text-[#302016]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm leading-relaxed">{activeMakerModal.description}</p>

            <div className="bg-[#f1e6da] rounded-2xl p-4 space-y-2 text-xs">
              <div>
                <strong>Контакти / Телефон:</strong> {activeMakerModal.phone}
              </div>
              {activeMakerModal.instagramHandle && (
                <div>
                  <strong>Instagram:</strong> {activeMakerModal.instagramHandle}
                </div>
              )}
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
                className="flex-1 bg-[#462b1f] hover:bg-[#b06a1e] text-white font-bold py-3 px-4 rounded-full text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5"
              >
                <span>Перейти на сторінку майстра</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Side-by-Side Comparison */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e1d5c8] pb-4">
              <h2 className="font-serif text-xl font-bold">
                Порівняння характеристик та ціни за 100 г
              </h2>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-full bg-[#f1e6da]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {comparedProducts.length === 0 ? (
              <p className="text-sm text-[#715f53] py-8 text-center">
                Додайте вироби до порівняння кнопкою «Порівняти».
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#e1d5c8]">
                      <th className="py-3 px-3 text-[#715f53]">Параметр</th>
                      {comparedProducts.map((p) => (
                        <th key={p.id} className="py-3 px-3">
                          <div className="font-bold">{p.title}</div>
                          <div className="text-xs text-[#b06a1e] font-bold">{p.makerName}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1d5c8]">
                    <tr>
                      <td className="py-3 px-3 text-[#715f53]">Ціна упаковки</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold">
                          {p.priceUah} грн ({p.weightGrams} г)
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-[#f1e6da]/60">
                      <td className="py-3 px-3 font-bold text-[#b06a1e]">Ціна за 100 г</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold text-[#b06a1e]">
                          {getPricePer100g(p.priceUah, p.weightGrams)} грн / 100 г
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#715f53]">Підсолоджувач</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3">
                          {p.sweetener}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b06a1e]">
                  Тендер для кондитерів та шоколатьє
                </span>
                <h2 className="font-serif text-xl font-bold">Замовити торт, букет чи набір</h2>
              </div>
              <button
                onClick={() => {
                  setIsTenderModalOpen(false);
                  setTenderSubmitted(false);
                }}
                className="p-2 rounded-full bg-[#f1e6da]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {tenderSubmitted ? (
              <div className="bg-[#f1e6da] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold">Заявку передано майстрам!</div>
                <p className="text-xs text-[#5a4638]">
                  Перевірені виробники вашого міста зв’яжуться з вами з пропозиціями.
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
                  placeholder="Ваше місто (Харків, Київ, Львів, Дніпро, Одеса...)"
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder="Що потрібно? (торт, зефірний букет, шоколадні квіти)"
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder="Ваш телефон або Telegram (@username)"
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <button
                  type="submit"
                  className="w-full bg-[#b06a1e] hover:bg-[#965715] text-white font-bold py-3 rounded-full transition"
                >
                  Отримати пропозиції
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: Add Maker */}
      {isAddMakerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b06a1e]">
                  Тариф: {selectedPlanForModal}
                </span>
                <h2 className="font-serif text-xl font-bold">Заявити про свою майстерню</h2>
              </div>
              <button
                onClick={() => {
                  setIsAddMakerModalOpen(false);
                  setMakerSubmitted(false);
                }}
                className="p-2 rounded-full bg-[#f1e6da]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {makerSubmitted ? (
              <div className="bg-[#f1e6da] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold">Заявку прийнято!</div>
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
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder="Сайт або Instagram"
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder="Контактний телефон"
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <button
                  type="submit"
                  className="w-full bg-[#462b1f] hover:bg-[#b06a1e] text-white font-bold py-3 rounded-full transition"
                >
                  Додати майстерню
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
