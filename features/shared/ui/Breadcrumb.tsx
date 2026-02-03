'use client';

import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      {/* Desktop view - full breadcrumb */}
      <ol className="hidden sm:flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-white font-medium' : 'text-gray-400'}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile view - back button + current */}
      <div className="flex sm:hidden items-center gap-2 text-sm">
        {items.length > 1 && items[items.length - 2]?.href && (
          <Link
            href={items[items.length - 2].href!}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>{items[items.length - 2].label}</span>
          </Link>
        )}
        {items.length === 1 && (
          <span className="text-white font-medium">{items[0].label}</span>
        )}
      </div>
    </nav>
  );
}
