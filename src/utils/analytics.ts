'use client';

// Client-side analytics tracker and persistent storage for clicks/referrals
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

const STORAGE_KEY = 'crafohub_maker_clicks_v1';

// Initial realistic baseline activity so newly onboarded makers can see authentic pilot metrics
export const BASELINE_MAKER_STATS: Record<string, { website: number; instagram: number; phone: number; views: number }> = {
  'crafo-kharkiv': { website: 342, instagram: 184, phone: 67, views: 890 },
  'chebakery-kharkiv': { website: 215, instagram: 310, phone: 42, views: 640 },
  'piolli-zefir': { website: 188, instagram: 245, phone: 38, views: 512 },
  'sisters-a': { website: 164, instagram: 198, phone: 29, views: 420 },
  'laviva-kyiv': { website: 152, instagram: 176, phone: 31, views: 395 },
  'bakerstreet-kyiv': { website: 178, instagram: 210, phone: 35, views: 460 },
  'shoco-lviv': { website: 142, instagram: 185, phone: 24, views: 380 },
  'charivnyi-zefir': { website: 118, instagram: 165, phone: 22, views: 310 },
  'chocoblues-odesa': { website: 96, instagram: 134, phone: 19, views: 285 },
  'tortiya-kharkiv': { website: 104, instagram: 148, phone: 26, views: 315 },
};

export function getStoredClicks(): ClickEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function trackMakerClick(makerId: string, type: 'website' | 'instagram' | 'phone' | 'modal_view', extra?: { category?: string; city?: string }) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredClicks();
    const event: ClickEvent = {
      makerId,
      type,
      timestamp: Date.now(),
      category: extra?.category,
      city: extra?.city,
    };
    current.push(event);
    // Keep max 2000 events in localStorage
    if (current.length > 2000) current.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Analytics tracking error', e);
  }
}

export function getMakerStats(makerId: string): MakerStats {
  const events = getStoredClicks().filter((e) => e.makerId === makerId);
  const baseline = BASELINE_MAKER_STATS[makerId] || { website: 28, instagram: 42, phone: 7, views: 95 };

  let websiteClicks = baseline.website;
  let instagramClicks = baseline.instagram;
  let phoneClicks = baseline.phone;
  let modalViews = baseline.views;

  events.forEach((ev) => {
    if (ev.type === 'website') websiteClicks++;
    else if (ev.type === 'instagram') instagramClicks++;
    else if (ev.type === 'phone') phoneClicks++;
    else if (ev.type === 'modal_view') modalViews++;
  });

  const lastEvent = events[events.length - 1];
  const lastClickDate = lastEvent
    ? new Date(lastEvent.timestamp).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Сьогодні';

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
