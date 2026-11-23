export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crafohab.com.ua'
).replace(/\/$/, '');

export const SITE_NAME = 'CrafoHab';
export const SITE_DOMAIN_LABEL = 'crafohab.com.ua';
export const SITE_EMAIL = 'crafohab@ukr.net';
export const SITE_LAST_UPDATED = '2026-11-24';
export const INDEXNOW_KEY = 'c7f4a9e2b1d84f6a9c3e5b7d2a8f1e4c';

export const RU_SUPPORTED_PREFIXES = [
  '/shokolad',
  '/torty',
  '/zefir',
  '/misto',
  '/podarunky',
  '/blog',
] as const;

export function hasRuRoute(ukPath: string): boolean {
  if (ukPath === '/') return true;
  return RU_SUPPORTED_PREFIXES.some(
    (prefix) => ukPath === prefix || ukPath.startsWith(`${prefix}/`)
  );
}

export function buildHreflangAlternates(ukPath: string) {
  const clean = ukPath.startsWith('/') ? ukPath : `/${ukPath}`;
  const normalized = clean === '/' ? '' : clean.replace(/\/$/, '');
  return {
    'uk-UA': `${SITE_URL}${normalized}`,
    'ru-UA': `${SITE_URL}/ru${normalized}`,
    'x-default': `${SITE_URL}${normalized}`,
  };
}

export function extractPhoneDigits(phone?: string | null): string | null {
  if (!phone || phone.startsWith('Замовлення')) return null;
  const rawDigits = phone.split(',')[0].replace(/[^\d]/g, '');
  if (rawDigits.length < 9) return null;
  if (rawDigits.startsWith('380')) return rawDigits;
  if (rawDigits.startsWith('0')) return `38${rawDigits}`;
  return rawDigits;
}

export function toAbsoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return `${SITE_URL}/images/crafo-collage.jpg`;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
}

export interface FaqEntry {
  qUk: string;
  qRu: string;
  aUk: string;
  aRu: string;
}

export const HOME_FAQ: FaqEntry[] = [
  {
    qUk: 'Чим крафтова плитка шоколаду та батончик відрізняються від мас-маркету?',
    qRu: 'Чем крафтовая плитка шоколада и батончик отличаются от масс-маркета?',
    aUk: 'Крафтова плитка шоколаду та ремісничий батончик виготовляються з натурального какао-масла та добірних какао-бобів (зокрема бельгійського кувертюру Barry Callebaut або фермерських бобів Fino de Aroma) без пальмової олії, замінників та штучних ароматизаторів. На CrafoHab додатково автоматично рахується чесна ціна за 100 г.',
    aRu: 'Крафтовая плитка шоколада и ремесленный батончик изготавливаются из натурального какао-масла и отборных какао-бобов (включая бельгийский кувертюр Barry Callebaut или фермерские бобы Fino de Aroma) без пальмового масла, заменителей и искусственных ароматизаторов. На CrafoHab дополнительно автоматически рассчитывается честная цена за 100 г.',
  },
  {
    qUk: 'Як працює підбір виробників і рубрики «Без цукру» та «Для дітей»?',
    qRu: 'Как работает подбор производителей и рубрики «Без сахара» и «Для детей»?',
    aUk: 'Ви обираєте розділ (Шоколад, Торти або Зефір) і потрібний вид виробу — каталог показує перевірені майстерні з прямими сайтами та швидким замовленням у Viber або Telegram. Окремо виділені розділи «Без цукру» (на меду, стевії, кокосовому нектарі) та «Для дітей» (на керобі без кофеїну та натуральна ягідна пастила).',
    aRu: 'Вы выбираете раздел (Шоколад, Торты или Зефир) и нужный вид изделия — каталог показывает проверенные мастерские с прямыми сайтами и быстрым заказом в Viber или Telegram. Отдельно выделены разделы «Без сахара» (на меде, стевии, кокосовом нектаре) и «Для детей» (на кэробе без кофеина и натуральная ягодная пастила).',
  },
  {
    qUk: 'Як працює форма індивідуального замовлення на торти та букети?',
    qRu: 'Как работает форма индивидуального заказа на торты и букеты?',
    aUk: 'Ви залишаєте одну заявку з містом, датою та орієнтовним бюджетом, а вільні майстерні вашого міста самі надсилають пропозиції з фото й цінами напряму у Telegram або Viber без комісій платформи (0%).',
    aRu: 'Вы оставляете одну заявку с городом, датой и ориентировочным бюджетом, а свободные мастерские вашего города сами присылают предложения с фото и ценами напрямую в Telegram или Viber без комиссий платформы (0%).',
  },
];
