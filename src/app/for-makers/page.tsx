import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Phone,
  BarChart2,
  MessageCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { generateBreadcrumbSchema } from '@/utils/seoSchema';
import ForMakersAuditForm from './ForMakersAuditForm';

export const metadata: Metadata = {
  title: 'Виробникам та кондитерам — Розміщення без комісій у CrafoHub 2027',
  description:
    'Підключіть вашу майстерню шоколаду, кондитерську або зефірну флористику до CrafoHub. 0% комісії з замовлень, прямі покупці на ваш сайт та в Instagram, замовлення з тендерної біржі.',
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app/for-makers',
  },
  openGraph: {
    title: 'Виробникам та кондитерам — Розміщення у CrafoHub 2027',
    description: '0% комісії з продажів, прямі клієнти, індивідуальні тендери по вашому місту.',
    url: 'https://choco-radar-ua.vercel.app/for-makers',
  },
};

export default function ForMakersPage() {
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'CrafoHub', url: 'https://choco-radar-ua.vercel.app' },
    { name: 'Виробникам крафтових солодощів', url: 'https://choco-radar-ua.vercel.app/for-makers' },
  ]);

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#302016]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e1d5c8] bg-[#fbf6ee]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid w-9 h-9 place-items-center rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white shadow-md text-base">
              🍫
            </span>
            <span className="font-serif text-lg font-bold">
              Crafo<span className="text-[#b06a1e]">Hub</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-[#5a4638] hover:text-[#b06a1e] transition"
            >
              ← До каталогу
            </Link>
            <a
              href="#apply-form"
              className="rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-4 py-2 text-xs font-extrabold transition shadow-sm"
            >
              + Додати майстерню
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-16 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b06a1e]/15 border border-[#b06a1e]/30 px-3.5 py-1 text-xs font-extrabold text-[#b06a1e]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Для українських кондитерських та шоколатьє • Стандарт 2027</span>
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
          Отримуйте прямих платоспроможних покупців <br />
          <span className="bg-gradient-to-r from-[#7a4a2b] via-[#b06a1e] to-[#c75b7a] bg-clip-text text-transparent">
            з 0% комісії за замовлення
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#5a4638] max-w-2xl mx-auto leading-relaxed">
          CrafoHub — це національний навігатор преміальних крафтових солодощів. Ми не ховаємо контакти
          і не стягуємо відсоток з ваших продажів, як Prom (18–25%) або Flowwow (20–30%). Клієнт купує
          безпосередньо на вашому сайті, в Instagram або месенджері за вашим прайсом.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#apply-form"
            className="rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] text-white font-extrabold px-7 py-3.5 text-sm shadow-md hover:brightness-110 transition flex items-center gap-2"
          >
            <span>Подати заявку на верифікацію</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/partner/stats"
            className="rounded-full border-2 border-[#b06a1e]/40 hover:bg-[#b06a1e]/10 text-[#462b1f] font-bold px-6 py-3 text-sm transition"
          >
            Кабінет аналітики переходів
          </Link>
        </div>
      </section>

      {/* 3 Pillars for Makers */}
      <section className="bg-white border-y border-[#e1d5c8] py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b06a1e]">
              Чому крафтовики обирають CrafoHub
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              3 ключові переваги для вашого кондитерського бізнесу
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#fbf6ee] border border-[#e1d5c8] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xl font-bold">
                0%
              </div>
              <h3 className="font-serif text-lg font-bold">Жодної комісії з чеку</h3>
              <p className="text-xs sm:text-sm text-[#5a4638] leading-relaxed">
                Покупець натискає «Перейти» і відразу потрапляє у ваш кошик або Instagram Direct. Гроші
                надходять безпосередньо на ваш ФОП/рахунок без затримок і процентних вирахувань.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fbf6ee] border border-[#e1d5c8] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#b06a1e]/15 text-[#b06a1e] flex items-center justify-center text-xl font-bold">
                🎯
              </div>
              <h3 className="font-serif text-lg font-bold">Гарячі ліди з Тендерної біржі</h3>
              <p className="text-xs sm:text-sm text-[#5a4638] leading-relaxed">
                Покупці залишають заявки на індивідуальні торти на свято, весілля та корпоративні бокси.
                Ви отримуєте готовий бриф із містом, датою та бюджетом.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fbf6ee] border border-[#e1d5c8] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-600 flex items-center justify-center text-xl font-bold">
                🏷️
              </div>
              <h3 className="font-serif text-lg font-bold">Знак якості «Перевірено 2027»</h3>
              <p className="text-xs sm:text-sm text-[#5a4638] leading-relaxed">
                Статус верифікованої майстерні Clean Label підтверджує натуральність вашої сировини (без
                пальмової олії), підвищує довіру клієнтів і дозволяє тримати гідний середній чек.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table: CrafoHub vs Aggregators */}
      <section className="mx-auto max-w-5xl px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#b06a1e]">
            Порівняння каналів
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Чому CrafoHub вигідніший за традиційні маркетплейси
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#e1d5c8] bg-white shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f1e6da] border-b border-[#e1d5c8] text-[#302016]">
              <tr>
                <th className="p-4 font-bold">Критерій</th>
                <th className="p-4 font-bold text-[#b06a1e]">CrafoHub</th>
                <th className="p-4 font-bold text-gray-500">Prom / Rozetka</th>
                <th className="p-4 font-bold text-gray-500">Flowwow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1d5c8]">
              <tr>
                <td className="p-4 font-medium">Комісія за успішне замовлення</td>
                <td className="p-4 font-extrabold text-emerald-600">0%</td>
                <td className="p-4 text-gray-600">15–22%</td>
                <td className="p-4 text-gray-600">20–30%</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Куди йде покупець</td>
                <td className="p-4 font-extrabold text-emerald-600">
                  На ваш сайт / в Instagram / Телефон
                </td>
                <td className="p-4 text-gray-600">Залишається в маркетплейсі</td>
                <td className="p-4 text-gray-600">У додаток посередника</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Конкуренція з дешевим мас-маркетом</td>
                <td className="p-4 font-extrabold text-emerald-600">
                  Ні (лише крафт і Clean Label)
                </td>
                <td className="p-4 text-gray-600">Так (дешева кондитерська глазур)</td>
                <td className="p-4 text-gray-600">Змішана</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">UTM-трекінг та Google Analytics</td>
                <td className="p-4 font-extrabold text-emerald-600">
                  Повна прозорість (utm_source=crafohub)
                </td>
                <td className="p-4 text-gray-600">Заблоковано</td>
                <td className="p-4 text-gray-600">Недоступно</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="bg-[#f1e6da] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-[#e1d5c8] shadow-md space-y-5">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#b06a1e]">
              Безкоштовний аудит майстерні
            </span>
            <h2 className="font-serif text-2xl font-bold">
              Подати заявку на підключення майстерні
            </h2>
            <p className="text-xs text-[#715f53]">
              Заповніть форму за 1 хвилину. Наш експерт перевірить склад продукції та зв’яжеться з вами
              для відкриття персонального профілю.
            </p>
          </div>

          <ForMakersAuditForm />

          <p className="text-[11px] text-center text-[#715f53]">
            Або напишіть нам напряму в Telegram:{' '}
            <a
              href="https://t.me/crafohub_ua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b06a1e] underline font-bold"
            >
              @crafohub_ua
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e1d5c8] py-8 px-4 text-center text-xs text-[#715f53]">
        <div>CrafoHub Україна • Платформа незалежних крафтових виробників 2027</div>
        <div className="pt-2">
          <Link href="/" className="hover:text-[#b06a1e] underline">
            Повернутися до каталогу продукції
          </Link>
        </div>
      </footer>
    </div>
  );
}
