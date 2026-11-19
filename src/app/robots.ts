import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const aiSearchBots = [
    'OAI-SearchBot',
    'ChatGPT-User',
    'PerplexityBot',
    'Claude-SearchBot',
    'ClaudeBot',
    'Google-Extended',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/partner/'],
      },
      ...aiSearchBots.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: ['/api/', '/partner/'],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
