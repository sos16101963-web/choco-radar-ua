import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Кабінет аналітики — CrafoHab',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PartnerStatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
