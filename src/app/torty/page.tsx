import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';

export const metadata: Metadata = {
  title: 'Авторські торти та десерти на замовлення — CrafoHub 2027',
  description:
    'Оберіть вид торта або десерту: святкові та мусові торти, бенто-торти, дитячі, весільні торти, макарони та ПП-десерти без цукру. ТОП-4 основних кондитерських України.',
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app/torty',
  },
};

export default function TortyPage() {
  return <ChocoRadarApp initialSection="cakes" initialCategory="avtorski-torty-ta-deserty" />;
}
