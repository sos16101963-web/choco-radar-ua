import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { MAKERS } from '@/data/chocolateData';
import { generateGlobalEntityGraph } from '@/utils/seoSchema';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#462b1f',
};

const makersCount = MAKERS.length;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CrafoHab — Крафтовий шоколад, авторські торти та зефір від майстерень України',
    template: '%s | CrafoHab',
  },
  description: `Каталог перевірених українських майстерень шоколаду, зефіру та тортів на замовлення. ${makersCount} виробників із прямими контактами, порівнянням ціни за 100 г і замовленням без комісії.`,
  keywords: [
    'CrafoHab Україна',
    'крафтовий шоколад Україна',
    'плитка шоколаду батончик купити',
    'дубайський шоколад купити Україна',
    'шоколадні квіти купити',
    'букети з шоколаду Україна',
    'корпусні цукерки ручної роботи',
    'сирні трюфелі купити',
    'малина в шоколаді купити',
    'полуниця в шоколаді',
    'шоколад без цукру Україна',
    'солодощі для дітей без цукру',
    'крафтовий зефір ручної роботи купити',
    'зефірні букети Україна',
    'авторські торти на замовлення',
    'бенто торт на замовлення',
    'торти на замовлення Київ Харків Львів Дніпро Одеса',
    'корпоративні подарунки шоколад',
    'crafohab.com.ua',
  ],
  openGraph: {
    title: 'CrafoHab — Крафтовий шоколад, авторські торти та зефір від майстерень України',
    description: `Каталог перевірених українських майстерень (${makersCount} виробників): порівняння ціни за 100 г, прозорий склад і прямі контакти без комісії.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrafoHab — Крафтовий шоколад, авторські торти та зефір України',
    description: `Порівняння крафтових майстерень України за ціною за 100 г та прямі контакти (${makersCount} виробників).`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalGraph = generateGlobalEntityGraph();

  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalGraph) }}
        />
      </head>
      <body className="min-h-screen bg-[#fbf6ee] text-[#302016] antialiased selection:bg-[#b06a1e] selection:text-white font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[#462b1f] focus:px-4 focus:py-2 focus:text-xs focus:font-extrabold focus:text-white focus:shadow-xl"
        >
          Перейти до основного змісту
        </a>
        {children}
      </body>
    </html>
  );
}
