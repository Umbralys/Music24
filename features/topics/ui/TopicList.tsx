import { Topic } from '@/types';
import { TopicCard } from './TopicCard';

interface TopicListProps {
  topics: Topic[];
  forumSlug?: string;
}

export function TopicList({ topics, forumSlug = '' }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          No topics yet. Be the first to start a discussion!
        </p>
      </div>
    );
  }

  // Separate pinned and regular topics
  const pinnedTopics = topics.filter((t) => t.pinned);
  const regularTopics = topics.filter((t) => !t.pinned);

  return (
    <div className="space-y-2">
      {pinnedTopics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} forumSlug={forumSlug} />
      ))}
      {regularTopics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} forumSlug={forumSlug} />
      ))}
    </div>
  );
}
