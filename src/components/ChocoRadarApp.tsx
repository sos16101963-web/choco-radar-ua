'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { CategorySlug } from '@/data/chocolateData';
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
  MapPin,
  ChevronDown,
  ChevronUp,
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
  BarChart2,
  Share2,
  Check,
  Copy,
  X,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';
import { trackMakerClick, appendUtm } from '@/utils/analytics';
import { extractPhoneDigits, hasRuRoute, HOME_FAQ, SITE_URL } from '@/lib/siteConfig';
import {
  BLOG_PREVIEW_CARDS,
  BreadcrumbTrailItem,
  CatalogMaker,
  CatalogSummary,
  CITY_HUB_LINKS,
  cleanDisplayName,
  getMakerCategoryUrl,
  Lang,
  localizeText,
  POPULAR_SEO_SHORTCUTS,
  SeoRelatedLinkGroup,
  SeoStatsBanner,
} from '@/lib/homePreviewData';
import {
  getRecentMakers,
  getStoredFavorites,
  getStoredTheme,
  RecentMakerEntry,
  recordRecentMaker,
  saveStoredFavorites,
  saveStoredTheme,
  shareOrCopy,
} from '@/lib/uxStorage';
import OptimizedImage from './OptimizedImage';
import Breadcrumbs from './Breadcrumbs';
import BackToTopButton from './BackToTopButton';

const ChocoModalsAndDrawers = dynamic(() => import('./ChocoModalsAndDrawers'), {
  ssr: false,
});

const CommandPaletteModal = dynamic(() => import('./CommandPaletteModal'), {
  ssr: false,
});

export interface PageSeoOverride {
  h1Uk: string;
  h1Ru?: string;
  leadUk?: string;
  leadRu?: string;
  articleTitleUk?: string;
  articleTitleRu?: string;
  articleUk?: string;
  articleRu?: string;
  faqUk?: { q: string; a: string }[];
  faqRu?: { q: string; a: string }[];
  breadcrumbs?: BreadcrumbTrailItem[];
  statsBanner?: SeoStatsBanner;
  relatedLinks?: SeoRelatedLinkGroup[];
}

interface ChocoRadarAppProps {
  initialSection?: MacroSectionId;
  initialCategory?: CategorySlug;
  initialCity?: string;
  initialVariantId?: string;
  initialLang?: Lang;
  initialMakers: CatalogMaker[];
  catalogSummary: CatalogSummary;
  seoOverride?: PageSeoOverride;
}

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

function isCityMatch(m: CatalogMaker, cityId: string): boolean {
  if (cityId === 'all') return true;
  const needle = cityId.toLowerCase();
  const c = (m.city || '').toLowerCase();
  const r = (m.regionCity || '').toLowerCase();
  return c.includes(needle) || r.includes(needle);
}

function isDirectCityMatch(m: CatalogMaker, cityId: string): boolean {
  if (!cityId || cityId === 'all') return false;
  return (m.city || '').toLowerCase().includes(cityId.toLowerCase());
}

function formatCitiesButtonText(count: number, lang: 'uk' | 'ru'): string {
  if (lang === 'uk') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 19) return `Усі ${count} міст ▾`;
    if (mod10 === 1) return `Усі ${count} місто ▾`;
    if (mod10 >= 2 && mod10 <= 4) return `Усі ${count} міста ▾`;
    return `Усі ${count} міст ▾`;
  } else {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 19) return `Все ${count} городов ▾`;
    if (mod10 === 1) return `Все ${count} город ▾`;
    if (mod10 >= 2 && mod10 <= 4) return `Все ${count} города ▾`;
    return `Все ${count} городов ▾`;
  }
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

