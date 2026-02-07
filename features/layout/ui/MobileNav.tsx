'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { getTodayReleases } from '@/features/on-this-day/utils/get-today-releases';

const navItems = [
  { href: '/forums', label: 'Forums', icon: '💬' },
  { href: '/on-this-day', label: 'On This Day', icon: '📀' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function MobileNav() {
  const pathname = usePathname();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const hasTodayRelease = useMemo(() => getTodayReleases().length > 0, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      // If the visual viewport is significantly shorter than the window,
      // the virtual keyboard is open
      setKeyboardOpen(window.innerHeight - viewport.height > 100);
    };

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  if (keyboardOpen) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-[var(--border)] z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <span className="text-xl relative">
                {item.icon}
                {item.href === '/on-this-day' && hasTodayRelease && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
