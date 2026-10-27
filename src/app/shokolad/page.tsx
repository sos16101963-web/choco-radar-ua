import React from 'react';
import { Metadata } from 'next';
import ChocoRadarApp from '@/components/ChocoRadarApp';

export const metadata: Metadata = {
  title: 'Шоколад та цукерки ручної роботи України — CrafoHub 2027',
  description:
    'Оберіть вид крафтового шоколаду: плитки шоколаду, батончики, корпусні цукерки ручної роботи, шоколадні квіти і букети, малина та полуниця в шоколаді, вироби без цукру та для дітей. ТОП-4 основних виробники України.',
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app/shokolad',
  },
};

export default function ShokoladPage() {
  return <ChocoRadarApp initialSection="chocolate" initialCategory="plytky-shokoladu" />;
}
