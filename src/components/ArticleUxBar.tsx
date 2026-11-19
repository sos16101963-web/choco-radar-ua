'use client';

import React, { useEffect, useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { shareOrCopy } from '@/lib/uxStorage';

export default function ArticleUxBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }
      const ratio = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setProgress(ratio);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-[#b06a1e] via-[#e39851] to-[#c75b7a] transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

interface ArticleShareButtonProps {
  title: string;
  url: string;
  lang?: 'uk' | 'ru';
}

export function ArticleShareButton({
  title,
  url,
  lang = 'uk',
}: ArticleShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'done'>('idle');

  const handleShare = async () => {
    const res = await shareOrCopy({ title, url });
    if (res === 'copied' || res === 'shared') {
      setStatus('done');
      window.setTimeout(() => setStatus('idle'), 2400);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#d4c3b3] bg-white hover:border-[#b06a1e] hover:bg-[#fff8ef] text-[#462b1f] px-3.5 py-1 text-xs font-bold transition active:scale-95"
    >
      {status === 'done' ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'ru' ? 'Скопировано ✓' : 'Скопійовано ✓'}</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-[#b06a1e]" />
          <span>{lang === 'ru' ? 'Поделиться' : 'Поділитися'}</span>
        </>
      )}
    </button>
  );
}
