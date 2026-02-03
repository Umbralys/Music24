import Link from 'next/link';
import { Forum } from '@/types';

interface ForumCardProps {
  forum: Forum;
}

export function ForumCard({ forum }: ForumCardProps) {
  const eraColors: Record<string, string> = {
    '80s': 'bg-amber-500/10 text-amber-400',
    '90s': 'bg-blue-500/10 text-blue-400',
    '00s': 'bg-slate-500/10 text-slate-300',
    all: 'bg-gray-500/10 text-gray-400',
  };

  const eraColor = eraColors[forum.era || 'all'];

  return (
    <Link href={`/forums/${forum.slug}`}>
      <div className="forum-card group cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-4xl">{forum.icon || '💬'}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                {forum.name}
              </h3>
              {forum.era && (
                <span className={`text-xs px-2 py-1 rounded-full ${eraColor}`}>
                  {forum.era}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">
              {forum.description}
            </p>
            {/* Mobile Stats */}
            <div className="flex sm:hidden gap-3 mt-2 text-xs text-gray-500">
              <span>{forum.topic_count || 0} topics</span>
              <span>•</span>
              <span>{forum.post_count || 0} posts</span>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden sm:flex flex-col items-end gap-1 text-sm text-gray-400">
            <div>{forum.topic_count || 0} topics</div>
            <div>{forum.post_count || 0} posts</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
