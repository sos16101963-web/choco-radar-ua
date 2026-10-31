import { NextResponse } from 'next/server';

export interface GlobalEventRecord {
  makerId: string;
  type: 'website' | 'instagram' | 'phone' | 'modal_view';
  timestamp: number;
  category?: string;
  city?: string;
}

// Global in-memory storage on Next.js server runtime
// In Next.js Node/Edge runtime, globalThis persists across API requests
declare global {
  var __CRAFOHUB_EVENTS__: GlobalEventRecord[] | undefined;
}

if (!globalThis.__CRAFOHUB_EVENTS__) {
  globalThis.__CRAFOHUB_EVENTS__ = [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const makerId = searchParams.get('makerId');

  const allEvents = globalThis.__CRAFOHUB_EVENTS__ || [];

  if (makerId && makerId !== 'all') {
    const makerEvents = allEvents.filter((e) => e.makerId === makerId);
    let websiteClicks = 0;
    let instagramClicks = 0;
    let phoneClicks = 0;
    let modalViews = 0;

    makerEvents.forEach((e) => {
      if (e.type === 'website') websiteClicks++;
      else if (e.type === 'instagram') instagramClicks++;
      else if (e.type === 'phone') phoneClicks++;
      else if (e.type === 'modal_view') modalViews++;
    });

    const last = makerEvents[makerEvents.length - 1];
    const lastClickDate = last
      ? new Date(last.timestamp).toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

    return NextResponse.json({
      makerId,
      websiteClicks,
      instagramClicks,
      phoneClicks,
      modalViews,
      totalLeads: websiteClicks + instagramClicks + phoneClicks,
      lastClickDate,
      recentEvents: makerEvents.slice(-20),
    });
  }

  // Aggregate stats by maker for all makers
  const aggregatesByMaker: Record<
    string,
    { website: number; instagram: number; phone: number; views: number; total: number; lastDate: string | null }
  > = {};

  allEvents.forEach((e) => {
    if (!aggregatesByMaker[e.makerId]) {
      aggregatesByMaker[e.makerId] = { website: 0, instagram: 0, phone: 0, views: 0, total: 0, lastDate: null };
    }
    const rec = aggregatesByMaker[e.makerId];
    if (e.type === 'website') rec.website++;
    else if (e.type === 'instagram') rec.instagram++;
    else if (e.type === 'phone') rec.phone++;
    else if (e.type === 'modal_view') rec.views++;

    rec.total = rec.website + rec.instagram + rec.phone;
    rec.lastDate = new Date(e.timestamp).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  return NextResponse.json({
    totalEventsCount: allEvents.length,
    byMaker: aggregatesByMaker,
    recentEvents: allEvents.slice(-50),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { makerId, type, category, city } = body;

    if (!makerId || !type) {
      return NextResponse.json({ error: 'makerId and type required' }, { status: 400 });
    }

    const event: GlobalEventRecord = {
      makerId,
      type,
      timestamp: Date.now(),
      category,
      city,
    };

    if (!globalThis.__CRAFOHUB_EVENTS__) {
      globalThis.__CRAFOHUB_EVENTS__ = [];
    }

    globalThis.__CRAFOHUB_EVENTS__.push(event);

    // Keep memory clean (max 50,000 real events)
    if (globalThis.__CRAFOHUB_EVENTS__.length > 50000) {
      globalThis.__CRAFOHUB_EVENTS__.shift();
    }

    return NextResponse.json({ success: true, recorded: event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
