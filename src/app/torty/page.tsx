import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';

export const metadata: Metadata = {
  title: 'Авторські торти та десерти на замовлення — CrafoHub 2027',
  description:
    'Святкові та мусові торти у шоколадному велюрі, трендові бенто-торти, дитячі торти та макарони. 3 основні кондитерські та повний список майстерень України.',
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app/torty',
  },
};

export default function TortyPage() {
  return (
    <ChocoRadarApp
      initialSection="cakes"
      initialCategory="avtorski-torty-ta-deserty"
      initialVariantId="cakes-custom"
    />
  );
}
