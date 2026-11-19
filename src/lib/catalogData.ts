import { CraftMaker, MAKERS } from '@/data/chocolateData';
import type { MacroSectionId } from '@/data/sectionVariants';
import type { CatalogCityCount, CatalogMaker, CatalogSummary } from './homePreviewData';

const RAW_CITIES: { id: string; uk: string; ru: string }[] = [
  { id: 'all', uk: 'Вся Україна', ru: 'Вся Украина' },
  { id: 'Київ', uk: 'Київ', ru: 'Киев' },
  { id: 'Харків', uk: 'Харків', ru: 'Харьков' },
  { id: 'Львів', uk: 'Львів', ru: 'Львов' },
  { id: 'Дніпро', uk: 'Дніпро', ru: 'Днепр' },
  { id: 'Одеса', uk: 'Одеса', ru: 'Одесса' },
  { id: 'Запоріжжя', uk: 'Запоріжжя', ru: 'Запорожье' },
  { id: 'Івано-Франківськ', uk: 'Івано-Франківськ', ru: 'Ивано-Франковск' },
  { id: 'Чернівці', uk: 'Чернівці', ru: 'Черновцы' },
  { id: 'Тернопіль', uk: 'Тернопіль', ru: 'Тернополь' },
  { id: 'Вінниця', uk: 'Вінниця', ru: 'Винница' },
  { id: 'Полтава', uk: 'Полтава', ru: 'Полтава' },
  { id: 'Луцьк', uk: 'Луцьк', ru: 'Луцк' },
  { id: 'Черкаси', uk: 'Черкаси', ru: 'Черкассы' },
  { id: 'Хмельницький', uk: 'Хмельницький', ru: 'Хмельницкий' },
  { id: 'Рівне', uk: 'Рівне', ru: 'Ровно' },
  { id: 'Житомир', uk: 'Житомир', ru: 'Житомир' },
  { id: 'Чернігів', uk: 'Чернігів', ru: 'Чернигов' },
  { id: 'Суми', uk: 'Суми', ru: 'Сумы' },
  { id: 'Кропивницький', uk: 'Кропивницький', ru: 'Кропивницкий' },
  { id: 'Миколаїв', uk: 'Миколаїв', ru: 'Николаев' },
  { id: 'Ужгород', uk: 'Ужгород', ru: 'Ужгород' },
  { id: 'Кременчук', uk: 'Кременчук', ru: 'Кременчуг' },
  { id: 'Ковель', uk: 'Ковель', ru: 'Ковель' },
];

function isCityMatch(m: CraftMaker, cityId: string): boolean {
  if (cityId === 'all') return true;
  const needle = cityId.toLowerCase();
  const c = (m.city || '').toLowerCase();
  const r = (m.regionCity || '').toLowerCase();
  return c.includes(needle) || r.includes(needle);
}

export function toCatalogMaker(m: CraftMaker): CatalogMaker {
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    segment: m.segment,
    city: m.city,
    regionCity: m.regionCity,
    specialty: m.specialty,
    categories: m.categories,
    mainCategory: m.mainCategory,
    rating: m.rating,
    description: m.description,
    websiteUrl: m.websiteUrl,
    ...(m.categoryUrls ? { categoryUrls: m.categoryUrls } : {}),
    ...(m.instagramHandle ? { instagramHandle: m.instagramHandle } : {}),
    phone: m.phone,
    address: m.address,
    shippingNote: m.shippingNote,
    ...(m.imageUrl ? { imageUrl: m.imageUrl } : {}),
  };
}

let cachedSummary: CatalogSummary | null = null;

export function getCatalogSummary(): CatalogSummary {
  if (cachedSummary) return cachedSummary;

  const chocolateMakersCount = MAKERS.filter(
    (m) =>
      m.segment === 'bean-to-bar' ||
      m.segment === 'chocolatier-bonbons' ||
      m.segment === 'healthy-vegan' ||
      m.segment === 'flowers-berries-nuts'
  ).length;

  const cakeMakersCount = MAKERS.filter((m) =>
    m.categories.includes('avtorski-torty-ta-deserty')
  ).length;

  const zefirMakersCount = MAKERS.filter((m) =>
    m.categories.includes('kraftovyi-zefir-ta-bukety')
  ).length;

  const popularCities: CatalogCityCount[] = RAW_CITIES.map((city) => ({
    ...city,
    count:
      city.id === 'all'
        ? MAKERS.length
        : MAKERS.filter((m) => isCityMatch(m, city.id)).length,
  }));

  cachedSummary = {
    totalMakersCount: MAKERS.length,
    chocolateMakersCount,
    cakeMakersCount,
    zefirMakersCount,
    popularCities,
  };

  return cachedSummary;
}

export function getMakersForSection(section: MacroSectionId): CatalogMaker[] {
  if (section === 'cakes') {
    return MAKERS.filter((m) => m.categories.includes('avtorski-torty-ta-deserty')).map(
      toCatalogMaker
    );
  }
  if (section === 'zefir') {
    return MAKERS.filter((m) => m.categories.includes('kraftovyi-zefir-ta-bukety')).map(
      toCatalogMaker
    );
  }
  if (section === 'chocolate') {
    return MAKERS.filter(
      (m) =>
        m.segment === 'bean-to-bar' ||
        m.segment === 'chocolatier-bonbons' ||
        m.segment === 'healthy-vegan' ||
        m.segment === 'flowers-berries-nuts' ||
        m.categories.some(
          (cat) => cat !== 'avtorski-torty-ta-deserty' && cat !== 'kraftovyi-zefir-ta-bukety'
        )
    ).map(toCatalogMaker);
  }
  return MAKERS.map(toCatalogMaker);
}
