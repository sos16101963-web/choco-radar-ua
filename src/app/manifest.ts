import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CrafoHab — Крафтові солодощі України',
    short_name: 'CrafoHab',
    description:
      'Платформа перевірених крафтових виробників шоколаду, цукерок, авторських тортів та зефіру України.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf6ee',
    theme_color: '#462b1f',
    lang: 'uk',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
