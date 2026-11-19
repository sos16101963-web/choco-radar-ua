'use client';

export interface RecentMakerEntry {
  id: string;
  slug: string;
  name: string;
  city: string;
  imageUrl?: string;
}

const FAVORITES_KEY = 'crafohab_favorites';
const RECENT_KEY = 'crafohab_recent_makers';
const THEME_KEY = 'crafohab_theme';
const MAX_RECENT = 6;

export function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function saveStoredFavorites(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // Storage unavailable or quota exceeded
  }
}

export function toggleStoredFavorite(id: string): { ids: string[]; added: boolean } {
  const current = getStoredFavorites();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  saveStoredFavorites(next);
  return { ids: next, added: !exists };
}

export function getRecentMakers(): RecentMakerEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentMakerEntry =>
        Boolean(item && typeof item.id === 'string' && typeof item.slug === 'string' && typeof item.name === 'string')
    );
  } catch {
    return [];
  }
}

export function recordRecentMaker(entry: RecentMakerEntry): RecentMakerEntry[] {
  const current = getRecentMakers();
  const next = [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, MAX_RECENT);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable
    }
  }
  return next;
}

export function getStoredTheme(): 'dark' | 'light' | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = window.localStorage.getItem(THEME_KEY);
    return val === 'dark' || val === 'light' ? val : null;
  } catch {
    return null;
  }
}

export function saveStoredTheme(isDark: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  } catch {
    // Storage unavailable
  }
}

export async function shareOrCopy(opts: {
  title: string;
  text?: string;
  url: string;
}): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
      });
      return 'shared';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'failed';
      }
      // Fall through to clipboard copy when native share rejects cleanly
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(opts.url);
      return 'copied';
    } catch {
      // Clipboard permission denied
    }
  }

  return 'failed';
}
