import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';

export const metadata: Metadata = {
  title: 'Крафтовий зефір, зефірні букети та пастила — CrafoHub 2027',
  description:
    'Оберіть асортимент крафтового зефіру: букети з зефірних квітів, ягідний зефір на агар-агарі, зефір у бельгійському шоколаді та натуральна пастила без цукру. ТОП-4 основних виробники України.',
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app/zefir',
  },
};

export default function ZefirPage() {
  return <ChocoRadarApp initialSection="zefir" initialCategory="kraftovyi-zefir-ta-bukety" />;
}
