'use client';

import { useState } from 'react';
import { AlbumCard } from './AlbumCard';
import { getAlbumsByMonth, filterByEra } from '../utils/get-today-releases';
import { AlbumRelease } from '../data/album-releases';

type EraFilter = '80s' | '90s' | '00s' | 'all';

const MOBILE_LIMIT = 3;

const ERA_TABS: { label: string; value: EraFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '80s', value: '80s' },
  { label: '90s', value: '90s' },
  { label: '00s', value: '00s' },
];

function MonthGroup({ month, albums }: { month: string; albums: AlbumRelease[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = albums.length > MOBILE_LIMIT;
  const remaining = albums.length - MOBILE_LIMIT;

  // On mobile show limited, on desktop show all
  const visibleAlbums = expanded ? albums : albums.slice(0, MOBILE_LIMIT);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {month}
      </h3>
      {/* Mobile: single column with limit */}
      <div className="md:hidden space-y-3">
        {visibleAlbums.map((album) => (
          <AlbumCard key={`${album.title}-${album.year}`} album={album} />
        ))}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2.5 rounded-lg bg-zinc-800/50 text-gray-400 text-sm font-medium hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {expanded ? 'Show less' : `Show ${remaining} more`}
          </button>
        )}
      </div>
      {/* Desktop: full grid, no limit */}
      <div className="hidden md:grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <AlbumCard key={`${album.title}-${album.year}`} album={album} />
        ))}
      </div>
    </div>
  );
}

export function BrowseSection() {
  const [activeEra, setActiveEra] = useState<EraFilter>('all');
  const allMonths = getAlbumsByMonth();

  const filteredMonths = allMonths
    .map((group) => ({
      month: group.month,
      albums: filterByEra(group.albums, activeEra),
    }))
    .filter((group) => group.albums.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Browse Releases</h2>
        <div className="flex gap-1">
          {ERA_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveEra(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeEra === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredMonths.map((group) => (
        <MonthGroup key={group.month} month={group.month} albums={group.albums} />
      ))}
    </div>
  );
}
