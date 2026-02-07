import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderProps {
  userButton: ReactNode;
  todayReleaseCount?: number;
}

export function Header({ userButton, todayReleaseCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold gradient-text">
            Music24
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/forums"
            className="text-sm font-medium hover:text-blue-400 transition-colors"
          >
            Forums
          </Link>
          <Link
            href="/on-this-day"
            className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            On This Day
            {todayReleaseCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-blue-400 transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {userButton}
        </div>
      </div>
    </header>
  );
}
