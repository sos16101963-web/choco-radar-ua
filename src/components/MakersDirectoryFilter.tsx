'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { MakerSegment } from '@/data/chocolateData';
import OptimizedImage from './OptimizedImage';

export interface DirectoryMaker {
  id: string;
  slug: string;
  name: string;
  city: string;
  regionCity: string;
  segment: MakerSegment;
  specialty: string;
  rating: number;
  isVerified: boolean;
  imageUrl?: string;
}

export interface DirectorySegmentGroup {
  id: MakerSegment;
  title: string;
  emoji: string;
}

interface MakersDirectoryFilterProps {
  makers: DirectoryMaker[];
  segmentGroups: DirectorySegmentGroup[];
}

const FEATURED_CITIES = [
  'all',
  'Київ',
  'Харків',
  'Львів',
  'Дніпро',
  'Одеса',
  'Запоріжжя',
  'Івано-Франківськ',
];

function matchesCity(maker: DirectoryMaker, cityFilter: string): boolean {
  if (cityFilter === 'all') return true;
  const needle = cityFilter.toLowerCase();
  return (
    (maker.city || '').toLowerCase().includes(needle) ||
    (maker.regionCity || '').toLowerCase().includes(needle)
  );
}

export default function MakersDirectoryFilter({
  makers,
  segmentGroups,
}: MakersDirectoryFilterProps) {
  const [query, setQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<'all' | MakerSegment>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  const allCities = useMemo(() => {
    const citySet = new Set<string>();
    makers.forEach((m) => {
      if (m.regionCity) citySet.add(m.regionCity);
      else if (m.city) citySet.add(m.city);
    });
    return Array.from(citySet).sort((a, b) => a.localeCompare(b, 'uk'));
  }, [makers]);

  const segmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    makers.forEach((m) => {
      counts[m.segment] = (counts[m.segment] || 0) + 1;
    });
    return counts;
  }, [makers]);

  const hasActiveFilters =
    query.trim() !== '' || selectedSegment !== 'all' || selectedCity !== 'all' || sortBy !== 'rating';

  const resetFilters = () => {
    setQuery('');
    setSelectedSegment('all');
    setSelectedCity('all');
    setSortBy('rating');
  };

  const filteredMakers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = makers.filter((m) => {
      if (selectedSegment !== 'all' && m.segment !== selectedSegment) return false;
      if (!matchesCity(m, selectedCity)) return false;
      if (q !== '') {
        const hit =
          m.name.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.regionCity.toLowerCase().includes(q) ||
          m.specialty.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });

    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'uk'));
    }
    return list;
  }, [makers, query, selectedSegment, selectedCity, sortBy]);

  const visibleGroups = useMemo(() => {
    return segmentGroups.filter((g) =>
      selectedSegment === 'all' ? true : g.id === selectedSegment
    );
  }, [segmentGroups, selectedSegment]);

  return (
    <div className="space-y-8">
      {/* Interactive Filter & Search Controls */}
      <section
        aria-label="Пошук та фільтри каталогу майстерень"
        className="rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-4 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#b06a1e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Знайти майстерню, місто або виріб..."
              aria-label="Знайти майстерню, місто або виріб"
              className="w-full rounded-full border border-[#d4c3b3] bg-white pl-10 pr-10 py-2.5 text-sm text-[#302016] placeholder:text-[#8c7a6b] focus:border-[#b06a1e] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Очистити пошук"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6858] hover:text-[#302016] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="sr-only" htmlFor="directory-city-select">
              Фільтр по місту
            </label>
            <select
              id="directory-city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-full border border-[#d4c3b3] bg-white px-3.5 py-2.5 text-xs font-bold text-[#302016] focus:border-[#b06a1e] focus:outline-none"
            >
              <option value="all">Усі міста України</option>
              {allCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setSortBy((prev) => (prev === 'rating' ? 'name' : 'rating'))}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#d4c3b3] bg-white hover:border-[#b06a1e] px-3.5 py-2.5 text-xs font-bold text-[#302016] transition active:scale-95"
              title="Змінити порядок сортування"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#b06a1e]" />
              <span>{sortBy === 'rating' ? 'За рейтингом' : 'За назвою А–Я'}</span>
            </button>
          </div>
        </div>

        {/* Segment Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => setSelectedSegment('all')}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
              selectedSegment === 'all'
                ? 'bg-[#462b1f] text-white shadow-xs'
                : 'bg-[#f1e6da] text-[#4a382e] hover:bg-[#e5d5c3]'
            }`}
          >
            Усі ({makers.length})
          </button>
          {segmentGroups.map((group) => {
            const count = segmentCounts[group.id] || 0;
            if (count === 0) return null;
            const active = selectedSegment === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedSegment(active ? 'all' : group.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition inline-flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#b06a1e] text-white shadow-xs'
                    : 'bg-white border border-[#e1d5c8] text-[#4a382e] hover:border-[#b06a1e]'
                }`}
              >
                <span>{group.emoji}</span>
                <span className="truncate max-w-[200px]">{group.title}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Quick City Pills + Result Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#e1d5c8]/60">
          <div className="flex flex-wrap items-center gap-1.5">
            {FEATURED_CITIES.map((cityId) => {
              const active = selectedCity === cityId;
              return (
                <button
                  key={cityId}
                  type="button"
                  onClick={() => setSelectedCity(cityId)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                    active
                      ? 'bg-[#b06a1e] text-white'
                      : 'bg-[#fbf6ee] border border-[#e1d5c8] text-[#5a4638] hover:border-[#b06a1e]'
                  }`}
                >
                  {cityId === 'all' ? 'Вся Україна' : cityId}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-[#5a4638]">
            <span>
              Показано <strong className="text-[#302016]">{filteredMakers.length}</strong> з{' '}
              {makers.length} майстерень
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[#b06a1e] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Скинути фільтри</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filtered Results or Grouped Sections */}
      {filteredMakers.length === 0 ? (
        <div className="rounded-3xl border border-[#e1d5c8] bg-[#fefbf7] p-8 sm:p-10 text-center space-y-3">
          <p className="font-serif text-lg font-bold text-[#302016]">
            За вашим запитом майстерень не знайдено
          </p>
          <p className="text-xs sm:text-sm text-[#5a4638]">
            Спробуйте змінити місто або скинути фільтри, щоб побачити всі {makers.length} перевірених виробників.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#462b1f] hover:bg-[#b06a1e] text-white px-5 py-2.5 text-xs font-bold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Скинути фільтри</span>
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {visibleGroups.map((group) => {
            const makersInGroup = filteredMakers.filter((m) => m.segment === group.id);
            if (makersInGroup.length === 0) return null;

            return (
              <section key={group.id} className="space-y-4 cv-auto">
                <div className="flex items-center justify-between border-b border-[#e1d5c8] pb-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <span>{group.emoji}</span>
                    <span>{group.title}</span>
                  </h2>
                  <span className="rounded-full bg-[#f1e6da] px-3 py-1 text-xs font-extrabold text-[#462b1f] shrink-0">
                    {makersInGroup.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {makersInGroup.map((maker) => (
                    <Link
                      key={maker.id}
                      href={`/maysternya/${maker.slug}`}
                      className="group rounded-2xl border border-[#e1d5c8] bg-[#fefbf7] hover:border-[#b06a1e] hover:shadow-lg transition p-4 flex items-start gap-3.5"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#f1e6da] border border-[#e1d5c8]">
                        <OptimizedImage
                          src={maker.imageUrl}
                          alt={maker.name}
                          fill
                          sizes="64px"
                          fallbackWidth={160}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-sm sm:text-base font-bold leading-snug group-hover:text-[#b06a1e] transition line-clamp-1">
                            {maker.name}
                          </h3>
                          <span className="shrink-0 text-[11px] font-bold text-[#8c4f12]">
                            ★ {maker.rating}
                          </span>
                        </div>

                        <p className="flex items-center gap-1 text-xs font-medium text-[#4a382e]">
                          <MapPin className="w-3 h-3 text-[#b06a1e] shrink-0" />
                          <span className="truncate">{maker.city}</span>
                          {maker.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                          )}
                        </p>

                        <p className="text-xs text-[#5a4638] line-clamp-2 leading-relaxed">
                          {maker.specialty}
                        </p>

                        <div className="pt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#b06a1e]">
                          <span>Профіль та контакти</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
