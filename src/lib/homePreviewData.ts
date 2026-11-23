import type { CategorySlug, MakerSegment } from '@/data/chocolateData';
import { DISCOVERED_CATEGORY_URLS } from '@/data/categoryLinks';

export type Lang = 'uk' | 'ru';

export interface BreadcrumbTrailItem {
  labelUk: string;
  labelRu?: string;
  hrefUk?: string;
  hrefRu?: string;
}

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
  {
    slug: 'dubaiskyi-shokolad-ta-korpusni-tsukerky-ukraina',
    titleUk:
      'Дубайський шоколад, корпусні цукерки та сирні трюфелі: на що дивитися перед покупкою',
    titleRu:
      'Дубайский шоколад, корпусные конфеты и сырные трюфели: на что смотреть перед покупкой',
    excerptUk:
      'З чого складається справжня фісташкова начинка з тістом катаїфі, скільки живуть корпусні цукерки з ганашем і чим цікаві сирні трюфелі з Дорблю й Пармезаном.',
    excerptRu:
      'Из чего делают настоящую фисташковую начинку с тестом катаифи, сколько хранятся корпусные конфеты с ганашем и чем отличаются сырные трюфели с Дорблю и Пармезаном.',
    heroImage:
      'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=80',
  },
  {
    slug: 'bento-tort-na-zamovlennia-vaha-tsina-napys',
    titleUk:
      'Бенто-торт на замовлення: вага, начинки, терміни та за скільки днів замовляти',
    titleRu:
      'Бенто-торт на заказ: вес, начинки, сроки и за сколько дней заказывать',
    excerptUk:
      'Скільки грамів важить стандартний бенто-торт, на скількох гостей його вистачає, що йде в комплекті та чи реально замовити десерт день у день.',
    excerptRu:
      'Сколько граммов весит стандартный бенто-торт, на сколько человек его хватает, что идет в комплекте и реально ли заказать десерт день в день.',
    heroImage:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80',
  },
] as const;

export interface SeoStatsBanner {
  makersCount: number;
  localCount?: number;
  minPriceUah: number;
  maxPriceUah: number;
  cityLabelUk?: string;
  cityLabelRu?: string;
}

export interface SeoRelatedLinkItem {
  labelUk: string;
  labelRu: string;
  hrefUk: string;
  hrefRu?: string;
}

export interface SeoRelatedLinkGroup {
  titleUk: string;
  titleRu: string;
  items: SeoRelatedLinkItem[];
}

export const CITY_HUB_LINKS = [
  { slug: 'kharkiv', cityNameUk: 'Харків', cityNameRu: 'Харьков' },
  { slug: 'kyiv', cityNameUk: 'Київ', cityNameRu: 'Киев' },
  { slug: 'lviv', cityNameUk: 'Львів', cityNameRu: 'Львов' },
  { slug: 'dnipro', cityNameUk: 'Дніпро', cityNameRu: 'Днепр' },
  { slug: 'odesa', cityNameUk: 'Одеса', cityNameRu: 'Одесса' },
  { slug: 'vinnytsia', cityNameUk: 'Вінниця', cityNameRu: 'Винница' },
  { slug: 'poltava', cityNameUk: 'Полтава', cityNameRu: 'Полтава' },
  { slug: 'zaporizhzhia', cityNameUk: 'Запоріжжя', cityNameRu: 'Запорожье' },
  { slug: 'ivano-frankivsk', cityNameUk: 'Івано-Франківськ', cityNameRu: 'Ивано-Франковск' },
  { slug: 'cherkasy', cityNameUk: 'Черкаси', cityNameRu: 'Черкассы' },
  { slug: 'lutsk-volyn', cityNameUk: 'Луцьк та Волинь', cityNameRu: 'Луцк и Волынь' },
] as const;

export const POPULAR_SEO_SHORTCUTS: {
  labelUk: string;
  labelRu: string;
  hrefUk: string;
  hrefRu?: string;
  emoji: string;
}[] = [
  { labelUk: 'Дубайський шоколад із катаїфі', labelRu: 'Дубайский шоколад с катаифи', hrefUk: '/katalog/dubaiskyi-shokolad', emoji: '💚' },
  { labelUk: 'Бенто-торти Київ', labelRu: 'Бенто-торты Киев', hrefUk: '/misto/kyiv/bento-torty', hrefRu: '/ru/misto/kyiv/bento-torty', emoji: '🍱' },
  { labelUk: 'Бенто-торти Харків', labelRu: 'Бенто-торты Харьков', hrefUk: '/misto/kharkiv/bento-torty', hrefRu: '/ru/misto/kharkiv/bento-torty', emoji: '🍱' },
  { labelUk: 'Шоколадні квіти Харків', labelRu: 'Шоколадные цветы Харьков', hrefUk: '/misto/kharkiv/shokoladni-kvity', hrefRu: '/ru/misto/kharkiv/shokoladni-kvity', emoji: '🌹' },
  { labelUk: 'Шоколадні квіти Київ', labelRu: 'Шоколадные цветы Киев', hrefUk: '/misto/kyiv/shokoladni-kvity', hrefRu: '/ru/misto/kyiv/shokoladni-kvity', emoji: '🌹' },
  { labelUk: 'Зефірні букети Київ', labelRu: 'Зефирные букеты Киев', hrefUk: '/misto/kyiv/zefirni-bukety', hrefRu: '/ru/misto/kyiv/zefirni-bukety', emoji: '💐' },
  { labelUk: 'Зефірні букети Дніпро', labelRu: 'Зефирные букеты Днепр', hrefUk: '/misto/dnipro/zefirni-bukety', hrefRu: '/ru/misto/dnipro/zefirni-bukety', emoji: '💐' },
  { labelUk: 'Сирні трюфелі Дорблю', labelRu: 'Сырные трюфели Дорблю', hrefUk: '/katalog/syrni-tryufeli', emoji: '🧀' },
  { labelUk: 'Шоколад без цукру', labelRu: 'Шоколад без сахара', hrefUk: '/katalog/bez-tsukru', emoji: '🌿' },
  { labelUk: 'Веганський шоколад', labelRu: 'Веганский шоколад', hrefUk: '/katalog/vegan-shokolad', emoji: '🌱' },
  { labelUk: 'Полуниця в шоколаді', labelRu: 'Клубника в шоколаде', hrefUk: '/katalog/polunytsia-v-shokoladi', emoji: '🍓' },
  { labelUk: 'Подарунок мамі', labelRu: 'Подарок маме', hrefUk: '/podarunky/dlia-mamy', hrefRu: '/ru/podarunky/dlia-mamy', emoji: '💝' },
  { labelUk: 'На день народження', labelRu: 'На день рождения', hrefUk: '/podarunky/na-den-narodzhennia', hrefRu: '/ru/podarunky/na-den-narodzhennia', emoji: '🎉' },
  { labelUk: 'Корпоративні подарунки', labelRu: 'Корпоративные подарки', hrefUk: '/podarunky/korporatyvni-podarunky', hrefRu: '/ru/podarunky/korporatyvni-podarunky', emoji: '🏢' },
  { labelUk: 'Дитячі подарунки', labelRu: 'Детские подарки', hrefUk: '/podarunky/dlia-ditei', hrefRu: '/ru/podarunky/dlia-ditei', emoji: '🧸' },
  { labelUk: 'Подарунок коханій', labelRu: 'Подарок любимой', hrefUk: '/podarunky/dlia-kohanoyi', hrefRu: '/ru/podarunky/dlia-kohanoyi', emoji: '❤️' },
];

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
