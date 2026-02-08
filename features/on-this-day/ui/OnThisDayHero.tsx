import { AlbumRelease } from '../data/album-releases';
import { AlbumCard } from './AlbumCard';

interface OnThisDayHeroProps {
  albums: AlbumRelease[];
  dateLabel: string;
}

export function OnThisDayHero({ albums, dateLabel }: OnThisDayHeroProps) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-2xl">📀</p>
        <p className="text-gray-400">No album releases on {dateLabel}</p>
        <p className="text-gray-500 text-sm">Browse the archive below to explore releases by month and era</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <p className="text-gray-400 text-sm">
          {albums.length === 1
            ? '1 album released on this day'
            : `${albums.length} albums released on this day`}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {albums.map((album) => (
          <AlbumCard key={`${album.title}-${album.year}`} album={album} highlight />
        ))}
      </div>
    </div>
  );
}
