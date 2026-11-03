'use client';

import React, { useState } from 'react';

export default function ForMakersAuditForm() {
  const [submitted, setSubmitted] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('🍫 Крафтовий шоколад та цукерки');
  const [link, setLink] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-6 text-center text-emerald-900">
        <div className="text-3xl mb-2">🎉</div>
        <h4 className="font-bold text-base mb-1">Дякуємо! Заявку на аудит прийнято</h4>
        <p className="text-xs text-emerald-700">
          Ми перевіримо профіль <strong>{brandName || 'вашої майстерні'}</strong> на відповідність стандарту
          Clean Label 2027 та зв’яжемося за контактом <strong>{contact}</strong> протягом робочого дня.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
      <div>
        <label className="block text-[11px] font-bold text-[#715f53] mb-1">
          Назва майстерні / бренду *
        </label>
        <input
          type="text"
          required
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Наприклад: CheBakery або Львівський шоколатьє"
          className="w-full bg-[#fbf6ee] border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-[#715f53] mb-1">
            Місто виробництва *
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Київ, Харків, Одеса..."
            className="w-full bg-[#fbf6ee] border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#715f53] mb-1">
            Основний напрямок *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#fbf6ee] border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
          >
            <option>🍫 Крафтовий шоколад та цукерки</option>
            <option>🎂 Авторські торти та десерти</option>
            <option>🌸 Зефірні букети та пастила</option>
            <option>🌹 Шоколадні квіти та подарунки</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-[#715f53] mb-1">
          Посилання на сайт або Instagram *
        </label>
        <input
          type="text"
          required
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://instagram.com/your_shop або сайт"
          className="w-full bg-[#fbf6ee] border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-[#715f53] mb-1">
          Телефон та месенджер для зв’язку (Telegram/Viber) *
        </label>
        <input
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="+38 (0XX) XXX-XX-XX або @username"
          className="w-full bg-[#fbf6ee] border border-[#d4c3b3] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b06a1e]"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#b06a1e] to-[#8c4f12] text-white font-extrabold py-3.5 rounded-full shadow-md hover:brightness-110 transition text-sm cursor-pointer"
      >
        🚀 Відправити заявку на безкоштовний аудит
      </button>
    </form>
  );
}
