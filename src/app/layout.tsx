import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://choco-radar-ua.vercel.app'),
  title: {
    default: 'ChocoRadar UA — Умный навигатор крафтового шоколада, конфет и ягод в шоколаде Украины',
    template: '%s | ChocoRadar UA — Рейтинг та порівняння крафтового шоколаду',
  },
  description:
    'Перша експертна платформа порівняння крафтового шоколаду в Україні (2026–2027). Плитки Bean-to-Bar, розмальовані корпусні цукерки, горіхи, сухофрукти, малина та полуниця в шоколаді. Чесний розрахунок ціни за 100 г, індекс чистоти складу та прямі контакти виробників.',
  keywords: [
    'крафтовий шоколад Україна',
    'bean to bar шоколад купити',
    'корпусні цукерки ручної роботи',
    'розмальовані цукерки',
    'малина в шоколаді купити',
    'полуниця в шоколаді',
    'горіхи в шоколаді драже',
    'сухофрукти в шоколаді',
    'шоколад без цукру Україна',
    'виробники крафтового шоколаду',
  ],
  openGraph: {
    title: 'ChocoRadar UA — Всі крафтові виробники шоколаду України на одній платформі',
    description:
      'Підбір за смаковим профілем, порівняння ціни за 100 г, чистоти складу та умов доставки. Від Bean-to-Bar плиток до розписних цукерок і малини в шоколаді.',
    url: 'https://choco-radar-ua.vercel.app',
    siteName: 'ChocoRadar UA',
    locale: 'uk_UA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://choco-radar-ua.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen bg-cacao-950 text-stone-100 antialiased selection:bg-gold-500 selection:text-cacao-950 font-sans">
        {children}
      </body>
    </html>
  );
}
