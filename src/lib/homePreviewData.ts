import type { CategorySlug, MakerSegment } from '@/data/chocolateData';
import { DISCOVERED_CATEGORY_URLS } from '@/data/categoryLinks';

export type Lang = 'uk' | 'ru';

export interface CatalogMaker {
  id: string;
  name: string;
  slug: string;
  segment: MakerSegment;
  city: string;
  regionCity: string;
  specialty: string;
  categories: Exclude<CategorySlug, 'all'>[];
  mainCategory: Exclude<CategorySlug, 'all'>;
  rating: number;
  description: string;
  websiteUrl: string;
  categoryUrls?: Partial<Record<Exclude<CategorySlug, 'all'>, string>>;
  instagramHandle?: string;
  phone: string;
  address: string;
  shippingNote: string;
  imageUrl?: string;
}

export interface CatalogCityCount {
  id: string;
  uk: string;
  ru: string;
  count: number;
}

export interface CatalogSummary {
  totalMakersCount: number;
  chocolateMakersCount: number;
  cakeMakersCount: number;
  zefirMakersCount: number;
  popularCities: CatalogCityCount[];
}

export const BLOG_PREVIEW_CARDS = [
  {
    slug: 'shokoladni-kvity-ta-bukety-ukraina-hyd-2027',
    titleUk:
      'Шоколадні квіти та букети ручної роботи в Україні: як обрати справжній бельгійський шоколад і не купити глазур',
    titleRu:
      'Шоколадные цветы и букеты ручной работы в Украине: как выбрать настоящий бельгийский шоколад и не купить глазурь',
    excerptUk:
      'Чому букети з шоколадних троянд та півоній дедалі частіше беруть замість живих квітів, як перевірити склад какао-масла Callebaut і як такі набори доїжджають Новою Поштою.',
    excerptRu:
      'Почему букеты из шоколадных роз и пионов все чаще выбирают вместо живых цветов, как проверить состав какао-масла Callebaut и как такие наборы доезжают Новой Почтой.',
    heroImage: '/images/crafo-large-flowers.webp',
  },
  {
    slug: 'yak-obraty-kraftovu-plytku-shokoladu-ta-batonchyk-reitynh',
    titleUk:
      'Крафтова плитка шоколаду та батончик: як обрати й порівняти виробників в Україні',
    titleRu:
      'Крафтовая плитка шоколада и батончик: как выбрать и сравнить производителей в Украине',
    excerptUk:
      'На що дивитися в складі плитки, чому важливо рахувати ціну за 100 грамів і які українські майстерні роблять шоколад із цільними горіхами й ягодами без замінників.',
    excerptRu:
      'На что смотреть в составе плитки, почему важно считать цену за 100 граммов и какие украинские мастерские делают шоколад с цельными орехами и ягодами без заменителей.',
    heroImage:
      'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=80',
  },
] as const;

export const CITY_HUB_LINKS = [
  { slug: 'kharkiv', cityNameUk: 'Харків', cityNameRu: 'Харьков' },
  { slug: 'kyiv', cityNameUk: 'Київ', cityNameRu: 'Киев' },
  { slug: 'lviv', cityNameUk: 'Львів', cityNameRu: 'Львов' },
  { slug: 'dnipro', cityNameUk: 'Дніпро', cityNameRu: 'Днепр' },
  { slug: 'odesa', cityNameUk: 'Одеса', cityNameRu: 'Одесса' },
  { slug: 'lutsk-volyn', cityNameUk: 'Луцьк та Волинь', cityNameRu: 'Луцк и Волынь' },
] as const;

export function getMakerCategoryUrl(
  maker: Pick<CatalogMaker, 'id' | 'categoryUrls'>,
  cat: CategorySlug
): string | null {
  if (cat === 'all') return null;
  return maker.categoryUrls?.[cat] || DISCOVERED_CATEGORY_URLS[maker.id]?.[cat] || null;
}

export function cleanDisplayName(name: string): string {
  if (!name) return '';
  if (name.includes('CraftChoco') || name.includes('Crafo.Choco')) {
    return 'Crafo — Майстерня крафтового шоколаду';
  }
  return name
    .replace(
      /\s*\([a-z0-9.\-/]+\.(?:com|ua|org|net|in\.ua|kiev\.ua|kh\.ua)(?:\s*\/\s*[a-z0-9.\-/]+\.(?:com|ua|org|net))?\)/gi,
      ''
    )
    .replace(/\s*—\s*№1\s*Лідер.*$/gi, '')
    .trim();
}

export function localizeText(text: string, lang: Lang): string {
  if (lang === 'uk' || !text) return text;
  return text
    .replace(/№1 Лідер категорії Шоколад/g, '№1 Лидер категории Шоколад')
    .replace(
      /Офіційний лідер рейтингу крафтового шоколаду України/g,
      'Официальный лидер рейтинга крафтового шоколада Украины'
    )
    .replace(
      /виготовляють преміальні шоколадні плитки ручної роботи/g,
      'изготавливают шоколадные плитки ручной работы'
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
