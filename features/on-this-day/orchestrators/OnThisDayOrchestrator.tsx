'use client';

import { getTodayReleases, getTodayDateString } from '../utils/get-today-releases';
import { OnThisDayHero } from '../ui/OnThisDayHero';
import { BrowseSection } from '../ui/BrowseSection';

export function OnThisDayOrchestrator() {
  const todayReleases = getTodayReleases();
  const todayString = getTodayDateString();

  // Format date for display (e.g., "February 7")
  const [month, day] = todayString.split('-').map(Number);
  const dateLabel = new Date(2000, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">
          On This Day
        </h1>
        <p className="text-gray-400">{dateLabel}</p>
      </div>

      <OnThisDayHero albums={todayReleases} dateLabel={dateLabel} />

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <BrowseSection />
      </div>
    </div>
  );
}
