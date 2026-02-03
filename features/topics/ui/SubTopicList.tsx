import { SubTopic } from '@/types';
import { SubTopicCard } from './SubTopicCard';

interface SubTopicListProps {
  subTopics: SubTopic[];
  forumSlug: string;
  topicSlug: string;
}

export function SubTopicList({ subTopics, forumSlug, topicSlug }: SubTopicListProps) {
  if (subTopics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          No discussions yet. Start a conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {subTopics.map((subTopic) => (
        <SubTopicCard
          key={subTopic.id}
          subTopic={subTopic}
          forumSlug={forumSlug}
          topicSlug={topicSlug}
        />
      ))}
    </div>
  );
}
