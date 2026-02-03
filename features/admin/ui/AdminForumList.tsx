import Link from 'next/link';
import { Forum } from '@/types';

interface AdminForumListProps {
  forums: Forum[];
  onDelete: (id: string) => void;
}

export function AdminForumList({ forums, onDelete }: AdminForumListProps) {
  if (forums.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 bg-zinc-900/50 rounded-lg">
        No forums yet. Create your first forum to get started.
      </div>
    );
  }

  const eraColors: Record<string, string> = {
    '80s': 'bg-amber-500/20 text-amber-400',
    '90s': 'bg-blue-500/20 text-blue-400',
    '00s': 'bg-slate-500/20 text-slate-300',
    'all': 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="space-y-3">
      {forums.map((forum) => (
        <div
          key={forum.id}
          className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="text-2xl">{forum.icon || '📁'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/forums/${forum.slug}`}
                  className="font-semibold hover:text-blue-400 transition-colors truncate"
                >
                  {forum.name}
                </Link>
                {forum.era && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${eraColors[forum.era]}`}>
                    {forum.era}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 truncate">{forum.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Link
              href={`/forums/${forum.slug}`}
              className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors"
            >
              View
            </Link>
            <button
              onClick={() => onDelete(forum.id)}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
