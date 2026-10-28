'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  SECTION_VARIANTS_MAP,
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
  initialVariantId?: string;
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

const POPULAR_CITIES: { id: string; uk: string; ru: string; count: number }[] = [
  { id: 'all', uk: 'Вся Україна', ru: 'Вся Украина', count: 105 },
  { id: 'Київ', uk: 'Київ', ru: 'Киев', count: 35 },
  { id: 'Харків', uk: 'Харків', ru: 'Харьков', count: 14 },
  { id: 'Львів', uk: 'Львів', ru: 'Львов', count: 8 },
  { id: 'Дніпро', uk: 'Дніпро', ru: 'Днепр', count: 7 },
  { id: 'Одеса', uk: 'Одеса', ru: 'Одесса', count: 9 },
  { id: 'Вінниця', uk: 'Вінниця', ru: 'Винница', count: 8 },
  { id: 'Полтава', uk: 'Полтава', ru: 'Полтава', count: 6 },
  { id: 'Луцьк', uk: 'Луцьк', ru: 'Луцк', count: 6 },
  { id: 'Черкаси', uk: 'Черкаси', ru: 'Черкассы', count: 12 },
];

const CITY_FILTERS = POPULAR_CITIES;

function isCityMatch(m: CraftMaker, cityId: string): boolean {
  if (cityId === 'all') return true;
  const needle = cityId.toLowerCase();
  const c = (m.city || '').toLowerCase();
  const r = (m.regionCity || '').toLowerCase();
  return c.includes(needle) || r.includes(needle);
}

