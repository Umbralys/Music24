import { Forum } from '@/types';
import { ForumCard } from './ForumCard';

interface ForumListProps {
  forums: Forum[];
}

export function ForumList({ forums }: ForumListProps) {
  if (forums.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No forums found. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <ForumCard key={forum.id} forum={forum} />
      ))}
    </div>
  );
}
