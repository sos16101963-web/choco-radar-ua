import { CATEGORIES, MAKERS } from '@/data/chocolateData';
import { BLOG_ARTICLES, CITY_SEO_HUBS } from '@/data/blogData';
import { CITY_SECTION_COMBOS } from '@/data/cityCategorySeo';
import { CAKE_VARIANTS, CHOCOLATE_VARIANTS, ZEFIR_VARIANTS } from '@/data/sectionVariants';
import { SITE_EMAIL, SITE_URL } from '@/lib/siteConfig';

export const dynamic = 'force-static';

export function GET() {
  const lines: string[] = [
    '# CrafoHab (crafohab.com.ua)',
    '',
    `> Всеукраїнська платформа та незалежний навігатор перевірених крафтових виробників шоколаду, цукерок ручної роботи, шоколадних квітів, авторських тортів та крафтового зефіру в Україні (${MAKERS.length} майстерень). Без посередників та з 0% комісії — прямі посилання на сайти виробників та швидке замовлення у Viber і Telegram.`,
    '',
    '## Key Standards & Methodology',
    '- Clean Label Verification: 100% натуральне какао-масло (зокрема Barry Callebaut або фермерські боби Fino de Aroma), вершкове масло 82.5%, ягоди та агар-агар без пальмової олії та рослинних спредів.',
    '- Fair Price per 100g: Автоматичний розрахунок вартості за 100 грамів для захисту покупців від шрінкфляції.',
    '- Direct Ordering (0% Commission): Покупці переходять напряму на сайт майстерні, в Instagram, Viber або Telegram або оголошують безкоштовний тендер на індивідуальний торт/букет.',
    `- Legal Notice: Інформація про майстерні зібрана з відкритих публічних джерел для ознайомлення споживачів. Оновлення або видалення профілю: ${SITE_EMAIL}.`,
    '',
    '## Main Sections',
    `- [Головна сторінка CrafoHab (UK)](${SITE_URL}): Огляд платформи, фільтр міст, Тендерна біржа та 3 головні розділи.`,
    `- [Главная страница CrafoHab (RU)](${SITE_URL}/ru): Русскоязычная версия каталога, фильтров городов и разделов.`,
    `- [Усі ${MAKERS.length} майстерень України](${SITE_URL}/maysternya): Повний реєстр персональних профілів виробників із рейтингами, контактами та цінами.`,
    `- [Крафтовий шоколад та цукерки](${SITE_URL}/shokolad): Плитки, батончики, корпусні цукерки, шоколадні квіти, ягоди та горіхи в шоколаді, без цукру, для дітей.`,
    `- [Авторські торти та десерти](${SITE_URL}/torty): Святкові торти на замовлення, бенто-торти, дитячі торти, макарони.`,
    `- [Крафтовий зефір та букети](${SITE_URL}/zefir): Їстівні зефірні букети, зефір у шоколаді, ягідний зефір і пастила.`,
    `- [Експертний блог та гіди](${SITE_URL}/blog): Рейтинги, огляди складу, норми ваги торта та інструкції вибору.`,
    `- [Для виробників (0% комісія)](${SITE_URL}/for-makers): Умови безкоштовного розміщення, UTM-трекінг та ліди з Тендерної біржі.`,
    '',
    '## Product Subcategories',
    ...CHOCOLATE_VARIANTS.map((v) => `- [${v.titleUk}](${SITE_URL}/shokolad/${v.slug}): ${v.shortDescUk}`),
    ...CAKE_VARIANTS.map((v) => `- [${v.titleUk}](${SITE_URL}/torty/${v.slug}): ${v.shortDescUk}`),
    ...ZEFIR_VARIANTS.map((v) => `- [${v.titleUk}](${SITE_URL}/zefir/${v.slug}): ${v.shortDescUk}`),
    ...CATEGORIES.filter((c) => c.slug !== 'all').map(
      (cat) => `- [Каталог: ${cat.shortTitle}](${SITE_URL}/katalog/${cat.slug}): ${cat.seoDescription}`
    ),
    '',
    '## Cities & Local Hubs',
    ...CITY_SEO_HUBS.map(
      (city) => `- [${city.cityNameUk}](${SITE_URL}/misto/${city.slug}): ${city.descriptionUk}`
    ),
    ...CITY_SECTION_COMBOS.map(
      (combo) => `- [${combo.h1Uk}](${SITE_URL}/misto/${combo.citySlug}/${combo.categorySlug}): ${combo.metaDescUk}`
    ),
    '',
    '## Expert Guides',
    ...BLOG_ARTICLES.map(
      (art) => `- [${art.titleUk}](${SITE_URL}/blog/${art.slug}): ${art.excerptUk}`
    ),
    '',
    '## Top Verified Makers (Selection)',
    ...MAKERS.slice(0, 15).map(
      (m) =>
        `- **${m.name}** (${m.city}, ★ ${m.rating}): ${m.specialty} — [Профіль CrafoHab](${SITE_URL}/maysternya/${m.slug}) | [Офіційний сайт](${m.websiteUrl})`
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
