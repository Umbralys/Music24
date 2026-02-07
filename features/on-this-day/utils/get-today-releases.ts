import { albumReleases, AlbumRelease } from '../data/album-releases';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function getTodayDateString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

export function getTodayReleases(): AlbumRelease[] {
  const today = getTodayDateString();
  return albumReleases.filter((album) => album.releaseDate === today);
}

export function getAlbumsByMonth(): { month: string; albums: AlbumRelease[] }[] {
  const grouped = new Map<string, AlbumRelease[]>();

  for (const album of albumReleases) {
    const monthIndex = parseInt(album.releaseDate.split('-')[0], 10) - 1;
    const monthName = MONTH_NAMES[monthIndex];
    if (!grouped.has(monthName)) {
      grouped.set(monthName, []);
    }
    grouped.get(monthName)!.push(album);
  }

  return MONTH_NAMES
    .filter((month) => grouped.has(month))
    .map((month) => ({
      month,
      albums: grouped.get(month)!.sort((a, b) => {
        const dayA = parseInt(a.releaseDate.split('-')[1], 10);
        const dayB = parseInt(b.releaseDate.split('-')[1], 10);
        return dayA - dayB;
      }),
    }));
}

export function filterByEra(
  albums: AlbumRelease[],
  era: '80s' | '90s' | '00s' | 'all',
): AlbumRelease[] {
  if (era === 'all') return albums;
  return albums.filter((album) => album.era === era);
}
