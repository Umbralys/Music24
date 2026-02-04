import Link from 'next/link';
import { Topic, EraTag } from '@/types';

interface TopicCardProps {
  topic: Topic;
  forumSlug: string;
}

const eraColors: Record<EraTag, string> = {
  '80s': 'bg-amber-500/10 text-amber-400',
  '90s': 'bg-blue-500/10 text-blue-400',
  '00s': 'bg-slate-500/10 text-slate-300',
};

const userEraColors: Record<EraTag, string> = {
  '80s': 'bg-pink-500/20 text-pink-400',
  '90s': 'bg-yellow-500/20 text-yellow-400',
  '00s': 'bg-gray-500/20 text-gray-300',
};

export function TopicCard({ topic, forumSlug }: TopicCardProps) {
  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    if (diffInMins > 0) return `${diffInMins}m ago`;
    return 'just now';
  };

  return (
    <Link href={`/forums/${forumSlug}/topics/${topic.slug}`}>
      <div className="topic-card group cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {topic.pinned && (
                <span className="text-yellow-500" title="Pinned">
                  📌
                </span>
              )}
              {topic.locked && (
                <span className="text-red-500" title="Locked">
                  🔒
                </span>
              )}
              <h3 className="text-base font-semibold group-hover:text-blue-400 transition-colors truncate">
                {topic.title}
              </h3>
              {topic.era_tags && topic.era_tags.length > 0 && (
                <div className="flex gap-1">
                  {topic.era_tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded-full ${eraColors[tag]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {topic.description && (
              <p className="text-sm text-gray-400 line-clamp-1 mb-2">
                {topic.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                by {topic.author?.display_name || topic.author?.username || 'Unknown'}
                {topic.author?.favorite_era && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${userEraColors[topic.author.favorite_era]}`}>
                    {topic.author.favorite_era}
                  </span>
                )}
              </span>
              <span>•</span>
              <span>{timeAgo(topic.created_at)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-end gap-1 text-xs text-gray-400 shrink-0">
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{topic.message_count || 0}</span>
            </div>
            {topic.last_message_at && (
              <span className="text-gray-500">{timeAgo(topic.last_message_at)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
