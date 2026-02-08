'use client';

import { useState } from 'react';
import { AlbumCard } from './AlbumCard';
import { getAlbumsByMonth, filterByEra } from '../utils/get-today-releases';

type EraFilter = '80s' | '90s' | '00s' | 'all';

const ERA_TABS: { label: string; value: EraFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '80s', value: '80s' },
  { label: '90s', value: '90s' },
  { label: '00s', value: '00s' },
];

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
        <div key={group.month} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {group.month}
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {group.albums.map((album) => (
              <AlbumCard key={`${album.title}-${album.year}`} album={album} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
