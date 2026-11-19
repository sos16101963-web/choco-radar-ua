export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crafohab.com.ua'
).replace(/\/$/, '');

export const SITE_NAME = 'CrafoHab';
export const SITE_DOMAIN_LABEL = 'crafohab.com.ua';
export const SITE_EMAIL = 'editor@crafohab.com.ua';
export const SITE_LAST_UPDATED = '2026-11-19';
export const INDEXNOW_KEY = 'c7f4a9e2b1d84f6a9c3e5b7d2a8f1e4c';

export const RU_SUPPORTED_PREFIXES = [
  '/shokolad',
  '/torty',
  '/zefir',
  '/misto',
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
    qUk: 'Як працює підбір основних виробників і рубрики «Без цукру» та «Для дітей»?',
    qRu: 'Как работает подбор основных производителей и рубрики «Без сахара» и «Для детей»?',
    aUk: 'Ви обираєте розділ (Шоколад, Торти або Зефір) і потрібний вид продукту — платформа миттєво показує ТОП-виробників із прямими посиланнями та швидким замовленням у Viber або Telegram. Для зручності окремо виділено розділ «Без цукру» (на меду, стевії, кокосовому нектарі) та «Для дітей» (на керобі без кофеїну та натуральна ягідна пастила).',
    aRu: 'Вы выбираете раздел (Шоколад, Торты или Зефир) и нужный вид продукта — платформа мгновенно показывает ТОП-производителей с прямыми ссылками и быстрым заказом в Viber или Telegram. Для удобства отдельно выделены разделы «Без сахара» (на меде, стевии, кокосовом нектаре) и «Для детей» (на кэробе без кофеина и натуральная ягодная пастила).',
  },
  {
    qUk: 'Як працює Тендерна біржа замовлень на торти, зефірні та шоколадні букети?',
    qRu: 'Как работает Тендерная биржа заказов на торты, зефирные и шоколадные букеты?',
    aUk: 'Покупець залишає одну заявку із зазначенням міста, дати та бюджету, а перевірені майстерні свого міста самі надсилають персональні пропозиції з фото та цінами напряму у Telegram або Viber без комісій платформи (0%).',
    aRu: 'Покупатель оставляет одну заявку с указанием города, даты и бюджета, а проверенные мастерские своего города сами присылают персональные предложения с фото и ценами напрямую в Telegram или Viber без комиссий платформы (0%).',
  },
];
