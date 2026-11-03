/**
 * Responsive Image Optimizer for Core Web Vitals & Lighthouse 2027
 * - Dynamically rewrites Unsplash URLs to optimized modern WebP at exact viewport dimensions
 * - Automatically routes local images to WebP equivalents
 */

export function getOptimizedImageUrl(
  url?: string | null,
  width: number = 450,
  quality: number = 75
): string {
  if (!url) return '/images/crafo-collage.webp';

  // 1. Local image paths
  if (url.startsWith('/images/')) {
    if (url.endsWith('.jpg') || url.endsWith('.png')) {
      const base = url.substring(0, url.lastIndexOf('.'));
      return `${base}.webp`;
    }
    return url;
  }

  // 2. Unsplash CDN Images
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('fm', 'webp');
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', quality.toString());
      return urlObj.toString();
    } catch {
      // Fallback string replacement
      return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`) + '&auto=format&fm=webp';
    }
  }

  return url;
}
