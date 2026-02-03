import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderProps {
  userButton: ReactNode;
}

export function Header({ userButton }: HeaderProps) {
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
            href="/trending"
            className="text-sm font-medium hover:text-blue-400 transition-colors"
          >
            Trending
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
