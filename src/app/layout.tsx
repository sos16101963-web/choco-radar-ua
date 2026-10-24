import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://choco-radar-ua.vercel.app'),
  title: {
    default: 'CraftHub — Всі крафтові виробники шоколаду, зефіру та тортів України (2027)',
    template: '%s | CraftHub — Платформа крафтових солодощів України',
  },
  description:
    'CraftHub — №1 сервіс крафтових солодощів України. Плитка шоколаду та батончик, цукерки ручної роботи, шоколадні квіти і букети, малина в шоколаді, вироби без цукру, солодощі для дітей, крафтовий зефір та авторські торти. 104 перевірені майстерні, чесна ціна за 100 г та тендерна біржа замовлень.',
  keywords: [
    'CraftHub Україна',
    'крафтовий шоколад Україна',
    'плитка шоколаду батончик купити',
    'шоколадні квіти купити',
    'букети з шоколаду Україна',
    'корпусні цукерки ручної роботи',
    'малина в шоколаді купити',
    'полуниця в шоколаді',
    'шоколад без цукру Україна',
    'солодощі для дітей без цукру',
    'крафтовий зефір букети',
    'авторські торти на замовлення',
    'crafo.com.ua',
  ],
  openGraph: {
    title: 'CraftHub — Всі крафтові виробники шоколаду, зефіру та тортів України',
    description:
      'Інтерактивний підбір подарунків за 30 секунд, порівняння ціни за 100 г, чистоти складу та прямі контакти 104 перевірених майстерень України.',
    url: 'https://choco-radar-ua.vercel.app',
    siteName: 'CraftHub',
    locale: 'uk_UA',
    alternateLocale: ['ru_UA'],
    type: 'website',
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
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app',
    languages: {
      'uk-UA': 'https://choco-radar-ua.vercel.app',
      'ru-UA': 'https://choco-radar-ua.vercel.app/?lang=ru',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#fbf6ee] text-[#302016] antialiased selection:bg-[#b06a1e] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
