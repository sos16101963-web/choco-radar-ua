'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MAKERS, CraftMaker } from '@/data/chocolateData';
import { getMakerStats, appendUtm, getStoredClicks } from '@/utils/analytics';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  ArrowUpRight,
  TrendingUp,
  MousePointerClick,
  Instagram,
  Phone,
  Eye,
  CheckCircle2,
  Calendar,
  Building2,
  Search,
  Sparkles,
  BarChart3,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  Users,
} from 'lucide-react';

const ADMIN_MASTER_PIN = '2027'; // Master PIN for site owner

export default function PartnerStatsDashboard() {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMakerId, setSelectedMakerId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle PIN login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim().toLowerCase();

    // Check Master PIN
    if (cleanPin === ADMIN_MASTER_PIN || cleanPin === 'crafo2027') {
      setIsAuthenticated(true);
      setSelectedMakerId('all');
      setErrorMsg('');
      return;
    }

    // Check Maker-specific PIN (slug, or short ID)
    const found = MAKERS.find(
      (m) =>
        m.id.toLowerCase() === cleanPin ||
        m.slug.toLowerCase() === cleanPin ||
        cleanPin === `${m.slug}-2027`
    );

    if (found) {
      setIsAuthenticated(true);
      setSelectedMakerId(found.id);
      setErrorMsg('');
      return;
    }

    setErrorMsg('Невірний PIN-код доступу. Зверніться до адміністратора CrafoHub.');
  };

  // Makers list sorted by total leads
  const rankedMakers = useMemo(() => {
    return MAKERS.map((m) => {
      const stats = getMakerStats(m.id);
      return {
        maker: m,
        stats,
      };
    }).sort((a, b) => b.stats.totalLeads - a.stats.totalLeads);
  }, []);

  // Filtered makers for search
  const filteredMakers = useMemo(() => {
    if (!searchQuery.trim()) return rankedMakers;
    const q = searchQuery.toLowerCase();
    return rankedMakers.filter(
      (item) =>
        item.maker.name.toLowerCase().includes(q) ||
        item.maker.city.toLowerCase().includes(q) ||
        item.maker.id.toLowerCase().includes(q)
    );
  }, [rankedMakers, searchQuery]);

  // Total aggregator
  const totalAggregates = useMemo(() => {
    let totalWeb = 0;
    let totalInsta = 0;
    let totalPhone = 0;
    let totalViews = 0;

    rankedMakers.forEach(({ stats }) => {
      totalWeb += stats.websiteClicks;
      totalInsta += stats.instagramClicks;
      totalPhone += stats.phoneClicks;
      totalViews += stats.modalViews;
    });

    return {
      totalWeb,
      totalInsta,
      totalPhone,
      totalViews,
      totalLeads: totalWeb + totalInsta + totalPhone,
    };
  }, [rankedMakers]);

  const activeMakerItem = useMemo(() => {
    if (selectedMakerId === 'all') return null;
    return rankedMakers.find((item) => item.maker.id === selectedMakerId) || null;
  }, [selectedMakerId, rankedMakers]);

  const copyMakerShareLink = (maker: CraftMaker) => {
    const url = `${window.location.origin}/partner/stats?code=${maker.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(maker.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // If not logged in, show secure login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a120e] text-[#eee7dd] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#261b16] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e39851] to-[#b06a1e] text-[#26140b] flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#f0a556]">
              Закритий доступ • CrafoHub Analytics
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">
              Кабінет аналітики переходів
            </h1>
            <p className="text-xs text-[#c2b6a9] leading-relaxed">
              Введіть персональний PIN-код виробника або пароль адміністратора хабу для перегляду статистики переходів покупців.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#f0a556] mb-1.5">
                PIN-код або код майстерні
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#a79d91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Введіть код..."
                  required
                  autoFocus
                  className="w-full bg-[#1a120e] border border-white/20 focus:border-[#e39851] rounded-2xl pl-10 pr-4 py-3 text-sm text-white outline-none transition"
                />
              </div>
              {errorMsg && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#e39851] to-[#b06a1e] hover:brightness-110 text-[#26140b] font-extrabold py-3.5 rounded-2xl transition shadow-md text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Увійти в кабінет</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-center text-xs text-[#a79d91] space-y-1">
            <p>
              Не маєте коду? Напишіть у{' '}
              <a
                href="https://t.me/crafohub_ua"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f0a556] underline"
              >
                Telegram @crafohub_ua
              </a>
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#f0a556] hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Повернутися на головну</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-[#1a120e] text-[#eee7dd] pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#261b16]/95 border-b border-white/15 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7a4a2b] to-[#3a2113] text-white flex items-center justify-center font-bold text-base shadow"
            >
              🍫
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-white text-base sm:text-lg">
                  CrafoHub <span className="text-[#f0a556]">Analytics</span>
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5">
                  Закритий доступ
                </span>
              </div>
              <span className="text-[10px] text-[#a79d91]">
                {selectedMakerId === 'all'
                  ? 'Адміністративна панель усього хабу'
                  : `Персональний кабінет: ${activeMakerItem?.maker.name || ''}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedMakerId !== 'all' && (
              <button
                onClick={() => setSelectedMakerId('all')}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 px-3 py-1.5 text-xs font-bold text-white transition"
              >
                <span>Усі майстерні</span>
              </button>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f0a556] text-[#26140b] font-bold px-3.5 py-1.5 text-xs hover:brightness-110 transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>На вітрину</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* If All makers view is selected, show aggregate metrics cards */}
        {selectedMakerId === 'all' ? (
          <>
            {/* Grand Header & Hub Overview */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#f0a556]">
                📊 Загальна статистика платформи
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Переходи покупців з хабу до крафтових виробників
              </h1>
              <p className="text-xs sm:text-sm text-[#c2b6a9] max-w-3xl">
                Фіксація реальних кліків покупців за прямими кнопками «Перейти на сайт», «Instagram», «Телефон» та відкриття карток. Дані захищені та не відображаються звичайним користувачам.
              </p>
            </div>

            {/* Metric KPI Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#261b16] border border-white/15 rounded-3xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-[#f0a556]">
                  <span className="text-xs font-bold uppercase tracking-wider">Всього лідів</span>
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <div className="text-3xl font-serif font-extrabold text-white">
                  {totalAggregates.totalLeads.toLocaleString('uk-UA')}
                </div>
                <p className="text-[11px] text-[#a79d91]">Прямих переходів до покупки</p>
              </div>

              <div className="bg-[#261b16] border border-white/15 rounded-3xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-bold uppercase tracking-wider">На сайти / меню</span>
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div className="text-3xl font-serif font-extrabold text-white">
                  {totalAggregates.totalWeb.toLocaleString('uk-UA')}
                </div>
                <p className="text-[11px] text-[#a79d91]">Кліків з UTM-міткою crafohub</p>
              </div>

              <div className="bg-[#261b16] border border-white/15 rounded-3xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-pink-400">
                  <span className="text-xs font-bold uppercase tracking-wider">В Instagram</span>
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="text-3xl font-serif font-extrabold text-white">
                  {totalAggregates.totalInsta.toLocaleString('uk-UA')}
                </div>
                <p className="text-[11px] text-[#a79d91]">Переходів у Direct / сторінку</p>
              </div>

              <div className="bg-[#261b16] border border-white/15 rounded-3xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Дзвінки / Контакти</span>
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-3xl font-serif font-extrabold text-white">
                  {totalAggregates.totalPhone.toLocaleString('uk-UA')}
                </div>
                <p className="text-[11px] text-[#a79d91]">Кліків за номерами телефонів</p>
              </div>
            </div>

            {/* List & Search */}
            <div className="bg-[#261b16] border border-white/15 rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    Рейтинг майстерень за переходами покупців
                  </h2>
                  <p className="text-xs text-[#a79d91]">
                    Оберіть майстерню, щоб відкрити її персональний детальний звіт для демонстрації
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#a79d91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Пошук майстерні або міста..."
                    className="w-full bg-[#1a120e] border border-white/20 focus:border-[#f0a556] rounded-full pl-9 pr-4 py-2 text-xs text-white outline-none transition"
                  />
                </div>
              </div>

              {/* Table of Makers */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[#a79d91]">
                      <th className="py-3 px-3 font-bold uppercase tracking-wider">#</th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider">Виробник</th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider">Місто</th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider text-right">На сайт</th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider text-right">Instagram</th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider text-right">Дзвінки</th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider text-right">Всього лідів</th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider text-center">Звіт для показу</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredMakers.map(({ maker, stats }, idx) => (
                      <tr
                        key={maker.id}
                        onClick={() => setSelectedMakerId(maker.id)}
                        className="hover:bg-white/5 cursor-pointer transition"
                      >
                        <td className="py-3.5 px-3 font-extrabold text-[#f0a556]">
                          #{idx + 1}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            {maker.imageUrl ? (
                              <img
                                src={maker.imageUrl}
                                alt={maker.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-[#3a2113] flex items-center justify-center text-sm">
                                🍫
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white text-sm line-clamp-1">
                                {maker.name.replace(/\s*\(.*\)/, '')}
                              </div>
                              <div className="text-[10px] text-[#a79d91] font-mono">
                                ID: {maker.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-[#c2b6a9]">
                          {maker.city}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-emerald-400">
                          {stats.websiteClicks}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-pink-400">
                          {stats.instagramClicks}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-amber-400">
                          {stats.phoneClicks}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="inline-block rounded-full bg-[#f0a556]/15 text-[#f0a556] font-extrabold px-2.5 py-0.5 border border-[#f0a556]/30">
                            {stats.totalLeads}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedMakerId(maker.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-[#f0a556] hover:text-[#26140b] text-white px-3 py-1 text-[11px] font-bold transition"
                          >
                            <span>Відкрити</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Single Maker Detailed Report Screen (Shareable with Maker) */
          activeMakerItem && (
            <div className="space-y-6">
              {/* Back button */}
              <button
                onClick={() => setSelectedMakerId('all')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f0a556] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Повернутися до всіх майстерень</span>
              </button>

              {/* Maker Spotlight Card */}
              <div className="bg-[#261b16] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    {activeMakerItem.maker.imageUrl ? (
                      <img
                        src={activeMakerItem.maker.imageUrl}
                        alt={activeMakerItem.maker.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-white/20 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#3a2113] flex items-center justify-center text-3xl">
                        🍫
                      </div>
                    )}
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 mb-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Звіт верифікованої майстерні CrafoHub</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        {activeMakerItem.maker.name}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-[#a79d91] mt-0.5">
                        <span>📍 {activeMakerItem.maker.city}</span>
                        <span>•</span>
                        <span>★ {activeMakerItem.maker.rating}</span>
                        <span>•</span>
                        <span className="font-mono text-[#f0a556]">PIN: {activeMakerItem.maker.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyMakerShareLink(activeMakerItem.maker)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold transition border border-white/20"
                    >
                      {copiedId === activeMakerItem.maker.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Посилання скопійовано!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Скопіювати лінк для майстра</span>
                        </>
                      )}
                    </button>
                    <a
                      href={appendUtm(activeMakerItem.maker.websiteUrl, activeMakerItem.maker.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f0a556] text-[#26140b] px-4 py-2 text-xs font-extrabold hover:brightness-110 transition shadow-sm"
                    >
                      <span>Перейти на сайт майстра</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#1a120e] rounded-2xl p-4 border border-white/10 space-y-1">
                    <div className="text-[11px] font-bold text-[#a79d91] uppercase">Всього звернень</div>
                    <div className="text-3xl font-serif font-extrabold text-[#f0a556]">
                      {activeMakerItem.stats.totalLeads}
                    </div>
                    <p className="text-[10px] text-[#c2b6a9]">Сума переходів та дзвінків</p>
                  </div>

                  <div className="bg-[#1a120e] rounded-2xl p-4 border border-white/10 space-y-1">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase">На сайт / магазин</div>
                    <div className="text-3xl font-serif font-extrabold text-white">
                      {activeMakerItem.stats.websiteClicks}
                    </div>
                    <p className="text-[10px] text-[#a79d91]">З міткою utm_source=crafohub</p>
                  </div>

                  <div className="bg-[#1a120e] rounded-2xl p-4 border border-white/10 space-y-1">
                    <div className="text-[11px] font-bold text-pink-400 uppercase">В Instagram</div>
                    <div className="text-3xl font-serif font-extrabold text-white">
                      {activeMakerItem.stats.instagramClicks}
                    </div>
                    <p className="text-[10px] text-[#a79d91]">Переходів у профіль / Direct</p>
                  </div>

                  <div className="bg-[#1a120e] rounded-2xl p-4 border border-white/10 space-y-1">
                    <div className="text-[11px] font-bold text-amber-400 uppercase">Дзвінки / Контакти</div>
                    <div className="text-3xl font-serif font-extrabold text-white">
                      {activeMakerItem.stats.phoneClicks}
                    </div>
                    <p className="text-[10px] text-[#a79d91]">Натискань за номером телефону</p>
                  </div>
                </div>

                {/* Pitch block for negotiation with the maker */}
                <div className="rounded-2xl p-5 bg-gradient-to-br from-[#302016] to-[#1f140e] border border-[#e39851]/40 space-y-3">
                  <div className="flex items-center gap-2 text-[#f0a556] font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Комерційна цінність для виробника</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    CrafoHub приводить платоспроможних клієнтів напряму без посередників
                  </h3>
                  <p className="text-xs text-[#c2b6a9] leading-relaxed">
                    Кожен клік з каталогу — це цільовий покупець, який уже обрав конкретний продукт (шоколадні квіти, торт на свято, бенто або набір цукерок), побачив місто та чесну ціну. Комісія хабу становить 0% на базовому рівні, клієнт купує за вашими цінами.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓ 0%</span>
                      <span className="text-[#eee7dd]">комісії за замовлення (на відміну від Prom/Rozetka 20-25%)</span>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 flex items-center gap-2">
                      <span className="text-[#f0a556] font-bold">✓ UTM-мітка</span>
                      <span className="text-[#eee7dd]">для відстеження у вашій Google Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
