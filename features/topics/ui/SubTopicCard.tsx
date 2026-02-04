import Link from 'next/link';
import { SubTopic, EraTag } from '@/types';

interface SubTopicCardProps {
  subTopic: SubTopic;
  forumSlug: string;
  topicSlug: string;
}

const userEraColors: Record<EraTag, string> = {
  '80s': 'bg-pink-500/20 text-pink-400',
  '90s': 'bg-yellow-500/20 text-yellow-400',
  '00s': 'bg-gray-500/20 text-gray-300',
};

export function SubTopicCard({ subTopic, forumSlug, topicSlug }: SubTopicCardProps) {
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
    <Link href={`/forums/${forumSlug}/topics/${topicSlug}/chat/${subTopic.slug}`}>
      <div className="topic-card group cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold group-hover:text-blue-400 transition-colors truncate">
              {subTopic.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1.5">
                by {subTopic.author?.display_name || subTopic.author?.username || 'Unknown'}
                {subTopic.author?.favorite_era && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${userEraColors[subTopic.author.favorite_era]}`}>
                    {subTopic.author.favorite_era}
                  </span>
                )}
              </span>
              <span>•</span>
              <span>{timeAgo(subTopic.created_at)}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-xs text-gray-400 shrink-0">
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{subTopic.message_count || 0}</span>
            </div>
            {subTopic.last_message_at && (
              <span className="text-gray-500">{timeAgo(subTopic.last_message_at)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
