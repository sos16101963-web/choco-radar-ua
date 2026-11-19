'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy, Heart, Instagram, Phone, Share2 } from 'lucide-react';
import { trackMakerClick, appendUtm } from '@/utils/analytics';
import { extractPhoneDigits } from '@/lib/siteConfig';
import {
  getStoredFavorites,
  recordRecentMaker,
  shareOrCopy,
  toggleStoredFavorite,
} from '@/lib/uxStorage';

interface MakerProfileActionsProps {
  makerId: string;
  makerSlug?: string;
  makerName: string;
  city: string;
  mainCategory: string;
  websiteUrl: string;
  instagramUrl?: string;
  phone?: string;
  imageUrl?: string;
  profileUrl: string;
}

export default function MakerProfileActions({
  makerId,
  makerSlug,
  makerName,
  city,
  mainCategory,
  websiteUrl,
  instagramUrl,
  phone,
  imageUrl,
  profileUrl,
}: MakerProfileActionsProps) {
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'copied'>('idle');
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getStoredFavorites().includes(makerId));
    if (makerSlug) {
      recordRecentMaker({
        id: makerId,
        slug: makerSlug,
        name: makerName,
        city,
        imageUrl,
      });
    }
  }, [makerId, makerSlug, makerName, city, imageUrl]);

  const phoneDigits = extractPhoneDigits(phone);
  const displayPhone = phone ? phone.split('(')[0].trim() : '';
  const showInstagram = Boolean(instagramUrl && instagramUrl !== websiteUrl);

  const handleShare = async () => {
    const res = await shareOrCopy({
      title: makerName,
      text: `${makerName} (${city}) — CrafoHab`,
      url: profileUrl,
    });
    if (res === 'shared' || res === 'copied') {
      setShareState(res);
      window.setTimeout(() => setShareState('idle'), 2400);
    }
  };

  const handleCopyPhone = async () => {
    if (!displayPhone || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(displayPhone);
      setPhoneCopied(true);
      window.setTimeout(() => setPhoneCopied(false), 2200);
    } catch {
      // Clipboard blocked or unavailable
    }
  };

  const handleToggleFavorite = () => {
    const { added } = toggleStoredFavorite(makerId);
    setIsFav(added);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={appendUtm(websiteUrl, makerId)}
          onClick={() =>
            trackMakerClick(
              makerId,
              websiteUrl.includes('instagram.com') ? 'instagram' : 'website',
              { category: mainCategory, city }
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 text-white font-extrabold px-6 py-3 text-xs sm:text-sm shadow-md transition active:scale-[0.98]"
        >
          <span>Перейти на сайт виробника ({makerName.split('—')[0].trim()})</span>
          <ArrowUpRight className="w-4 h-4 shrink-0" />
        </a>

        {showInstagram && instagramUrl && (
          <a
            href={appendUtm(instagramUrl, makerId)}
            onClick={() =>
              trackMakerClick(makerId, 'instagram', { category: mainCategory, city })
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#d4c3b3] bg-[#fefbf7] hover:border-[#b06a1e] text-[#302016] font-bold px-4 py-3 text-xs sm:text-sm transition"
          >
            <Instagram className="w-4 h-4 text-[#c75b7a]" />
            <span>Instagram</span>
          </a>
        )}

        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`inline-flex items-center gap-1.5 rounded-full border font-bold px-4 py-3 text-xs transition active:scale-[0.98] ${
            isFav
              ? 'bg-[#c75b7a] border-[#c75b7a] text-white shadow-sm'
              : 'border-[#d4c3b3] bg-white hover:border-[#c75b7a] text-[#4a382e]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : 'text-[#c75b7a]'}`} />
          <span>{isFav ? 'В обраному' : 'В обране'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#d4c3b3] bg-white hover:bg-[#f1e6da] text-[#4a382e] font-bold px-4 py-3 text-xs transition active:scale-[0.98]"
        >
          {shareState !== 'idle' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {shareState === 'shared' ? 'Поділилися ✓' : 'Посилання скопійовано!'}
              </span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#b06a1e]" />
              <span>Поділитися профілем</span>
            </>
          )}
        </button>
      </div>

      {phoneDigits && phone && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          <a
            href={`tel:+${phoneDigits}`}
            onClick={() =>
              trackMakerClick(makerId, 'phone', { category: mainCategory, city })
            }
            className="inline-flex items-center gap-1.5 font-bold text-[#302016] hover:text-[#b06a1e] transition"
          >
            <Phone className="w-3.5 h-3.5 text-[#b06a1e]" />
            <span>{displayPhone}</span>
          </a>

          <button
            type="button"
            onClick={handleCopyPhone}
            className="inline-flex items-center gap-1 rounded-full border border-[#d4c3b3] bg-white hover:border-[#b06a1e] px-2.5 py-0.5 text-[11px] font-bold text-[#4a382e] transition active:scale-95"
          >
            {phoneCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Скопійовано ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#b06a1e]" />
                <span>Копіювати</span>
              </>
            )}
          </button>

          <span className="text-[#d4c3b3]">•</span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#6e5d50]">
              Швидке замовлення:
            </span>
            <a
              href={`viber://chat?number=%2B${phoneDigits}`}
              onClick={() =>
                trackMakerClick(makerId, 'phone', { category: mainCategory, city })
              }
              className="inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold bg-[#7360f2]/15 text-[#5e35b1] hover:bg-[#7360f2] hover:text-white border border-[#7360f2]/30 transition"
              title="Швидке замовлення у Viber"
            >
              Viber
            </a>
            <a
              href={`https://t.me/+${phoneDigits}`}
              onClick={() =>
                trackMakerClick(makerId, 'phone', { category: mainCategory, city })
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold bg-[#229ed9]/15 text-[#0088cc] hover:bg-[#229ed9] hover:text-white border border-[#229ed9]/30 transition"
              title="Швидке замовлення у Telegram"
            >
              Telegram
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
