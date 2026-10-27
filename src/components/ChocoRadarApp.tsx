'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CATEGORIES,
  MAKERS,
  PRODUCTS,
  CategorySlug,
  CraftMaker,
  MakerSegment,
  getPricePer100g,
} from '@/data/chocolateData';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';
import { DISCOVERED_CATEGORY_URLS } from '@/data/categoryLinks';
import {
  MacroSectionId,
  ProductVariantItem,
  CHOCOLATE_VARIANTS,
  CAKE_VARIANTS,
  ZEFIR_VARIANTS,
  ALL_SECTION_VARIANTS,
} from '@/data/sectionVariants';
import {
  Search,
  CheckCircle2,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
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
  Instagram,
  Moon,
  Sun,
  Calculator,
  Heart,
  HelpCircle,
  Wand2,
  BookOpen,
  Maximize2,
  LayoutList,
  Clock,
} from 'lucide-react';

// Direct link to a category page on the maker's site (manual > auto-discovered). null = no verified link.
function getMakerCategoryUrl(maker: CraftMaker, cat: CategorySlug): string | null {
  if (cat === 'all') return null;
  return maker.categoryUrls?.[cat] || DISCOVERED_CATEGORY_URLS[maker.id]?.[cat] || null;
}

interface ChocoRadarAppProps {
  initialSection?: MacroSectionId;
  initialCategory?: CategorySlug;
  initialCity?: string;
}

type Lang = 'uk' | 'ru';

const CATEGORY_SHORT_LABELS: Record<
  Exclude<CategorySlug, 'all'>,
  { uk: string; ru: string; emoji: string }
> = {
  'plytky-shokoladu': {
    uk: 'Плитка шоколаду, батончик',
    ru: 'Плитка шоколада, батончик',
    emoji: '🍫',
  },
  'korpusni-ta-rozmalovani-tsukerky': {
    uk: 'Цукерки ручної роботи',
    ru: 'Конфеты ручной работы',
    emoji: '🍬',
  },
  'shokoladni-kvity-ta-bukety': {
    uk: 'Шоколадні квіти і букет',
    ru: 'Шоколадные цветы и букеты',
    emoji: '🌹',
  },
  'malyna-ta-polunytsia-v-shokoladi': {
    uk: 'Малина і полуниця в шоколаді',
    ru: 'Малина и клубника в шоколаде',
    emoji: '🍓',
  },
  'horikhy-ta-sukhofrukty-v-shokoladi': {
    uk: 'Горіхи та сухофрукти',
    ru: 'Орехи и сухофрукты',
    emoji: '🌰',
  },
  'bez-tsukru-ta-vegan': {
    uk: 'Без цукру',
    ru: 'Без сахара',
    emoji: '🌿',
  },
  'solodoshchi-dlia-ditei': {
    uk: 'Для дітей',
    ru: 'Для детей',
    emoji: '🧸',
  },
  'kraftovyi-zefir-ta-bukety': {
    uk: 'Зефір та зефірні букети',
    ru: 'Зефир и зефирные букеты',
    emoji: '🌸',
  },
  'avtorski-torty-ta-deserty': {
    uk: 'Авторські торти і десерти',
    ru: 'Авторские торты и десерты',
    emoji: '🎂',
  },
};

const CITY_FILTERS: { id: string; uk: string; ru: string }[] = [
  { id: 'all', uk: 'Вся Україна', ru: 'Вся Украина' },
  { id: 'Харків', uk: 'Харків', ru: 'Харьков' },
  { id: 'Київ', uk: 'Київ', ru: 'Киев' },
  { id: 'Львів', uk: 'Львів', ru: 'Львов' },
  { id: 'Дніпро', uk: 'Дніпро', ru: 'Днепр' },
  { id: 'Одеса / Південь', uk: 'Одеса • Миколаїв', ru: 'Одесса • Николаев' },
  { id: 'Луцьк / Волинь', uk: 'Луцьк • Волинь', ru: 'Луцк • Волынь' },
  {
    id: 'Вінниця / Хмельницький / Житомир',
    uk: 'Вінниця • Хмельницький • Житомир',
    ru: 'Винница • Хмельницкий • Житомир',
  },
  {
    id: 'Полтава / Суми / Запоріжжя',
    uk: 'Полтава • Суми • Запоріжжя',
    ru: 'Полтава • Сумы • Запорожье',
  },
  {
    id: 'Черкаси / Захід та Центри',
    uk: 'Черкаси • Ужгород • Рівне',
    ru: 'Черкассы • Ужгород • Ровно',
  },
];

// Simple Ukrainian-to-Russian dynamic text helper for database descriptions when RU is active
function localizeText(text: string, lang: Lang): string {
  if (lang === 'uk' || !text) return text;
  return text
    .replace(/№1 Лідер категорії Шоколад/g, '№1 Лидер категории Шоколад')
    .replace(
      /Офіційний лідер рейтингу крафтового шоколаду України/g,
      'Официальный лидер рейтинга крафтового шоколада Украины'
    )
    .replace(
      /виготовляють преміальні шоколадні плитки ручної роботи/g,
      'изготавливают премиальные шоколадные плитки ручной работы'
    )
    .replace(
      /авторські корпусні та трюфельні цукерки/g,
      'авторские корпусные и трюфельные конфеты'
    )
    .replace(
      /реалістичні букети з шоколадних квітів та подарункові бокси зі 100% бельгійського шоколаду/g,
      'реалистичные букеты из шоколадных цветов и подарочные боксы из 100% бельгийского шоколада'
    )
    .replace(/Плитки \+ Цукерки \+ Квіти/g, 'Плитки + Конфеты + Цветы')
    .replace(/Плитка шоколаду, батончик/g, 'Плитка шоколада, батончик')
    .replace(/Плитка шоколаду • Батончик/g, 'Плитка шоколада • Батончик')
    .replace(/Цукерки ручної роботи/g, 'Конфеты ручной работы')
    .replace(/Шоколадні квіти і букети/g, 'Шоколадные цветы и букеты')
    .replace(/Без цукру/g, 'Без сахара')
    .replace(/Для дітей/g, 'Для детей')
    .replace(/Авторські торти/g, 'Авторские торты')
    .replace(/Крафтовий зефір/g, 'Крафтовый зефир')
    .replace(/Доставка Новою Поштою по всій Україні/g, 'Доставка Новой Почтой по всей Украине')
    .replace(/Харків/g, 'Харьков')
    .replace(/Київ/g, 'Киев')
    .replace(/Львів/g, 'Львов')
    .replace(/Дніпро/g, 'Днепр')
    .replace(/Одеса/g, 'Одесса')
    .replace(/Луцьк/g, 'Луцк')
    .replace(/Вінниця/g, 'Винница')
    .replace(/Рівне/g, 'Ровно')
    .replace(/Чернівці/g, 'Черновцы');
}

