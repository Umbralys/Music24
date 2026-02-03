import Link from 'next/link';
import { SubTopic } from '@/types';

interface SubTopicCardProps {
  subTopic: SubTopic;
  forumSlug: string;
  topicSlug: string;
}

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

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <span>by {subTopic.author?.username || 'Unknown'}</span>
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
