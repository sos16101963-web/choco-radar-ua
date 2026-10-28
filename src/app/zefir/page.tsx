import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';

export const metadata: Metadata = {
  title: 'Крафтовий зефір, зефірні букети та пастила — CrafoHub 2027',
  description:
    'Реалістичні зефірні букети з півоній і троянд, ягідний зефір на агар-агарі та зефір у шоколаді. 3 основні майстерні та повний список виробників України.',
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app/zefir',
  },
};

export default function ZefirPage() {
  return (
    <ChocoRadarApp
      initialSection="zefir"
      initialCategory="kraftovyi-zefir-ta-bukety"
      initialVariantId="zefir-bouquets"
    />
  );
}
