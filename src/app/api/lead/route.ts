import { NextResponse } from 'next/server';
import { SITE_EMAIL } from '@/lib/siteConfig';

export type LeadType = 'tender' | 'add_maker' | 'maker_audit';

export interface LeadRecord {
  id: string;
  type: LeadType;
  brandName?: string;
  category?: string;
  plan?: string;
  city?: string;
  eventDate?: string;
  link?: string;
  description?: string;
  contact: string;
  lang: 'uk' | 'ru';
  sourcePage: string;
  createdAt: string;
}

declare global {
  var __CRAFOHAB_LEADS__: LeadRecord[] | undefined;
}

if (!globalThis.__CRAFOHAB_LEADS__) {
  globalThis.__CRAFOHAB_LEADS__ = [];
}

function cleanField(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function cleanMultiline(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/\r\n/g, '\n')
    .slice(0, maxLen);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const TENDER_CATEGORY_LABELS: Record<string, string> = {
  cake: '🎂 Торт на свято',
  zefir: '🌸 Зефірний букет',
  chocolate: '🍫 Шоколадний набір',
  corporate: '🎁 Корпоративне замовлення',
};

function formatTelegramMessage(lead: LeadRecord): string {
  const header =
    lead.type === 'tender'
      ? '🎯 <b>Новий тендер на CrafoHab</b>'
      : lead.type === 'add_maker'
      ? '🏭 <b>Заявка на додавання майстерні</b>'
      : '🚀 <b>Заявка на аудит виробника (/for-makers)</b>';

  const lines: string[] = [header, ''];

  if (lead.plan) lines.push(`<b>Тариф:</b> ${escapeHtml(lead.plan)}`);
  if (lead.category) {
    const label = TENDER_CATEGORY_LABELS[lead.category] || lead.category;
    lines.push(`<b>Напрямок:</b> ${escapeHtml(label)}`);
  }
  if (lead.brandName) lines.push(`<b>Майстерня:</b> ${escapeHtml(lead.brandName)}`);
  if (lead.city) lines.push(`<b>Місто:</b> ${escapeHtml(lead.city)}`);
  if (lead.eventDate) lines.push(`<b>Дата / дедлайн:</b> ${escapeHtml(lead.eventDate)}`);
  if (lead.link) lines.push(`<b>Сайт / Instagram:</b> ${escapeHtml(lead.link)}`);
  if (lead.description) lines.push(`<b>Опис:</b> ${escapeHtml(lead.description)}`);

  lines.push(`<b>Контакт:</b> ${escapeHtml(lead.contact)}`);
  lines.push(`<b>Сторінка:</b> ${escapeHtml(lead.sourcePage)} (${lead.lang.toUpperCase()})`);
  lines.push(`<b>Час (Київ):</b> ${escapeHtml(lead.createdAt)}`);

  return lines.join('\n');
}

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  return NextResponse.json({
    status: 'ok',
    telegramConfigured: Boolean(token && chatId),
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return NextResponse.json(
        { ok: false, error: 'Некоректний формат запиту.' },
        { status: 400 }
      );
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Не вдалося прочитати дані форми.' },
      { status: 400 }
    );
  }

  // Honeypot anti-spam trap
  if (cleanField(body.hp, 100) !== '') {
    return NextResponse.json({ ok: true, delivered: 'ignored' });
  }

  const rawType = cleanField(body.type, 32);
  if (rawType !== 'tender' && rawType !== 'add_maker' && rawType !== 'maker_audit') {
    return NextResponse.json(
      { ok: false, error: 'Невідомий тип заявки.' },
      { status: 400 }
    );
  }

  const contact = cleanField(body.contact, 120);
  const brandName = cleanField(body.brandName, 200);
  const category = cleanField(body.category, 120);
  const plan = cleanField(body.plan, 120);
  const city = cleanField(body.city, 120);
  const eventDate = cleanField(body.eventDate, 120);
  const link = cleanField(body.link, 200);
  const description = cleanMultiline(body.description, 1500);
  const lang: 'uk' | 'ru' = cleanField(body.lang, 10) === 'ru' ? 'ru' : 'uk';
  const sourcePage = cleanField(body.sourcePage, 160) || '/';

  if (contact.length < 3) {
    return NextResponse.json(
      {
        ok: false,
        error:
          lang === 'ru'
            ? 'Укажите корректный телефон или Telegram для связи.'
            : 'Вкажіть коректний телефон або Telegram для зв’язку.',
      },
      { status: 400 }
    );
  }

  if (rawType === 'tender' && !description && !city) {
    return NextResponse.json(
      {
        ok: false,
        error:
          lang === 'ru'
            ? 'Укажите город и описание заказа.'
            : 'Вкажіть місто та опис замовлення.',
      },
      { status: 400 }
    );
  }

  if ((rawType === 'add_maker' || rawType === 'maker_audit') && !brandName) {
    return NextResponse.json(
      {
        ok: false,
        error:
          lang === 'ru'
            ? 'Укажите название мастерской.'
            : 'Вкажіть назву майстерні.',
      },
      { status: 400 }
    );
  }

  const createdAt = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lead: LeadRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: rawType,
    ...(brandName ? { brandName } : {}),
    ...(category ? { category } : {}),
    ...(plan ? { plan } : {}),
    ...(city ? { city } : {}),
    ...(eventDate ? { eventDate } : {}),
    ...(link ? { link } : {}),
    ...(description ? { description } : {}),
    contact,
    lang,
    sourcePage,
    createdAt,
  };

  if (!globalThis.__CRAFOHAB_LEADS__) {
    globalThis.__CRAFOHAB_LEADS__ = [];
  }
  globalThis.__CRAFOHAB_LEADS__.push(lead);
  if (globalThis.__CRAFOHAB_LEADS__.length > 50) {
    globalThis.__CRAFOHAB_LEADS__.shift();
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = (process.env.TELEGRAM_CHAT_ID || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    console.warn('[CrafoHab /api/lead] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured.');
    return NextResponse.json({ ok: true, delivered: 'pending_config' });
  }

  const messageText = formatTelegramMessage(lead);
  let sentCount = 0;

  for (const chatId of chatIds) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      if (tgRes.ok) {
        sentCount++;
      } else {
        const errText = await tgRes.text().catch(() => '');
        console.error('[CrafoHab /api/lead] Telegram API error:', tgRes.status, errText);
      }
    } catch (err) {
      console.error('[CrafoHab /api/lead] Telegram request failed:', err);
    }
  }

  if (sentCount === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          lang === 'ru'
            ? `Не удалось отправить заявку. Попробуйте еще раз или напишите на ${SITE_EMAIL}`
            : `Не вдалося надіслати заявку. Спробуйте ще раз або напишіть на ${SITE_EMAIL}`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, delivered: 'telegram' });
}
