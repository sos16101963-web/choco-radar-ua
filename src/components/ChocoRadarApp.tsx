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

// Direct link to a category page on the maker's site (manual > auto-discovered). null = no verified link.
function getMakerCategoryUrl(maker: CraftMaker, cat: CategorySlug): string | null {
  if (cat === 'all') return null;
  return maker.categoryUrls?.[cat] || DISCOVERED_CATEGORY_URLS[maker.id]?.[cat] || null;
}
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
  Instagram,
  Moon,
  Sun,
  Calculator,
  Heart,
  HelpCircle,
  Wand2,
  BookOpen,
} from 'lucide-react';

interface ChocoRadarAppProps {
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
    uk: 'Шоколадні квіти і букети',
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

const SEGMENT_GROUPS: {
  id: MakerSegment;
  titleUk: string;
  titleRu: string;
  subtitleUk: string;
  subtitleRu: string;
  gradient: string;
}[] = [
  {
    id: 'bean-to-bar',
    titleUk: '1. Плитка шоколаду, батончик (Від какао-боба до плитки)',
    titleRu: '1. Плитка шоколада, батончик (От какао-боба до плитки)',
    subtitleUk:
      'Виробники ремісничих плиток шоколаду та крафтових батончиків із фермерських какао-бобів Fino de Aroma та Criollo.',
    subtitleRu:
      'Производители ремесленных плиток шоколада и крафтовых батончиков из фермерских какао-бобов Fino de Aroma и Criollo.',
    gradient: 'linear-gradient(135deg, #7a4a2b 0%, #3a2113 100%)',
  },
  {
    id: 'chocolatier-bonbons',
    titleUk: '2. Шоколатьє: плитка шоколаду, батончик, цукерки та шоколадні квіти',
    titleRu: '2. Шоколатье: плитка шоколада, батончик, конфеты и шоколадные цветы',
    subtitleUk:
      'Авторські плитки шоколаду, батончики, корпусні цукерки з художнім розписом, шоколадні букети, трюфелі та сирні цукерки.',
    subtitleRu:
      'Авторские плитки шоколада, батончики, корпусные конфеты с художественной росписью, шоколадные букеты, трюфели и сырные конфеты.',
    gradient: 'linear-gradient(135deg, #8b4d27 0%, #462b1f 100%)',
  },
  {
    id: 'healthy-vegan',
    titleUk: '3. Без цукру та Для дітей (Натуральний шоколад, батончики на керобі і меду)',
    titleRu: '3. Без сахара и Для детей (Натуральный шоколад, батончики на кэробе и меду)',
    subtitleUk:
      'Шоколадні плитки, батончики, пастила та цукерки без білого цукру, лактози й глютену, а також безпечні солодощі для дітей.',
    subtitleRu:
      'Шоколадные плитки, батончики, пастила и конфеты без белого сахара, лактозы и глютена, а также безопасные сладости для детей.',
    gradient: 'linear-gradient(135deg, #3c7a47 0%, #1f4728 100%)',
  },
  {
    id: 'flowers-berries-nuts',
    titleUk: '4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді',
    titleRu: '4. Шоколадные цветы, букеты, малина, клубника и орехи в шоколаде',
    subtitleUk:
      'Букети з бельгійського шоколаду, свіжа й сублімована полуниця та малина в шоколаді, чорнослив і горіхове драже.',
    subtitleRu:
      'Букеты из бельгийского шоколада, свежая и сублимированная клубника и малина в шоколаде, чернослив и ореховое драже.',
    gradient: 'linear-gradient(135deg, #b53f61 0%, #6b1d35 100%)',
  },
  {
    id: 'craft-zefir-pastila',
    titleUk: '5. Крафтовий зефір ручної роботи, зефірні букети та пастила',
    titleRu: '5. Крафтовый зефир ручной работы, зефирные букеты и пастила',
    subtitleUk:
      'Натуральний зефір на агар-агарі з живого ягідного пюре, букети з зефірних півоній і троянд та ягідна пастила.',
    subtitleRu:
      'Натуральный зефир на агар-агаре из живого ягодного пюре, букеты из зефирных пионов и роз и ягодная пастила.',
    gradient: 'linear-gradient(135deg, #e0a866 0%, #b06a1e 100%)',
  },
  {
    id: 'custom-cakes-pastry',
    titleUk: '6. Авторські торти на замовлення, бенто-торти та кондитерські ательє',
    titleRu: '6. Авторские торты на заказ, бенто-торты и кондитерские ателье',
    subtitleUk:
      'Святкові, весільні, дитячі та корпоративні торти, мусові десерти в шоколадному велюрі, бенто-торти та макарони.',
    subtitleRu:
      'Праздничные, свадебные, детские и корпоративные торты, муссовые десерты в шоколадном велюре, бенто-торты и макароны.',
    gradient: 'linear-gradient(135deg, #c75b7a 0%, #8e2f4a 100%)',
  },
];

const LIVE_BUYER_REQUESTS = [
  {
    id: 'req-1',
    cityUk: 'Харків / Доставка НП',
    cityRu: 'Харьков / Доставка НП',
    catUk: '🍫 Шоколадні плитки, батончики та букет шоколадних троянд (Crafo)',
    catRu: '🍫 Шоколадные плитки, батончики и букет шоколадных роз (Crafo)',
    budgetUk: '4 200 грн',
    budgetRu: '4 200 грн',
    timeUk: '12 хв тому',
    timeRu: '12 мин назад',
  },
  {
    id: 'req-2',
    cityUk: 'Київ / Вся Україна',
    cityRu: 'Киев / Вся Украина',
    catUk: '🎁 Корпоративні шоколадні та зефірні набори (55 боксів)',
    catRu: '🎁 Корпоративные шоколадные и зефирные наборы (55 боксов)',
    budgetUk: '38 500 грн',
    budgetRu: '38 500 грн',
    timeUk: '34 хв тому',
    timeRu: '34 мин назад',
  },
  {
    id: 'req-3',
    cityUk: 'Львів / Дніпро / Одеса',
    cityRu: 'Львов / Днепр / Одесса',
    catUk: '🎂 Дитячий авторський торт + солодощі без цукру для дітей',
    catRu: '🎂 Детский авторский торт + сладости без сахара для детей',
    budgetUk: '3 400 грн',
    budgetRu: '3 400 грн',
    timeUk: '50 хв тому',
    timeRu: '50 мин назад',
  },
];

// Simple Ukrainian-to-Russian dynamic text helper for database descriptions when RU is active
function localizeText(text: string, lang: Lang): string {
  if (lang === 'uk' || !text) return text;
  return text
    .replace(/№1 Лідер категорії Шоколад/g, '№1 Лидер категории Шоколад')
    .replace(/Офіційний лідер рейтингу крафтового шоколаду України/g, 'Официальный лидер рейтинга крафтового шоколада Украины')
    .replace(/виготовляють преміальні шоколадні плитки ручної роботи/g, 'изготавливают премиальные шоколадные плитки ручной работы')
    .replace(/авторські корпусні та трюфельні цукерки/g, 'авторские корпусные и трюфельные конфеты')
    .replace(/реалістичні букети з шоколадних квітів та подарункові бокси зі 100% бельгійського шоколаду/g, 'реалистичные букеты из шоколадных цветов и подарочные боксы из 100% бельгийского шоколада')
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
  initialCategory = 'all',
  initialCity = 'all',
}: ChocoRadarAppProps) {
  // Language state: 'uk' by default, switchable to 'ru' at the top
  const [lang, setLang] = useState<Lang>('uk');
  const [isDark, setIsDark] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMakerId, setSelectedMakerId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price100_asc' | 'price_asc'>('popular');
  const [visibleMakersLimit, setVisibleMakersLimit] = useState<number>(24);

  // Quick Purpose / Dietary Filter Pills
  const [onlySugarFree, setOnlySugarFree] = useState(false);
  const [onlyForKids, setOnlyForKids] = useState(false);
  const [onlyChocoBars, setOnlyChocoBars] = useState(false);

  // Progressive Disclosure & Favorites (3+ min dwell time magnet)
  const [favoriteMakerIds, setFavoriteMakerIds] = useState<string[]>(['crafo-kharkiv']);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [expandedMakerIds, setExpandedMakerIds] = useState<string[]>([]);
  const [groupBySegment, setGroupBySegment] = useState<boolean>(false);
  const [isB2BOpen, setIsB2BOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive 3-Minute Engagement Widgets (2027 Tech)
  const [activeEngagementTab, setActiveEngagementTab] = useState<'quiz' | 'calculator'>('quiz');
  const [quizRecipient, setQuizRecipient] = useState<'her' | 'kids' | 'boss' | 'self'>('her');
  const [quizDiet, setQuizDiet] = useState<'classic' | 'sugarfree' | 'kids_safe'>('classic');
  const [quizFormat, setQuizFormat] = useState<'bars' | 'flowers' | 'candies' | 'cakes_zefir'>('flowers');

  // Interactive Cake & Gift Box Calculator state
  const [guestsCount, setGuestsCount] = useState<number>(12);
  const [eventType, setEventType] = useState<'birthday' | 'wedding' | 'corporate' | 'kids'>('birthday');

  // Comparison & Modals
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

  const toggleFavoriteMaker = (id: string) => {
    setFavoriteMakerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

  // Filtered Makers (Crafo.com.ua is ALWAYS #1 in chocolate categories)
  const filteredMakers = useMemo(() => {
    return MAKERS.filter((m) => {
      if (onlyFavorites && !favoriteMakerIds.includes(m.id)) return false;
      if (selectedCategory !== 'all' && !m.categories.includes(selectedCategory)) return false;
      if (
        selectedCity !== 'all' &&
        m.regionCity !== selectedCity &&
        !m.city.toLowerCase().includes(selectedCity.split('•')[0].trim().toLowerCase())
      ) {
        return false;
      }
      if (onlyChocoBars && !m.categories.includes('plytky-shokoladu')) return false;
      if (onlySugarFree && !m.categories.includes('bez-tsukru-ta-vegan')) return false;
      if (onlyForKids && !m.categories.includes('solodoshchi-dlia-ditei')) return false;

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
  }, [
    onlyFavorites,
    favoriteMakerIds,
    selectedCategory,
    selectedCity,
    onlyChocoBars,
    onlySugarFree,
    onlyForKids,
    searchQuery,
  ]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'solodoshchi-dlia-ditei') {
          if (product.category !== 'solodoshchi-dlia-ditei' && !product.bestFor.includes('kids')) {
            return false;
          }
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }
      if (selectedMakerId !== 'all' && product.makerId !== selectedMakerId) return false;
      if (onlySugarFree && !product.isSugarFree) return false;
      if (onlyForKids && !product.bestFor.includes('kids') && product.category !== 'solodoshchi-dlia-ditei') {
        return false;
      }
      if (onlyChocoBars && product.category !== 'plytky-shokoladu') return false;

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
    onlyForKids,
    onlyChocoBars,
    searchQuery,
    sortBy,
  ]);

  // Interactive AI Sommelier Recommendations (Always includes Crafo.com.ua for chocolate!)
  const quizRecommendedMakers = useMemo(() => {
    return MAKERS.filter((m) => {
      if (m.id === 'crafo-kharkiv' && quizFormat !== 'cakes_zefir') return true;
      if (quizDiet === 'sugarfree' && !m.categories.includes('bez-tsukru-ta-vegan')) return false;
      if (quizDiet === 'kids_safe' && !m.categories.includes('solodoshchi-dlia-ditei')) return false;
      if (quizFormat === 'bars' && !m.categories.includes('plytky-shokoladu')) return false;
      if (quizFormat === 'flowers' && !m.categories.includes('shokoladni-kvity-ta-bukety')) return false;
      if (quizFormat === 'candies' && !m.categories.includes('korpusni-ta-rozmalovani-tsukerky')) return false;
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

  // Cake & Gift Calculator calculations
  const calculatedWeightKg = useMemo(() => {
    const gramsPerGuest = eventType === 'wedding' ? 180 : eventType === 'kids' ? 150 : 160;
    return Math.max(1, Math.round(((guestsCount * gramsPerGuest) / 1000) * 10) / 10);
  }, [guestsCount, eventType]);

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
    setOnlyForKids(false);
    setOnlyChocoBars(false);
    setOnlyFavorites(false);
    setVisibleMakersLimit(24);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedMakerId !== 'all' ||
    onlySugarFree ||
    onlyForKids ||
    onlyChocoBars ||
    onlyFavorites;

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
      pill:
        lang === 'uk'
          ? 'Плитка шоколаду, батончик'
          : 'Плитка шоколада, батончик',
    };
  };

  const renderMakerCard = (maker: CraftMaker) => {
    const isExpanded = expandedMakerIds.includes(maker.id);
    const isLeader = maker.id === 'crafo-kharkiv';
    const isFav = favoriteMakerIds.includes(maker.id);
    const headerMeta = getMakerHeaderStyle(maker);
    
    // Direct destination URL: if user selected a category filter (e.g. flowers, bonbons, bars),
    // and maker has a direct landing link for that category, use it directly!
    const effectiveCategory = selectedCategory !== 'all' ? selectedCategory : maker.mainCategory;
    const categoryDirectUrl = getMakerCategoryUrl(maker, effectiveCategory);
    const hasDirectCategoryLink = selectedCategory !== 'all' && !!getMakerCategoryUrl(maker, selectedCategory);
    const directDestinationUrl = categoryDirectUrl || maker.websiteUrl;

    const cleanDomain = directDestinationUrl
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
        {/* Top Banner — 2x Larger, Bright & Clear without dark overlay */}
        <div
          className="relative h-64 sm:h-72 overflow-hidden cursor-pointer"
          style={{ background: headerMeta.gradient }}
          onClick={() => setActiveMakerModal(maker)}
        >
          {maker.imageUrl ? (
            <>
              <img
                src={maker.imageUrl}
                alt={maker.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-105 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
            </>
          ) : (
            <span className="absolute -right-3 -top-4 select-none text-8xl opacity-30 transition-transform duration-300 group-hover:scale-110">
              {headerMeta.emoji}
            </span>
          )}

          {/* Top Left Pills */}
          <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap items-center gap-1.5 pr-10">
            {isLeader ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e39851] to-[#b06a1e] px-3 py-1 text-[11px] sm:text-xs font-extrabold text-[#26140b] shadow-md">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {lang === 'uk' ? '№1 Лідер категорії Шоколад' : '№1 Лидер категории Шоколад'}
                </span>
              </span>
            ) : (
              <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/20">
                {headerMeta.pill}
              </span>
            )}
            {maker.rating >= 4.95 && (
              <span className="rounded-full bg-[#fff8ef] px-2 py-0.5 text-[11px] font-bold text-[#302016] shadow-sm">
                ★ {maker.rating}
              </span>
            )}
          </div>

          {/* Top Right Favorite Heart Button */}
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
            {maker.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-[#302016] shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'uk' ? 'Перевірений виробник' : 'Проверенный производитель'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div>
            <h3
              onClick={() => setActiveMakerModal(maker)}
              className={`font-serif text-base sm:text-lg font-bold leading-snug cursor-pointer hover:text-[#b06a1e] transition ${
                isDark ? 'text-[#eee7dd]' : 'text-[#302016]'
              }`}
            >
              <a
                href={directDestinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:underline hover:text-[#b06a1e]"
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

          {/* Multi-Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {maker.categories.map((catSlug) => {
              const info = CATEGORY_SHORT_LABELS[catSlug];
              if (!info) return null;
              const isSelectedCat = selectedCategory === catSlug;
              const catTargetUrl = getMakerCategoryUrl(maker, catSlug);
              return (
                <div key={catSlug} className="inline-flex items-center">
                  <button
                    onClick={() => setSelectedCategory(catSlug)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      isSelectedCat
                        ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                        : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
                    }`}
                  >
                    <span>{info.emoji}</span>
                    <span>{lang === 'uk' ? info.uk : info.ru}</span>
                    {catTargetUrl && (
                      <a
                        href={catTargetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={lang === 'uk' ? `Пряме посилання у розділ ${info.uk}` : `Прямая ссылка в раздел ${info.ru}`}
                        className="ml-0.5 hover:text-[#e39851]"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 2-line Description */}
          <p
            className={`line-clamp-2 text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
            }`}
          >
            {localizeText(maker.description || maker.specialty, lang)}
          </p>

          {/* Verified Contact / Phone Row */}
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
                <span>
                  {lang === 'uk' ? 'Активна сторінка • Доставка НП' : 'Активная страница • Доставка НП'}
                </span>
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
              <p className="leading-relaxed">{localizeText(maker.description, lang)}</p>
              <div
                className={`rounded-xl p-3 space-y-1 ${
                  isDark ? 'bg-[#1a120e]' : 'bg-[#f1e6da]/70'
                }`}
              >
                <div>
                  <strong>{lang === 'uk' ? 'Контакт / Телефон:' : 'Контакт / Телефон:'}</strong>{' '}
                  {maker.phone}
                </div>
                {maker.address && (
                  <div>
                    <strong>{lang === 'uk' ? 'Локація:' : 'Локация:'}</strong>{' '}
                    {localizeText(maker.address, lang)}
                  </div>
                )}
                {maker.instagramHandle && (
                  <div>
                    <strong>Instagram:</strong> {maker.instagramHandle}
                  </div>
                )}
                <div>
                  <strong>{lang === 'uk' ? 'Доставка:' : 'Доставка:'}</strong>{' '}
                  {localizeText(maker.shippingNote, lang)}
                </div>
                <div className="pt-2 mt-1 border-t border-black/10">
                  <button
                    onClick={() => {
                      setSelectedPlanForModal(
                        `${lang === 'uk' ? 'Оновлення фото та вітрини:' : 'Обновление фото и витрины:'} ${maker.name}`
                      );
                      setIsAddMakerModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-[#b06a1e] hover:underline flex items-center gap-1 text-left"
                  >
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>
                      {lang === 'uk'
                        ? 'Ви власник цієї майстерні? Оновити фото / підключити PRO →'
                        : 'Вы владелец этой мастерской? Обновить фото / подключить PRO →'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="mt-auto flex items-center gap-1.5 pt-2">
            <a
              href={directDestinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition shadow-xs ${
                isDark
                  ? 'bg-[#f0a556] text-[#26160e] hover:bg-[#e39851]'
                  : 'bg-[#462b1f] text-[#faf4eb] hover:bg-[#b06a1e]'
              }`}
            >
              <span>
                {cleanDomain.includes('instagram.com')
                  ? 'Instagram'
                  : hasDirectCategoryLink
                  ? lang === 'uk'
                    ? `У розділ «${CATEGORY_SHORT_LABELS[selectedCategory]?.uk || 'Каталог'}»`
                    : `В раздел «${CATEGORY_SHORT_LABELS[selectedCategory]?.ru || 'Каталог'}»`
                  : categoryDirectUrl
                  ? lang === 'uk'
                    ? 'В каталог'
                    : 'В каталог'
                  : lang === 'uk'
                  ? 'На сайт'
                  : 'На сайт'}
              </span>
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
              className={`ml-auto inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold transition ${
                isDark
                  ? 'text-[#f0a556] hover:bg-white/10'
                  : 'text-[#7a4a2b] hover:bg-[#f1e6da]'
              }`}
            >
              <span>
                {isExpanded
                  ? lang === 'uk'
                    ? 'Згорнути'
                    : 'Свернуть'
                  : lang === 'uk'
                  ? 'Докладніше'
                  : 'Подробнее'}
              </span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
      {/* Top Sticky Header with UK / RU Language Switcher */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl ${
          isDark
            ? 'border-white/15 bg-[#1a120e]/90'
            : 'border-[#e1d5c8] bg-[#fbf6ee]/95'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-2 text-left outline-none shrink-0"
          >
            <span className="grid w-9 h-9 sm:w-10 sm:h-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-lg">
              🍫
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight">
                Craft<span className="text-[#b06a1e]">Sweets</span>
              </span>
              <span className={`text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-[#a79d91]' : 'text-[#715f53]'}`}>
                {lang === 'uk'
                  ? `${MAKERS.length} майстерень України`
                  : `${MAKERS.length} мастерских Украины`}
              </span>
            </span>
          </button>

          {/* Desktop Quick Macro Navigation */}
          <nav className="ml-2 hidden items-center gap-1 xl:flex">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              {lang === 'uk' ? `Усі (${MAKERS.length})` : `Все (${MAKERS.length})`}
            </button>
            <button
              onClick={() => setSelectedCategory('plytky-shokoladu')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'plytky-shokoladu'
                  ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🍫 {lang === 'uk' ? 'Плитка шоколаду, батончик' : 'Плитка шоколада, батончик'}
            </button>
            <button
              onClick={() => setSelectedCategory('bez-tsukru-ta-vegan')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'bez-tsukru-ta-vegan'
                  ? 'bg-[#3c7a47] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#3c7a47]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🌿 {lang === 'uk' ? 'Без цукру' : 'Без сахара'}
            </button>
            <button
              onClick={() => setSelectedCategory('solodoshchi-dlia-ditei')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'solodoshchi-dlia-ditei'
                  ? 'bg-[#b06a1e] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#b06a1e]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🧸 {lang === 'uk' ? 'Для дітей' : 'Для детей'}
            </button>
            <button
              onClick={() => setSelectedCategory('avtorski-torty-ta-deserty')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'avtorski-torty-ta-deserty'
                  ? 'bg-[#8e2f4a] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#8e2f4a]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🎂 {lang === 'uk' ? 'Торти' : 'Торты'}
            </button>
            <button
              onClick={() => setSelectedCategory('kraftovyi-zefir-ta-bukety')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === 'kraftovyi-zefir-ta-bukety'
                  ? 'bg-[#b06a1e] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#b06a1e]'
                  : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e5d5c3]'
              }`}
            >
              🌸 {lang === 'uk' ? 'Зефір' : 'Зефир'}
            </button>
            <Link
              href="/blog"
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                isDark
                  ? 'border-[#b06a1e]/50 bg-[#362820] text-[#f0a556] hover:bg-[#b06a1e] hover:text-white'
                  : 'border-[#b06a1e]/40 bg-[#f1e6da] text-[#8c4f12] hover:bg-[#b06a1e] hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'uk' ? 'Блог' : 'Блог'}</span>
            </Link>
          </nav>

          {/* Right Actions: Language Switcher (УКР | РУС), Theme, Favorites, CTA */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Pill (Default UKR) */}
            <div
              className={`inline-flex items-center rounded-full p-0.5 border text-xs font-extrabold ${
                isDark
                  ? 'bg-[#362820] border-white/20'
                  : 'bg-[#f1e6da] border-[#d4c3b3]'
              }`}
              role="group"
              aria-label="Перемикач мови"
            >
              <button
                onClick={() => setLang('uk')}
                className={`rounded-full px-2.5 py-1 transition ${
                  lang === 'uk'
                    ? 'bg-[#462b1f] text-[#faf4eb] shadow-xs'
                    : 'text-[#715f53] hover:text-[#302016]'
                }`}
              >
                УКР
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`rounded-full px-2.5 py-1 transition ${
                  lang === 'ru'
                    ? 'bg-[#462b1f] text-[#faf4eb] shadow-xs'
                    : 'text-[#715f53] hover:text-[#302016]'
                }`}
              >
                РУС
              </button>
            </div>

            {/* Favorites Quick Filter */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              title={lang === 'uk' ? 'Обрані майстерні' : 'Избранные мастерские'}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold border transition ${
                onlyFavorites
                  ? 'bg-[#c75b7a] text-white border-[#c75b7a]'
                  : isDark
                  ? 'border-white/20 bg-[#362820] text-[#eee7dd]'
                  : 'border-[#e1d5c8] bg-[#f1e6da] text-[#462b1f]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'text-[#c75b7a]'}`} />
              <span>{favoriteMakerIds.length}</span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Перемкнути тему"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition ${
                isDark
                  ? 'border-white/20 bg-[#362820] text-[#f0a556]'
                  : 'border-[#e1d5c8] bg-[#f1e6da] text-[#462b1f]'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#b06a1e] hover:bg-[#965715] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{lang === 'uk' ? 'Замовити підбір' : 'Заказать подбор'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedPlanForModal('PRO або Безкоштовний старт');
                setIsAddMakerModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#462b1f] to-[#3a2113] hover:from-[#5c3929] hover:to-[#462b1f] px-3.5 py-2 text-xs font-bold text-[#faf4eb] shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e39851]" />
              <span>{lang === 'uk' ? 'Додати майстерню' : 'Добавить мастерскую'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          className={`relative overflow-hidden border-b ${
            isDark
              ? 'border-white/10 bg-gradient-to-b from-[#2f2018] via-[#1a120e] to-[#1a120e]'
              : 'border-[#e1d5c8] bg-gradient-to-b from-[#f1e6da]/80 via-[#fbf6ee] to-[#fbf6ee]'
          }`}
        >
          <div
            className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full opacity-35 blur-3xl"
            style={{ background: 'radial-gradient(circle, #b06a1e, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #c75b7a, transparent 70%)' }}
          />

          <div className="relative mx-auto max-w-7xl px-3 py-7 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b06a1e]/40 bg-[#e39851]/20 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-[#8c4f12] dark:text-[#f0a556] mb-3">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {lang === 'uk'
                    ? `CraftHub Україна 2027 • ${MAKERS.length} перевірені активні майстерні`
                    : `CraftHub Украина 2027 • ${MAKERS.length} проверенные активные мастерские`}
                </span>
              </span>

              <h1 className="font-serif text-3xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                {lang === 'uk' ? 'Всі крафтові виробники ' : 'Все крафтовые производители '}
                <span className="bg-gradient-to-r from-[#7a4a2b] via-[#b06a1e] to-[#c75b7a] bg-clip-text text-transparent">
                  {lang === 'uk' ? 'шоколаду, зефіру і тортів' : 'шоколада, зефира и тортов'}
                </span>
              </h1>

              <p
                className={`mx-auto mt-3 max-w-2xl text-xs sm:text-base leading-relaxed ${
                  isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                }`}
              >
                {lang === 'uk'
                  ? 'Єдиний сервіс CraftHub, де покупці обирають плитки шоколаду, батончики, цукерки ручної роботи, букети, солодощі без цукру, ласощі для дітей та авторські торти напряму у перевірених майстрів.'
                  : 'Единый сервис CraftHub, где покупатели выбирают плитки шоколада, батончики, конфеты ручной работы, букеты, сладости без сахара, лакомства для детей и авторские торты напрямую у проверенных мастеров.'}
              </p>

              {/* Search Bar */}
              <div className="mx-auto mt-5 flex max-w-xl items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 w-4 h-4 sm:w-5 sm:h-5 -translate-y-1/2 text-[#715f53]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'uk'
                        ? 'Плитка шоколаду, батончик, без цукру, дітям, торт, зефір, Харків...'
                        : 'Плитка шоколада, батончик, без сахара, детям, торт, зефир, Харьков...'
                    }
                    className={`w-full h-11 sm:h-12 rounded-full border pl-10 pr-9 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b06a1e] ${
                      isDark
                        ? 'bg-[#261b16] border-white/20 text-[#eee7dd] placeholder:text-[#a79d91]'
                        : 'bg-[#fefbf7] border-[#d4c3b3] text-[#302016] placeholder:text-[#715f53]'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#715f53] hover:text-[#302016]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <a
                  href="#makers-section"
                  className="h-11 sm:h-12 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#462b1f] to-[#3a2113] hover:from-[#5c3929] hover:to-[#462b1f] px-5 text-xs sm:text-sm font-bold text-[#faf4eb] shadow-md transition shrink-0"
                >
                  {lang === 'uk' ? 'Знайти' : 'Найти'}
                </a>
              </div>

              {/* 3 Macro Pillar Cards */}
              <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-4">
                <button
                  onClick={() => setSelectedCategory('plytky-shokoladu')}
                  className={`group rounded-2xl border p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    selectedCategory === 'plytky-shokoladu' ||
                    selectedCategory === 'korpusni-ta-rozmalovani-tsukerky'
                      ? 'border-[#7a4a2b] ring-2 ring-[#7a4a2b]/30 bg-[#f1e6da]'
                      : isDark
                      ? 'border-white/15 bg-[#261b16]/90'
                      : 'border-[#e1d5c8] bg-[#fefbf7]/95'
                  }`}
                >
                  <div
                    className="mx-auto grid w-10 h-10 sm:w-12 sm:h-12 place-items-center rounded-xl text-xl sm:text-2xl text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #7a4a2b 0%, #3a2113 100%)' }}
                  >
                    🍫
                  </div>
                  <div className="mt-2 font-serif text-xl font-bold sm:text-3xl">
                    {chocolateMakersCount}
                  </div>
                  <div
                    className={`text-[11px] font-bold sm:text-sm leading-tight ${
                      isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                    }`}
                  >
                    {lang === 'uk' ? 'Шоколад і цукерки' : 'Шоколад и конфеты'}
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCategory('avtorski-torty-ta-deserty')}
                  className={`group rounded-2xl border p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    selectedCategory === 'avtorski-torty-ta-deserty'
                      ? 'border-[#c75b7a] ring-2 ring-[#c75b7a]/30 bg-[#f1e6da]'
                      : isDark
                      ? 'border-white/15 bg-[#261b16]/90'
                      : 'border-[#e1d5c8] bg-[#fefbf7]/95'
                  }`}
                >
                  <div
                    className="mx-auto grid w-10 h-10 sm:w-12 sm:h-12 place-items-center rounded-xl text-xl sm:text-2xl text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #c75b7a 0%, #8e2f4a 100%)' }}
                  >
                    🎂
                  </div>
                  <div className="mt-2 font-serif text-xl font-bold sm:text-3xl">
                    {cakeMakersCount}
                  </div>
                  <div
                    className={`text-[11px] font-bold sm:text-sm leading-tight ${
                      isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                    }`}
                  >
                    {lang === 'uk' ? 'Авторські торти' : 'Авторские торты'}
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCategory('kraftovyi-zefir-ta-bukety')}
                  className={`group rounded-2xl border p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    selectedCategory === 'kraftovyi-zefir-ta-bukety'
                      ? 'border-[#b06a1e] ring-2 ring-[#b06a1e]/30 bg-[#f1e6da]'
                      : isDark
                      ? 'border-white/15 bg-[#261b16]/90'
                      : 'border-[#e1d5c8] bg-[#fefbf7]/95'
                  }`}
                >
                  <div
                    className="mx-auto grid w-10 h-10 sm:w-12 sm:h-12 place-items-center rounded-xl text-xl sm:text-2xl text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #e0a866 0%, #b06a1e 100%)' }}
                  >
                    🌸
                  </div>
                  <div className="mt-2 font-serif text-xl font-bold sm:text-3xl">
                    {zefirMakersCount}
                  </div>
                  <div
                    className={`text-[11px] font-bold sm:text-sm leading-tight ${
                      isDark ? 'text-[#c2b6a9]' : 'text-[#5a4638]'
                    }`}
                  >
                    {lang === 'uk' ? 'Зефір і букети' : 'Зефир и букеты'}
                  </div>
                </button>
              </div>
            </div>

            {/* Detailed 10 Category Filter Buttons (Responsive Mobile Horizontal Swipe + Desktop Grid) */}
            <div className="mt-6 flex overflow-x-auto pb-2 gap-2 sm:grid sm:grid-cols-5 lg:grid-cols-10 sm:overflow-visible no-scrollbar">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.slug;
                const slug = cat.slug;
                const count =
                  slug === 'all'
                    ? MAKERS.length
                    : MAKERS.filter((m) => m.categories.includes(slug)).length;

                const labelText =
                  slug === 'all'
                    ? lang === 'uk'
                      ? 'Всі категорії'
                      : 'Все категории'
                    : lang === 'uk'
                    ? CATEGORY_SHORT_LABELS[slug].uk
                    : CATEGORY_SHORT_LABELS[slug].ru;

                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`shrink-0 w-36 sm:w-auto p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                      active
                        ? 'bg-gradient-to-br from-[#462b1f] to-[#3a2113] text-[#faf4eb] border-[#3a2113] shadow-md'
                        : isDark
                        ? 'bg-[#261b16] text-[#eee7dd] border-white/15 hover:border-[#f0a556]'
                        : 'bg-[#fefbf7] text-[#302016] border-[#d9c8b8] hover:border-[#b06a1e] hover:bg-[#f1e6da]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl">{cat.emoji}</span>
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
                    <div className="font-bold text-[11px] sm:text-xs leading-tight">{labelText}</div>
                  </button>
                );
              })}
            </div>

            {/* City & Dietary Filter Bar */}
            <div
              className={`mt-3 rounded-2xl border p-3.5 sm:p-4 shadow-sm space-y-3 ${
                isDark ? 'bg-[#261b16] border-white/15' : 'bg-[#fefbf7] border-[#d9c8b8]'
              }`}
            >
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                        active
                          ? 'bg-[#462b1f] text-[#faf4eb] shadow-sm'
                          : isDark
                          ? 'bg-[#362820] text-[#eee7dd] hover:bg-[#462b1f]'
                          : 'bg-[#f1e6da] text-[#3e281b] hover:bg-[#e3d2c0]'
                      }`}
                    >
                      {lang === 'uk' ? city.uk : city.ru}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e1d5c8]/60">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setOnlyChocoBars(!onlyChocoBars)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      onlyChocoBars
                        ? 'bg-[#b06a1e] text-white'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    🍫 {lang === 'uk' ? 'Плитка шоколаду, батончик' : 'Плитка шоколада, батончик'}
                  </button>
                  <button
                    onClick={() => setOnlySugarFree(!onlySugarFree)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      onlySugarFree
                        ? 'bg-[#3c7a47] text-white'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    🌿 {lang === 'uk' ? 'Без цукру' : 'Без сахара'}
                  </button>
                  <button
                    onClick={() => setOnlyForKids(!onlyForKids)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      onlyForKids
                        ? 'bg-[#b06a1e] text-white'
                        : isDark
                        ? 'bg-[#362820] text-[#eee7dd]'
                        : 'bg-[#f1e6da] text-[#3e281b]'
                    }`}
                  >
                    🧸 {lang === 'uk' ? 'Для дітей' : 'Для детей'}
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-[#c75b7a] hover:underline"
                  >
                    {lang === 'uk' ? 'Скинути всі фільтри ✕' : 'Сбросить все фильтры ✕'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT CONTAINER */}
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 space-y-12">
          {/* NEW 2027 INTERACTIVE DWELL-TIME MAGNET (3+ MINUTES ON SITE): AI GIFT SOMMELIER & CAKE CALCULATOR */}
          <section
            id="interactive-tools"
            className={`rounded-3xl border-2 p-4 sm:p-7 shadow-md ${
              isDark
                ? 'bg-[#261b16] border-[#e39851]/40'
                : 'bg-gradient-to-br from-[#fff9f2] via-[#fefbf7] to-[#f4e8da] border-[#e39851]/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e1d5c8] pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#b06a1e]">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'uk'
                      ? 'Інтерактивні помічники CraftHub 2027'
                      : 'Интерактивные помощники CraftHub 2027'}
                  </span>
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                  {activeEngagementTab === 'quiz'
                    ? lang === 'uk'
                      ? 'Інтерактивний Сомельє: підберіть ідеальні солодощі за 3 кроки'
                      : 'Интерактивный Сомелье: подберите идеальные сладости за 3 шага'
                    : lang === 'uk'
                    ? 'Калькулятор ваги торта та бюджету подарункових боксів'
                    : 'Калькулятор веса торта и бюджета подарочных боксов'}
                </h2>
              </div>

              <div className="flex rounded-full p-1 bg-[#f1e6da] text-[#302016] self-start sm:self-auto">
                <button
                  onClick={() => setActiveEngagementTab('quiz')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    activeEngagementTab === 'quiz'
                      ? 'bg-[#462b1f] text-white shadow-xs'
                      : 'hover:text-[#b06a1e]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Підбір подарунка' : 'Подбор подарка'}</span>
                </button>
                <button
                  onClick={() => setActiveEngagementTab('calculator')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    activeEngagementTab === 'calculator'
                      ? 'bg-[#462b1f] text-white shadow-xs'
                      : 'hover:text-[#b06a1e]'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Калькулятор свята' : 'Калькулятор праздника'}</span>
                </button>
              </div>
            </div>

            {activeEngagementTab === 'quiz' ? (
              <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  {/* Step 1 */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#b06a1e]">
                      {lang === 'uk' ? 'Крок 1. Для кого обираємо?' : 'Шаг 1. Для кого выбираем?'}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                          className={`rounded-xl border px-3 py-2.5 text-xs font-bold text-left transition ${
                            quizRecipient === opt.id
                              ? 'bg-[#462b1f] text-white border-[#462b1f] shadow-xs'
                              : isDark
                              ? 'bg-[#1a120e] border-white/15'
                              : 'bg-white border-[#e1d5c8] hover:border-[#b06a1e]'
                          }`}
                        >
                          {lang === 'uk' ? opt.uk : opt.ru}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#b06a1e]">
                      {lang === 'uk'
                        ? 'Крок 2. Побажання до складу:'
                        : 'Шаг 2. Пожелания к составу:'}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: 'classic',
                          uk: '🍫 Класичний бельгійський / крафт',
                          ru: '🍫 Классический бельгийский / крафт',
                        },
                        {
                          id: 'sugarfree',
                          uk: '🌿 Без цукру (Мед / Стевія / Vegan)',
                          ru: '🌿 Без сахара (Мед / Стевия / Vegan)',
                        },
                        {
                          id: 'kids_safe',
                          uk: '🧸 Для дітей (Кероб / Пастила / Натур)',
                          ru: '🧸 Для детей (Кэроб / Пастила / Натур)',
                        },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setQuizDiet(opt.id as typeof quizDiet)}
                          className={`rounded-xl border px-3 py-2.5 text-xs font-bold text-left transition ${
                            quizDiet === opt.id
                              ? 'bg-[#462b1f] text-white border-[#462b1f] shadow-xs'
                              : isDark
                              ? 'bg-[#1a120e] border-white/15'
                              : 'bg-white border-[#e1d5c8] hover:border-[#b06a1e]'
                          }`}
                        >
                          {lang === 'uk' ? opt.uk : opt.ru}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#b06a1e]">
                      {lang === 'uk' ? 'Крок 3. Який формат виробу?' : 'Шаг 3. Какой формат изделия?'}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          id: 'flowers',
                          uk: '🌹 Шоколадні квіти / Букет',
                          ru: '🌹 Шоколадные цветы / Букет',
                        },
                        {
                          id: 'bars',
                          uk: '🍫 Плитка шоколаду, батончик',
                          ru: '🍫 Плитка шоколада, батончик',
                        },
                        {
                          id: 'candies',
                          uk: '🍬 Цукерки ручної роботи',
                          ru: '🍬 Конфеты ручной работы',
                        },
                        {
                          id: 'cakes_zefir',
                          uk: '🎂 Торт або Зефірний букет',
                          ru: '🎂 Торт или Зефирный букет',
                        },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setQuizFormat(opt.id as typeof quizFormat)}
                          className={`rounded-xl border px-3 py-2.5 text-xs font-bold text-left transition ${
                            quizFormat === opt.id
                              ? 'bg-[#462b1f] text-white border-[#462b1f] shadow-xs'
                              : isDark
                              ? 'bg-[#1a120e] border-white/15'
                              : 'bg-white border-[#e1d5c8] hover:border-[#b06a1e]'
                          }`}
                        >
                          {lang === 'uk' ? opt.uk : opt.ru}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Instant Recommendations Output */}
                <div
                  className={`lg:col-span-5 rounded-2xl p-4 sm:p-5 border space-y-3 ${
                    isDark
                      ? 'bg-[#1a120e] border-white/15'
                      : 'bg-white border-[#e1d5c8] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-[#b06a1e]">
                      {lang === 'uk'
                        ? '🎯 Ваша персональна рекомендація ТОП-3:'
                        : '🎯 Ваша персональная рекомендация ТОП-3:'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {quizRecommendedMakers.map((m, idx) => (
                      <div
                        key={m.id}
                        className={`flex items-center justify-between gap-3 rounded-xl p-3 border ${
                          idx === 0
                            ? 'border-[#e39851] bg-[#e39851]/10'
                            : isDark
                            ? 'border-white/10 bg-[#261b16]'
                            : 'border-[#e1d5c8] bg-[#fbf6ee]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-[#b06a1e]">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-xs sm:text-sm truncate">
                              {localizeText(m.name, lang)}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-75 truncate mt-0.5">
                            {localizeText(m.city, lang)} • ★ {m.rating}
                          </p>
                        </div>
                        <a
                          href={m.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-3 py-1.5 text-[11px] font-bold flex items-center gap-1"
                        >
                          <span>{lang === 'uk' ? 'Перейти' : 'Перейти'}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Interactive Cake & Gift Box Calculator */
              <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#b06a1e] mb-2">
                      {lang === 'uk'
                        ? `Кількість гостей або отримувачів подарунків: ${guestsCount} осіб`
                        : `Количество гостей или получателей подарков: ${guestsCount} чел.`}
                    </label>
                    <input
                      type="range"
                      min={4}
                      max={100}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full accent-[#b06a1e] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] opacity-70 mt-1">
                      <span>4</span>
                      <span>15</span>
                      <span>30</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'birthday', uk: '🎂 День народження', ru: '🎂 День рождения' },
                      { id: 'kids', uk: '🧸 Дитяче свято', ru: '🧸 Детский праздник' },
                      { id: 'wedding', uk: '💍 Весілля / Ювілей', ru: '💍 Свадьба / Юбилей' },
                      { id: 'corporate', uk: '💼 Корпоративні бокси', ru: '💼 Корпоративные боксы' },
                    ].map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => setEventType(ev.id as typeof eventType)}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                          eventType === ev.id
                            ? 'bg-[#462b1f] text-white border-[#462b1f]'
                            : isDark
                            ? 'bg-[#1a120e] border-white/15'
                            : 'bg-white border-[#e1d5c8]'
                        }`}
                      >
                        {lang === 'uk' ? ev.uk : ev.ru}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`lg:col-span-5 rounded-2xl p-5 border space-y-3 ${
                    isDark ? 'bg-[#1a120e] border-white/15' : 'bg-white border-[#e1d5c8]'
                  }`}
                >
                  <div className="text-xs font-bold uppercase text-[#b06a1e]">
                    {lang === 'uk' ? 'Розрахунок для вашої події:' : 'Расчет для вашего события:'}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#f1e6da]/70 p-3 text-[#302016]">
                      <div className="text-[11px] opacity-75">
                        {lang === 'uk' ? 'Оптимальна вага торта:' : 'Оптимальный вес торта:'}
                      </div>
                      <div className="text-xl font-extrabold text-[#462b1f] mt-0.5">
                        {calculatedWeightKg} кг
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#f1e6da]/70 p-3 text-[#302016]">
                      <div className="text-[11px] opacity-75">
                        {lang === 'uk' ? 'Або подарункових наборів:' : 'Или подарочных наборов:'}
                      </div>
                      <div className="text-xl font-extrabold text-[#b06a1e] mt-0.5">
                        {guestsCount} шт
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTenderModalOpen(true)}
                    className="w-full rounded-full bg-[#b06a1e] hover:bg-[#965715] text-white font-bold py-2.5 text-xs transition"
                  >
                    {lang === 'uk'
                      ? 'Отримати пропозиції від майстрів під цей розрахунок →'
                      : 'Получить предложения от мастеров под этот расчет →'}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 1: ALL VERIFIED ACTIVE UKRAINIAN CRAFT MAKERS */}
          <section id="makers-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e1d5c8] pb-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b06a1e]">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {lang === 'uk'
                      ? 'Каталог перевірених виробників України (CraftHub)'
                      : 'Каталог проверенных производителей Украины (CraftHub)'}
                  </span>
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  {selectedCategory === 'all'
                    ? lang === 'uk'
                      ? `Усі крафтові майстри та виробництва (${filteredMakers.length})`
                      : `Все крафтовые мастера и производства (${filteredMakers.length})`
                    : `${
                        lang === 'uk'
                          ? CATEGORY_SHORT_LABELS[selectedCategory].uk
                          : CATEGORY_SHORT_LABELS[selectedCategory].ru
                      } — ${lang === 'uk' ? 'виробники' : 'производители'} (${filteredMakers.length})`}
                  {selectedCity !== 'all' ? ` • ${localizeText(selectedCity, lang)}` : ''}
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
                <span>
                  {groupBySegment
                    ? lang === 'uk'
                      ? 'Показати єдиною сіткою'
                      : 'Показать единой сеткой'
                    : lang === 'uk'
                    ? 'Згрупувати за 6 напрямками'
                    : 'Сгруппировать по 6 направлениям'}
                </span>
              </button>
            </div>

            {filteredMakers.length === 0 ? (
              <div className="rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-10 text-center space-y-3">
                <p className="text-lg font-bold text-[#302016]">
                  {lang === 'uk'
                    ? 'За обраними фільтрами майстерень не знайдено'
                    : 'По выбранным фильтрам мастерских не найдено'}
                </p>
                <button
                  onClick={resetAllFilters}
                  className="rounded-full bg-[#462b1f] px-5 py-2.5 text-xs font-bold text-white"
                >
                  {lang === 'uk'
                    ? `Показати всі ${MAKERS.length} майстерень України`
                    : `Показать все ${MAKERS.length} мастерских Украины`}
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
                          {lang === 'uk' ? group.titleUk : group.titleRu} ({segMakers.length})
                        </h3>
                        <p className="text-xs sm:text-sm text-white/90 mt-1">
                          {lang === 'uk' ? group.subtitleUk : group.subtitleRu}
                        </p>
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
                        {lang === 'uk'
                          ? `Показати ще виробників (залишилось ${filteredMakers.length - visibleMakersLimit} із ${filteredMakers.length})`
                          : `Показать еще производителей (осталось ${filteredMakers.length - visibleMakersLimit} из ${filteredMakers.length})`}
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
                  {lang === 'uk'
                    ? 'Чесне порівняння ціни за 100 грамів та чистоти складу'
                    : 'Честное сравнение цены за 100 граммов и чистоты состава'}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  {lang === 'uk'
                    ? `Флагманські вироби для порівняння (${filteredProducts.length})`
                    : `Флагманские изделия для сравнения (${filteredProducts.length})`}
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
                  <option value="popular">
                    {lang === 'uk' ? 'Сортування: За популярністю' : 'Сортировка: По популярности'}
                  </option>
                  <option value="price100_asc">
                    {lang === 'uk' ? 'Найвигідніша ціна за 100 г' : 'Самая выгодная цена за 100 г'}
                  </option>
                  <option value="price_asc">
                    {lang === 'uk' ? 'Від дешевших за упаковку' : 'От более доступных за упаковку'}
                  </option>
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
                      <div className="relative h-64 sm:h-72 bg-[#f1e6da] overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover object-center brightness-105 contrast-105 transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#462b1f]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                            {localizeText(product.subType, lang)}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>
                            {lang === 'uk' ? 'Склад' : 'Состав'} {product.cleanLabelScore}/100
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <button
                            onClick={() => maker && setActiveMakerModal(maker)}
                            className="font-bold text-[#b06a1e] hover:underline text-left"
                          >
                            {localizeText(product.makerName, lang)} ({localizeText(product.makerCity, lang)})
                          </button>
                          <span className="flex items-center gap-1 font-bold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {product.rating}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base sm:text-lg leading-snug">
                          {localizeText(product.title, lang)}
                        </h3>

                        <div className="pt-1 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-bold">{product.priceUah} грн</span>
                            <span className="text-xs opacity-70 ml-1.5">/ {product.weightGrams} г</span>
                          </div>
                          <div className="bg-[#f1e6da] text-[#3e281b] px-3 py-1 rounded-full text-xs font-bold">
                            {pricePer100} {lang === 'uk' ? 'грн за 100 г' : 'грн за 100 г'}
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => toggleProductExpand(product.id)}
                            className="text-xs font-bold text-[#b06a1e] hover:underline flex items-center gap-1"
                          >
                            <span>
                              {isExpanded
                                ? lang === 'uk'
                                  ? 'Сховати склад і смак'
                                  : 'Скрыть состав и вкус'
                                : lang === 'uk'
                                ? 'Розгорнути склад та опис'
                                : 'Развернуть состав и описание'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-[#e1d5c8] space-y-2 text-xs">
                              <p className="leading-relaxed">{localizeText(product.expertVerdict, lang)}</p>
                              <div className="bg-[#f1e6da]/60 rounded-xl p-3 space-y-1 text-[#302016]">
                                <div>
                                  <strong>{lang === 'uk' ? 'Основа:' : 'Основа:'}</strong>{' '}
                                  {product.cacaoPercent > 0
                                    ? `${product.cacaoPercent}% (${product.cacaoType})`
                                    : product.cacaoType}
                                </div>
                                <div>
                                  <strong>{lang === 'uk' ? 'Підсолоджувач:' : 'Подсластитель:'}</strong>{' '}
                                  {product.sweetener}
                                </div>
                                <div>
                                  <strong>{lang === 'uk' ? 'Ноти смаку:' : 'Ноты вкуса:'}</strong>{' '}
                                  {product.tastingNotes.join(', ')}
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
                        <span>
                          {isCompared
                            ? lang === 'uk'
                              ? 'У порівнянні'
                              : 'В сравнении'
                            : lang === 'uk'
                            ? 'Порівняти'
                            : 'Сравнить'}
                        </span>
                      </button>

                      {maker && (
                        <a
                          href={product.productUrl || getMakerCategoryUrl(maker, product.category) || maker.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#b06a1e] hover:bg-[#965715] text-white font-bold py-2 px-4 rounded-full text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <span>{lang === 'uk' ? 'Купити' : 'Купить'}</span>
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
            className="rounded-3xl bg-gradient-to-br from-[#462b1f] via-[#3a2113] to-[#26140b] text-[#faf4eb] p-5 sm:p-10 shadow-xl space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-[#e39851]/25 border border-[#e39851]/40 text-[#f5c492] text-xs font-bold px-3.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'uk'
                      ? 'Тендерна біржа замовлень CraftHub'
                      : 'Тендерная биржа заказов CraftHub'}
                  </span>
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                  {lang === 'uk'
                    ? 'Замовте торт, букет чи корпоративні подарунки напряму у майстрів'
                    : 'Закажите торт, букет или корпоративные подарки напрямую у мастеров'}
                </h2>
                <p className="text-xs sm:text-sm text-[#e1d5c8] leading-relaxed">
                  {lang === 'uk'
                    ? 'Опишіть ваше замовлення за 30 секунд — перевірені кондитерські, зефірні флористи та шоколатьє вашого міста самі надішлють вам пропозиції з цінами у Telegram або Viber.'
                    : 'Опишите ваш заказ за 30 секунд — проверенные кондитерские, зефирные флористы и шоколатье вашего города сами пришлют вам предложения с ценами в Telegram или Viber.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={() => setIsTenderModalOpen(true)}
                  className="bg-[#e39851] hover:bg-[#f0a556] text-[#2e190d] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition shadow-md flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>
                    {lang === 'uk' ? 'Залишити заявку на підбір' : 'Оставить заявку на подбор'}
                  </span>
                </button>
                <button
                  onClick={() => setIsB2BOpen(!isB2BOpen)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full transition flex items-center gap-1.5"
                >
                  <Crown className="w-4 h-4 text-[#e39851]" />
                  <span>
                    {isB2BOpen
                      ? lang === 'uk'
                        ? 'Сховати тарифи PRO'
                        : 'Скрыть тарифы PRO'
                      : lang === 'uk'
                      ? 'Виробникам: Підключити PRO'
                      : 'Производителям: Подключить PRO'}
                  </span>
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
                    <span className="font-bold">{lang === 'uk' ? req.cityUk : req.cityRu}</span>
                    <span>{lang === 'uk' ? req.timeUk : req.timeRu}</span>
                  </div>
                  <div className="font-bold text-sm text-white leading-snug">
                    {lang === 'uk' ? req.catUk : req.catRu}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="font-bold text-[#e39851]">
                      {lang === 'uk' ? 'Бюджет:' : 'Бюджет:'} {lang === 'uk' ? req.budgetUk : req.budgetRu}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPlanForModal('PRO Майстерня (990 грн/міс)');
                        setIsAddMakerModalOpen(true);
                      }}
                      className="text-[11px] font-bold underline text-white hover:text-[#e39851]"
                    >
                      {lang === 'uk' ? 'Взяти замовлення →' : 'Взять заказ →'}
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
                    <span className="text-xs font-bold uppercase text-[#e1d5c8]">
                      {lang === 'uk' ? 'Базовий старт' : 'Базовый старт'}
                    </span>
                    <div className="text-2xl font-bold">0 грн / міс</div>
                    <p className="text-xs text-[#e1d5c8]">
                      {lang === 'uk'
                        ? 'Розміщення у каталозі CraftHub, пряме посилання на сайт та Instagram.'
                        : 'Размещение в каталоге CraftHub, прямая ссылка на сайт и Instagram.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('Базовий (Безкоштовно)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-full"
                  >
                    {lang === 'uk' ? 'Додати безкоштовно' : 'Добавить бесплатно'}
                  </button>
                </div>

                <div className="bg-[#e39851]/20 border-2 border-[#e39851] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-[#f5c492]">
                      ★ {lang === 'uk' ? 'Рекомендуємо • PRO Майстер' : 'Рекомендуем • PRO Мастер'}
                    </span>
                    <div className="text-2xl font-bold">990 грн / міс</div>
                    <p className="text-xs text-white">
                      {lang === 'uk'
                        ? 'Закріплення у ТОП-3 вашого міста, бейдж «★ Рекомендуємо» та миттєві контакти замовників тортів і букетів у Telegram.'
                        : 'Закрепление в ТОП-3 вашего города, бейдж «★ Рекомендуем» и мгновенные контакты заказчиков тортов и букетов в Telegram.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('PRO Майстерня (990 грн/міс)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-[#e39851] hover:bg-[#f0a556] text-[#2e190d] text-xs font-bold py-2.5 rounded-full"
                  >
                    {lang === 'uk' ? 'Підключити PRO' : 'Подключить PRO'}
                  </button>
                </div>

                <div className="bg-white/5 border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-[#f5c492]">
                      {lang === 'uk' ? 'B2B Корпоративний' : 'B2B Корпоративный'}
                    </span>
                    <div className="text-2xl font-bold">2 490 грн / міс</div>
                    <p className="text-xs text-[#e1d5c8]">
                      {lang === 'uk'
                        ? 'Пріоритетний доступ до оптових та корпоративних замовлень (від 30 до 500 подарункових наборів).'
                        : 'Приоритетный доступ к оптовым и корпоративным заказам (от 30 до 500 подарочных наборов).'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForModal('B2B Корпоративний (2490 грн/міс)');
                      setIsAddMakerModalOpen(true);
                    }}
                    className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-full"
                  >
                    {lang === 'uk' ? 'Стати B2B-партнером' : 'Стать B2B-партнером'}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 3.5: EXPERT BLOG & SEO LANDING PAGES HUB */}
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
                      ? 'Експертний Блог CraftHub • SEO Гід покупця'
                      : 'Экспертный Блог CraftHub • SEO Гид покупателя'}
                  </span>
                </span>
                <h2 className="font-serif text-xl sm:text-3xl font-bold">
                  {lang === 'uk'
                    ? 'Статті та огляди: як обрати найкращий крафтовий шоколад, букет або торт'
                    : 'Статьи и обзоры: как выбрать лучший крафтовый шоколад, букет или торт'}
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#462b1f] hover:bg-[#5c3929] px-5 py-2.5 text-xs font-extrabold text-[#faf4eb] shadow-sm transition shrink-0"
              >
                <span>{lang === 'uk' ? 'Перейти у Блог (всі статті)' : 'Перейти в Блог (все статьи)'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4 Blog Article Cards with 2x Large Bright Photo Windows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {BLOG_ARTICLES.map((article) => (
                <article
                  key={article.slug}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark ? 'bg-[#211713] border-white/15' : 'bg-white border-[#e1d5c8]'
                  }`}
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="relative h-64 sm:h-72 w-full overflow-hidden block bg-[#f3e9dc]"
                  >
                    <img
                      src={article.heroImage}
                      alt={lang === 'uk' ? article.titleUk : article.titleRu}
                      className="w-full h-full object-cover object-center brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-[#462b1f]/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-[#faf4eb] shadow-md">
                        {lang === 'uk' ? article.categoryLabelUk : article.categoryLabelRu}
                      </span>
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#302016] shadow-md">
                        ⏱ {article.readTimeMinutes} {lang === 'uk' ? 'хв' : 'мин'}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <Link href={`/blog/${article.slug}`}>
                        <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug group-hover:text-[#b06a1e] transition">
                          {lang === 'uk' ? article.titleUk : article.titleRu}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm opacity-85 line-clamp-2 leading-relaxed">
                        {lang === 'uk' ? article.excerptUk : article.excerptRu}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-[#e1d5c8]/60">
                      <span className="text-[11px] font-bold text-[#715f53]">
                        {article.publishedAt}
                      </span>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-[#b06a1e] hover:underline"
                      >
                        <span>{lang === 'uk' ? 'Читати статтю' : 'Читать статью'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* SEO Hub Links: Categories & Cities for Google Indexing & Fast User Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-[#d9c8b8]">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e] mb-2.5">
                  {lang === 'uk'
                    ? '📂 SEO-сторінки рубрик (прямі посилання для Google)'
                    : '📂 SEO-страницы рубрик (прямые ссылки для Google)'}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/katalog/${cat.slug}`}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                        isDark
                          ? 'bg-[#362820] border-white/15 text-[#eee7dd] hover:border-[#b06a1e]'
                          : 'bg-[#f1e6da] border-[#d4c3b3] text-[#302016] hover:bg-[#b06a1e] hover:text-white'
                      }`}
                    >
                      {cat.emoji} {localizeText(cat.shortTitle, lang)}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e] mb-2.5">
                  {lang === 'uk'
                    ? '📍 Регіональні SEO-сторінки міст України'
                    : '📍 Региональные SEO-страницы городов Украины'}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {CITY_SEO_HUBS.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/misto/${city.slug}`}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                        isDark
                          ? 'bg-[#362820] border-white/15 text-[#eee7dd] hover:border-[#b06a1e]'
                          : 'bg-[#fefbf7] border-[#d4c3b3] text-[#302016] hover:bg-[#462b1f] hover:text-white'
                      }`}
                    >
                      📍 {lang === 'uk' ? city.cityNameUk : city.cityNameRu}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: GOOGLE SEO & AI OVERVIEW FAQ ACCORDION */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#b06a1e]" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                {lang === 'uk'
                  ? 'Часті запитання про крафтовий шоколад, вироби без цукру та для дітей'
                  : 'Частые вопросы о крафтовом шоколаде, изделиях без сахара и для детей'}
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  qUk: 'Чим крафтова плитка шоколаду та батончик відрізняються від магазинного?',
                  qRu: 'Чем крафтовая плитка шоколада и батончик отличаются от магазинного?',
                  aUk: 'Справжня крафтова плитка шоколаду та ремісничий батончик виготовляються з натурального какао-масла та добірного бельгійського кувертюру (як у лідера категорії crafo.com.ua) або фермерських какао-бобів без пальмової олії, замінників та штучних ароматизаторів.',
                  aRu: 'Настоящая крафтовая плитка шоколада и ремесленный батончик изготавливаются из натурального какао-масла и отборного бельгийского кувертюра (как у лидера категории crafo.com.ua) или фермерских какао-бобов без пальмового масла, заменителей и искусственных ароматизаторов.',
                },
                {
                  qUk: 'Чим відрізняються рубрики «Без цукру» та «Для дітей» на CraftHub?',
                  qRu: 'Чем отличаются рубрики «Без сахара» и «Для детей» на CraftHub?',
                  aUk: 'У рубриці «Без цукру» зібрані шоколадні плитки, батончики, цукерки та зефір на меду, кокосовому нектарі, еритритолі та стевії (для здорового харчування, діабетиків та веганів). В окремій рубриці «Для дітей» зібрані безпечні ласощі без кофеїну (шоколад на керобі), натуральна фруктово-ягідна пастила, шоколадні фігурки та дитячі святкові торти.',
                  aRu: 'В рубрике «Без сахара» собраны шоколадные плитки, батончики, конфеты и зефир на меду, кокосовом нектаре, эритритоле и стевии (для здорового питания, диабетиков и веганов). В отдельной рубрике «Для детей» собраны безопасные лакомства без кофеина (шоколад на кэробе), натуральная фруктово-ягодная пастила, шоколадные фигурки и детские праздничные торты.',
                },
                {
                  qUk: 'Як швидко замовити шоколадний букет, зефір або торт у своєму місті?',
                  qRu: 'Как быстро заказать шоколадный букет, зефир или торт в своем городе?',
                  aUk: 'Оберіть потрібне місто у фільтрі зверху та перейдіть напряму на сайт або телефон перевіреного виробника, або натисніть кнопку «Замовити підбір» — і майстри вашого міста самі надішлють вам пропозиції з актуальними цінами.',
                  aRu: 'Выберите нужный город в фильтре сверху и перейдите напрямую на сайт или телефон проверенного производителя, либо нажмите кнопку «Заказать подбор» — и мастера вашего города сами пришлют вам предложения с актуальными ценами.',
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

      {/* Rich Footer */}
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
              CraftHub Україна (2027)
            </strong>{' '}
            —{' '}
            {lang === 'uk'
              ? `${MAKERS.length} перевірених виробників шоколаду, зефіру та авторських тортів`
              : `${MAKERS.length} проверенных производителей шоколада, зефира и авторских тортов`}
          </div>
          <div className="flex flex-wrap justify-center gap-5 font-bold">
            <button
              onClick={() => {
                setSelectedPlanForModal('PRO або Безкоштовний');
                setIsAddMakerModalOpen(true);
              }}
              className="hover:text-[#b06a1e]"
            >
              + {lang === 'uk' ? 'Додати майстерню' : 'Добавить мастерскую'}
            </button>
            <button onClick={() => setIsTenderModalOpen(true)} className="hover:text-[#b06a1e]">
              {lang === 'uk' ? 'Замовити торт / букет' : 'Заказать торт / букет'}
            </button>
            <button onClick={() => setIsCompareModalOpen(true)} className="hover:text-[#b06a1e]">
              {lang === 'uk' ? 'Порівняння' : 'Сравнение'} ({compareIds.length})
            </button>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM NAVIGATION BAR (2027 Mobile-First Standard) */}
      <nav
        aria-label="Мобільна навігація"
        className={`sm:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 grid grid-cols-4 gap-1 ${
          isDark
            ? 'bg-[#1a120e]/95 border-white/15 text-[#eee7dd]'
            : 'bg-[#fefbf7]/95 border-[#d9c8b8] text-[#302016]'
        }`}
      >
        <a
          href="#makers-section"
          className="flex flex-col items-center justify-center py-1 text-[10px] font-bold"
        >
          <Sparkles className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Майстри' : 'Мастера'}</span>
        </a>
        <a
          href="#interactive-tools"
          onClick={() => setActiveEngagementTab('quiz')}
          className="flex flex-col items-center justify-center py-1 text-[10px] font-bold"
        >
          <Wand2 className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">{lang === 'uk' ? 'Підбір' : 'Подбор'}</span>
        </a>
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[10px] font-bold"
        >
          <Scale className="w-4 h-4 text-[#b06a1e]" />
          <span className="mt-0.5">
            {lang === 'uk' ? 'Порівняти' : 'Сравнить'} ({compareIds.length})
          </span>
        </button>
        <button
          onClick={() => setIsTenderModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl bg-[#b06a1e] text-white text-[10px] font-bold"
        >
          <Gift className="w-4 h-4" />
          <span className="mt-0.5">{lang === 'uk' ? 'Замовити' : 'Заказать'}</span>
        </button>
      </nav>

      {/* MODAL 1: Maker Details */}
      {activeMakerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b06a1e]">
                  {localizeText(activeMakerModal.segmentTitle, lang)}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                  {localizeText(activeMakerModal.name, lang)}
                </h2>
                <p className="text-xs text-[#715f53]">
                  {localizeText(activeMakerModal.city, lang)} •{' '}
                  {lang === 'uk' ? 'Рейтинг' : 'Рейтинг'} {activeMakerModal.rating}/5
                </p>
              </div>
              <button
                onClick={() => setActiveMakerModal(null)}
                className="p-2 rounded-full bg-[#f1e6da] text-[#302016]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeMakerModal.imageUrl && (
              <div className="rounded-2xl overflow-hidden h-56 sm:h-64 border border-[#e1d5c8] bg-[#f1e6da]">
                <img
                  src={activeMakerModal.imageUrl}
                  alt={activeMakerModal.name}
                  className="w-full h-full object-cover object-center brightness-105 contrast-105"
                />
              </div>
            )}

            <p className="text-sm leading-relaxed">
              {localizeText(activeMakerModal.description, lang)}
            </p>

            <div className="bg-[#f1e6da] rounded-2xl p-4 space-y-2 text-xs">
              <div>
                <strong>{lang === 'uk' ? 'Контакти / Телефон:' : 'Контакты / Телефон:'}</strong>{' '}
                {activeMakerModal.phone}
              </div>
              {activeMakerModal.instagramHandle && (
                <div>
                  <strong>Instagram:</strong> {activeMakerModal.instagramHandle}
                </div>
              )}
              {activeMakerModal.address && (
                <div>
                  <strong>{lang === 'uk' ? 'Локація:' : 'Локация:'}</strong>{' '}
                  {localizeText(activeMakerModal.address, lang)}
                </div>
              )}
              <div>
                <strong>{lang === 'uk' ? 'Доставка:' : 'Доставка:'}</strong>{' '}
                {localizeText(activeMakerModal.shippingNote, lang)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={
                  getMakerCategoryUrl(activeMakerModal, selectedCategory) ||
                  getMakerCategoryUrl(activeMakerModal, activeMakerModal.mainCategory) ||
                  activeMakerModal.websiteUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#462b1f] hover:bg-[#b06a1e] text-white font-bold py-3 px-4 rounded-full text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5"
              >
                <span>
                  {selectedCategory !== 'all' && getMakerCategoryUrl(activeMakerModal, selectedCategory)
                    ? lang === 'uk'
                      ? `Перейти у розділ «${CATEGORY_SHORT_LABELS[selectedCategory]?.uk || 'Каталог'}»`
                      : `Перейти в раздел «${CATEGORY_SHORT_LABELS[selectedCategory]?.ru || 'Каталог'}»`
                    : lang === 'uk'
                    ? 'Перейти до каталогу майстра'
                    : 'Перейти в каталог мастера'}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  const name = activeMakerModal.name;
                  setActiveMakerModal(null);
                  setSelectedPlanForModal(
                    `${lang === 'uk' ? 'Оновлення фото/вітрини:' : 'Обновление фото/витрины:'} ${name}`
                  );
                  setIsAddMakerModalOpen(true);
                }}
                className="bg-[#f1e6da] hover:bg-[#e5d5c3] text-[#462b1f] font-bold py-3 px-4 rounded-full text-xs transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#b06a1e]" />
                <span>{lang === 'uk' ? 'Змінити фото картки' : 'Изменить фото карточки'}</span>
              </button>
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
                {lang === 'uk'
                  ? 'Порівняння характеристик та ціни за 100 г'
                  : 'Сравнение характеристик и цены за 100 г'}
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
                {lang === 'uk'
                  ? 'Додайте вироби до порівняння кнопкою «Порівняти».'
                  : 'Добавьте изделия к сравнению кнопкой «Сравнить».'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#e1d5c8]">
                      <th className="py-3 px-3 text-[#715f53]">
                        {lang === 'uk' ? 'Параметр' : 'Параметр'}
                      </th>
                      {comparedProducts.map((p) => (
                        <th key={p.id} className="py-3 px-3">
                          <div className="font-bold">{localizeText(p.title, lang)}</div>
                          <div className="text-xs text-[#b06a1e] font-bold">
                            {localizeText(p.makerName, lang)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1d5c8]">
                    <tr>
                      <td className="py-3 px-3 text-[#715f53]">
                        {lang === 'uk' ? 'Ціна упаковки' : 'Цена упаковки'}
                      </td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold">
                          {p.priceUah} грн ({p.weightGrams} г)
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-[#f1e6da]/60">
                      <td className="py-3 px-3 font-bold text-[#b06a1e]">
                        {lang === 'uk' ? 'Ціна за 100 г' : 'Цена за 100 г'}
                      </td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-3 font-bold text-[#b06a1e]">
                          {getPricePer100g(p.priceUah, p.weightGrams)} грн / 100 г
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-[#715f53]">
                        {lang === 'uk' ? 'Підсолоджувач' : 'Подсластитель'}
                      </td>
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
                  {lang === 'uk'
                    ? 'Тендер для кондитерів та шоколатьє CraftHub'
                    : 'Тендер для кондитеров и шоколатье CraftHub'}
                </span>
                <h2 className="font-serif text-xl font-bold">
                  {lang === 'uk'
                    ? 'Замовити торт, букет чи шоколадний набір'
                    : 'Заказать торт, букет или шоколадный набор'}
                </h2>
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
                <div className="font-bold">
                  {lang === 'uk' ? 'Заявку передано майстрам!' : 'Заявка передана мастерам!'}
                </div>
                <p className="text-xs text-[#5a4638]">
                  {lang === 'uk'
                    ? 'Перевірені виробники вашого міста зв’яжуться з вами з пропозиціями.'
                    : 'Проверенные производители вашего города свяжутся с вами с предложениями.'}
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
                  placeholder={
                    lang === 'uk'
                      ? 'Ваше місто (Харків, Київ, Львів, Дніпро, Одеса...)'
                      : 'Ваш город (Харьков, Киев, Львов, Днепр, Одесса...)'
                  }
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder={
                    lang === 'uk'
                      ? 'Що потрібно? (плитки шоколаду, букет квітів, торт, зефір)'
                      : 'Что нужно? (плитки шоколада, букет цветов, торт, зефир)'
                  }
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <input
                  type="text"
                  required
                  placeholder={
                    lang === 'uk'
                      ? 'Ваш телефон або Telegram (@username)'
                      : 'Ваш телефон или Telegram (@username)'
                  }
                  className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-3"
                />
                <button
                  type="submit"
                  className="w-full bg-[#b06a1e] hover:bg-[#965715] text-white font-bold py-3 rounded-full transition"
                >
                  {lang === 'uk' ? 'Отримати пропозиції' : 'Получить предложения'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: Add Maker / PRO Upgrade / Direct Links Update */}
      {isAddMakerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fefbf7] text-[#302016] border border-[#e1d5c8] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#b06a1e] bg-[#b06a1e]/10 px-2.5 py-0.5 rounded-full mb-1">
                  <Sparkles className="w-3 h-3 text-[#b06a1e]" />
                  <span>{lang === 'uk' ? 'Кабінет майстра / PRO' : 'Кабинет мастера / PRO'}</span>
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {lang === 'uk'
                    ? 'Оновити прямі посилання, вітрину або додати майстерню'
                    : 'Обновить прямые ссылки, витрину или добавить мастерскую'}
                </h2>
                <p className="text-xs text-[#715f53] mt-1">
                  {lang === 'uk'
                    ? 'Клієнти переходитимуть одразу в потрібний розділ вашого інтернет-магазину чи Instagram!'
                    : 'Клиенты будут переходить сразу в нужный раздел вашего интернет-магазина или Instagram!'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddMakerModalOpen(false);
                  setMakerSubmitted(false);
                }}
                className="p-2 rounded-full bg-[#f1e6da] hover:bg-[#e5d5c3] text-[#302016] transition shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {makerSubmitted ? (
              <div className="bg-[#f1e6da] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="font-bold text-base">
                  {lang === 'uk' ? 'Дані успішно прийнято в обробку!' : 'Данные успешно приняты в обработку!'}
                </div>
                <p className="text-xs text-[#715f53]">
                  {lang === 'uk'
                    ? 'Ми перевіримо та підключимо ваші прямі посилання на розділи та оновимо фотографію вітрини протягом кількох годин.'
                    : 'Мы проверим и подключим ваши прямые ссылки на разделы и обновим фотографию витрины в течение нескольких часов.'}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMakerSubmitted(true);
                }}
                className="space-y-3.5 text-xs sm:text-sm"
              >
                <div>
                  <label className="block text-[11px] font-bold text-[#715f53] mb-1">
                    {lang === 'uk' ? 'Бренд, назва майстерні та місто *' : 'Бренд, название мастерской и город *'}
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={selectedPlanForModal.includes(':') ? selectedPlanForModal.split(':').pop()?.trim() : ''}
                    placeholder={lang === 'uk' ? 'Наприклад: CraftChoco, Харків' : 'Например: CraftChoco, Харьков'}
                    className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b06a1e]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#715f53] mb-1">
                      {lang === 'uk' ? 'Головний сайт або магазин *' : 'Главный сайт или магазин *'}
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://mysite.com.ua"
                      className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b06a1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#715f53] mb-1">
                      {lang === 'uk' ? 'Instagram або Telegram' : 'Instagram или Telegram'}
                    </label>
                    <input
                      type="text"
                      placeholder="@my_brand_chocolate"
                      className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b06a1e]"
                    />
                  </div>
                </div>

                {/* Section for direct category deep links */}
                <div className="bg-[#f1e6da]/70 border border-[#e1d5c8] rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#b06a1e]">
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === 'uk'
                        ? '🎯 Прямі посилання на ваші рубрики (для миттєвого переходу клієнта):'
                        : '🎯 Прямые ссылки на ваши рубрики (для мгновенного перехода клиента):'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#715f53] leading-tight">
                    {lang === 'uk'
                      ? 'Вкажіть прямі URL сторінок вашого магазину, щоб покупець в 1 клік потрапляв у потрібну категорію:'
                      : 'Укажите прямые URL страниц вашего магазина, чтобы покупатель в 1 клик попадал в нужную категорию:'}
                  </p>

                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder={lang === 'uk' ? '🍫 Посилання на розділ «Плитки та батончики»' : '🍫 Ссылка на раздел «Плитки и батончики»'}
                      className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#b06a1e]"
                    />
                    <input
                      type="url"
                      placeholder={lang === 'uk' ? '🍬 Посилання на розділ «Цукерки ручної роботи»' : '🍬 Ссылка на раздел «Конфеты ручной работы»'}
                      className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#b06a1e]"
                    />
                    <input
                      type="url"
                      placeholder={lang === 'uk' ? '🌹 Посилання на розділ «Шоколадні квіти / Букети»' : '🌹 Ссылка на раздел «Шоколадные цветы / Букеты»'}
                      className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#b06a1e]"
                    />
                    <input
                      type="url"
                      placeholder={lang === 'uk' ? '🎂 Посилання на розділ «Торти» / 🌸 «Зефір» / 🌿 «Без цукру»' : '🎂 Ссылка на раздел «Торты» / 🌸 «Зефир» / 🌿 «Без сахара»'}
                      className="w-full bg-white border border-[#d4c3b3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#b06a1e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#715f53] mb-1">
                    {lang === 'uk'
                      ? 'Фото вітрини (посилання на фото або вкажіть, що надішлете в Telegram)'
                      : 'Фото витрины (ссылка на фото или укажите, что пришлете в Telegram)'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      lang === 'uk'
                        ? 'Посилання на фото (Google Drive, сайт) або телефон/Telegram'
                        : 'Ссылка на фото (Google Drive, сайт) или телефон/Telegram'
                    }
                    className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b06a1e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#715f53] mb-1">
                    {lang === 'uk' ? 'Контактний телефон власника / менеджера *' : 'Контактный телефон владельца / менеджера *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+38 (0XX) XXX-XX-XX"
                    className="w-full bg-white border border-[#d4c3b3] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b06a1e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#462b1f] to-[#b06a1e] hover:from-[#5a3828] hover:to-[#965715] text-white font-bold py-3.5 rounded-full transition shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#f0a556]" />
                  <span>
                    {lang === 'uk'
                      ? 'Зберегти прямі посилання та оновити вітрину'
                      : 'Сохранить прямые ссылки и обновить витрину'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
