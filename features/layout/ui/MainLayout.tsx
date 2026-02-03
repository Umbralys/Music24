import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  header: ReactNode;
  mobileNav: ReactNode;
}

export function MainLayout({ children, header, mobileNav }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {header}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      {mobileNav}
    </div>
  );
}
