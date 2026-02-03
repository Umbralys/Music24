import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const timeFormat = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[75%] md:max-w-[60%] ${
          isCurrentUser
            ? 'bg-blue-600 rounded-l-2xl rounded-tr-2xl'
            : 'bg-zinc-800 rounded-r-2xl rounded-tl-2xl'
        } px-4 py-3`}
      >
        {!isCurrentUser && (
          <div className="text-xs font-semibold text-amber-500 mb-1">
            {message.author?.username || 'Unknown'}
          </div>
        )}
        <p className="text-sm break-words">{message.content}</p>
        <div
          className={`text-xs mt-1 ${
            isCurrentUser ? 'text-blue-200' : 'text-gray-500'
          }`}
        >
          {timeFormat(message.created_at)}
        </div>
      </div>
    </div>
  );
}