export default function ChocoRadarApp({
  initialSection = 'home',
  initialCategory = 'all',
  initialCity = 'all',
}: ChocoRadarAppProps) {
  const [lang, setLang] = useState<Lang>('uk');
  const [isDark, setIsDark] = useState(false);

  // Active Section ('home' | 'chocolate' | 'cakes' | 'zefir')
  const derivedInitialSection: MacroSectionId =
    initialSection !== 'home'
      ? initialSection
      : initialCategory === 'avtorski-torty-ta-deserty'
      ? 'cakes'
      : initialCategory === 'kraftovyi-zefir-ta-bukety'
      ? 'zefir'
      : initialCategory !== 'all'
      ? 'chocolate'
      : 'home';

  const [activeSection, setActiveSection] = useState<MacroSectionId>(derivedInitialSection);

  // Initial variant within the section
  const getInitialVariantId = (sec: MacroSectionId, cat: CategorySlug): string => {
    if (sec === 'cakes') return CAKE_VARIANTS[0].id;
    if (sec === 'zefir') return ZEFIR_VARIANTS[0].id;
    const found = CHOCOLATE_VARIANTS.find((v) => v.categorySlug === cat);
    return found ? found.id : CHOCOLATE_VARIANTS[0].id;
  };

  const [selectedVariantId, setSelectedVariantId] = useState<string>(() =>
    getInitialVariantId(derivedInitialSection, initialCategory)
  );

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>(
    initialCategory !== 'all'
      ? initialCategory
      : derivedInitialSection === 'cakes'
      ? 'avtorski-torty-ta-deserty'
      : derivedInitialSection === 'zefir'
      ? 'kraftovyi-zefir-ta-bukety'
      : 'plytky-shokoladu'
  );
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllMakers, setShowAllMakers] = useState<boolean>(false);

  // RIGHT SLIDE-OVER DRAWERS (Шторки справа — стандарт 2027)
  const [isAssortmentDrawerOpen, setIsAssortmentDrawerOpen] = useState<boolean>(false);
  const [drawerSectionTab, setDrawerSectionTab] = useState<Exclude<MacroSectionId, 'home'>>(
    derivedInitialSection === 'home' ? 'chocolate' : derivedInitialSection
  );
  const [isSommelierDrawerOpen, setIsSommelierDrawerOpen] = useState<boolean>(false);

  // Favorites & Modals
  const [favoriteMakerIds, setFavoriteMakerIds] = useState<string[]>(['crafo-kharkiv']);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [expandedMakerIds, setExpandedMakerIds] = useState<string[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Sommelier & Calculator inside the Right Drawer
  const [activeEngagementTab, setActiveEngagementTab] = useState<'quiz' | 'calculator'>('quiz');
  const [quizRecipient, setQuizRecipient] = useState<'her' | 'kids' | 'boss' | 'self'>('her');
  const [quizDiet, setQuizDiet] = useState<'classic' | 'sugarfree' | 'kids_safe'>('classic');
  const [quizFormat, setQuizFormat] = useState<'bars' | 'flowers' | 'candies' | 'cakes_zefir'>('flowers');
  const [guestsCount, setGuestsCount] = useState<number>(12);
  const [eventType, setEventType] = useState<'birthday' | 'wedding' | 'corporate' | 'kids'>('birthday');

  // Modals
  const [compareIds, setCompareIds] = useState<string[]>(['p-13', 'p-2', 'p-1']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [activeMakerModal, setActiveMakerModal] = useState<CraftMaker | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isAddMakerModalOpen, setIsAddMakerModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string>('PRO Майстерня');
  const [tenderSubmitted, setTenderSubmitted] = useState(false);
  const [makerSubmitted, setMakerSubmitted] = useState(false);

  // Macro Pillar counts
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

  // Current active variant object
  const currentVariantsList = useMemo(() => {
    if (activeSection === 'cakes') return CAKE_VARIANTS;
    if (activeSection === 'zefir') return ZEFIR_VARIANTS;
    return CHOCOLATE_VARIANTS;
  }, [activeSection]);

  const activeVariant: ProductVariantItem = useMemo(() => {
    return (
      currentVariantsList.find((v) => v.id === selectedVariantId) || currentVariantsList[0]
    );
  }, [currentVariantsList, selectedVariantId]);

  // Switch section helper
  const handleSelectSection = (sec: MacroSectionId) => {
    setActiveSection(sec);
    setShowAllMakers(false);
    if (sec === 'chocolate') {
      setSelectedVariantId(CHOCOLATE_VARIANTS[0].id);
      setSelectedCategory('plytky-shokoladu');
      setDrawerSectionTab('chocolate');
    } else if (sec === 'cakes') {
      setSelectedVariantId(CAKE_VARIANTS[0].id);
      setSelectedCategory('avtorski-torty-ta-deserty');
      setDrawerSectionTab('cakes');
    } else if (sec === 'zefir') {
      setSelectedVariantId(ZEFIR_VARIANTS[0].id);
      setSelectedCategory('kraftovyi-zefir-ta-bukety');
      setDrawerSectionTab('zefir');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Select specific product variant
  const handleSelectVariant = (variant: ProductVariantItem) => {
    setActiveSection(variant.section);
    setDrawerSectionTab(variant.section);
    setSelectedVariantId(variant.id);
    setSelectedCategory(variant.categorySlug);
    setShowAllMakers(false);
    setIsAssortmentDrawerOpen(false);
  };

  const toggleFavoriteMaker = (id: string) => {
    setFavoriteMakerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleMakerExpand = (id: string) => {
    setExpandedMakerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered & Ranked Makers for the active variant (Top 4 Main Producers first!)
  const filteredMakers = useMemo(() => {
    const targetCategory = activeVariant.categorySlug;
    const preferredIds = activeVariant.preferredMakerIds || [];

    return MAKERS.filter((m) => {
      if (onlyFavorites && !favoriteMakerIds.includes(m.id)) return false;
      if (!m.categories.includes(targetCategory)) return false;

      if (
        selectedCity !== 'all' &&
        m.regionCity !== selectedCity &&
        !m.city.toLowerCase().includes(selectedCity.split('•')[0].trim().toLowerCase())
      ) {
        return false;
      }

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
      // 1. Crafo.com.ua is ALWAYS #1 in chocolate categories
      if (activeSection === 'chocolate') {
        if (a.id === 'crafo-kharkiv') return -1;
        if (b.id === 'crafo-kharkiv') return 1;
      }
      // 2. Curated preferred makers for this specific product variant
      const aPrefIdx = preferredIds.indexOf(a.id);
      const bPrefIdx = preferredIds.indexOf(b.id);
      if (aPrefIdx !== -1 && bPrefIdx !== -1) return aPrefIdx - bPrefIdx;
      if (aPrefIdx !== -1) return -1;
      if (bPrefIdx !== -1) return 1;

      // 3. Makers with verified direct category links first
      const aHasDirect = !!getMakerCategoryUrl(a, targetCategory);
      const bHasDirect = !!getMakerCategoryUrl(b, targetCategory);
      if (aHasDirect && !bHasDirect) return -1;
      if (!aHasDirect && bHasDirect) return 1;

      return b.rating - a.rating;
    });
  }, [
    activeVariant,
    activeSection,
    onlyFavorites,
    favoriteMakerIds,
    selectedCity,
    searchQuery,
  ]);

  // Top 4 Flagship Makers for Home Page preview
  const homeTop4Makers = useMemo(() => {
    const ids = ['crafo-kharkiv', 'chebakery-kharkiv', 'piolli-zefir', 'sisters-a'];
    return ids
      .map((id) => MAKERS.find((m) => m.id === id))
      .filter((m): m is CraftMaker => !!m);
  }, []);

  // Interactive Sommelier Recommendations — NOW RETURNS TOP-4 MAIN PRODUCERS!
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
      .slice(0, 4);
  }, [quizDiet, quizFormat]);

  const calculatedWeightKg = useMemo(() => {
    const gramsPerGuest = eventType === 'wedding' ? 180 : eventType === 'kids' ? 150 : 160;
    return Math.max(1, Math.round(((guestsCount * gramsPerGuest) / 1000) * 10) / 10);
  }, [guestsCount, eventType]);

  const comparedProducts = useMemo(
    () => PRODUCTS.filter((p) => compareIds.includes(p.id)),
    [compareIds]
  );

  const getMakerHeaderStyle = (maker: CraftMaker) => {
    if (maker.segment === 'custom-cakes-pastry') {
      return {
        gradient: 'linear-gradient(135deg, #c75b7a 0%, #8e2f4a 100%)',
        emoji: '🎂',
        pill: lang === 'uk' ? 'Торти та десерти' : 'Торты и десерты',
      };
    }
    if (maker.segment === 'craft-zefir-pastila') {
      return {
        gradient: 'linear-gradient(135deg, #e0a866 0%, #b06a1e 100%)',
        emoji: '🌸',
        pill: lang === 'uk' ? 'Крафтовий зефір' : 'Крафтовый зефир',
      };
    }
    if (maker.segment === 'flowers-berries-nuts') {
      return {
        gradient: 'linear-gradient(135deg, #b53f61 0%, #5a182c 100%)',
        emoji: '🌹',
        pill: lang === 'uk' ? 'Квіти та ягоди в шоколаді' : 'Цветы и ягоды в шоколаде',
      };
    }
    if (maker.segment === 'healthy-vegan') {
      return {
        gradient: 'linear-gradient(135deg, #3c7a47 0%, #1d3f24 100%)',
        emoji: '🌿',
        pill: lang === 'uk' ? 'Без цукру • Для дітей' : 'Без сахара • Для детей',
      };
    }
    return {
      gradient: 'linear-gradient(135deg, #7a4a2b 0%, #3a2113 100%)',
      emoji: '🍫',
      pill: lang === 'uk' ? 'Плитка шоколаду, батончик' : 'Плитка шоколада, батончик',
    };
  };

  // Render Maker Card (Clean, high-conversion 2027 card)
  const renderMakerCard = (maker: CraftMaker, rankIndex?: number) => {
    const isExpanded = expandedMakerIds.includes(maker.id);
    const isLeader = maker.id === 'crafo-kharkiv';
    const isFav = favoriteMakerIds.includes(maker.id);
    const headerMeta = getMakerHeaderStyle(maker);

    const effectiveCategory =
      activeSection !== 'home' ? activeVariant.categorySlug : maker.mainCategory;
    const customVariantUrl = activeVariant.customDirectUrls?.[maker.id];
    const categoryDirectUrl = customVariantUrl || getMakerCategoryUrl(maker, effectiveCategory);
    const directDestinationUrl = categoryDirectUrl || maker.websiteUrl;

    const cleanDomain = directDestinationUrl
      .replace('https://www.', '')
      .replace('https://', '')
      .replace(/\/$/, '');

    const activeVariantShortName =
      activeSection !== 'home'
        ? lang === 'uk'
          ? activeVariant.titleUk
          : activeVariant.titleRu
        : lang === 'uk'
        ? CATEGORY_SHORT_LABELS[effectiveCategory]?.uk
        : CATEGORY_SHORT_LABELS[effectiveCategory]?.ru;

    return (
      <article
        key={maker.id}
        className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
          isLeader
            ? 'border-2 border-[#e39851] ring-2 ring-[#e39851]/30 shadow-lg'
            : 'border'
        } ${
          isDark
            ? 'bg-[#261b16] border-white/15 hover:border-[#f0a556]'
            : 'bg-[#fefbf7] border-[#e1d5c8] hover:border-[#b06a1e] shadow-sm'
        }`}
      >
        {/* Top Visual Showcase */}
        <div
          className="relative h-60 sm:h-68 overflow-hidden cursor-pointer group/img"
          style={{ background: headerMeta.gradient }}
          onClick={() => setActiveMakerModal(maker)}
        >
          {maker.imageUrl ? (
            <>
              <img
                src={maker.imageUrl}
                alt={maker.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-105 transition-all duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold shadow-lg border border-white/20">
                  <Maximize2 className="w-3.5 h-3.5 text-[#f0a556]" />
                  <span>{lang === 'uk' ? 'Роздивитися фото' : 'Рассмотреть фото'}</span>
                </span>
              </div>
            </>
          ) : (
            <span className="absolute -right-3 -top-4 select-none text-8xl opacity-30">
              {headerMeta.emoji}
            </span>
          )}

          {/* Top Left Rank & Leader Badge */}
          <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap items-center gap-1.5 pr-10">
            {rankIndex !== undefined && rankIndex < 4 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#302016]/90 backdrop-blur-md text-[#f0a556] border border-[#f0a556]/40 px-2.5 py-1 text-[11px] font-extrabold shadow-md">
                ТОП-{rankIndex + 1}
              </span>
            )}
            {isLeader ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e39851] to-[#b06a1e] px-3 py-1 text-[11px] font-extrabold text-[#26140b] shadow-md">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'uk' ? '№1 Лідер категорії' : '№1 Лидер категории'}</span>
              </span>
            ) : (
              <span className="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/20">
                {headerMeta.pill}
              </span>
            )}
            <span className="rounded-full bg-[#fff8ef] px-2 py-0.5 text-[11px] font-bold text-[#302016] shadow-sm">
              ★ {maker.rating}
            </span>
          </div>

          {/* Top Right Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteMaker(maker.id);
            }}
            aria-label="Обране"
            className={`absolute right-3 top-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition ${
              isFav
                ? 'bg-[#c75b7a] text-white shadow-md'
                : 'bg-black/35 text-white/85 hover:bg-black/55'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
          </button>

          {/* Bottom Left Verified Badge */}
          <div className="absolute bottom-3 left-3.5 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-[#302016] shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'uk' ? 'Перевірений виробник' : 'Проверенный производитель'}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold leading-snug">
              <a
                href={directDestinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#b06a1e] transition"
              >
                {localizeText(maker.name, lang)}
              </a>
            </h3>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                isDark ? 'text-[#a79d91]' : 'text-[#715f53]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#b06a1e] shrink-0" />
              <span>{localizeText(maker.city, lang)}</span>
            </p>
          </div>

          <p
            className={`line-clamp-2 text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
            }`}
          >
            {localizeText(maker.description || maker.specialty, lang)}
          </p>

          {/* Phone & Contact Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs font-bold">
            {maker.phone && !maker.phone.startsWith('Замовлення') ? (
              <a
                href={`tel:${maker.phone.split(',')[0].replace(/[^\d+]/g, '')}`}
                className={`flex items-center gap-1.5 hover:text-[#b06a1e] ${
                  isDark ? 'text-[#eee7dd]' : 'text-[#302016]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#b06a1e] shrink-0" />
                <span>{maker.phone.split(',')[0]}</span>
              </a>
            ) : (
              <div className="flex items-center gap-1.5 text-[#b06a1e]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'uk' ? 'Доставка по Україні' : 'Доставка по Украине'}</span>
              </div>
            )}
          </div>

          {isExpanded && (
            <div
              className={`pt-3 mt-1 border-t space-y-2 text-xs ${
                isDark ? 'border-white/10 text-[#eee7dd]' : 'border-[#e1d5c8] text-[#302016]'
              }`}
            >
              <p className="leading-relaxed">{localizeText(maker.description, lang)}</p>
              <div
                className={`rounded-xl p-3 space-y-1 ${
                  isDark ? 'bg-[#1a120e]' : 'bg-[#f1e6da]/70'
                }`}
              >
                <div>
                  <strong>{lang === 'uk' ? 'Телефон:' : 'Телефон:'}</strong> {maker.phone}
                </div>
                {maker.address && (
                  <div>
                    <strong>{lang === 'uk' ? 'Адреса:' : 'Адрес:'}</strong>{' '}
                    {localizeText(maker.address, lang)}
                  </div>
                )}
                <div>
                  <strong>{lang === 'uk' ? 'Доставка:' : 'Доставка:'}</strong>{' '}
                  {localizeText(maker.shippingNote, lang)}
                </div>
              </div>
            </div>
          )}

          {/* Direct Action Button — Immediately takes buyer to the selected product page */}
          <div className="mt-auto flex items-center gap-2 pt-2">
            <a
              href={directDestinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs sm:text-sm font-extrabold transition shadow-sm ${
                isLeader
                  ? 'bg-gradient-to-r from-[#e39851] to-[#b06a1e] text-[#26140b] hover:brightness-105'
                  : isDark
                  ? 'bg-[#f0a556] text-[#26160e] hover:bg-[#e39851]'
                  : 'bg-[#462b1f] text-[#faf4eb] hover:bg-[#b06a1e]'
              }`}
            >
              <span className="truncate">
                {cleanDomain.includes('instagram.com')
                  ? 'Instagram'
                  : categoryDirectUrl
                  ? lang === 'uk'
                    ? `Перейти: ${activeVariantShortName}`
                    : `Перейти: ${activeVariantShortName}`
                  : lang === 'uk'
                  ? 'Перейти у каталог'
                  : 'Перейти в каталог'}
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>

            <button
              onClick={() => toggleMakerExpand(maker.id)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-2.5 text-xs font-bold border transition shrink-0 ${
                isDark
                  ? 'border-white/15 text-[#f0a556] hover:bg-white/10'
                  : 'border-[#d4c3b3] text-[#462b1f] hover:bg-[#f1e6da]'
              }`}
            >
              <span>{isExpanded ? (lang === 'uk' ? 'Згорнути' : 'Свернуть') : 'Інфо'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col pb-20 sm:pb-0 transition-colors duration-200 ${
        isDark ? 'bg-[#1a120e] text-[#eee7dd]' : 'bg-[#fbf6ee] text-[#302016]'
      }`}
    >
      {/* STICKY HEADER */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl ${
          isDark ? 'border-white/15 bg-[#1a120e]/95' : 'border-[#e1d5c8] bg-[#fbf6ee]/95'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2 text-left outline-none shrink-0"
          >
            <span className="grid w-9 h-9 sm:w-10 sm:h-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-lg">
              🍫
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight">
                Crafo<span className="text-[#b06a1e]">Hub</span>
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-medium ${
                  isDark ? 'text-[#a79d91]' : 'text-[#715f53]'
                }`}
              >
                crafohub.com.ua
              </span>
            </span>
          </Link>

          {/* Desktop Section Links */}
          <nav className="ml-3 hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              onClick={() => setActiveSection('home')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'home'
                  ? 'bg-[#462b1f] text-[#faf4eb] shadow-xs'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🏠 {lang === 'uk' ? 'Головна' : 'Главная'}
            </Link>
            <Link
              href="/shokolad"
              onClick={() => handleSelectSection('chocolate')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'chocolate'
                  ? 'bg-[#462b1f] text-[#faf4eb] shadow-xs'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🍫 {lang === 'uk' ? 'Шоколад і цукерки' : 'Шоколад и конфеты'}
            </Link>
            <Link
              href="/torty"
              onClick={() => handleSelectSection('cakes')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'cakes'
                  ? 'bg-[#8e2f4a] text-white shadow-xs'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#8e2f4a]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🎂 {lang === 'uk' ? 'Торти і десерти' : 'Торты и десерты'}
            </Link>
            <Link
              href="/zefir"
              onClick={() => handleSelectSection('zefir')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'zefir'
                  ? 'bg-[#b06a1e] text-white shadow-xs'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#b06a1e]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🌸 {lang === 'uk' ? 'Крафтовий зефір' : 'Крафтовый зефир'}
            </Link>
          </nav>

          {/* Right Header Triggers: Assortment Drawer, Sommelier Drawer, Lang Switcher */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Button 1: Open Right Assortment Drawer */}
            <button
              onClick={() => {
                if (activeSection !== 'home') setDrawerSectionTab(activeSection);
                setIsAssortmentDrawerOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold border transition shadow-xs ${
                isDark
                  ? 'bg-[#362820] border-[#e39851]/50 text-[#f0a556] hover:bg-[#462b1f]'
                  : 'bg-[#fff8ef] border-[#b06a1e]/40 text-[#462b1f] hover:bg-[#f1e6da]'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5 text-[#b06a1e]" />
              <span className="hidden sm:inline">
                {lang === 'uk' ? 'Асортимент' : 'Ассортимент'}
              </span>
            </button>

            {/* Button 2: Open Right Sommelier Drawer */}
            <button
              onClick={() => setIsSommelierDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 px-3 py-1.5 text-xs font-extrabold text-white shadow-xs transition"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'uk' ? 'Сомельє' : 'Сомелье'}
              </span>
            </button>

            {/* Language Switcher Pill (УКР | РУС) */}
            <div
              className={`inline-flex items-center rounded-full p-0.5 border text-[11px] font-extrabold ${
                isDark ? 'bg-[#362820] border-white/20' : 'bg-[#f1e6da] border-[#d4c3b3]'
              }`}
            >
              <button
                onClick={() => setLang('uk')}
                className={`rounded-full px-2 py-1 transition ${
                  lang === 'uk'
                    ? 'bg-[#462b1f] text-[#faf4eb]'
                    : 'text-[#715f53] hover:text-[#302016]'
                }`}
              >
                УКР
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`rounded-full px-2 py-1 transition ${
                  lang === 'ru'
                    ? 'bg-[#462b1f] text-[#faf4eb]'
                    : 'text-[#715f53] hover:text-[#302016]'
                }`}
              >
                РУС
              </button>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Тема"
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${
                isDark
                  ? 'border-white/20 bg-[#362820] text-[#f0a556]'
                  : 'border-[#e1d5c8] bg-[#f1e6da] text-[#462b1f]'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN CONTENT: STEP-BY-STEP 2027 ARCHITECTURE
          1) IF activeSection === 'home' -> Clean 3-Section Gateway Page
          2) IF activeSection !== 'home' -> Dedicated Section Page + Top 4 Makers
      ===================================================================== */}
      <main className="flex-1">
        {activeSection === 'home' ? (
          /* =================================================================
             STEP 1: HOME PAGE — CLEAN, EASY-TO-UNDERSTAND 3-SECTION GATEWAY
          ================================================================= */
          <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 space-y-10">
            {/* Clean Hero Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b06a1e]/40 bg-[#e39851]/20 px-3.5 py-1 text-xs font-extrabold text-[#8c4f12] dark:text-[#f0a556]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'uk'
                    ? 'CrafoHub 2027 • Найкращі крафтові солодощі України'
                    : 'CrafoHub 2027 • Лучшие крафтовые сладости Украины'}
                </span>
              </span>

              <h1 className="font-serif text-2xl sm:text-5xl font-bold leading-tight tracking-tight">
                {lang === 'uk' ? 'Оберіть розділ солодощів' : 'Выберите раздел сладостей'}
              </h1>

              <p
                className={`text-xs sm:text-base max-w-xl mx-auto leading-relaxed ${
                  isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                }`}
              >
                {lang === 'uk'
                  ? 'Натисніть на потрібний розділ — ми покажемо види продукції та 4 основних перевірених виробники з прямим переходом до товарів.'
                  : 'Нажмите на нужный раздел — мы покажем виды продукции и 4 основных проверенных производителя с прямым переходом к товарам.'}
              </p>

              {/* Quick Drawer Triggers Bar (Assortment Drawer & Sommelier Drawer) */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => {
                    setDrawerSectionTab('chocolate');
                    setIsAssortmentDrawerOpen(true);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-xs sm:text-sm font-extrabold transition shadow-sm ${
                    isDark
                      ? 'bg-[#261b16] border-[#e39851] text-[#f0a556] hover:bg-[#362820]'
                      : 'bg-white border-[#462b1f] text-[#302016] hover:bg-[#f1e6da]'
                  }`}
                >
                  <LayoutList className="w-4 h-4 text-[#b06a1e]" />
                  <span>
                    {lang === 'uk'
                      ? '📋 Весь асортимент продукції (Шторка)'
                      : '📋 Весь ассортимент продукции (Шторка)'}
                  </span>
                </button>

                <button
                  onClick={() => setIsSommelierDrawerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md transition"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>
                    {lang === 'uk'
                      ? '🪄 Підібрати з Сомельє (Шторка)'
                      : '🪄 Подобрать с Сомелье (Шторка)'}
                  </span>
                </button>
              </div>
            </div>

            {/* 3 LARGE VISUAL SECTION CARDS (Шоколад / Торти / Зефір) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* CARD 1: CHOCOLATE */}
              <Link
                href="/shokolad"
                onClick={() => handleSelectSection('chocolate')}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                  isDark
                    ? 'bg-[#261b16] border-[#e39851]/60 hover:border-[#f0a556]'
                    : 'bg-[#fefbf7] border-[#d4b08c] hover:border-[#b06a1e] shadow-md'
                }`}
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#3a2113]">
                  <img
                    src="/images/crafo-collage.jpg"
                    alt="Шоколад та цукерки"
                    className="w-full h-full object-cover object-center brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e39851] px-3 py-1 text-xs font-extrabold text-[#26140b] shadow-md">
                      🍫 {chocolateMakersCount} {lang === 'uk' ? 'майстерень' : 'мастерских'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#f5c492]">
                      {lang === 'uk' ? 'Розділ 1' : 'Раздел 1'}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-0.5">
                      {lang === 'uk' ? 'Шоколад та цукерки' : 'Шоколад и конфеты'}
                    </h2>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                      }`}
                    >
                      {lang === 'uk'
                        ? 'Авторські плитки шоколаду, батончики, корпусні цукерки ручної роботи, шоколадні квіти і букети, малина в шоколаді, вироби без цукру та для дітей.'
                        : 'Авторские плитки шоколада, батончики, корпусные конфеты ручной работы, шоколадные цветы и букеты, малина в шоколаде, изделия без сахара и для детей.'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        lang === 'uk' ? '🍫 Плитки і батончики' : '🍫 Плитки и батончики',
                        lang === 'uk' ? '🍬 Цукерки' : '🍬 Конфеты',
                        lang === 'uk' ? '🌹 Шоколадні квіти' : '🌹 Шоколадные цветы',
                        lang === 'uk' ? '🍓 Ягоди і горіхи' : '🍓 Ягоды и орехи',
                      ].map((tag, i) => (
                        <span
                          key={i}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            isDark ? 'bg-[#362820] text-[#eee7dd]' : 'bg-[#f1e6da] text-[#3e281b]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gradient-to-r from-[#462b1f] to-[#3a2113] group-hover:from-[#b06a1e] group-hover:to-[#8c4f12] text-white font-extrabold py-3.5 px-5 text-sm flex items-center justify-center gap-2 shadow-md transition">
                    <span>
                      {lang === 'uk'
                        ? 'Обрати шоколад (Види та ТОП-4)'
                        : 'Выбрать шоколад (Виды и ТОП-4)'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* CARD 2: CAKES */}
              <Link
                href="/torty"
                onClick={() => handleSelectSection('cakes')}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                  isDark
                    ? 'bg-[#261b16] border-[#c75b7a]/50 hover:border-[#c75b7a]'
                    : 'bg-[#fefbf7] border-[#e2bec8] hover:border-[#c75b7a] shadow-md'
                }`}
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#5a182c]">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
                    alt="Авторські торти та десерти"
                    className="w-full h-full object-cover object-center brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c75b7a] px-3 py-1 text-xs font-extrabold text-white shadow-md">
                      🎂 {cakeMakersCount} {lang === 'uk' ? 'кондитерських' : 'кондитерских'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-pink-200">
                      {lang === 'uk' ? 'Розділ 2' : 'Раздел 2'}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-0.5">
                      {lang === 'uk' ? 'Торти та десерти' : 'Торты и десерты'}
                    </h2>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                      }`}
                    >
                      {lang === 'uk'
                        ? 'Святкові та мусові торти у шоколадному велюрі, трендові бенто-торти з вашим написом, дитячі, весільні торти, французькі макарони та еклери.'
                        : 'Праздничные и муссовые торты в шоколадном велюре, трендовые бенто-торты с вашей надписью, детские, свадебные торты, французские макароны и эклеры.'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        lang === 'uk' ? '🎂 Святкові торти' : '🎂 Праздничные торты',
                        lang === 'uk' ? '🍱 Бенто-торти' : '🍱 Бенто-торты',
                        lang === 'uk' ? '🧸 Дитячі торти' : '🧸 Детские торты',
                        lang === 'uk' ? '🧁 Макарони і тістечка' : '🧁 Макароны и пирожные',
                      ].map((tag, i) => (
                        <span
                          key={i}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            isDark ? 'bg-[#362820] text-[#eee7dd]' : 'bg-[#f1e6da] text-[#3e281b]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gradient-to-r from-[#c75b7a] to-[#8e2f4a] group-hover:brightness-110 text-white font-extrabold py-3.5 px-5 text-sm flex items-center justify-center gap-2 shadow-md transition">
                    <span>
                      {lang === 'uk'
                        ? 'Обрати торти (Види та ТОП-4)'
                        : 'Выбрать торты (Виды и ТОП-4)'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* CARD 3: ZEFIR */}
              <Link
                href="/zefir"
                onClick={() => handleSelectSection('zefir')}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                  isDark
                    ? 'bg-[#261b16] border-[#e0a866]/50 hover:border-[#e0a866]'
                    : 'bg-[#fefbf7] border-[#e6ccb2] hover:border-[#b06a1e] shadow-md'
                }`}
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#7a4a2b]">
                  <img
                    src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
                    alt="Крафтовий зефір та букети"
                    className="w-full h-full object-cover object-center brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0a866] px-3 py-1 text-xs font-extrabold text-[#26140b] shadow-md">
                      🌸 {zefirMakersCount} {lang === 'uk' ? 'майстерень' : 'мастерских'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-amber-200">
                      {lang === 'uk' ? 'Розділ 3' : 'Раздел 3'}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-0.5">
                      {lang === 'uk' ? 'Зефір та букети' : 'Зефир и букеты'}
                    </h2>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                      }`}
                    >
                      {lang === 'uk'
                        ? 'Їстівні букети з реалістичних зефірних півоній і троянд, натуральний ягідний зефір на агар-агарі, зефір у бельгійському шоколаді та пастила.'
                        : 'Съедобные букеты из реалистичных зефирных пионов и роз, натуральный ягодный зефир на агар-агаре, зефир в бельгийском шоколаде и пастила.'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        lang === 'uk' ? '💐 Зефірні букети' : '💐 Зефирные букеты',
                        lang === 'uk' ? '🌸 Ягідний зефір' : '🌸 Ягодный зефир',
                        lang === 'uk' ? '🍫 Зефір у шоколаді' : '🍫 Зефир в шоколаде',
                        lang === 'uk' ? '🌿 Натуральна пастила' : '🌿 Натуральная пастила',
                      ].map((tag, i) => (
                        <span
                          key={i}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            isDark ? 'bg-[#362820] text-[#eee7dd]' : 'bg-[#f1e6da] text-[#3e281b]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] group-hover:brightness-110 text-white font-extrabold py-3.5 px-5 text-sm flex items-center justify-center gap-2 shadow-md transition">
                    <span>
                      {lang === 'uk'
                        ? 'Обрати зефір (Види та ТОП-4)'
                        : 'Выбрать зефир (Виды и ТОП-4)'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>

            {/* FLAGSHIP TOP-4 SHOWCASE ON HOME */}
            <section className="space-y-5 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e1d5c8] pb-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
                    {lang === 'uk'
                      ? '🏆 Еталон якості CrafoHub 2027'
                      : '🏆 Эталон качества CrafoHub 2027'}
                  </span>
                  <h2 className="font-serif text-xl sm:text-3xl font-bold mt-0.5">
                    {lang === 'uk'
                      ? '4 головні флагмани платформи'
                      : '4 главных флагмана платформы'}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/shokolad"
                    onClick={() => handleSelectSection('chocolate')}
                    className="rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] text-[#302016] px-4 py-2 text-xs font-extrabold transition"
                  >
                    🍫 {lang === 'uk' ? 'Усі види шоколаду →' : 'Все виды шоколада →'}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {homeTop4Makers.map((maker, idx) => renderMakerCard(maker, idx))}
              </div>
            </section>
          </div>
        ) : (
          /* =================================================================
             STEP 2: DEDICATED SECTION PAGE (/shokolad, /torty, /zefir)
             - Variant Selector Cards
             - Right Drawer Triggers (Assortment & Sommelier)
             - TOP-4 MAIN PRODUCERS for the chosen product!
          ================================================================= */
          <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 space-y-8">
            {/* Top Navigation Bar & Right Drawer Triggers */}
            <div
              className={`rounded-3xl border p-4 sm:p-6 shadow-xs space-y-4 ${
                isDark ? 'bg-[#261b16] border-white/15' : 'bg-[#fefbf7] border-[#e1d5c8]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Back to Home & Section Switcher */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/"
                    onClick={() => setActiveSection('home')}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold border transition ${
                      isDark
                        ? 'bg-[#362820] border-white/15 text-[#eee7dd] hover:bg-[#462b1f]'
                        : 'bg-[#f1e6da] border-[#d4c3b3] text-[#302016] hover:bg-[#e5d5c3]'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{lang === 'uk' ? 'На головну' : 'На главную'}</span>
                  </Link>

                  <div className="flex items-center gap-1 rounded-full p-1 bg-[#f1e6da] dark:bg-[#1a120e]">
                    <Link
                      href="/shokolad"
                      onClick={() => handleSelectSection('chocolate')}
                      className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                        activeSection === 'chocolate'
                          ? 'bg-[#462b1f] text-white shadow-xs'
                          : 'text-[#5a4638] hover:text-[#302016]'
                      }`}
                    >
                      🍫 {lang === 'uk' ? 'Шоколад' : 'Шоколад'}
                    </Link>
                    <Link
                      href="/torty"
                      onClick={() => handleSelectSection('cakes')}
                      className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                        activeSection === 'cakes'
                          ? 'bg-[#c75b7a] text-white shadow-xs'
                          : 'text-[#5a4638] hover:text-[#302016]'
                      }`}
                    >
                      🎂 {lang === 'uk' ? 'Торти' : 'Торты'}
                    </Link>
                    <Link
                      href="/zefir"
                      onClick={() => handleSelectSection('zefir')}
                      className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                        activeSection === 'zefir'
                          ? 'bg-[#b06a1e] text-white shadow-xs'
                          : 'text-[#5a4638] hover:text-[#302016]'
                      }`}
                    >
                      🌸 {lang === 'uk' ? 'Зефір' : 'Зефир'}
                    </Link>
                  </div>
                </div>

                {/* Right Slide-Over Drawer Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setDrawerSectionTab(activeSection);
                      setIsAssortmentDrawerOpen(true);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-extrabold transition shadow-xs ${
                      isDark
                        ? 'bg-[#362820] border-[#e39851] text-[#f0a556]'
                        : 'bg-white border-[#462b1f] text-[#302016] hover:bg-[#f1e6da]'
                    }`}
                  >
                    <LayoutList className="w-4 h-4 text-[#b06a1e]" />
                    <span>
                      {lang === 'uk'
                        ? '📋 Асортимент продукції (Шторка справа)'
                        : '📋 Ассортимент продукции (Шторка справа)'}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsSommelierDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>
                      {lang === 'uk'
                        ? '🪄 Підбір з Сомельє (Шторка справа)'
                        : '🪄 Подбор с Сомелье (Шторка справа)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Section Title & Step 1 Instruction */}
              <div className="pt-2 border-t border-[#e1d5c8]/60">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
                  {activeSection === 'chocolate'
                    ? lang === 'uk'
                      ? '🍫 Розділ: Крафтовий шоколад та цукерки'
                      : '🍫 Раздел: Крафтовый шоколад и конфеты'
                    : activeSection === 'cakes'
                    ? lang === 'uk'
                      ? '🎂 Розділ: Авторські торти та десерти на замовлення'
                      : '🎂 Раздел: Авторские торты и десерты на заказ'
                    : lang === 'uk'
                    ? '🌸 Розділ: Крафтовий зефір, зефірні букети та пастила'
                    : '🌸 Раздел: Крафтовый зефир, зефирные букеты и пастила'}
                </div>
                <h1 className="font-serif text-xl sm:text-3xl font-bold mt-1">
                  {lang === 'uk'
                    ? 'Крок 1. Оберіть потрібний варіант продукту:'
                    : 'Шаг 1. Выберите нужный вариант продукта:'}
                </h1>
              </div>

              {/* PRODUCT VARIANT CARDS FOR THIS SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {currentVariantsList.map((variant) => {
                  const isSelected = activeVariant.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleSelectVariant(variant)}
                      className={`group text-left rounded-2xl border-2 p-3 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#462b1f] to-[#2e190d] text-white border-[#e39851] shadow-md ring-2 ring-[#e39851]/30'
                          : isDark
                          ? 'bg-[#1a120e] border-white/15 text-[#eee7dd] hover:border-[#f0a556]'
                          : 'bg-white border-[#e1d5c8] text-[#302016] hover:border-[#b06a1e] hover:bg-[#fbf6ee]'
                      }`}
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 bg-[#3a2113]">
                        <img
                          src={variant.imageUrl}
                          alt={lang === 'uk' ? variant.titleUk : variant.titleRu}
                          className="w-full h-full object-cover object-center"
                        />
                        <span className="absolute bottom-0.5 right-0.5 text-sm bg-black/50 backdrop-blur-xs rounded-md px-1">
                          {variant.emoji}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm leading-tight">
                          {lang === 'uk' ? variant.titleUk : variant.titleRu}
                        </div>
                        <p
                          className={`text-[11px] line-clamp-2 mt-1 leading-snug ${
                            isSelected ? 'text-[#f5c492]' : 'opacity-75'
                          }`}
                        >
                          {lang === 'uk' ? variant.shortDescUk : variant.shortDescRu}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Variant Quick Summary + City Filter */}
              <div
                className={`rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-[#1a120e]' : 'bg-[#f1e6da]/75'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl shrink-0">{activeVariant.emoji}</span>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold">
                      {lang === 'uk' ? activeVariant.titleUk : activeVariant.titleRu}
                    </div>
                    <p className="text-xs opacity-85 mt-0.5">
                      {lang === 'uk'
                        ? activeVariant.detailedAssortmentUk
                        : activeVariant.detailedAssortmentRu}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDrawerSectionTab(activeSection);
                    setIsAssortmentDrawerOpen(true);
                  }}
                  className="shrink-0 rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-3.5 py-2 text-xs font-bold transition self-start sm:self-center"
                >
                  {lang === 'uk' ? 'Склад і опис у шторці →' : 'Состав и описание в шторке →'}
                </button>
              </div>

              {/* Optional City Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                <span className="text-xs font-bold text-[#b06a1e] shrink-0 flex items-center gap-1 mr-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Місто:' : 'Город:'}</span>
                </span>
                {CITY_FILTERS.map((city) => {
                  const active = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition ${
                        active
                          ? 'bg-[#462b1f] text-[#faf4eb] shadow-xs'
                          : isDark
                          ? 'bg-[#362820] text-[#eee7dd]'
                          : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e3d2c0]'
                      }`}
                    >
                      {lang === 'uk' ? city.uk : city.ru}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===============================================================
                STEP 2 OUTPUT: 4 MAIN PRODUCERS (ТОП-4 ОСНОВНИХ ВИРОБНИКИ)
            =============================================================== */}
            <section id="makers-section" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e1d5c8] pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
                    <Crown className="w-4 h-4" />
                    <span>
                      {lang === 'uk'
                        ? 'Крок 2. Рекомендовані лідери напрямку'
                        : 'Шаг 2. Рекомендованные лидеры направления'}
                    </span>
                  </span>
                  <h2 className="mt-1 font-serif text-xl sm:text-3xl font-bold">
                    {lang === 'uk'
                      ? `4 основних виробники: «${activeVariant.titleUk}»`
                      : `4 основных производителя: «${activeVariant.titleRu}»`}
                    {selectedCity !== 'all' ? ` (${localizeText(selectedCity, lang)})` : ''}
                  </h2>
                  <p className="text-xs sm:text-sm opacity-80 mt-1">
                    {lang === 'uk'
                      ? 'Натисніть кнопку на картці майстра, щоб перейти одразу на сторінку обраного продукту на сайті виробника.'
                      : 'Нажмите кнопку на карточке мастера, чтобы перейти сразу на страницу выбранного продукта на сайте производителя.'}
                  </p>
                </div>
              </div>

              {filteredMakers.length === 0 ? (
                <div className="rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-8 text-center space-y-3">
                  <p className="text-base font-bold text-[#302016]">
                    {lang === 'uk'
                      ? 'У вибраному місті майстерень цієї рубрики не знайдено'
                      : 'В выбранном городе мастерских этой рубрики не найдено'}
                  </p>
                  <button
                    onClick={() => setSelectedCity('all')}
                    className="rounded-full bg-[#462b1f] px-5 py-2.5 text-xs font-bold text-white"
                  >
                    {lang === 'uk'
                      ? 'Показати ТОП-4 виробники з доставкою по всій Україні'
                      : 'Показать ТОП-4 производителя с доставкой по всей Украине'}
                  </button>
                </div>
              ) : (
                <>
                  {/* THE TOP 4 MAIN PRODUCERS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredMakers.slice(0, 4).map((maker, idx) => renderMakerCard(maker, idx))}
                  </div>

                  {/* Optional Expand Button for Remaining Producers */}
                  {filteredMakers.length > 4 && (
                    <div className="pt-4">
                      {!showAllMakers ? (
                        <div className="text-center">
                          <button
                            onClick={() => setShowAllMakers(true)}
                            className={`inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-xs sm:text-sm font-extrabold transition ${
                              isDark
                                ? 'bg-[#261b16] border-white/20 text-[#eee7dd] hover:border-[#f0a556]'
                                : 'bg-white border-[#462b1f] text-[#302016] hover:bg-[#f1e6da]'
                            }`}
                          >
                            <span>
                              {lang === 'uk'
                                ? `Показати ще виробників у цій рубриці (+${filteredMakers.length - 4})`
                                : `Показать еще производителей в этой рубрике (+${filteredMakers.length - 4})`}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5 pt-4 border-t border-[#e1d5c8]">
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-lg sm:text-xl font-bold">
                              {lang === 'uk'
                                ? `Інші перевірені майстерні рубрики (${filteredMakers.length - 4})`
                                : `Другие проверенные мастерские рубрики (${filteredMakers.length - 4})`}
                            </h3>
                            <button
                              onClick={() => setShowAllMakers(false)}
                              className="text-xs font-bold text-[#b06a1e] hover:underline flex items-center gap-1"
                            >
                              <span>
                                {lang === 'uk'
                                  ? 'Залишити тільки ТОП-4 основних'
                                  : 'Оставить только ТОП-4 основных'}
                              </span>
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredMakers
                              .slice(4)
                              .map((maker, idx) => renderMakerCard(maker, idx + 4))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* SHARED BOTTOM SECTIONS: BLOG & FAQ */}
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 space-y-10">
          {/* EXPERT BLOG & SEO LINKS */}
          <section
            id="blog-seo-section"
            className={`rounded-3xl border p-5 sm:p-8 shadow-sm ${
              isDark
                ? 'bg-gradient-to-br from-[#261b16] to-[#1a120e] border-white/15'
                : 'bg-gradient-to-br from-[#fefbf7] to-[#f1e6da]/60 border-[#d9c8b8]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b06a1e]/15 px-3 py-1 text-[11px] font-extrabold text-[#b06a1e] mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'uk'
                      ? 'Експертний Блог CrafoHub • Гід покупця'
                      : 'Экспертный Блог CrafoHub • Гид покупателя'}
                  </span>
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {lang === 'uk'
                    ? 'Як обрати справжній крафтовий шоколад, букет або торт'
                    : 'Как выбрать настоящий крафтовый шоколад, букет или торт'}
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#462b1f] hover:bg-[#5c3929] px-5 py-2.5 text-xs font-extrabold text-[#faf4eb] shadow-sm transition shrink-0"
              >
                <span>{lang === 'uk' ? 'Усі статті блогу' : 'Все статьи блога'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {BLOG_ARTICLES.slice(0, 2).map((article) => (
                <article
                  key={article.slug}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-lg ${
                    isDark ? 'bg-[#211713] border-white/15' : 'bg-white border-[#e1d5c8]'
                  }`}
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="relative h-52 sm:h-60 w-full overflow-hidden block bg-[#f3e9dc]"
                  >
                    <img
                      src={article.heroImage}
                      alt={lang === 'uk' ? article.titleUk : article.titleRu}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="font-serif text-base sm:text-lg font-bold leading-snug group-hover:text-[#b06a1e] transition">
                        {lang === 'uk' ? article.titleUk : article.titleRu}
                      </h3>
                    </Link>
                    <p className="text-xs opacity-80 line-clamp-2">
                      {lang === 'uk' ? article.excerptUk : article.excerptRu}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#b06a1e]" />
              <h2 className="font-serif text-lg sm:text-2xl font-bold">
                {lang === 'uk' ? 'Часті запитання покупців' : 'Частые вопросы покупателей'}
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  qUk: 'Як працює підбір 4 основних виробників на CrafoHub?',
                  qRu: 'Как работает подбор 4 основных производителей на CrafoHub?',
                  aUk: 'Ви обираєте розділ (Шоколад, Торти або Зефір) і потрібний вид продукту. Система миттєво показує ТОП-4 перевірених виробників із прямими посиланнями саме у вибраний розділ на їхньому сайті.',
                  aRu: 'Вы выбираете раздел (Шоколад, Торты или Зефир) и нужный вид продукта. Система мгновенно показывает ТОП-4 проверенных производителей с прямыми ссылками именно в выбранный раздел на их сайте.',
                },
                {
                  qUk: 'Де подивитися детальний опис асортименту та скористатися Сомельє?',
                  qRu: 'Где посмотреть детальное описание ассортимента и воспользоваться Сомелье?',
                  aUk: 'Натисніть кнопку «Асортимент» або «Сомельє» у верхній панелі чи внизу екрана смартфона — праворуч плавно виїде зручна шторка з повним описом усіх видів продукції або інтерактивним помічником вибору.',
                  aRu: 'Нажмите кнопку «Ассортимент» или «Сомелье» в верхней панели или внизу экрана смартфона — справа плавно выедет удобная шторка с полным описанием всех видов продукции или интерактивным помощником выбора.',
                },
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition ${
                      isDark ? 'bg-[#261b16] border-white/15' : 'bg-[#fefbf7] border-[#e1d5c8]'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm"
                    >
                      <span>{lang === 'uk' ? faq.qUk : faq.qRu}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#b06a1e] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#b06a1e] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm opacity-85 leading-relaxed border-t border-[#e1d5c8]/50 pt-3">
                        {lang === 'uk' ? faq.aUk : faq.aRu}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`border-t py-8 px-4 sm:px-6 ${
          isDark
            ? 'bg-[#140d0a] border-white/10 text-[#a79d91]'
            : 'bg-[#f1e6da] border-[#e1d5c8] text-[#5a4638]'
        }`}
      >
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div>
            <strong className={isDark ? 'text-white' : 'text-[#302016]'}>
              CrafoHub Україна (crafohub.com.ua • 2027)
            </strong>{' '}
            —{' '}
            {lang === 'uk'
              ? 'Шоколад • Авторські торти • Крафтовий зефір'
              : 'Шоколад • Авторские торты • Крафтовый зефир'}
          </div>
          <div className="flex flex-wrap justify-center gap-4 font-bold">
            <Link href="/shokolad" onClick={() => handleSelectSection('chocolate')} className="hover:text-[#b06a1e]">
              🍫 {lang === 'uk' ? 'Шоколад' : 'Шоколад'}
            </Link>
            <Link href="/torty" onClick={() => handleSelectSection('cakes')} className="hover:text-[#b06a1e]">
              🎂 {lang === 'uk' ? 'Торти' : 'Торты'}
            </Link>
            <Link href="/zefir" onClick={() => handleSelectSection('zefir')} className="hover:text-[#b06a1e]">
              🌸 {lang === 'uk' ? 'Зефір' : 'Зефир'}
            </Link>
            <button
              onClick={() => {
                setSelectedPlanForModal('PRO або Безкоштовний');
                setIsAddMakerModalOpen(true);
              }}
              className="hover:text-[#b06a1e]"
            >
              + {lang === 'uk' ? 'Додати майстерню' : 'Добавить мастерскую'}
            </button>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          STICKY MOBILE BOTTOM NAVIGATION BAR (2027 Intuitive 4-Button Bar)
      ===================================================================== */}
      <nav
        aria-label="Мобільна навігація"
        className={`sm:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 grid grid-cols-4 gap-1 ${
          isDark
            ? 'bg-[#1a120e]/95 border-white/15 text-[#eee7dd]'
            : 'bg-[#fefbf7]/95 border-[#d9c8b8] text-[#302016]'
        }`}
      >
        <Link
          href="/"
          onClick={() => setActiveSection('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-extrabold ${
            activeSection === 'home' ? 'text-[#b06a1e] bg-[#b06a1e]/10' : ''
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Розділи' : 'Разделы'}</span>
        </Link>

        <button
          onClick={() => {
            if (activeSection !== 'home') setDrawerSectionTab(activeSection);
            setIsAssortmentDrawerOpen(true);
          }}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-extrabold"
        >
          <LayoutList className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Асортимент' : 'Ассортимент'}</span>
        </button>

        <button
          onClick={() => setIsSommelierDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-extrabold"
        >
          <Wand2 className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Сомельє' : 'Сомелье'}</span>
        </button>

        <button
          onClick={() => setIsTenderModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl bg-[#b06a1e] text-white text-[10px] font-extrabold"
        >
          <Gift className="w-4 h-4" />
          <span className="mt-0.5">{lang === 'uk' ? 'Замовити' : 'Заказать'}</span>
        </button>
      </nav>

      {/* =====================================================================
          RIGHT SLIDE-OVER DRAWER 1: ASSORTMENT GUIDE (Шторка справа — Асортимент)
      ===================================================================== */}
      {isAssortmentDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsAssortmentDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-8">
            <div
              className={`w-screen max-w-md sm:max-w-lg flex flex-col shadow-2xl border-l ${
                isDark
                  ? 'bg-[#1e1510] border-white/15 text-[#eee7dd]'
                  : 'bg-[#fefbf7] border-[#d9c8b8] text-[#302016]'
              }`}
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#e1d5c8] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b06a1e]">
                    {lang === 'uk' ? 'Гід по продукції CrafoHub' : 'Гид по продукции CrafoHub'}
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">
                    {lang === 'uk'
                      ? '📋 Весь асортимент продукції'
                      : '📋 Весь ассортимент продукции'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsAssortmentDrawerOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#f1e6da] text-[#302016] flex items-center justify-center hover:bg-[#e39851] transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Section Tabs inside Drawer */}
              <div className="px-4 pt-3 pb-2 border-b border-[#e1d5c8] flex gap-1.5">
                {[
                  { id: 'chocolate', uk: '🍫 Шоколад (7)', ru: '🍫 Шоколад (7)' },
                  { id: 'cakes', uk: '🎂 Торти (5)', ru: '🎂 Торты (5)' },
                  { id: 'zefir', uk: '🌸 Зефір (4)', ru: '🌸 Зефир (4)' },
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
                {ALL_SECTION_VARIANTS[drawerSectionTab].map((item) => (
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
                      <img
                        src={item.imageUrl}
                        alt={lang === 'uk' ? item.titleUk : item.titleRu}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#e1d5c8]"
                      />
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

                    <button
                      onClick={() => handleSelectVariant(item)}
                      className="w-full rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white font-extrabold py-2.5 px-4 text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <span>
                        {lang === 'uk'
                          ? 'Обрати та показати 4 основних виробники →'
                          : 'Выбрать и показать 4 основных производителя →'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          RIGHT SLIDE-OVER DRAWER 2: SOMMELIER & CALCULATOR (Шторка справа — Сомельє)
      ===================================================================== */}
      {isSommelierDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsSommelierDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-8">
            <div
              className={`w-screen max-w-md sm:max-w-lg flex flex-col shadow-2xl border-l ${
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
                      ? 'Інтерактивний помічник CrafoHub 2027'
                      : 'Интерактивный помощник CrafoHub 2027'}
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">
                    {lang === 'uk'
                      ? '🪄 Сомельє подарунків та Калькулятор'
                      : '🪄 Сомелье подарков и Калькулятор'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsSommelierDrawerOpen(false)}
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

                    {/* TOP-4 RECOMMENDED PRODUCERS IN DRAWER */}
                    <div
                      className={`rounded-2xl p-4 border space-y-3 ${
                        isDark ? 'bg-[#261b16] border-white/15' : 'bg-white border-[#e1d5c8]'
                      }`}
                    >
                      <div className="text-xs font-extrabold uppercase text-[#b06a1e]">
                        {lang === 'uk'
                          ? '🎯 Ваші 4 основні виробники:'
                          : '🎯 Ваши 4 основных производителя:'}
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
                                <img
                                  src={m.imageUrl}
                                  alt={m.name}
                                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#e1d5c8]"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs truncate">
                                  #{idx + 1} {localizeText(m.name, lang)}
                                </div>
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
                <p className="text-xs text-[#715f53]">
                  {localizeText(activeMakerModal.city, lang)} • ★ {activeMakerModal.rating}
                </p>
              </div>
              <button
                onClick={() => setActiveMakerModal(null)}
                className="p-2 rounded-full bg-[#f1e6da]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {activeMakerModal.imageUrl && (
              <div className="rounded-2xl overflow-hidden h-64 border border-[#e1d5c8]">
                <img
                  src={activeMakerModal.imageUrl}
                  alt={activeMakerModal.name}
                  className="w-full h-full object-cover"
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
            <a
              href={
                getMakerCategoryUrl(activeMakerModal, selectedCategory) ||
                getMakerCategoryUrl(activeMakerModal, activeMakerModal.mainCategory) ||
                activeMakerModal.websiteUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#462b1f] hover:bg-[#b06a1e] text-white font-bold py-3 px-4 rounded-full text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <span>{lang === 'uk' ? 'Перейти на сайт виробника' : 'Перейти на сайт производителя'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* MODAL 2: Tender Request */}
      {isTenderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="font-serif text-xl font-bold">
                {lang === 'uk'
                  ? 'Замовити торт, букет чи шоколадний набір'
                  : 'Заказать торт, букет или шоколадный набор'}
              </h2>
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
                <div className="font-bold">
                  {lang === 'uk' ? 'Заявку передано майстрам!' : 'Заявка передана мастерам!'}
                </div>
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
                  placeholder={lang === 'uk' ? 'Ваше місто' : 'Ваш город'}
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder={lang === 'uk' ? 'Що бажаєте замовити?' : 'Что хотите заказать?'}
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder={lang === 'uk' ? 'Ваш телефон або Telegram' : 'Ваш телефон или Telegram'}
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <button
                  type="submit"
                  className="w-full bg-[#b06a1e] hover:bg-[#965715] text-white font-bold py-3 rounded-full"
                >
                  {lang === 'uk' ? 'Надіслати запит' : 'Отправить запрос'}
                </button>
              </form>
            )}
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
                  {lang === 'uk' ? 'Додати майстерню у CrafoHub' : 'Добавить мастерскую в CrafoHub'}
                </h2>
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
    </div>
  );
}
