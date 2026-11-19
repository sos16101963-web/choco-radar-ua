'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy, Instagram, Phone } from 'lucide-react';
import { trackMakerClick, appendUtm } from '@/utils/analytics';
import { extractPhoneDigits } from '@/lib/siteConfig';

interface MakerProfileActionsProps {
  makerId: string;
  makerName: string;
  city: string;
  mainCategory: string;
  websiteUrl: string;
  instagramUrl?: string;
  phone?: string;
  profileUrl: string;
}

export default function MakerProfileActions({
  makerId,
  makerName,
  city,
  mainCategory,
  websiteUrl,
  instagramUrl,
  phone,
  profileUrl,
}: MakerProfileActionsProps) {
  const [copied, setCopied] = useState(false);

  const phoneDigits = extractPhoneDigits(phone);
  const showInstagram = Boolean(instagramUrl && instagramUrl !== websiteUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked or unavailable
    }
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
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] hover:brightness-110 text-white font-extrabold px-6 py-3 text-xs sm:text-sm shadow-md transition"
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
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#d4c3b3] bg-white hover:bg-[#f1e6da] text-[#4a382e] font-bold px-4 py-3 text-xs transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Посилання скопійовано!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#b06a1e]" />
              <span>Поділитися профілем</span>
            </>
          )}
        </button>
      </div>

      {phoneDigits && phone && (
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <a
            href={`tel:+${phoneDigits}`}
            onClick={() =>
              trackMakerClick(makerId, 'phone', { category: mainCategory, city })
            }
            className="inline-flex items-center gap-1.5 font-bold text-[#302016] hover:text-[#b06a1e] transition"
          >
            <Phone className="w-3.5 h-3.5 text-[#b06a1e]" />
            <span>{phone.split('(')[0].trim()}</span>
          </a>

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
