import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface VisibleBreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: VisibleBreadcrumbItem[];
  isDark?: boolean;
  className?: string;
}

export default function Breadcrumbs({
  items,
  isDark = false,
  className = '',
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-xs ${
          isDark ? 'text-[#c2b6a9]' : 'text-[#6e5d50]'
        }`}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5 min-w-0">
              {idx > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 opacity-55 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={`font-bold truncate max-w-[260px] sm:max-w-md ${
                    isDark ? 'text-[#faf4eb]' : 'text-[#302016]'
                  }`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium hover:text-[#b06a1e] transition truncate max-w-[220px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
