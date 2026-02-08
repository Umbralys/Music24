import { AlbumRelease } from '../data/album-releases';

const eraColors: Record<string, string> = {
  '80s': 'bg-amber-500/10 text-amber-400',
  '90s': 'bg-blue-500/10 text-blue-400',
  '00s': 'bg-purple-500/10 text-purple-400',
};

const genreColors: Record<string, string> = {
  'Hip-Hop': 'bg-green-500/10 text-green-400',
  'R&B': 'bg-pink-500/10 text-pink-400',
};

interface AlbumCardProps {
  album: AlbumRelease;
  highlight?: boolean;
}

export function AlbumCard({ album, highlight = false }: AlbumCardProps) {
  return (
    <div className={`forum-card overflow-hidden ${highlight ? 'border-amber-500/50' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3 className={`font-semibold truncate ${highlight ? 'text-lg' : 'text-base'}`}>
            {album.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">{album.artist}</p>
        </div>
        <span className="text-gray-500 text-sm shrink-0">{album.year}</span>
      </div>
      <div className="flex gap-2 mt-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eraColors[album.era]}`}>
          {album.era}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${genreColors[album.genre]}`}>
          {album.genre}
        </span>
      </div>
    </div>
  );
}