export default function ChocoRadarApp({
  initialSection = 'home',
  initialCategory = 'all',
  initialCity = 'all',
  initialVariantId,
  initialLang = 'uk',
  initialMakers,
  catalogSummary,
  seoOverride,
}: ChocoRadarAppProps) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang);
  const [isDark, setIsDark] = useState(false);
  const [isVariantDropdownOpen, setIsVariantDropdownOpen] = useState(false);

  useEffect(() => {
    setLang(initialLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initialLang;
    }
  }, [initialLang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('q');
      if (qParam && qParam.trim() !== '') {
        setSearchQuery(qParam.trim());
      }
      if (initialLang === 'ru') {
        try {
          localStorage.setItem('crafo_lang', 'ru');
        } catch (e) {}
        return;
      }
      const qLang = params.get('lang');
      if (qLang === 'ru' || qLang === 'uk') {
        setLang(qLang);
        document.documentElement.lang = qLang;
        try {
          localStorage.setItem('crafo_lang', qLang);
        } catch (e) {}
      }
    }
  }, [initialLang]);

  const changeLanguage = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      document.documentElement.lang = newLang;
      try {
        localStorage.setItem('crafo_lang', newLang);
      } catch (e) {}

      const pathname = window.location.pathname || '/';
      if (newLang === 'ru') {
        const ukPath = pathname.replace(/^\/ru(?=\/|$)/, '') || '/';
        if (hasRuRoute(ukPath)) {
          router.push(ukPath === '/' ? '/ru' : `/ru${ukPath}`);
          return;
        }
      } else {
        if (pathname === '/ru' || pathname.startsWith('/ru/')) {
          const ukPath = pathname.replace(/^\/ru(?=\/|$)/, '') || '/';
          router.push(ukPath);
          return;
        }
      }
    }
  };

  const getLocalizedHref = (path: string) => {
    if (lang === 'ru' && hasRuRoute(path)) {
      return path === '/' ? '/ru' : `/ru${path}`;
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
  const [favoriteMakerIds, setFavoriteMakerIds] = useState<string[]>([]);
  const [recentMakers, setRecentMakers] = useState<RecentMakerEntry[]>([]);
  const [sortMode, setSortMode] = useState<'recommended' | 'rating'>('recommended');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [expandedMakerIds, setExpandedMakerIds] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPhoneMakerId, setCopiedPhoneMakerId] = useState<string | null>(null);

  const hasHydratedRef = useRef(false);
  const toastTimerRef = useRef<number | null>(null);
  const variantDropdownRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(toastTimerRef.current);
    }
    if (typeof window !== 'undefined') {
      toastTimerRef.current = window.setTimeout(() => {
        setToastMessage(null);
      }, 2400);
    }
  }, []);

  useEffect(() => {
    setFavoriteMakerIds(getStoredFavorites());
    setRecentMakers(getRecentMakers());
    if (getStoredTheme() === 'dark') {
      setIsDark(true);
    }
    hasHydratedRef.current = true;
    return () => {
      if (toastTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    }
    if (hasHydratedRef.current) {
      saveStoredTheme(isDark);
    }
  }, [isDark]);

  // Modals (lazy-loaded overlay triggers)
  const [activeMakerModal, setActiveMakerModal] = useState<CatalogMaker | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isAddMakerModalOpen, setIsAddMakerModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [isCitySelectorModalOpen, setIsCitySelectorModalOpen] = useState(false);
  const [isMakerStatsModalOpen, setIsMakerStatsModalOpen] = useState(false);
  const [statsModalMaker, setStatsModalMaker] = useState<CatalogMaker | null>(null);
  const [tenderCategory, setTenderCategory] = useState<'cake' | 'zefir' | 'chocolate' | 'corporate'>('cake');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string>('PRO Майстерня');

  const hasAnyOverlayOpen = Boolean(
    isAssortmentDrawerOpen ||
      isSommelierDrawerOpen ||
      isFavoritesDrawerOpen ||
      activeMakerModal ||
      isTenderModalOpen ||
      isMethodologyModalOpen ||
      isCitySelectorModalOpen ||
      isAddMakerModalOpen ||
      isMakerStatsModalOpen
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      if (e.key === '/') {
        const el = document.activeElement as HTMLElement | null;
        const tag = el?.tagName;
        const isTyping =
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          Boolean(el?.isContentEditable);
        if (!isTyping) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
        return;
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsVariantDropdownOpen(false);
        setIsAssortmentDrawerOpen(false);
        setIsSommelierDrawerOpen(false);
        setIsFavoritesDrawerOpen(false);
        setActiveMakerModal(null);
        setIsTenderModalOpen(false);
        setIsAddMakerModalOpen(false);
        setIsMethodologyModalOpen(false);
        setIsCitySelectorModalOpen(false);
        setIsMakerStatsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isVariantDropdownOpen &&
        variantDropdownRef.current &&
        !variantDropdownRef.current.contains(e.target as Node)
      ) {
        setIsVariantDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVariantDropdownOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = hasAnyOverlayOpen || isSearchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasAnyOverlayOpen, isSearchOpen]);

  // Macro Pillar counts (computed on server in catalogSummary)
  const {
    totalMakersCount,
    chocolateMakersCount,
    cakeMakersCount,
    zefirMakersCount,
    popularCities,
  } = catalogSummary;

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
    setFavoriteMakerIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      saveStoredFavorites(next);
      showToast(
        exists
          ? lang === 'uk'
            ? 'Видалено з обраного'
            : 'Удалено из избранного'
          : lang === 'uk'
          ? 'Додано в обране ❤️'
          : 'Добавлено в избранное ❤️'
      );
      return next;
    });
  };

  const clearFavorites = () => {
    saveStoredFavorites([]);
    setFavoriteMakerIds([]);
    setOnlyFavorites(false);
    showToast(lang === 'uk' ? 'Список обраного очищено' : 'Список избранного очищен');
  };

  const openMakerPreview = (maker: CatalogMaker) => {
    setActiveMakerModal(maker);
    setRecentMakers(
      recordRecentMaker({
        id: maker.id,
        slug: maker.slug,
        name: maker.name,
        city: maker.city,
        imageUrl: maker.imageUrl,
      })
    );
  };

  const handleShareMaker = async (maker: CatalogMaker) => {
    const res = await shareOrCopy({
      title: cleanDisplayName(localizeText(maker.name, lang)),
      text: localizeText(maker.specialty, lang),
      url: `${SITE_URL}/maysternya/${maker.slug}`,
    });
    if (res === 'shared') {
      showToast(lang === 'uk' ? 'Посиланням поділилися ✓' : 'Поделились ссылкой ✓');
    } else if (res === 'copied') {
      showToast(lang === 'uk' ? 'Посилання на майстерню скопійовано ✓' : 'Ссылка на мастерскую скопирована ✓');
    }
  };

  const handleCopyPhone = async (maker: CatalogMaker) => {
    const cleanPhone = formatPhoneDisplay(maker.phone);
    if (!cleanPhone || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(cleanPhone);
      setCopiedPhoneMakerId(maker.id);
      showToast(lang === 'uk' ? 'Номер скопійовано ✓' : 'Номер скопирован ✓');
      window.setTimeout(() => {
        setCopiedPhoneMakerId((curr) => (curr === maker.id ? null : curr));
      }, 2200);
    } catch {
      // Clipboard blocked
    }
  };

  const toggleMakerExpand = (id: string) => {
    setExpandedMakerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered & Ranked Makers for the active variant (Top 3 Main Producers first!)
  const filteredMakers = useMemo(() => {
    const targetCategory = activeVariant.categorySlug;
    const preferredIds = activeVariant.preferredMakerIds || [];

    return initialMakers.filter((m) => {
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
      // 0. When a specific city is selected, makers physically located in this city come FIRST!
      if (selectedCity !== 'all') {
        const aDirect = isDirectCityMatch(a, selectedCity);
        const bDirect = isDirectCityMatch(b, selectedCity);
        if (aDirect && !bDirect) return -1;
        if (!aDirect && bDirect) return 1;
      }

      if (sortMode === 'rating') {
        if (b.rating !== a.rating) return b.rating - a.rating;
      }

      // 1. Crafo.com.ua is ALWAYS #1 in chocolate categories (if in all cities or if matching city)
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
    initialMakers,
    activeVariant,
    activeSection,
    sortMode,
    onlyFavorites,
    favoriteMakerIds,
    selectedCity,
    searchQuery,
  ]);

  // Top 3 Flagship Makers for Home Page preview (filters by searchQuery or city if selected)
  const homeTop3Makers = useMemo(() => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return initialMakers.filter(
        (m) =>
          (selectedCity === 'all' || isCityMatch(m, selectedCity)) &&
          (m.name.toLowerCase().includes(q) ||
            m.city.toLowerCase().includes(q) ||
            m.specialty.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q))
      )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    }
    if (selectedCity === 'all') {
      const ids = ['crafo-kharkiv', 'chebakery-kharkiv', 'piolli-zefir'];
      return ids
        .map((id) => initialMakers.find((m) => m.id === id))
        .filter((m): m is CatalogMaker => !!m);
    }
    return initialMakers.filter((m) => isCityMatch(m, selectedCity))
      .sort((a, b) => {
        // Direct city match comes first
        const aDirect = isDirectCityMatch(a, selectedCity);
        const bDirect = isDirectCityMatch(b, selectedCity);
        if (aDirect && !bDirect) return -1;
        if (!aDirect && bDirect) return 1;

        if (a.id === 'crafo-kharkiv') return -1;
        if (b.id === 'crafo-kharkiv') return 1;
        return b.rating - a.rating;
      })
      .slice(0, 3);
  }, [initialMakers, selectedCity, searchQuery]);

  const getMakerHeaderStyle = (maker: CatalogMaker) => {
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
  const renderMakerCard = (maker: CatalogMaker, rankIndex?: number) => {
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

    const phoneNum = extractPhoneDigits(maker.phone);

    return (
      <article
        key={maker.id}
        className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
          isLeader
            ? 'border-2 border-[#e39851] ring-2 ring-[#e39851]/35 shadow-xl'
            : 'border'
        } ${
          isDark
            ? 'bg-[#221711]/90 backdrop-blur-md border-white/15 hover:border-[#f0a556]'
            : 'bg-[#fefcf8]/90 backdrop-blur-md border-[#e1d5c8] hover:border-[#b06a1e] shadow-sm'
        }`}
      >
        {/* Top Visual Showcase */}
        <div
          className="relative h-60 sm:h-68 overflow-hidden cursor-pointer group/img"
          style={{ background: headerMeta.gradient }}
          onClick={() => openMakerPreview(maker)}
        >
          {maker.imageUrl ? (
            <>
              <OptimizedImage
                src={maker.imageUrl}
                alt={maker.name}
                fill
                priority={rankIndex === 0}
                sizes="(max-width: 768px) 100vw, 33vw"
                fallbackWidth={500}
                className="object-cover object-center brightness-105 contrast-105 transition-all duration-500 group-hover:scale-105"
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
          <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap items-center gap-1.5 pr-20">
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

          {/* Top Right Share & Favorite Buttons */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleShareMaker(maker);
            }}
            aria-label={lang === 'uk' ? 'Поділитися майстернею' : 'Поделиться мастерской'}
            title={lang === 'uk' ? 'Поділитися майстернею' : 'Поделиться мастерской'}
            className="absolute right-12 top-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-black/35 text-white/90 hover:bg-black/60 transition active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteMaker(maker.id);
            }}
            aria-label={
              isFav
                ? (lang === 'uk' ? 'Видалити з обраного' : 'Удалить из избранного')
                : (lang === 'uk' ? 'Додати в обране' : 'Добавить в избранное')
            }
            className={`absolute right-3 top-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition active:scale-95 ${
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
              <Link
                href={`/maysternya/${maker.slug}`}
                onClick={() =>
                  setRecentMakers(
                    recordRecentMaker({
                      id: maker.id,
                      slug: maker.slug,
                      name: maker.name,
                      city: maker.city,
                      imageUrl: maker.imageUrl,
                    })
                  )
                }
                className="hover:underline hover:text-[#b06a1e] transition"
              >
                {cleanDisplayName(localizeText(maker.name, lang))}
              </Link>
            </h3>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                isDark ? 'text-[#d4c9be]' : 'text-[#4a382e]'
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
                onClick={() => trackMakerClick(maker.id, 'phone', { category: effectiveCategory, city: maker.city })}
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
                className={`rounded-xl p-3 space-y-1.5 ${
                  isDark ? 'bg-[#1a120e]' : 'bg-[#f1e6da]/70'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong>{lang === 'uk' ? 'Телефон:' : 'Телефон:'}</strong>{' '}
                    {phoneNum && !maker.phone.startsWith('Замовлення') ? (
                      <a
                        href={`tel:+${phoneNum}`}
                        onClick={() =>
                          trackMakerClick(maker.id, 'phone', {
                            category: effectiveCategory,
                            city: maker.city,
                          })
                        }
                        className="font-bold hover:text-[#b06a1e] hover:underline"
                      >
                        {formatPhoneDisplay(maker.phone)}
                      </a>
                    ) : (
                      <span>{localizeText(maker.phone, lang)}</span>
                    )}
                  </div>
                  {phoneNum && !maker.phone.startsWith('Замовлення') && (
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(maker)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border transition ${
                        isDark
                          ? 'border-white/15 bg-white/5 hover:border-[#e39851] text-[#f0a556]'
                          : 'border-[#d4c3b3] bg-white hover:border-[#b06a1e] text-[#462b1f]'
                      }`}
                    >
                      {copiedPhoneMakerId === maker.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{lang === 'uk' ? 'Скопійовано' : 'Скопировано'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#b06a1e]" />
                          <span>{lang === 'uk' ? 'Копіювати' : 'Копировать'}</span>
                        </>
                      )}
                    </button>
                  )}
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

              {/* Secret discreet button for maker's analytics access + profile link */}
              <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                <Link
                  href={`/maysternya/${maker.slug}`}
                  className="text-[11px] font-bold text-[#b06a1e] hover:underline inline-flex items-center gap-1"
                >
                  <span>{lang === 'uk' ? 'Повний профіль майстерні →' : 'Полный профиль мастерской →'}</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatsModalMaker(maker);
                    setIsMakerStatsModalOpen(true);
                  }}
                  aria-label={lang === 'uk' ? 'Статистика майстерні' : 'Статистика мастерской'}
                  className="text-[11px] text-[#4a382e] dark:text-[#d4c9be] hover:text-[#b06a1e] flex items-center gap-1 opacity-80 hover:opacity-100 transition"
                  title="Статистика переходів для виробника"
                >
                  <BarChart2 className="w-3 h-3" />
                  <span>{lang === 'uk' ? 'Статистика майстерні' : 'Статистика мастерской'}</span>
                </button>
              </div>

              {/* Legal source note inside info */}
              <div className={`pt-2 border-t text-[10px] leading-relaxed italic ${isDark ? 'border-white/10 text-[#a89b8f]' : 'border-[#e1d5c8] text-[#7a6858]'}`}>
                {lang === 'uk'
                  ? "Інформація взята з відкритих публічних джерел для ознайомлення споживачів. Якщо ви є власником майстерні та бажаєте оновити дані або видалити профіль — зв'яжіться з нами: "
                  : "Информация взята из открытых публичных источников для ознакомления потребителей. Если вы являетесь владельцем мастерской и желаете обновить данные или удалить профиль — свяжитесь с нами: "}
                <a href="mailto:crafohab@ukr.net" className="underline font-bold hover:text-[#b06a1e]">
                  crafohab@ukr.net
                </a>
              </div>
            </div>
          )}

          {/* Direct Action Buttons: Primary Site/Catalog */}
          <div className="mt-auto flex flex-col gap-2 pt-2">
            <div className="flex items-center gap-2">
              <a
                href={appendUtm(directDestinationUrl, maker.id)}
                onClick={() => {
                  const clickType = cleanDomain.includes('instagram.com') ? 'instagram' : 'website';
                  trackMakerClick(maker.id, clickType, { category: effectiveCategory, city: maker.city });
                }}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs sm:text-sm font-extrabold transition ${
                  isLeader
                    ? 'btn-amber-2027 font-black'
                    : 'btn-primary-2027'
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
                aria-label={
                  isExpanded
                    ? (lang === 'uk' ? 'Згорнути детальну інформацію' : 'Свернуть подробную информацию')
                    : (lang === 'uk' ? 'Розгорнути детальну інформацію' : 'Развернуть подробную информацию')
                }
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

            {/* Quick Order: Viber & Telegram (WhatsApp Removed) */}
            {phoneNum && !maker.phone.startsWith('Замовлення') && (
              <div className="flex items-center gap-2 pt-0.5 text-xs text-[#6e5d50] dark:text-[#b8a99c]">
                <span className="text-[11px] font-medium shrink-0">
                  {lang === 'uk' ? 'Швидке замовлення:' : 'Быстрый заказ:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={`viber://chat?number=%2B${phoneNum}`}
                    onClick={() => trackMakerClick(maker.id, 'phone', { category: effectiveCategory, city: maker.city })}
                    className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-[#7360f2]/15 text-[#5e35b1] dark:text-[#c4b5fd] hover:bg-[#7360f2] hover:text-white border border-[#7360f2]/30 transition"
                    title={lang === 'uk' ? 'Швидке замовлення у Viber' : 'Быстрый заказ в Viber'}
                  >
                    Viber
                  </a>
                  <a
                    href={`https://t.me/+${phoneNum}`}
                    onClick={() => trackMakerClick(maker.id, 'phone', { category: effectiveCategory, city: maker.city })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-[#229ed9]/15 text-[#0088cc] dark:text-[#7dd3fc] hover:bg-[#229ed9] hover:text-white border border-[#229ed9]/30 transition"
                    title={lang === 'uk' ? 'Швидке замовлення у Telegram' : 'Быстрый заказ в Telegram'}
                  >
                    Telegram
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  const visibleBreadcrumbs =
    seoOverride?.breadcrumbs?.map((item) => ({
      label: lang === 'uk' ? item.labelUk : item.labelRu || item.labelUk,
      href: lang === 'uk' ? item.hrefUk : item.hrefRu || item.hrefUk,
    })) || [];

  return (
    <div
      className={`min-h-screen flex flex-col pb-20 sm:pb-0 transition-colors duration-300 craft-grain-overlay ${
        isDark ? 'bg-crafo-aura-dark text-[#eee7dd]' : 'bg-crafo-aura-light text-[#302016]'
      }`}
    >
      {/* STICKY HEADER */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors ${
          isDark ? 'border-white/10 bg-[#170f0b]/90' : 'border-[#e1d5c8]/80 bg-[#faf5ee]/90 shadow-xs'
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
                <span>Crafo<span className="text-[#b06a1e]">Hab</span></span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#b06a1e]">
                  {lang === 'uk' ? 'в Україні' : 'в Украине'}
                </span>
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-medium ${
                  isDark ? 'text-[#d4c9be]' : 'text-[#4a382e]'
                }`}
              >
                crafohab.com.ua
              </span>
            </span>
          </Link>

          {/* Desktop Section Links */}
          <nav className="ml-3 hidden lg:flex items-center gap-1.5">
            <Link
              href={getLocalizedHref('/')}
              onClick={() => setActiveSection('home')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'home'
                  ? 'btn-pill-active'
                  : isDark
                  ? 'dark-btn-glass-pill'
                  : 'btn-glass-pill'
              }`}
            >
              🏠 {lang === 'uk' ? 'Головна' : 'Главная'}
            </Link>
            <Link
              href={getLocalizedHref('/shokolad')}
              onClick={() => handleSelectSection('chocolate')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'chocolate'
                  ? 'btn-pill-active'
                  : isDark
                  ? 'dark-btn-glass-pill'
                  : 'btn-glass-pill'
              }`}
            >
              🍫 {lang === 'uk' ? 'Шоколад і цукерки' : 'Шоколад и конфеты'}
            </Link>
            <Link
              href={getLocalizedHref('/torty')}
              onClick={() => handleSelectSection('cakes')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'cakes'
                  ? 'bg-gradient-to-b from-[#a33857] to-[#79243c] text-white shadow-md'
                  : isDark
                  ? 'dark-btn-glass-pill hover:text-[#f8719d]'
                  : 'btn-glass-pill hover:text-[#8e2f4a]'
              }`}
            >
              🎂 {lang === 'uk' ? 'Торти і десерти' : 'Торты и десерты'}
            </Link>
            <Link
              href={getLocalizedHref('/zefir')}
              onClick={() => handleSelectSection('zefir')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeSection === 'zefir'
                  ? 'btn-amber-2027'
                  : isDark
                  ? 'dark-btn-glass-pill hover:text-[#f59e0b]'
                  : 'btn-glass-pill hover:text-[#b06a1e]'
              }`}
            >
              🌸 {lang === 'uk' ? 'Крафтовий зефір' : 'Крафтовый зефир'}
            </Link>
            <Link
              href="/for-makers"
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 border ${
                isDark
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 shadow-xs'
                  : 'border-amber-600/30 bg-amber-50/90 text-amber-900 hover:bg-amber-100 shadow-xs'
              }`}
            >
              <span>✨</span>
              <span>{lang === 'uk' ? 'Виробникам' : 'Производителям'}</span>
            </Link>
          </nav>

          {/* Right Header Triggers: Search, Favorites, Assortment Drawer, Sommelier Drawer, Lang Switcher */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Button: Command Palette Instant Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={lang === 'uk' ? 'Пошук по каталогу (Ctrl+K)' : 'Поиск по каталогу (Ctrl+K)'}
              title={lang === 'uk' ? 'Пошук по каталогу (Ctrl+K)' : 'Поиск по каталогу (Ctrl+K)'}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                isDark
                  ? 'dark-btn-glass-pill hover:bg-[#462b1f]'
                  : 'btn-glass-pill hover:bg-[#f1e6da]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#b06a1e]" />
              <span className="hidden xl:inline">
                {lang === 'uk' ? 'Пошук' : 'Поиск'}
              </span>
              <kbd className="hidden 2xl:inline-flex items-center rounded border border-[#b06a1e]/30 px-1.5 py-0.5 text-[10px] font-bold opacity-75">
                Ctrl K
              </kbd>
            </button>

            {/* Button: Saved Favorites & Comparison Drawer */}
            <button
              type="button"
              onClick={() => setIsFavoritesDrawerOpen(true)}
              aria-label={lang === 'uk' ? 'Обрані майстерні та порівняння' : 'Избранные мастерские и сравнение'}
              title={lang === 'uk' ? 'Обрані майстерні та порівняння' : 'Избранные мастерские и сравнение'}
              className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                isDark
                  ? 'dark-btn-glass-pill hover:bg-[#462b1f]'
                  : 'btn-glass-pill hover:bg-[#f1e6da]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  favoriteMakerIds.length > 0 ? 'text-[#c75b7a] fill-[#c75b7a]' : 'text-[#b06a1e]'
                }`}
              />
              {favoriteMakerIds.length > 0 && (
                <span className="rounded-full bg-[#c75b7a] text-white px-1.5 py-0.5 text-[10px] leading-none font-extrabold">
                  {favoriteMakerIds.length}
                </span>
              )}
            </button>

            {/* Button: Methodology & Trust */}
            <button
              onClick={() => setIsMethodologyModalOpen(true)}
              aria-label={lang === 'uk' ? 'Стандарти перевірки майстерень' : 'Стандарты проверки мастерских'}
              className={`hidden xl:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                isDark
                  ? 'dark-btn-glass-pill hover:bg-[#462b1f]'
                  : 'btn-glass-pill hover:bg-[#f1e6da]'
              }`}
              title={lang === 'uk' ? 'Стандарти перевірки майстерень' : 'Стандарты проверки мастерских'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'uk' ? 'Як відбираємо' : 'Как отбираем'}</span>
            </button>

            {/* Button 1: Open Right Assortment Drawer */}
            <button
              onClick={() => {
                if (activeSection !== 'home') setDrawerSectionTab(activeSection);
                setIsAssortmentDrawerOpen(true);
              }}
              aria-label={lang === 'uk' ? 'Відкрити асортимент продукції' : 'Открыть ассортимент продукции'}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
                isDark
                  ? 'dark-btn-glass-pill text-[#f0a556]'
                  : 'btn-glass-pill text-[#462b1f]'
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
              aria-label={lang === 'uk' ? 'Підбір подарунка сомельє' : 'Подбор подарка сомелье'}
              className="inline-flex items-center gap-1.5 rounded-full btn-amber-2027 px-3.5 py-1.5 text-xs font-extrabold"
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
                aria-label="Українська мова"
                className={`rounded-full px-2 py-1 transition ${
                  lang === 'uk'
                    ? 'bg-[#462b1f] text-[#faf4eb]'
                    : 'text-[#4a382e] hover:text-[#1a100c]'
                }`}
              >
                УКР
              </button>
              <button
                onClick={() => changeLanguage('ru')}
                aria-label="Русский язык"
                className={`rounded-full px-2 py-1 transition ${
                  lang === 'ru'
                    ? 'bg-[#462b1f] text-[#faf4eb]'
                    : 'text-[#4a382e] hover:text-[#1a100c]'
                }`}
              >
                РУС
              </button>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={
                isDark
                  ? (lang === 'uk' ? 'Увімкнути світлу тему' : 'Включить светлую тему')
                  : (lang === 'uk' ? 'Увімкнути темну тему' : 'Включить темную тему')
              }
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
      <main id="main-content" className="flex-1">
        {activeSection === 'home' ? (
          /* =================================================================
             STEP 1: HOME PAGE — CLEAN, EASY-TO-UNDERSTAND 3-SECTION GATEWAY
          ================================================================= */
          <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 space-y-10">
            {visibleBreadcrumbs.length > 0 && (
              <Breadcrumbs
                items={visibleBreadcrumbs}
                isDark={isDark}
                className="flex justify-center"
              />
            )}

            {/* Clean Grand Hero Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b06a1e]/40 bg-[#e39851]/20 px-3.5 py-1 text-xs font-extrabold text-[#8c4f12] dark:text-[#f0a556]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'uk'
                    ? `CrafoHab • ${totalMakersCount} перевірених майстерень України`
                    : `CrafoHab • ${totalMakersCount} проверенных мастерских Украины`}
                </span>
              </span>

              <h1 className="font-serif text-2xl sm:text-5xl font-bold leading-tight tracking-tight">
                {seoOverride?.h1Uk ? (
                  lang === 'uk' ? seoOverride.h1Uk : seoOverride.h1Ru || seoOverride.h1Uk
                ) : (
                  <>
                    {lang === 'uk' ? 'Крафтовий шоколад, торти та зефір ' : 'Крафтовый шоколад, торты и зефир '}
                    <span className="bg-gradient-to-r from-[#7a4a2b] via-[#b06a1e] to-[#c75b7a] bg-clip-text text-transparent">
                      {lang === 'uk' ? 'від перевірених майстерень України' : 'от проверенных мастерских Украины'}
                    </span>
                  </>
                )}
              </h1>

              <p
                className={`text-xs sm:text-base max-w-2xl mx-auto leading-relaxed ${
                  isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                }`}
              >
                {seoOverride?.leadUk
                  ? lang === 'uk'
                    ? seoOverride.leadUk
                    : seoOverride.leadRu || seoOverride.leadUk
                  : lang === 'uk'
                  ? 'Каталог CrafoHab (crafohab.com.ua), де зібрані майстерні шоколаду, авторських тортів та зефіру: обирайте за фото й ціною за 100 г, порівнюйте склад і переходьте на пряме замовлення.'
                  : 'Каталог CrafoHab (crafohab.com.ua), где собраны мастерские шоколада, авторских тортов и зефира: выбирайте по фото и цене за 100 г, сравнивайте состав и заказывайте напрямую.'}
              </p>

              {/* Quick Triggers Bar without the word "Шторка" */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => {
                    setDrawerSectionTab('chocolate');
                    setIsAssortmentDrawerOpen(true);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition ${
                    isDark
                      ? 'dark-btn-glass-pill hover:bg-[#362820]'
                      : 'btn-glass-pill hover:bg-[#f1e6da]'
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
                  className="inline-flex items-center gap-2 rounded-full btn-amber-2027 px-5 py-2.5 text-xs sm:text-sm font-extrabold"
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
                {popularCities.slice(0, 6).map((city) => {
                  const active = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                        active
                          ? 'btn-pill-active'
                          : isDark
                          ? 'dark-btn-glass-pill'
                          : 'btn-glass-pill'
                      }`}
                    >
                      {lang === 'uk' ? city.uk : city.ru}
                      <span className="ml-1 opacity-60 text-[10px]">({city.count})</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => setIsCitySelectorModalOpen(true)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 ${
                    selectedCity !== 'all' && !popularCities.slice(0, 6).some((c) => c.id === selectedCity)
                      ? 'btn-amber-2027'
                      : isDark
                      ? 'dark-btn-glass-pill text-[#f0a556]'
                      : 'btn-glass-pill text-[#b06a1e]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {selectedCity !== 'all' && !popularCities.slice(0, 6).some((c) => c.id === selectedCity)
                      ? selectedCity
                      : formatCitiesButtonText(popularCities.filter((c) => c.id !== 'all').length, lang)}
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
                  <OptimizedImage
                    src="/images/crafo-collage.webp"
                    alt={lang === 'uk' ? 'Шоколад та цукерки' : 'Шоколад и конфеты'}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackWidth={640}
                    className="object-cover object-center brightness-110 contrast-105 saturate-110 transition-transform duration-500 group-hover:scale-105"
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
                    <div className="flex-1 rounded-full btn-primary-2027 font-black py-3 px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5 transition">
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
                      aria-label={lang === 'uk' ? 'Відкрити асортимент шоколаду справа' : 'Открыть ассортимент шоколада справа'}
                      className="rounded-full btn-glass-pill px-3.5 py-3 text-xs font-extrabold flex items-center gap-1.5 shrink-0"
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
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=75"
                    alt={lang === 'uk' ? 'Авторські торти та десерти' : 'Авторские торты и десерты'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackWidth={600}
                    className="object-cover object-center brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
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
                        ? 'Святкові та мусові торти у шоколадному велюрі, мінімалістичні бенто-торти з вашим написом, дитячі, весільні торти, французькі макарони та еклери.'
                        : 'Праздничные и муссовые торты в шоколадном велюре, минималистичные бенто-торты с вашей надписью, детские, свадебные торты, французские макароны и эклеры.'}
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
                    <div className="flex-1 rounded-full btn-rose-2027 font-black py-3 px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5 transition">
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
                      aria-label={lang === 'uk' ? 'Відкрити асортимент тортів справа' : 'Открыть ассортимент тортов справа'}
                      className="rounded-full btn-glass-pill px-3.5 py-3 text-xs font-extrabold flex items-center gap-1.5 shrink-0"
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
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=75"
                    alt={lang === 'uk' ? 'Крафтовий зефір та букети' : 'Крафтовый зефир и букеты'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackWidth={600}
                    className="object-cover object-center brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
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
                    <div className="flex-1 rounded-full btn-amber-2027 font-black py-3 px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5 transition">
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
                      aria-label={lang === 'uk' ? 'Відкрити асортимент зефіру справа' : 'Открыть ассортимент зефира справа'}
                      className="rounded-full btn-glass-pill px-3.5 py-3 text-xs font-extrabold flex items-center gap-1.5 shrink-0"
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
                    <span>{lang === 'uk' ? 'Індивідуальні замовлення' : 'Индивидуальные заказы'}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                    {lang === 'uk'
                      ? 'Тендерна біржа CrafoHab: один запит — 3–5 пропозицій від майстрів вашого міста'
                      : 'Тендерная биржа CrafoHab: один запрос — 3–5 предложений от мастеров вашего города'}
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full btn-amber-2027 font-black px-6 py-3.5 text-xs sm:text-sm"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{lang === 'uk' ? '🎯 Оголосити тендер безкоштовно' : '🎯 Объявить тендер бесплатно'}</span>
                  </button>
                  <button
                    onClick={() => setIsMethodologyModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full btn-glass-pill font-bold px-5 py-3 text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'uk' ? 'Як ми верифікуємо майстрів' : 'Как мы верифицируем мастеров'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* ===============================================================
                2 TRUST STANDARDS OF CRAFOHAB (ЦІНА ЗА 100 Г + ЧИСТИЙ СКЛАД)
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
                      {lang === 'uk' ? 'Чесна ціна за 100 г' : 'Честная цена за 100 г'}
                    </h3>
                    <span className="text-[11px] font-bold text-[#b06a1e]">
                      {lang === 'uk' ? 'Без хитрощів із вагою' : 'Без уловок с весом'}
                    </span>
                  </div>
                </div>
                <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'}`}>
                  {lang === 'uk'
                    ? 'Коробка цукерок може важити як 70 г, так і 250 г при однаковій зовнішній ціні. CrafoHab автоматично розраховує вартість за 100 грамів для кожного товару, щоб ви бачили чесне співвідношення ціни та об’єму.'
                    : 'Коробка конфет может весить как 70 г, так и 250 г при одинаковой внешней цене. CrafoHab автоматически рассчитывает стоимость за 100 граммов для каждого товара, чтобы вы видели честное соотношение цены и объема.'}
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
                      {lang === 'uk' ? 'Натуральний склад' : 'Натуральный состав'}
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {lang === 'uk' ? 'Без пальмової олії та глазурі' : 'Без пальмового масла и глазури'}
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

            {/* RECENTLY VIEWED MAKERS (if any in localStorage) */}
            {recentMakers.length > 0 && (
              <section
                aria-label={lang === 'uk' ? 'Нещодавно переглянуті' : 'Недавно просмотренные'}
                className={`rounded-2xl border px-4 py-3 flex items-center gap-2.5 overflow-x-auto no-scrollbar ${
                  isDark ? 'bg-[#221711]/80 border-white/10' : 'bg-[#fefbf7]/90 border-[#e1d5c8] shadow-xs'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#b06a1e] shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Нещодавно переглянуті:' : 'Недавно просмотренные:'}</span>
                </span>
                {recentMakers.map((item) => (
                  <Link
                    key={item.id}
                    href={`/maysternya/${item.slug}`}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition ${
                      isDark
                        ? 'bg-[#2e1e16] border-white/15 text-[#eee7dd] hover:border-[#e39851]'
                        : 'bg-white border-[#d4c3b3] text-[#302016] hover:border-[#b06a1e] hover:bg-[#fff8ef]'
                    }`}
                  >
                    <span className="truncate max-w-[180px]">
                      {cleanDisplayName(localizeText(item.name, lang))}
                    </span>
                    <span className="opacity-65 text-[10px]">
                      • {localizeText(item.city, lang)}
                    </span>
                  </Link>
                ))}
              </section>
            )}

            {/* FLAGSHIP TOP-3 SHOWCASE ON HOME */}
            <section className="space-y-5 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e1d5c8] pb-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
                    {lang === 'uk'
                      ? 'Вибір редакції'
                      : 'Выбор редакции'}
                  </span>
                  <h2 className="font-serif text-xl sm:text-3xl font-bold mt-0.5">
                    {lang === 'uk'
                      ? 'Три майстерні, з яких варто почати'
                      : 'Три мастерские, с которых стоит начать'}
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
          <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 space-y-6">
            {visibleBreadcrumbs.length > 0 && (
              <Breadcrumbs items={visibleBreadcrumbs} isDark={isDark} />
            )}

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
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mt-1">
                      {seoOverride?.h1Uk
                        ? lang === 'uk'
                          ? seoOverride.h1Uk
                          : seoOverride.h1Ru || seoOverride.h1Uk
                        : lang === 'uk'
                        ? `${activeVariant.titleUk} — кращі крафтові виробники України`
                        : `${activeVariant.titleRu} — лучшие крафтовые производители Украины`}
                    </h1>
                    <p
                      className={`text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed ${
                        isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                      }`}
                    >
                      {seoOverride?.leadUk
                        ? lang === 'uk'
                          ? seoOverride.leadUk
                          : seoOverride.leadRu || seoOverride.leadUk
                        : lang === 'uk'
                        ? activeVariant.shortDescUk
                        : activeVariant.shortDescRu}
                    </p>
                    {seoOverride?.statsBanner && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-bold">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${
                            isDark
                              ? 'bg-[#261b16] border-white/15 text-[#eee7dd]'
                              : 'bg-[#fefbf7] border-[#d9c8b8] text-[#302016]'
                          }`}
                        >
                          ✅{' '}
                          {seoOverride.statsBanner.cityLabelUk
                            ? seoOverride.statsBanner.localCount && seoOverride.statsBanner.localCount > 0
                              ? lang === 'uk'
                                ? `${seoOverride.statsBanner.localCount} локальних + ${seoOverride.statsBanner.makersCount} у каталозі`
                                : `${seoOverride.statsBanner.localCount} локальных + ${seoOverride.statsBanner.makersCount} в каталоге`
                              : lang === 'uk'
                              ? `${seoOverride.statsBanner.makersCount} майстерень із доставкою у ${seoOverride.statsBanner.cityLabelUk}`
                              : `${seoOverride.statsBanner.makersCount} мастерских с доставкой в ${seoOverride.statsBanner.cityLabelRu || seoOverride.statsBanner.cityLabelUk}`
                            : lang === 'uk'
                            ? `${seoOverride.statsBanner.makersCount} перевірених майстерень`
                            : `${seoOverride.statsBanner.makersCount} проверенных мастерских`}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${
                            isDark
                              ? 'bg-[#261b16] border-white/15 text-[#e39851]'
                              : 'bg-[#fff8ef] border-[#e39851]/40 text-[#8b4c10]'
                          }`}
                        >
                          💰{' '}
                          {lang === 'uk'
                            ? `Ціни: від ${seoOverride.statsBanner.minPriceUah} до ${seoOverride.statsBanner.maxPriceUah} грн`
                            : `Цены: от ${seoOverride.statsBanner.minPriceUah} до ${seoOverride.statsBanner.maxPriceUah} грн`}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${
                            isDark
                              ? 'bg-[#261b16] border-white/15 text-[#9fd8b1]'
                              : 'bg-[#effaf3] border-[#75be8f]/40 text-[#1d6438]'
                          }`}
                        >
                          🤝 {lang === 'uk' ? '0% комісії • напряму' : '0% комиссии • напрямую'}
                        </span>
                      </div>
                    )}
                    <p className="text-xs sm:text-sm font-bold text-[#b06a1e] mt-1.5">
                      {lang === 'uk'
                        ? 'Крок 1. Оберіть потрібний варіант продукту:'
                        : 'Шаг 1. Выберите нужный вариант продукта:'}
                    </p>
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
                ref={variantDropdownRef}
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
                      <OptimizedImage
                        src={activeVariant.imageUrl}
                        alt={lang === 'uk' ? activeVariant.titleUk : activeVariant.titleRu}
                        fill
                        sizes="64px"
                        fallbackWidth={150}
                        className="object-cover object-center"
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
                              <OptimizedImage
                                src={variant.imageUrl}
                                alt={lang === 'uk' ? variant.titleUk : variant.titleRu}
                                fill
                                sizes="48px"
                                fallbackWidth={120}
                                className="object-cover object-center"
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
                              <p className="text-[11px] text-[#4a382e] dark:text-[#d4c9be] line-clamp-1 mt-0.5">
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
                {popularCities.slice(0, 6).map((city) => {
                  const active = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                        active
                          ? 'btn-pill-active'
                          : isDark
                          ? 'dark-btn-glass-pill'
                          : 'btn-glass-pill'
                      }`}
                    >
                      {lang === 'uk' ? city.uk : city.ru}
                    </button>
                  );
                })}
                <button
                  onClick={() => setIsCitySelectorModalOpen(true)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedCity !== 'all' && !popularCities.slice(0, 6).some((c) => c.id === selectedCity)
                      ? 'btn-amber-2027'
                      : isDark
                      ? 'dark-btn-glass-pill text-[#f0a556]'
                      : 'btn-glass-pill text-[#b06a1e]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {selectedCity !== 'all' && !popularCities.slice(0, 6).some((c) => c.id === selectedCity)
                      ? selectedCity
                      : formatCitiesButtonText(popularCities.filter((c) => c.id !== 'all').length, lang)}
                  </span>
                </button>
              </div>

              {/* Inline Filter & Sort Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-[#e1d5c8]/60 dark:border-white/10">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#b06a1e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'uk'
                        ? 'Пошук майстерні або міста...'
                        : 'Поиск мастерской или города...'
                    }
                    aria-label={
                      lang === 'uk'
                        ? 'Пошук майстерні або міста'
                        : 'Поиск мастерской или города'
                    }
                    className={`w-full rounded-full border pl-9 pr-8 py-2 text-xs font-medium outline-none transition ${
                      isDark
                        ? 'bg-[#1a120e] border-white/15 text-[#eee7dd] placeholder:text-[#8c7a6b] focus:border-[#e39851]'
                        : 'bg-white border-[#d4c3b3] text-[#302016] placeholder:text-[#8c7a6b] focus:border-[#b06a1e]'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={lang === 'uk' ? 'Очистити пошук' : 'Очистить поиск'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#7a6858] hover:text-[#b06a1e]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setOnlyFavorites((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold border transition ${
                      onlyFavorites
                        ? 'bg-[#c75b7a] border-[#c75b7a] text-white shadow-xs'
                        : isDark
                        ? 'bg-[#2a1d17] border-white/15 text-[#eee7dd] hover:border-[#c75b7a]'
                        : 'bg-white border-[#d4c3b3] text-[#462b1f] hover:border-[#c75b7a]'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        onlyFavorites || favoriteMakerIds.length > 0 ? 'fill-current' : ''
                      }`}
                    />
                    <span>
                      {lang === 'uk' ? 'Обрані' : 'Избранное'}
                      {favoriteMakerIds.length > 0 ? ` (${favoriteMakerIds.length})` : ''}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSortMode((prev) => (prev === 'recommended' ? 'rating' : 'recommended'))
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold border transition ${
                      sortMode === 'rating'
                        ? 'bg-[#b06a1e] border-[#b06a1e] text-white shadow-xs'
                        : isDark
                        ? 'bg-[#2a1d17] border-white/15 text-[#eee7dd] hover:border-[#e39851]'
                        : 'bg-white border-[#d4c3b3] text-[#462b1f] hover:border-[#b06a1e]'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>
                      {sortMode === 'recommended'
                        ? lang === 'uk'
                          ? 'Рекомендовані'
                          : 'Рекомендуемые'
                        : lang === 'uk'
                        ? 'За рейтингом ★'
                        : 'По рейтингу ★'}
                    </span>
                  </button>
                </div>
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
                <div
                  className={`rounded-3xl border p-8 text-center space-y-3 ${
                    isDark
                      ? 'border-white/15 bg-[#221711] text-[#eee7dd]'
                      : 'border-[#e1d5c8] bg-[#fefbf7] text-[#302016]'
                  }`}
                >
                  <p className="text-base font-bold">
                    {onlyFavorites
                      ? lang === 'uk'
                        ? 'У вибраному ще немає майстерень цієї рубрики'
                        : 'В избранном еще нет мастерских этой рубрики'
                      : searchQuery.trim() !== ''
                      ? lang === 'uk'
                        ? `За запитом «${searchQuery}» майстерень не знайдено`
                        : `По запросу «${searchQuery}» мастерских не найдено`
                      : lang === 'uk'
                      ? 'У вибраному місті майстерень цієї рубрики не знайдено'
                      : 'В выбранном городе мастерских этой рубрики не найдено'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('all');
                      setSearchQuery('');
                      setOnlyFavorites(false);
                    }}
                    className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] px-5 py-2.5 text-xs font-bold text-white transition"
                  >
                    {lang === 'uk'
                      ? 'Скинути фільтри та показати всю Україну'
                      : 'Сбросить фильтры и показать всю Украину'}
                  </button>
                </div>
              ) : (
                <>
                  {/* THE TOP 3 MAIN PRODUCERS (3 CARDS) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {filteredMakers.slice(0, 3).map((maker, idx) => renderMakerCard(maker, idx))}
                  </div>

                  {/* REMAINING PRODUCERS AS A COLLAPSIBLE DIRECTORY LIST */}
                  {filteredMakers.length > 3 && (
                    <div className="space-y-4 pt-6 border-t border-[#e1d5c8]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbf6ee] dark:bg-[#261b16] rounded-2xl p-4 sm:p-5 border border-[#e1d5c8] dark:border-white/10">
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

                        <button
                          type="button"
                          onClick={() => setShowAllMakers((prev) => !prev)}
                          className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition shrink-0 ${
                            showAllMakers
                              ? 'btn-primary-2027'
                              : isDark
                              ? 'dark-btn-glass-pill hover:bg-[#462b1f]'
                              : 'btn-glass-pill'
                          }`}
                        >
                          <span>
                            {showAllMakers
                              ? lang === 'uk'
                                ? 'Сховати список майстерень'
                                : 'Скрыть список мастерских'
                              : lang === 'uk'
                              ? `Показати список (${filteredMakers.length - 3})`
                              : `Показать список (${filteredMakers.length - 3})`}
                          </span>
                          {showAllMakers ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {showAllMakers && (
                        <>
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
                                        onClick={() => openMakerPreview(maker)}
                                        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-black/10 bg-[#3a2113] cursor-pointer group"
                                      >
                                        <OptimizedImage
                                          src={maker.imageUrl}
                                          alt={maker.name}
                                          fill
                                          sizes="56px"
                                          fallbackWidth={120}
                                          className="object-cover object-center transition-transform group-hover:scale-110"
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

                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#4a382e] dark:text-[#d4c9be]">
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
                                      onClick={() => openMakerPreview(maker)}
                                      className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                                        isDark
                                          ? 'border-white/15 text-[#f0a556] hover:bg-white/10'
                                          : 'border-[#d4c3b3] text-[#462b1f] hover:bg-[#f1e6da]'
                                      }`}
                                    >
                                      {lang === 'uk' ? 'Детальніше' : 'Подробнее'}
                                    </button>

                                    <a
                                      href={appendUtm(directDestinationUrl, maker.id)}
                                      onClick={() => {
                                        const clickType = cleanDomain.includes('instagram.com') ? 'instagram' : 'website';
                                        trackMakerClick(maker.id, clickType, { category: effectiveCategory, city: maker.city });
                                      }}
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

                          <div className="text-center pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAllMakers(false);
                                const el = document.getElementById('makers-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b06a1e] hover:underline"
                            >
                              <span>{lang === 'uk' ? 'Сховати список майстерень ▴' : 'Скрыть список мастерских ▴'}</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* SHARED BOTTOM SECTIONS: SEO GUIDE, BLOG & FAQ */}
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 space-y-10 cv-auto">
          {seoOverride?.articleUk && (
            <section
              aria-label={lang === 'uk' ? 'Експертний гід' : 'Экспертный гид'}
              className={`rounded-3xl border p-6 sm:p-8 space-y-3 shadow-xs ${
                isDark
                  ? 'bg-[#261b16] border-white/15 text-[#eee7dd]'
                  : 'bg-[#fefbf7] border-[#e1d5c8] text-[#302016]'
              }`}
            >
              {seoOverride.articleTitleUk && (
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {lang === 'uk'
                    ? seoOverride.articleTitleUk
                    : seoOverride.articleTitleRu || seoOverride.articleTitleUk}
                </h2>
              )}
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                }`}
              >
                {lang === 'uk'
                  ? seoOverride.articleUk
                  : seoOverride.articleRu || seoOverride.articleUk}
              </p>
            </section>
          )}

          {seoOverride?.relatedLinks && seoOverride.relatedLinks.length > 0 && (
            <section
              aria-label={lang === 'uk' ? 'Схожі запити та сусідні категорії' : 'Похожие запросы и соседние категории'}
              className={`rounded-3xl border p-5 sm:p-6 space-y-5 ${
                isDark ? 'bg-[#211713] border-white/15' : 'bg-[#fefbf7] border-[#e1d5c8]'
              }`}
            >
              {seoOverride.relatedLinks.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2.5">
                  <h2 className="font-serif text-base sm:text-lg font-bold">
                    {lang === 'uk' ? group.titleUk : group.titleRu}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => {
                      const targetHref =
                        lang === 'ru' && item.hrefRu
                          ? item.hrefRu
                          : getLocalizedHref(item.hrefUk);
                      return (
                        <Link
                          key={item.hrefUk}
                          href={targetHref}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                            isDark
                              ? 'bg-[#261b16] border-white/15 text-[#eee7dd] hover:border-[#e39851]'
                              : 'bg-[#f8f1e7] border-[#d4c3b3] text-[#302016] hover:border-[#b06a1e]'
                          }`}
                        >
                          {lang === 'uk' ? item.labelUk : item.labelRu}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* POPULAR PROGRAMMATIC CLUSTERS INTERLINKING */}
          <section
            aria-label={lang === 'uk' ? 'Популярні пошукові підбірки та подарунки' : 'Популярные поисковые подборки и подарки'}
            className={`rounded-3xl border p-5 sm:p-6 space-y-3 ${
              isDark ? 'bg-[#211713] border-white/15' : 'bg-[#fefbf7] border-[#e1d5c8]'
            }`}
          >
            <h2 className="font-serif text-base sm:text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b06a1e]" />
              <span>
                {lang === 'uk'
                  ? 'Популярні пошуки, подарунки та дієтичні підбірки:'
                  : 'Популярные поиски, подарки и диетические подборки:'}
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEO_SHORTCUTS.map((sc) => {
                const targetHref =
                  lang === 'ru' && sc.hrefRu ? sc.hrefRu : getLocalizedHref(sc.hrefUk);
                return (
                  <Link
                    key={sc.hrefUk}
                    href={targetHref}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                      isDark
                        ? 'bg-[#261b16] border-white/15 text-[#eee7dd] hover:border-[#e39851]'
                        : 'bg-[#fbf6ee] border-[#d4c3b3] text-[#302016] hover:border-[#b06a1e]'
                    }`}
                  >
                    {sc.emoji} {lang === 'uk' ? sc.labelUk : sc.labelRu}
                  </Link>
                );
              })}
            </div>
          </section>

          <section
            aria-label={lang === 'uk' ? 'Популярні міста України' : 'Популярные города Украины'}
            className={`rounded-3xl border p-5 sm:p-6 space-y-3 ${
              isDark ? 'bg-[#211713] border-white/15' : 'bg-[#f1e6da]/50 border-[#e1d5c8]'
            }`}
          >
            <h2 className="font-serif text-base sm:text-lg font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#b06a1e]" />
              <span>
                {lang === 'uk'
                  ? 'Крафтові майстерні у містах України:'
                  : 'Крафтовые мастерские в городах Украины:'}
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {CITY_HUB_LINKS.map((city) => (
                <Link
                  key={city.slug}
                  href={getLocalizedHref(`/misto/${city.slug}`)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                    isDark
                      ? 'bg-[#261b16] border-white/15 text-[#eee7dd] hover:border-[#e39851]'
                      : 'bg-[#fefbf7] border-[#d4c3b3] text-[#302016] hover:border-[#b06a1e]'
                  }`}
                >
                  📍 {lang === 'uk' ? city.cityNameUk : city.cityNameRu}
                </Link>
              ))}
            </div>
          </section>

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
                      ? 'Блог CrafoHab • Поради покупцям'
                      : 'Блог CrafoHab • Советы покупателям'}
                  </span>
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {lang === 'uk'
                    ? 'Як обрати справжній крафтовий шоколад, букет або торт'
                    : 'Как выбрать настоящий крафтовый шоколад, букет или торт'}
                </h2>
              </div>
              <Link
                href={getLocalizedHref('/blog')}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#462b1f] hover:bg-[#5c3929] px-5 py-2.5 text-xs font-extrabold text-[#faf4eb] shadow-sm transition shrink-0"
              >
                <span>{lang === 'uk' ? 'Усі статті блогу' : 'Все статьи блога'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {BLOG_PREVIEW_CARDS.map((article) => (
                <article
                  key={article.slug}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-lg ${
                    isDark ? 'bg-[#211713] border-white/15' : 'bg-white border-[#e1d5c8]'
                  }`}
                >
                  <Link
                    href={getLocalizedHref(`/blog/${article.slug}`)}
                    className="relative h-52 sm:h-60 w-full overflow-hidden block bg-[#f3e9dc]"
                  >
                    <OptimizedImage
                      src={article.heroImage}
                      alt={lang === 'uk' ? article.titleUk : article.titleRu}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      fallbackWidth={500}
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                    <Link href={getLocalizedHref(`/blog/${article.slug}`)}>
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

          {/* FAQ (Semantic details/summary so 100% of answers match JSON-LD in SSR HTML) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#b06a1e]" />
              <h2 className="font-serif text-lg sm:text-2xl font-bold">
                {lang === 'uk' ? 'Часті запитання покупців' : 'Частые вопросы покупателей'}
              </h2>
            </div>

            <div className="space-y-2.5">
              {(seoOverride?.faqUk && seoOverride.faqUk.length > 0
                ? seoOverride.faqUk.map((item, idx) => ({
                    qUk: item.q,
                    aUk: item.a,
                    qRu: seoOverride.faqRu?.[idx]?.q || item.q,
                    aRu: seoOverride.faqRu?.[idx]?.a || item.a,
                  }))
                : HOME_FAQ
              ).map((faq, idx) => (
                <details
                  key={idx}
                  open={idx === 0}
                  className={`group rounded-2xl border transition ${
                    isDark ? 'bg-[#261b16] border-white/15' : 'bg-[#fefbf7] border-[#e1d5c8]'
                  }`}
                >
                  <summary className="cursor-pointer list-none px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm [&::-webkit-details-marker]:hidden">
                    <span>{lang === 'uk' ? faq.qUk : faq.qRu}</span>
                    <ChevronDown className="w-4 h-4 text-[#b06a1e] shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-4 text-xs sm:text-sm opacity-85 leading-relaxed border-t border-[#e1d5c8]/50 pt-3">
                    {lang === 'uk' ? faq.aUk : faq.aRu}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`border-t py-8 px-4 sm:px-6 ${
          isDark
            ? 'bg-[#140d0a] border-white/10 text-[#d4c9be]'
            : 'bg-[#f1e6da] border-[#e1d5c8] text-[#4a382e]'
        }`}
      >
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div>
            <strong className={isDark ? 'text-white' : 'text-[#302016]'}>
              CrafoHab Україна (crafohab.com.ua)
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
            <Link href="/maysternya" className="hover:text-[#b06a1e]">
              🏭 {lang === 'uk' ? `Усі ${totalMakersCount} майстерень` : `Все ${totalMakersCount} мастерских`}
            </Link>
            <button
              onClick={() => setIsMethodologyModalOpen(true)}
              aria-label={lang === 'uk' ? 'Методологія відбору' : 'Методология отбора'}
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
              aria-label={lang === 'uk' ? 'Додати майстерню' : 'Добавить мастерскую'}
              className="hover:text-[#b06a1e]"
            >
              + {lang === 'uk' ? 'Додати майстерню' : 'Добавить мастерскую'}
            </button>
            <Link
              href="/for-makers"
              className="hover:text-[#b06a1e] flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold"
            >
              <span>✨</span>
              <span>{lang === 'uk' ? 'Виробникам (0% комісія)' : 'Производителям (0% комиссия)'}</span>
            </Link>
            <Link
              href="/partner/stats"
              className="text-[#4a382e] dark:text-[#d4c9be] hover:text-[#b06a1e] flex items-center gap-1 font-normal"
              title="Закритий кабінет статистики переходів"
            >
              <BarChart2 className="w-3.5 h-3.5 opacity-70" />
              <span>{lang === 'uk' ? 'Кабінет майстра (PIN)' : 'Кабинет мастера (PIN)'}</span>
            </Link>
            <Link
              href="/privacy"
              className="text-[#4a382e] dark:text-[#d4c9be] hover:text-[#b06a1e] font-normal"
            >
              {lang === 'uk' ? 'Політика конфіденційності' : 'Политика конфиденциальности'}
            </Link>
          </div>
        </div>

        {/* Legal Disclaimer / Публічне юридичне роз'яснення */}
        <div className={`mt-6 pt-5 border-t text-[11px] leading-relaxed max-w-4xl mx-auto text-center ${
          isDark ? 'border-white/10 text-[#a89b8f]' : 'border-[#e1d5c8] text-[#7a6858]'
        }`}>
          <p>
            {lang === 'uk'
              ? "Інформація взята з відкритих публічних джерел для ознайомлення споживачів. Якщо ви є власником майстерні та бажаєте оновити дані або видалити профіль — зв'яжіться з нами: "
              : "Информация взята из открытых публичных источников для ознакомления потребителей. Если вы являетесь владельцем мастерской и желаете обновить данные или удалить профиль — свяжитесь с нами: "}
            <a
              href="mailto:crafohab@ukr.net"
              className="font-bold underline hover:text-[#b06a1e] transition ml-1"
            >
              crafohab@ukr.net
            </a>
          </p>
        </div>
      </footer>

      {/* =====================================================================
          STICKY MOBILE BOTTOM NAVIGATION BAR (2026 5-Button Bar + Safe Area)
      ===================================================================== */}
      <nav
        aria-label="Мобільна навігація"
        className={`sm:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] grid grid-cols-5 gap-1 ${
          isDark
            ? 'bg-[#1a120e]/95 border-white/15 text-[#eee7dd]'
            : 'bg-[#fefbf7]/95 border-[#d9c8b8] text-[#302016]'
        }`}
      >
        <Link
          href={getLocalizedHref('/')}
          onClick={() => setActiveSection('home')}
          aria-label={lang === 'uk' ? 'Розділи' : 'Разделы'}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-extrabold ${
            activeSection === 'home' ? 'text-[#b06a1e] bg-[#b06a1e]/10' : ''
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Розділи' : 'Разделы'}</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          aria-label={lang === 'uk' ? 'Пошук' : 'Поиск'}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-extrabold"
        >
          <Search className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Пошук' : 'Поиск'}</span>
        </button>

        <button
          onClick={() => {
            if (activeSection !== 'home') setDrawerSectionTab(activeSection);
            setIsAssortmentDrawerOpen(true);
          }}
          aria-label={lang === 'uk' ? 'Асортимент' : 'Ассортимент'}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-extrabold"
        >
          <LayoutList className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Асортимент' : 'Ассортимент'}</span>
        </button>

        <button
          onClick={() => setIsSommelierDrawerOpen(true)}
          aria-label={lang === 'uk' ? 'Сомельє' : 'Сомелье'}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-extrabold"
        >
          <Wand2 className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Сомельє' : 'Сомелье'}</span>
        </button>

        <button
          onClick={() => setIsTenderModalOpen(true)}
          aria-label={lang === 'uk' ? 'Замовити індивідуально' : 'Заказать индивидуально'}
          className="flex flex-col items-center justify-center py-1 rounded-xl bg-[#b06a1e] text-white text-[10px] font-extrabold"
        >
          <Gift className="w-4 h-4" />
          <span className="mt-0.5">{lang === 'uk' ? 'Замовити' : 'Заказать'}</span>
        </button>
      </nav>

      {/* Toast Micro-Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 left-1/2 z-50 rounded-full bg-[#302016] text-white border border-[#e39851]/60 px-4 py-2 text-xs font-extrabold shadow-2xl animate-toast-in whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}

      <BackToTopButton lang={lang} isDark={isDark} />

      {isSearchOpen && (
        <CommandPaletteModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          lang={lang}
          isDark={isDark}
        />
      )}

      {hasAnyOverlayOpen && (
        <ChocoModalsAndDrawers
          lang={lang}
          isDark={isDark}
          activeSection={activeSection}
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          activeVariant={activeVariant}
          getVariantUrl={getVariantUrl}
          handleSelectVariant={handleSelectVariant}
          catalogSummary={catalogSummary}
          isAssortmentDrawerOpen={isAssortmentDrawerOpen}
          setIsAssortmentDrawerOpen={setIsAssortmentDrawerOpen}
          drawerSectionTab={drawerSectionTab}
          setDrawerSectionTab={setDrawerSectionTab}
          isSommelierDrawerOpen={isSommelierDrawerOpen}
          setIsSommelierDrawerOpen={setIsSommelierDrawerOpen}
          isFavoritesDrawerOpen={isFavoritesDrawerOpen}
          setIsFavoritesDrawerOpen={setIsFavoritesDrawerOpen}
          favoriteMakerIds={favoriteMakerIds}
          toggleFavoriteMaker={toggleFavoriteMaker}
          clearFavorites={clearFavorites}
          activeMakerModal={activeMakerModal}
          setActiveMakerModal={setActiveMakerModal}
          isTenderModalOpen={isTenderModalOpen}
          setIsTenderModalOpen={setIsTenderModalOpen}
          tenderCategory={tenderCategory}
          setTenderCategory={setTenderCategory}
          isMethodologyModalOpen={isMethodologyModalOpen}
          setIsMethodologyModalOpen={setIsMethodologyModalOpen}
          isCitySelectorModalOpen={isCitySelectorModalOpen}
          setIsCitySelectorModalOpen={setIsCitySelectorModalOpen}
          isAddMakerModalOpen={isAddMakerModalOpen}
          setIsAddMakerModalOpen={setIsAddMakerModalOpen}
          selectedPlanForModal={selectedPlanForModal}
          isMakerStatsModalOpen={isMakerStatsModalOpen}
          setIsMakerStatsModalOpen={setIsMakerStatsModalOpen}
          statsModalMaker={statsModalMaker}
          setStatsModalMaker={setStatsModalMaker}
        />
      )}
    </div>
  );
}
