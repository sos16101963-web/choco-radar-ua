import React from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  quality?: number;
  fallbackWidth?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority = false,
  className = '',
  quality = 75,
  fallbackWidth,
}: OptimizedImageProps) {
  const resolvedSrc = getOptimizedImageUrl(
    src,
    fallbackWidth || width || 600,
    quality
  );

  const canOptimize =
    resolvedSrc.startsWith('/') || resolvedSrc.includes('images.unsplash.com');

  if (fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        unoptimized={!canOptimize}
        className={className}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      unoptimized={!canOptimize}
      className={className}
    />
  );
}
