'use client';

// Real-time analytics tracker and persistent storage for genuine buyer clicks & referrals
export interface ClickEvent {
  makerId: string;
  type: 'website' | 'instagram' | 'phone' | 'modal_view';
  timestamp: number;
  category?: string;
  city?: string;
}

export interface MakerStats {
  websiteClicks: number;
  instagramClicks: number;
  phoneClicks: number;
  modalViews: number;
  totalLeads: number;
  lastClickDate?: string;
  history: ClickEvent[];
}

const STORAGE_KEY = 'crafohub_real_clicks_v2';

export function getStoredClicks(): ClickEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Track genuine click: persists to localStorage and fires asynchronous API call to /api/analytics
export function trackMakerClick(
  makerId: string,
  type: 'website' | 'instagram' | 'phone' | 'modal_view',
  extra?: { category?: string; city?: string }
) {
  if (typeof window === 'undefined') return;

  const event: ClickEvent = {
    makerId,
    type,
    timestamp: Date.now(),
    category: extra?.category,
    city: extra?.city,
  };

  try {
    const current = getStoredClicks();
    current.push(event);
    if (current.length > 5000) current.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }

  // Also send event to Next.js API route in the background
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(event));
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Non-blocking
  }
}

// Pure 100% genuine stats: starts strictly at 0 and increments ONLY when a real user performs an action
export function getMakerStats(makerId: string): MakerStats {
  const events = getStoredClicks().filter((e) => e.makerId === makerId);

  let websiteClicks = 0;
  let instagramClicks = 0;
  let phoneClicks = 0;
  let modalViews = 0;

  events.forEach((ev) => {
    if (ev.type === 'website') websiteClicks++;
    else if (ev.type === 'instagram') instagramClicks++;
    else if (ev.type === 'phone') phoneClicks++;
    else if (ev.type === 'modal_view') modalViews++;
  });

  const lastEvent = events[events.length - 1];
  const lastClickDate = lastEvent
    ? new Date(lastEvent.timestamp).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : undefined;

  return {
    websiteClicks,
    instagramClicks,
    phoneClicks,
    modalViews,
    totalLeads: websiteClicks + instagramClicks + phoneClicks,
    lastClickDate,
    history: events.slice(-50),
  };
}

// Append UTM parameters so the maker sees "crafohub" in their Google Analytics / Instagram analytics
export function appendUtm(url: string, makerId: string): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'crafohub');
      u.searchParams.set('utm_medium', 'referral');
      u.searchParams.set('utm_campaign', 'catalog_2027');
      u.searchParams.set('utm_content', makerId);
    }
    return u.toString();
  } catch {
    const glue = url.includes('?') ? '&' : '?';
    return `${url}${glue}utm_source=crafohub&utm_medium=referral&utm_campaign=catalog_2027&utm_content=${makerId}`;
  }
}
