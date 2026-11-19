'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopButtonProps {
  lang?: 'uk' | 'ru';
  isDark?: boolean;
}

export default function BackToTopButton({
  lang = 'uk',
  isDark = false,
}: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 520);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const label = lang === 'ru' ? 'Наверх страницы' : 'Повернутися вгору';

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      title={label}
      className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
        isDark
          ? 'bg-[#2a1b13]/90 border-[#e39851]/50 text-[#f0a556] hover:bg-[#3a251a]'
          : 'bg-[#fefbf7]/95 border-[#d4a373] text-[#462b1f] hover:bg-[#fff8ef] hover:border-[#b06a1e]'
      }`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
