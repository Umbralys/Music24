import { Message, MessageVoteInfo, EraBadge } from '@/types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  voteMap?: Record<string, MessageVoteInfo>;
  badgeMap?: Record<string, EraBadge[]>;
  onUpvote?: (messageId: string) => void;
}

export function MessageList({ messages, currentUserId, voteMap, badgeMap, onUpvote }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-center">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isCurrentUser={message.user_id === currentUserId}
          voteInfo={voteMap?.[message.id]}
          authorBadges={badgeMap?.[message.user_id]}
          onUpvote={onUpvote ? () => onUpvote(message.id) : undefined}
          isAuthenticated={!!currentUserId}
        />
      ))}
    </div>
  );
}
