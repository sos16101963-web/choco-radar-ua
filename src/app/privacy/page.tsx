import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ShieldCheck, ArrowUpRight, Sparkles, Database, FileText } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import BackToTopButton from '@/components/BackToTopButton';
import { SITE_EMAIL, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';

const pageTitle = 'Політика конфіденційності та контакти редакції';
const pageDescription = `Політика конфіденційності платформи CrafoHab: як ми обробляємо заявки, зберігаємо обрані майстерні в браузері та працюємо із запитами власників майстерень на ${SITE_EMAIL}.`;
const pageUrl = `${SITE_URL}/privacy`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: pageUrl,
    siteName: SITE_NAME,
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function PrivacyPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Крафтові солодощі України', url: SITE_URL },
    { name: pageTitle, url: pageUrl },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage: 'uk-UA',
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  };

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid w-9 h-9 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-base">
              🍫
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight">
                Crafo<span className="text-[#b06a1e]">Hab</span>
              </span>
              <span className="text-[10px] font-medium text-[#4a382e]">crafohab.com.ua</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 text-xs font-bold">
            <Link href="/shokolad" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              🍫 Шоколад
            </Link>
            <Link href="/torty" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              🎂 Торти
            </Link>
            <Link href="/zefir" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              🌸 Зефір
            </Link>
            <Link href="/maysternya" className="rounded-full px-3 py-1.5 hover:bg-[#f1e6da] transition">
              🏭 Майстерні
            </Link>
          </nav>

          <Link
            href="/"
            className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-2 text-xs font-bold transition shrink-0"
          >
            ← На головну
          </Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 sm:py-10 sm:px-6 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Крафтові солодощі України', href: '/' },
            { label: pageTitle },
          ]}
        />

        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e39851]/20 border border-[#b06a1e]/40 px-3.5 py-1 text-xs font-extrabold text-[#8c4f12]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Прозорі правила CrafoHab</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Політика конфіденційності та контакти редакції
          </h1>
          <p className="text-sm sm:text-base text-[#5a4638] leading-relaxed">
            Тут коротко та без складних формулювань описано, як CrafoHab працює з вашими заявками, локальними збереженнями в браузері та зверненнями власників майстерень.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-6 sm:p-8 shadow-xs">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#b06a1e] shrink-0" />
              <span>1. Про каталог CrafoHab</span>
            </h2>
            <p className="text-sm text-[#5a4638] leading-relaxed">
              CrafoHab (<strong>crafohab.com.ua</strong>) — незалежний український каталог майстерень крафтового шоколаду, авторських тортів та зефіру. Ми не виступаємо інтернет-магазином чи посередником в оплатах: користувачі переходять напряму на сайти, у Viber або Telegram вибраних виробників без націнок і комісій платформи (0%).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#b06a1e] shrink-0" />
              <span>2. Які дані ми отримуємо</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#5a4638] leading-relaxed">
              <li>
                <strong>Дані із заявок на сайті:</strong> коли ви заповнюєте форму індивідуального замовлення, додавання майстерні або заявку на безкоштовний аудит виробника, ми отримуємо лише ті поля, які ви добровільно ввели (місто, опис, назву майстерні, посилання та контактний номер або Telegram/Viber для зворотного зв’язку).
              </li>
              <li>
                <strong>Локальні збереження у вашому браузері (localStorage):</strong> вибрані майстерні («Обрані»), останні переглянуті профілі та світла чи темна тема зберігаються виключно у пам’яті вашого браузера для зручності й не передаються на наші сервери.
              </li>
              <li>
                <strong>Агреговані кліки переходів:</strong> переходи на зовнішні сайти чи контакти майстерень рахуються як знеособлена статистика без збору ваших персональних контактів.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>3. Мета обробки та захист контактів</span>
            </h2>
            <p className="text-sm text-[#5a4638] leading-relaxed">
              Контактні дані із заявок використовуються виключно для передачі вашого запиту майстрам за вибраним містом або для зв’язку редакції з власником майстерні. Ми не продаємо, не здаємо в оренду і не передаємо номери телефонів чи контакти стороннім рекламним базам.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-[#b06a1e] shrink-0" />
              <span>4. Відкриті джерела та оновлення профілів майстерень</span>
            </h2>
            <p className="text-sm text-[#5a4638] leading-relaxed">
              Інформація про майстерні у каталозі взята з відкритих публічних джерел для ознайомлення споживачів. Якщо ви є власником майстерні та бажаєте оновити опис, контакти, фотографії або повністю видалити профіль з каталогу — напишіть нам на пошту редакції, і ми опрацюємо запит протягом 1–2 робочих днів.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e39851]/50 bg-[#fff8ef] p-5 space-y-3">
            <h2 className="font-serif text-lg font-bold flex items-center gap-2 text-[#302016]">
              <Mail className="w-5 h-5 text-[#b06a1e] shrink-0" />
              <span>5. Контакти редакції CrafoHab</span>
            </h2>
            <p className="text-sm text-[#5a4638]">
              Із будь-яких питань щодо персональних даних, співпраці або редагування карток майстерень звертайтеся на офіційну пошту:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-5 py-2.5 text-xs font-extrabold transition"
              >
                <Mail className="w-4 h-4" />
                <span>{SITE_EMAIL}</span>
              </a>
              <Link
                href="/for-makers"
                className="inline-flex items-center gap-1 rounded-full border border-[#d4c3b3] bg-white hover:border-[#b06a1e] px-4 py-2.5 text-xs font-bold text-[#302016] transition"
              >
                <span>Умови для виробників</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#b06a1e]" />
              </Link>
              <Link
                href="/maysternya"
                className="inline-flex items-center gap-1 rounded-full border border-[#d4c3b3] bg-white hover:border-[#b06a1e] px-4 py-2.5 text-xs font-bold text-[#302016] transition"
              >
                <span>Каталог майстерень</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#b06a1e]" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <BackToTopButton lang="uk" />

      <footer className="mt-12 border-t border-[#e1d5c8] bg-[#f1e6da] py-8 px-4 text-center text-xs text-[#4a382e] space-y-2">
        <div className="font-bold text-[#302016]">
          CrafoHab Україна (crafohab.com.ua) — Шоколад • Авторські торти • Крафтовий зефір
        </div>
        <p className="max-w-3xl mx-auto text-[11px] leading-relaxed text-[#7a6858]">
          Пошта редакції:{' '}
          <a href={`mailto:${SITE_EMAIL}`} className="font-bold underline hover:text-[#b06a1e]">
            {SITE_EMAIL}
          </a>
        </p>
      </footer>
    </div>
  );
}