function formatPhoneDisplay(phoneStr: string): string {
  if (!phoneStr) return '';
  const first = phoneStr.split(',')[0].trim();
  const openCount = (first.match(/\(/g) || []).length;
  const closeCount = (first.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    const lastOpen = first.lastIndexOf('(');
    return first.substring(0, lastOpen).trim();
  }
  return first;
}

function cleanDisplayName(name: string): string {
  if (!name) return '';
  if (name.includes('CraftChoco') || name.includes('Crafo.Choco')) return 'Crafo — Майстерня крафтового шоколаду';
  return name
    .replace(/\s*\([a-z0-9\.\-\/]+\.(?:com|ua|org|net|in\.ua|kiev\.ua|kh\.ua)(?:\s*\/\s*[a-z0-9\.\-\/]+\.(?:com|ua|org|net))?\)/gi, '')
    .replace(/\s*—\s*№1\s*Лідер.*$/gi, '')
    .trim();
}

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
  initialVariantId,
}: ChocoRadarAppProps) {
  const [lang, setLang] = useState<Lang>('uk');
  const [isDark, setIsDark] = useState(false);
  const [isVariantDropdownOpen, setIsVariantDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qLang = params.get('lang');
      if (qLang === 'ru' || qLang === 'uk') {
        setLang(qLang);
        try {
          localStorage.setItem('crafo_lang', qLang);
        } catch (e) {}
        return;
      }
      try {
        const stored = localStorage.getItem('crafo_lang');
        if (stored === 'ru' || stored === 'uk') {
          setLang(stored as Lang);
        }
      } catch (e) {}
    }
  }, []);

  const changeLanguage = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('crafo_lang', newLang);
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLang);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }
  };

  const getLocalizedHref = (path: string) => {
    if (lang === 'ru') {
      return path.includes('?') ? `${path}&lang=ru` : `${path}?lang=ru`;
    }
    return path;
  };

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
    initialVariantId || getInitialVariantId(derivedInitialSection, initialCategory)
  );

  useEffect(() => {
    if (initialVariantId) {
      setSelectedVariantId(initialVariantId);
      const found = ALL_SECTION_VARIANTS.find((v) => v.id === initialVariantId);
      if (found) {
        setSelectedCategory(found.categorySlug);
        setActiveSection(found.section);
      }
    }
  }, [initialVariantId]);

  const getVariantUrl = (variant: ProductVariantItem) => {
    const sectionPath =
      variant.section === 'chocolate'
        ? '/shokolad'
        : variant.section === 'cakes'
        ? '/torty'
        : '/zefir';
    return getLocalizedHref(`${sectionPath}/${variant.slug}`);
  };

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
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [isCitySelectorModalOpen, setIsCitySelectorModalOpen] = useState(false);
  const [cityFilterSearch, setCityFilterSearch] = useState('');
  const [tenderCategory, setTenderCategory] = useState<'cake' | 'zefir' | 'chocolate' | 'corporate'>('cake');
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

      if (!isCityMatch(m, selectedCity)) {
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

  // Top 3 Flagship Makers for Home Page preview (filters by city if selected)
  const homeTop3Makers = useMemo(() => {
    if (selectedCity === 'all') {
      const ids = ['crafo-kharkiv', 'chebakery-kharkiv', 'piolli-zefir'];
      return ids
        .map((id) => MAKERS.find((m) => m.id === id))
        .filter((m): m is CraftMaker => !!m);
    }
    return MAKERS.filter((m) => isCityMatch(m, selectedCity))
      .sort((a, b) => {
        if (a.id === 'crafo-kharkiv') return -1;
        if (b.id === 'crafo-kharkiv') return 1;
        return b.rating - a.rating;
      })
      .slice(0, 3);
  }, [selectedCity]);

  // Interactive Sommelier Recommendations — NOW RETURNS TOP-3 MAIN PRODUCERS!
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
            {rankIndex !== undefined && rankIndex < 3 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#302016]/90 backdrop-blur-md text-[#f0a556] border border-[#f0a556]/40 px-2.5 py-1 text-[11px] font-extrabold shadow-md">
                ТОП-{rankIndex + 1}
              </span>
            )}
            {isLeader ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e39851] to-[#b06a1e] px-3 py-1 text-[11px] font-extrabold text-[#26140b] shadow-md">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'uk' ? 'Партнер платформи • Вибір редакції' : 'Партнер платформы • Выбор редакции'}</span>
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
                {cleanDisplayName(localizeText(maker.name, lang))}
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
                <span>{formatPhoneDisplay(maker.phone)}</span>
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
            href={getLocalizedHref('/')}
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2 text-left outline-none shrink-0"
          >
            <span className="grid w-9 h-9 sm:w-10 sm:h-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-lg">
              🍫
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Crafo<span className="text-[#b06a1e]">Hub</span></span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#b06a1e]">
                  {lang === 'uk' ? 'в Україні' : 'в Украине'}
                </span>
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
              href={getLocalizedHref('/')}
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
              href={getLocalizedHref('/shokolad')}
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
              href={getLocalizedHref('/torty')}
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
              href={getLocalizedHref('/zefir')}
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
            {/* Button: Methodology & Trust */}
            <button
              onClick={() => setIsMethodologyModalOpen(true)}
              className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                isDark
                  ? 'bg-[#362820] border-white/20 text-[#eee7dd] hover:bg-[#462b1f]'
                  : 'bg-white border-[#e1d5c8] text-[#5a4638] hover:bg-[#f1e6da]'
              }`}
              title={lang === 'uk' ? 'Стандарти перевірки майстерень' : 'Стандарты проверки мастерских'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'uk' ? 'Методологія 2027' : 'Методология 2027'}</span>
            </button>

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
                onClick={() => changeLanguage('uk')}
                className={`rounded-full px-2 py-1 transition ${
                  lang === 'uk'
                    ? 'bg-[#462b1f] text-[#faf4eb]'
                    : 'text-[#715f53] hover:text-[#302016]'
                }`}
              >
                УКР
              </button>
              <button
                onClick={() => changeLanguage('ru')}
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
            {/* Clean Grand Hero Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b06a1e]/40 bg-[#e39851]/20 px-3.5 py-1 text-xs font-extrabold text-[#8c4f12] dark:text-[#f0a556]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'uk'
                    ? `CrafoHub 2027 • ${MAKERS.length} перевірених майстерень України`
                    : `CrafoHub 2027 • ${MAKERS.length} проверенных мастерских Украины`}
                </span>
              </span>

              <h1 className="font-serif text-2xl sm:text-5xl font-bold leading-tight tracking-tight">
                {lang === 'uk' ? 'Кращі, перевірені виробники ' : 'Лучшие, проверенные производители '}
                <span className="bg-gradient-to-r from-[#7a4a2b] via-[#b06a1e] to-[#c75b7a] bg-clip-text text-transparent">
                  {lang === 'uk' ? 'крафтової продукції в Україні' : 'крафтовой продукции в Украине'}
                </span>
              </h1>

              <p
                className={`text-xs sm:text-base max-w-2xl mx-auto leading-relaxed ${
                  isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                }`}
              >
                {lang === 'uk'
                  ? 'Єдиний сервіс CrafoHub (crafohub.com.ua), де зібрані найкращі майстерні шоколаду, авторських тортів та крафтового зефіру: обирайте очима, знаходьте 3 основні виробники свого міста та переходьте напряму до замовлення.'
                  : 'Единый сервис CrafoHub (crafohub.com.ua), где собраны лучшие мастерские шоколада, авторских тортов и крафтового зефира: выбирайте глазами, находите 3 основных производителя своего города и переходите напрямую к заказу.'}
              </p>

              {/* Quick Triggers Bar without the word "Шторка" */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => {
                    setDrawerSectionTab('chocolate');
                    setIsAssortmentDrawerOpen(true);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-xs sm:text-sm font-extrabold transition shadow-sm ${
                    isDark
                      ? 'bg-[#261b16] border-[#e39851] text-[#f0a556] hover:bg-[#362820]'
                      : 'bg-white border-[#462b1f] text-[#302016] hover:bg-[#f1e6da]'
                  }`}
                >
                  <LayoutList className="w-4 h-4 text-[#b06a1e]" />
                  <span>
                    {lang === 'uk'
                      ? '📋 Весь асортимент продукції'
                      : '📋 Весь ассортимент продукции'}
                  </span>
                </button>

                <button
                  onClick={() => setIsSommelierDrawerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md transition"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>
                    {lang === 'uk'
                      ? '🪄 Підібрати з Сомельє'
                      : '🪄 Подобрать с Сомелье'}
                  </span>
                </button>
              </div>

              {/* Prominent City Filter Bar across Ukraine on Home */}
              <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-xs font-extrabold text-[#b06a1e] shrink-0 flex items-center gap-1 mr-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Місто:' : 'Город:'}</span>
                </span>
                {POPULAR_CITIES.slice(0, 6).map((city) => {
                  const active = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                        active
                          ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                          : isDark
                          ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                          : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e3d2c0]'
                      }`}
                    >
                      {lang === 'uk' ? city.uk : city.ru}
                      <span className="ml-1 opacity-60 text-[10px]">({city.count})</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => setIsCitySelectorModalOpen(true)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition flex items-center gap-1.5 ${
                    selectedCity !== 'all' && !POPULAR_CITIES.slice(0, 6).some((c) => c.id === selectedCity)
                      ? 'bg-[#b06a1e] text-white border-[#b06a1e] shadow-sm'
                      : isDark
                      ? 'border-[#e39851]/50 text-[#f0a556] hover:bg-[#462b1f]'
                      : 'border-[#b06a1e]/40 bg-white text-[#b06a1e] hover:bg-[#fff8ef]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {selectedCity !== 'all' && !POPULAR_CITIES.slice(0, 6).some((c) => c.id === selectedCity)
                      ? selectedCity
                      : lang === 'uk'
                      ? 'Усі 43 міста ▾'
                      : 'Все 43 города ▾'}
                  </span>
                </button>
              </div>
            </div>

            {/* 3 LARGE VISUAL SECTION CARDS (Шоколад / Торти / Зефір) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* CARD 1: CHOCOLATE */}
              <Link
                href={getLocalizedHref('/shokolad')}
                onClick={() => handleSelectSection('chocolate')}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                  isDark
                    ? 'bg-[#261b16] border-[#e39851]/60 hover:border-[#f0a556]'
                    : 'bg-[#fefbf7] border-[#d4b08c] hover:border-[#b06a1e] shadow-md'
                }`}
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#24130a]">
                  <img
                    src="/images/crafo-collage.jpg"
                    alt="Шоколад та цукерки"
                    className="w-full h-full object-cover object-center brightness-110 contrast-105 saturate-110 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e39851] px-3 py-1 text-xs font-extrabold text-[#26140b] shadow-md">
                      🍫 {chocolateMakersCount} {lang === 'uk' ? 'майстерень' : 'мастерских'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-md">
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

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 rounded-full bg-gradient-to-r from-[#462b1f] to-[#3a2113] group-hover:from-[#b06a1e] group-hover:to-[#8c4f12] text-white font-extrabold py-3 px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition">
                      <span>
                        {lang === 'uk'
                          ? 'Перейти у розділ'
                          : 'Перейти в раздел'}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDrawerSectionTab('chocolate');
                        setIsAssortmentDrawerOpen(true);
                      }}
                      className="rounded-full border-2 border-[#b06a1e]/40 hover:border-[#b06a1e] bg-white text-[#302016] px-3.5 py-3 text-xs font-extrabold flex items-center gap-1.5 transition shrink-0 shadow-xs"
                      title={lang === 'uk' ? 'Відкрити асортимент шоколаду справа' : 'Открыть ассортимент шоколада справа'}
                    >
                      <LayoutList className="w-4 h-4 text-[#b06a1e]" />
                      <span>{lang === 'uk' ? 'Асортимент' : 'Ассортимент'}</span>
                    </button>
                  </div>
                </div>
              </Link>

              {/* CARD 2: CAKES */}
              <Link
                href={getLocalizedHref('/torty')}
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
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c75b7a] px-3 py-1 text-xs font-extrabold text-white shadow-md">
                      🎂 {cakeMakersCount} {lang === 'uk' ? 'кондитерських' : 'кондитерских'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-md">
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

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 rounded-full bg-gradient-to-r from-[#c75b7a] to-[#8e2f4a] group-hover:brightness-110 text-white font-extrabold py-3 px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition">
                      <span>
                        {lang === 'uk'
                          ? 'Перейти у розділ'
                          : 'Перейти в раздел'}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDrawerSectionTab('cakes');
                        setIsAssortmentDrawerOpen(true);
                      }}
                      className="rounded-full border-2 border-[#c75b7a]/40 hover:border-[#c75b7a] bg-white text-[#302016] px-3.5 py-3 text-xs font-extrabold flex items-center gap-1.5 transition shrink-0 shadow-xs"
                      title={lang === 'uk' ? 'Відкрити асортимент тортів справа' : 'Открыть ассортимент тортов справа'}
                    >
                      <LayoutList className="w-4 h-4 text-[#c75b7a]" />
                      <span>{lang === 'uk' ? 'Асортимент' : 'Ассортимент'}</span>
                    </button>
                  </div>
                </div>
              </Link>

              {/* CARD 3: ZEFIR */}
              <Link
                href={getLocalizedHref('/zefir')}
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
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0a866] px-3 py-1 text-xs font-extrabold text-[#26140b] shadow-md">
                      🌸 {zefirMakersCount} {lang === 'uk' ? 'майстерень' : 'мастерских'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-md">
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

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] group-hover:brightness-110 text-white font-extrabold py-3 px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition">
                      <span>
                        {lang === 'uk'
                          ? 'Перейти у розділ'
                          : 'Перейти в раздел'}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDrawerSectionTab('zefir');
                        setIsAssortmentDrawerOpen(true);
                      }}
                      className="rounded-full border-2 border-[#b06a1e]/40 hover:border-[#b06a1e] bg-white text-[#302016] px-3.5 py-3 text-xs font-extrabold flex items-center gap-1.5 transition shrink-0 shadow-xs"
                      title={lang === 'uk' ? 'Відкрити асортимент зефіру справа' : 'Открыть ассортимент зефира справа'}
                    >
                      <LayoutList className="w-4 h-4 text-[#b06a1e]" />
                      <span>{lang === 'uk' ? 'Асортимент' : 'Ассортимент'}</span>
                    </button>
                  </div>
                </div>
              </Link>
            </div>

            {/* ===============================================================
                NEW 2027 PILLAR: TENDER EXCHANGE (СЦЕНАРІЙ 2: ІНДИВІДУАЛЬНІ ЗАМОВЛЕННЯ)
            =============================================================== */}
            <section className={`rounded-3xl border-2 p-6 sm:p-8 shadow-lg transition-all ${
              isDark
                ? 'bg-gradient-to-br from-[#2a1a12] via-[#22150e] to-[#2c141c] border-[#e39851]/40'
                : 'bg-gradient-to-br from-[#fffbf5] via-[#faf0e4] to-[#fdeded] border-[#b06a1e]/30'
            }`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#b06a1e]/15 border border-[#b06a1e]/30 px-3 py-1 text-xs font-extrabold text-[#b06a1e]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'uk' ? 'Сценарій 2: Індивідуальні замовлення' : 'Сценарий 2: Индивидуальные заказы'}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                    {lang === 'uk'
                      ? 'Тендерна біржа CrafoHub: один запит — 3–5 пропозицій від майстрів вашого міста'
                      : 'Тендерная биржа CrafoHub: один запрос — 3–5 предложений от мастеров вашего города'}
                  </h2>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'}`}>
                    {lang === 'uk'
                      ? 'Потрібен авторський торт на свято, їстівний зефірний букет або корпоративні подарунки? Не пишіть у 10 різних Instagram-акаунтів вручну. Опишіть задачу за 1 хвилину — вільні перевірені кондитери вашого міста самі надішлють розрахунок вартості та фото зразків.'
                      : 'Нужен авторский торт на праздник, съедобный зефирный букет или корпоративные подарки? Не пишите в 10 разных Instagram-аккаунтов вручную. Опишите задачу за 1 минуту — свободные проверенные кондитеры вашего города сами пришлют расчет стоимости и фото образцов.'}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {lang === 'uk' ? 'Відповідь за 1 годину' : 'Ответ за 1 час'}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {lang === 'uk' ? 'Без націнок та посередників' : 'Без наценок и посредников'}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {lang === 'uk' ? 'Тільки перевірені майстерні' : 'Только проверенные мастерские'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
                  <button
                    onClick={() => {
                      setTenderCategory('cake');
                      setIsTenderModalOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 text-white font-extrabold px-6 py-3.5 text-xs sm:text-sm shadow-md transition"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{lang === 'uk' ? '🎯 Оголосити тендер безкоштовно' : '🎯 Объявить тендер бесплатно'}</span>
                  </button>
                  <button
                    onClick={() => setIsMethodologyModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#b06a1e]/40 hover:bg-[#b06a1e]/10 text-[#302016] dark:text-[#f0a556] font-bold px-5 py-3 text-xs transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'uk' ? 'Як ми верифікуємо майстрів' : 'Как мы верифицируем мастеров'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* ===============================================================
                2 TRUST STANDARDS OF CRAFOHUB 2027 (ЦІНА ЗА 100 Г + ЧИСТИЙ СКЛАД)
            =============================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-5 sm:p-6 rounded-3xl border transition ${
                isDark ? 'bg-[#261b16] border-white/10' : 'bg-[#fffbf6] border-[#e1d5c8] shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#b06a1e]/15 text-[#b06a1e] flex items-center justify-center font-bold text-lg">
                    ⚖️
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold">
                      {lang === 'uk' ? 'Стандарт «Чесна ціна за 100 г»' : 'Стандарт «Честная цена за 100 г»'}
                    </h3>
                    <span className="text-[11px] font-bold text-[#b06a1e]">
                      {lang === 'uk' ? 'Захист від шрінкфляції' : 'Защита от шринкфляции'}
                    </span>
                  </div>
                </div>
                <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'}`}>
                  {lang === 'uk'
                    ? 'Коробка цукерок може важити як 70 г, так і 250 г при однаковій зовнішній ціні. CrafoHub автоматично розраховує питому вартість за 100 грамів для кожного товару, щоб ви бачили чесне співвідношення ціни та об’єму.'
                    : 'Коробка конфет может весить как 70 г, так и 250 г при одинаковой внешней цене. CrafoHub автоматически рассчитывает удельную стоимость за 100 граммов для каждого товара, чтобы вы видели честное соотношение цены и объема.'}
                </p>
              </div>

              <div className={`p-5 sm:p-6 rounded-3xl border transition ${
                isDark ? 'bg-[#261b16] border-white/10' : 'bg-[#fffbf6] border-[#e1d5c8] shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    🌱
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold">
                      {lang === 'uk' ? 'Бейдж «100% Чистий склад»' : 'Бейдж «100% Чистый состав»'}
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {lang === 'uk' ? 'Clean Label стандарт 2027' : 'Clean Label стандарт 2027'}
                    </span>
                  </div>
                </div>
                <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'}`}>
                  {lang === 'uk'
                    ? 'Усі майстерні проходять перевірку сировини: виключно натуральне какао-масло (Barry Callebaut, Fino de Aroma), ягоди, горіхи та агар-агар. Жодних пальмових еквівалентів, штучних замінників чи дешевої кондитерської глазурі.'
                    : 'Все мастерские проходят проверку сырья: исключительно натуральное какао-масло (Barry Callebaut, Fino de Aroma), ягоды, орехи и агар-агар. Никаких пальмовых эквивалентов, искусственных заменителей или дешевой кондитерской глазури.'}
                </p>
              </div>
            </div>

            {/* FLAGSHIP TOP-3 SHOWCASE ON HOME */}
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
                      ? '3 головні флагмани платформи'
                      : '3 главных флагмана платформы'}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={getLocalizedHref('/shokolad')}
                    onClick={() => handleSelectSection('chocolate')}
                    className="rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] text-[#302016] px-4 py-2 text-xs font-extrabold transition"
                  >
                    🍫 {lang === 'uk' ? 'Усі види шоколаду →' : 'Все виды шоколада →'}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {homeTop3Makers.map((maker, idx) => renderMakerCard(maker, idx))}
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
                    href={getLocalizedHref('/')}
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
                      href={getLocalizedHref('/shokolad')}
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
                      href={getLocalizedHref('/torty')}
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
                      href={getLocalizedHref('/zefir')}
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
                        ? '📋 Асортимент продукції'
                        : '📋 Ассортимент продукции'}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsSommelierDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>
                      {lang === 'uk'
                        ? '🪄 Підбір з Сомельє'
                        : '🪄 Подбор с Сомелье'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Section Title & Step 1 Instruction */}
              <div className="pt-2 border-t border-[#e1d5c8]/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
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
                    <h1 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                      {lang === 'uk'
                        ? 'Крок 1. Оберіть потрібний варіант продукту:'
                        : 'Шаг 1. Выберите нужный вариант продукта:'}
                    </h1>
                  </div>

                  <button
                    onClick={() => {
                      setDrawerSectionTab(activeSection);
                      setIsAssortmentDrawerOpen(true);
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#b06a1e]/40 bg-white dark:bg-[#261b16] px-3.5 py-1.5 text-xs font-bold text-[#b06a1e] hover:bg-[#fff8ef] transition self-start sm:self-center shadow-xs"
                  >
                    <LayoutList className="w-3.5 h-3.5 text-[#b06a1e]" />
                    <span>{lang === 'uk' ? 'Асортимент та склад' : 'Ассортимент и состав'}</span>
                  </button>
                </div>
              </div>

              {/* COMPACT PRODUCT VARIANT SELECTOR: ONLY 1 ACTIVE ROW VISIBLE, OTHERS IN DROPDOWN MENU */}
              <div
                className="relative"
                onMouseEnter={() => setIsVariantDropdownOpen(true)}
                onMouseLeave={() => setIsVariantDropdownOpen(false)}
              >
                {/* 1 Selected Active Row */}
                <button
                  type="button"
                  onClick={() => setIsVariantDropdownOpen((prev) => !prev)}
                  className="w-full text-left rounded-2xl border-2 p-3 sm:p-3.5 transition-all flex items-center justify-between gap-3 shadow-md bg-gradient-to-br from-[#462b1f] to-[#2e190d] text-white border-[#e39851] ring-2 ring-[#e39851]/30"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 bg-[#3a2113]">
                      <img
                        src={activeVariant.imageUrl}
                        alt={lang === 'uk' ? activeVariant.titleUk : activeVariant.titleRu}
                        className="w-full h-full object-cover object-center"
                      />
                      <span className="absolute bottom-0.5 right-0.5 text-xs sm:text-sm bg-black/60 backdrop-blur-xs rounded-md px-1 text-white">
                        {activeVariant.emoji}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base leading-tight">
                          {lang === 'uk' ? activeVariant.titleUk : activeVariant.titleRu}
                        </span>
                        <span className="rounded-full bg-[#e39851] text-[#26140b] text-[10px] font-extrabold px-2 py-0.5 shrink-0">
                          {lang === 'uk' ? 'Обрано' : 'Выбрано'}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#f5c492] line-clamp-1 sm:line-clamp-2 mt-0.5 leading-snug">
                        {lang === 'uk' ? activeVariant.shortDescUk : activeVariant.shortDescRu}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-[#e39851] hover:bg-[#f0a556] text-[#26140b] px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-extrabold shadow-sm transition">
                    <span>
                      {lang === 'uk'
                        ? `Змінити (${currentVariantsList.length - 1})`
                        : `Изменить (${currentVariantsList.length - 1})`}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isVariantDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu of Other Variants (6 for choco, 3 for cakes, 2 for zefir) */}
                {isVariantDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-40 mt-1.5 rounded-2xl border-2 border-[#b06a1e]/40 bg-[#fefbf7] dark:bg-[#1f140e] shadow-2xl p-2 sm:p-2.5 space-y-1.5 max-h-[75vh] overflow-y-auto animate-slide-in-right sm:animate-none">
                    <div className="px-2 py-1 text-[11px] font-bold text-[#8c5225] dark:text-[#e39851] uppercase tracking-wider flex items-center justify-between border-b border-[#e1d5c8]/60 pb-1.5">
                      <span>{lang === 'uk' ? 'Оберіть потрібний варіант продукту:' : 'Выберите нужный вариант продукта:'}</span>
                      <span className="text-[10px] opacity-75">
                        {currentVariantsList.length - 1} {lang === 'uk' ? 'інших варіантів у меню' : 'других вариантов в меню'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {currentVariantsList
                        .filter((v) => v.id !== activeVariant.id)
                        .map((variant) => (
                          <Link
                            key={variant.id}
                            href={getVariantUrl(variant)}
                            onClick={() => {
                              handleSelectVariant(variant);
                              setIsVariantDropdownOpen(false);
                            }}
                            className={`w-full text-left rounded-xl p-2.5 transition-all flex items-center gap-3 ${
                              isDark
                                ? 'bg-[#180f0b] text-[#eee7dd] hover:bg-[#2e1d15] hover:border-[#e39851]'
                                : 'bg-white text-[#302016] hover:bg-[#f6eee3] border border-[#e8dccf] hover:border-[#b06a1e]'
                            }`}
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-black/10 bg-[#3a2113]">
                              <img
                                src={variant.imageUrl}
                                alt={lang === 'uk' ? variant.titleUk : variant.titleRu}
                                className="w-full h-full object-cover object-center"
                              />
                              <span className="absolute bottom-0 right-0 text-[10px] bg-black/60 rounded px-1 text-white">
                                {variant.emoji}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs sm:text-sm leading-tight">
                                  {lang === 'uk' ? variant.titleUk : variant.titleRu}
                                </span>
                                <span className="text-[11px] font-bold text-[#b06a1e] opacity-85 shrink-0 flex items-center gap-1">
                                  <span>{lang === 'uk' ? 'Перейти' : 'Перейти'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                              <p className="text-[11px] text-[#715f53] dark:text-[#a79d91] line-clamp-1 mt-0.5">
                                {lang === 'uk' ? variant.shortDescUk : variant.shortDescRu}
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick City Filter Pills on Section Page */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs font-bold text-[#b06a1e] shrink-0 flex items-center gap-1 mr-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Місто:' : 'Город:'}</span>
                </span>
                {POPULAR_CITIES.slice(0, 6).map((city) => {
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
                <button
                  onClick={() => setIsCitySelectorModalOpen(true)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition flex items-center gap-1 text-[#b06a1e] ${
                    selectedCity !== 'all' && !POPULAR_CITIES.slice(0, 6).some((c) => c.id === selectedCity)
                      ? 'bg-[#b06a1e] text-white border-[#b06a1e]'
                      : 'border-[#b06a1e]/40 hover:bg-[#fff8ef]'
                  }`}
                >
                  <Search className="w-3 h-3" />
                  <span>
                    {selectedCity !== 'all' && !POPULAR_CITIES.slice(0, 6).some((c) => c.id === selectedCity)
                      ? selectedCity
                      : lang === 'uk'
                      ? 'Усі 43 міста ▾'
                      : 'Все 43 города ▾'}
                  </span>
                </button>
              </div>
            </div>

            {/* ===============================================================
                STEP 2 OUTPUT: 3 MAIN PRODUCERS + DIRECTORY LIST
            =============================================================== */}
            <section id="makers-section" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e1d5c8] pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
                    <Crown className="w-4 h-4" />
                    <span>
                      {lang === 'uk'
                        ? 'Крок 2. 3 основні виробники напрямку'
                        : 'Шаг 2. 3 основных производителя направления'}
                    </span>
                  </span>
                  <h2 className="mt-1 font-serif text-xl sm:text-3xl font-bold">
                    {lang === 'uk'
                      ? `3 основні виробники: «${activeVariant.titleUk}»`
                      : `3 основных производителя: «${activeVariant.titleRu}»`}
                    {selectedCity !== 'all' ? ` (${localizeText(selectedCity, lang)})` : ''}
                  </h2>
                  <p className="text-xs sm:text-sm opacity-80 mt-1">
                    {lang === 'uk'
                      ? 'ТОП-3 рекомендовані виробники обраного продукту. Нижче представлені всі інші перевірені майстерні списком.'
                      : 'ТОП-3 рекомендованных производителя выбранного продукта. Ниже представлены все остальные проверенные мастерские списком.'}
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
                      ? 'Показати ТОП-3 виробники з доставкою по всій Україні'
                      : 'Показать ТОП-3 производителя с доставкой по всей Украине'}
                  </button>
                </div>
              ) : (
                <>
                  {/* THE TOP 3 MAIN PRODUCERS (3 CARDS) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {filteredMakers.slice(0, 3).map((maker, idx) => renderMakerCard(maker, idx))}
                  </div>

                  {/* REMAINING PRODUCERS AS A CLEAN DIRECTORY LIST */}
                  {filteredMakers.length > 3 && (
                    <div className="space-y-4 pt-6 border-t border-[#e1d5c8]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                        <div>
                          <h3 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
                            <span>
                              {lang === 'uk'
                                ? 'Інші перевірені майстерні рубрики'
                                : 'Другие проверенные мастерские рубрики'}
                            </span>
                            <span className="rounded-full bg-[#f1e6da] dark:bg-[#362820] text-[#462b1f] dark:text-[#f0a556] text-xs font-extrabold px-2.5 py-0.5">
                              {filteredMakers.length - 3}
                            </span>
                          </h3>
                          <p className="text-xs opacity-75 mt-0.5">
                            {lang === 'uk'
                              ? 'Повний список майстерень з прямими переходами до замовлення'
                              : 'Полный список мастерских с прямыми переходами к заказу'}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`rounded-3xl border overflow-hidden divide-y ${
                          isDark
                            ? 'bg-[#261b16] border-white/10 divide-white/10'
                            : 'bg-[#fefbf7] border-[#e1d5c8] divide-[#ebdcd0]'
                        }`}
                      >
                        {filteredMakers.slice(3).map((maker, idx) => {
                          const globalRank = idx + 4;
                          const effectiveCategory = activeVariant.categorySlug;
                          const customVariantUrl = activeVariant.customDirectUrls?.[maker.id];
                          const categoryDirectUrl =
                            customVariantUrl || getMakerCategoryUrl(maker, effectiveCategory);
                          const directDestinationUrl = categoryDirectUrl || maker.websiteUrl;
                          const cleanDomain = directDestinationUrl
                            .replace('https://www.', '')
                            .replace('https://', '')
                            .replace(/\/$/, '');

                          return (
                            <div
                              key={maker.id}
                              className="p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition hover:bg-black/5 dark:hover:bg-white/5"
                            >
                              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                <span className="text-xs sm:text-sm font-extrabold text-[#b06a1e] w-7 shrink-0 text-center">
                                  #{globalRank}
                                </span>

                                {maker.imageUrl ? (
                                  <div
                                    onClick={() => setActiveMakerModal(maker)}
                                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-black/10 bg-[#3a2113] cursor-pointer group"
                                  >
                                    <img
                                      src={maker.imageUrl}
                                      alt={maker.name}
                                      className="w-full h-full object-cover object-center transition-transform group-hover:scale-110"
                                      loading="lazy"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f1e6da] dark:bg-[#362820] text-xl flex items-center justify-center shrink-0">
                                    {effectiveCategory === 'avtorski-torty-ta-deserty'
                                      ? '🎂'
                                      : effectiveCategory === 'kraftovyi-zefir-ta-bukety'
                                      ? '🌸'
                                      : '🍫'}
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <a
                                      href={directDestinationUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-bold text-sm sm:text-base leading-snug hover:underline hover:text-[#b06a1e] transition truncate"
                                    >
                                      {cleanDisplayName(localizeText(maker.name, lang))}
                                    </a>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>{lang === 'uk' ? 'Перевірено' : 'Проверено'}</span>
                                    </span>
                                    <span className="text-xs font-bold text-[#b06a1e]">
                                      ★ {maker.rating}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#715f53] dark:text-[#a79d91]">
                                    <span className="flex items-center gap-1 shrink-0 font-medium">
                                      <MapPin className="w-3 h-3 text-[#b06a1e]" />
                                      <span>{localizeText(maker.city, lang)}</span>
                                    </span>
                                    <span className="hidden sm:inline opacity-40">•</span>
                                    <span className="line-clamp-1 text-xs">
                                      {localizeText(maker.specialty || maker.description, lang)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  onClick={() => setActiveMakerModal(maker)}
                                  className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                                    isDark
                                      ? 'border-white/15 text-[#f0a556] hover:bg-white/10'
                                      : 'border-[#d4c3b3] text-[#462b1f] hover:bg-[#f1e6da]'
                                  }`}
                                >
                                  {lang === 'uk' ? 'Детальніше' : 'Подробнее'}
                                </button>

                                <a
                                  href={directDestinationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold transition shadow-xs ${
                                    isDark
                                      ? 'bg-[#f0a556] text-[#26160e] hover:bg-[#e39851]'
                                      : 'bg-[#462b1f] text-[#faf4eb] hover:bg-[#b06a1e]'
                                  }`}
                                >
                                  <span>
                                    {cleanDomain.includes('instagram.com')
                                      ? 'Instagram'
                                      : lang === 'uk'
                                      ? 'Перейти'
                                      : 'Перейти'}
                                  </span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
                  aUk: 'Натисніть кнопку «Асортимент» або «Сомельє» у верхній панелі чи внизу екрана смартфона — праворуч плавно відкриється зручна панель з повним описом усіх видів продукції або інтерактивним помічником вибору.',
                  aRu: 'Нажмите кнопку «Ассортимент» или «Сомелье» в верхней панели или внизу экрана смартфона — справа плавно откроется удобная панель с полным описанием всех видов продукции или интерактивным помощником выбора.',
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
            <Link href={getLocalizedHref('/shokolad')} onClick={() => handleSelectSection('chocolate')} className="hover:text-[#b06a1e]">
              🍫 {lang === 'uk' ? 'Шоколад' : 'Шоколад'}
            </Link>
            <Link href={getLocalizedHref('/torty')} onClick={() => handleSelectSection('cakes')} className="hover:text-[#b06a1e]">
              🎂 {lang === 'uk' ? 'Торти' : 'Торты'}
            </Link>
            <Link href={getLocalizedHref('/zefir')} onClick={() => handleSelectSection('zefir')} className="hover:text-[#b06a1e]">
              🌸 {lang === 'uk' ? 'Зефір' : 'Зефир'}
            </Link>
            <button
              onClick={() => setIsMethodologyModalOpen(true)}
              className="hover:text-[#b06a1e] flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'uk' ? 'Методологія відбору' : 'Методология отбора'}</span>
            </button>
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
          href={getLocalizedHref('/')}
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

      {/* =====================================================================
          RIGHT SLIDE-OVER DRAWER 2: SOMMELIER & CALCULATOR (Шторка справа — Сомельє)
      ===================================================================== */}
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

      {/* MODAL 2: Upgraded Tender Request */}
      {isTenderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl my-auto">
            <div className="flex items-start justify-between border-b border-[#e1d5c8] pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b06a1e]">
                  {lang === 'uk' ? 'Тендерна біржа CrafoHub 2027' : 'Тендерная биржа CrafoHub 2027'}
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
                  <label className="block text-[11px] font-bold text-[#715f53] mb-1.5">
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
                        onClick={() => setTenderCategory(tab.id as any)}
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
                    <label className="block text-[11px] font-bold text-[#715f53] mb-1">
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
                    <label className="block text-[11px] font-bold text-[#715f53] mb-1">
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
                  <label className="block text-[11px] font-bold text-[#715f53] mb-1">
                    {lang === 'uk' ? 'Опис замовлення (вага, кількість гостей, ідея)' : 'Описание заказа (вес, число гостей, идея)'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder={lang === 'uk'
                      ? 'Наприклад: торт на 15 людей, начинка манго-маракуйя або шоколадний велюр...'
                      : 'Например: торт на 15 человек, начинка манго-маракуйя или шоколадный велюр...'}
                    className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2 outline-none focus:border-[#b06a1e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#715f53] mb-1">
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
                  <span>Стандарт прозорості CrafoHub 2027</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1.5">
                  {lang === 'uk'
                    ? 'Методологія відбору та верифікації майстерень'
                    : 'Методология отбора и верификации мастерских'}
                </h2>
              </div>
              <button
                onClick={() => setIsMethodologyModalOpen(false)}
                className="p-2 rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#4a3b32]">
              <p className="font-medium text-[#2d1f17]">
                {lang === 'uk'
                  ? 'CrafoHub — це національний гід та незалежний навігатор крафтових солодощів України. Наша мета на 2027 рік — надати українцям сервіс найвищого світового рівня для замовлення справжнього шоколаду, авторських тортів та натурального зефіру.'
                  : 'CrafoHub — это национальный гид и независимый навигатор крафтовых сладостей Украины. Наша цель на 2027 год — предоставить украинцам сервис высшего мирового уровня для заказа настоящего шоколада, авторских тортов и натурального зефира.'}
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
                        ? 'Ми виступаємо проти оманливого зменшення ваги упаковки. Каталог розраховує ціну за 100 грамів, щоб ви завжди знали реальну собівартість виробу.'
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
                <div className="text-xs text-[#715f53]">
                  Електронна пошта: <a href="mailto:editor@crafohub.com.ua" className="underline text-[#b06a1e]">editor@crafohub.com.ua</a> | Підтримка: <a href="https://t.me/crafohub_ua" target="_blank" rel="noopener noreferrer" className="underline text-[#b06a1e]">Telegram @crafohub_ua</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: City Selector with Search (43 Cities of Ukraine) */}
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
                <span className="opacity-70 text-xs">105 майстерень</span>
              </button>

              {POPULAR_CITIES.filter((c) => c.id !== 'all')
                .filter((c) =>
                  !cityFilterSearch ||
                  c.uk.toLowerCase().includes(cityFilterSearch.toLowerCase()) ||
                  c.ru.toLowerCase().includes(cityFilterSearch.toLowerCase())
                )
                .map((city) => {
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
                      <span className="opacity-70 text-xs">{city.count} {lang === 'uk' ? 'майстерень' : 'мастерских'}</span>
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
