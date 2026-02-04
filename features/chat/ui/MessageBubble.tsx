import { Message, EraTag } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const eraColors: Record<EraTag, string> = {
  '80s': 'bg-pink-500/20 text-pink-400',
  '90s': 'bg-yellow-500/20 text-yellow-400',
  '00s': 'bg-gray-500/20 text-gray-300',
};

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const timeFormat = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const authorEra = message.author?.favorite_era;

  return (
    <div
      className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 group animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>

        {/* Username Label (only for others) */}
        {!isCurrentUser && (
          <div className="flex items-center gap-1.5 mb-1 ml-3">
            <span className="text-[10px] font-medium text-zinc-500 tracking-wide">
              {message.author?.display_name || message.author?.username || 'Unknown'}
            </span>
            {authorEra && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${eraColors[authorEra]}`}>
                {authorEra}
              </span>
            )}
          </div>
        )}

        {/* The Bubble */}
        <div
          className={`relative px-5 py-3 shadow-sm ${
            isCurrentUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm'
              : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-100 rounded-2xl rounded-tl-sm border border-zinc-700/30'
          }`}
        >
          <p className="text-[15px] leading-relaxed break-words font-normal">
            {message.content}
          </p>
          
          {/* Timestamp inside bubble */}
          <div
            className={`text-[10px] mt-1 text-right select-none ${
              isCurrentUser ? 'text-blue-200/70' : 'text-zinc-500'
            }`}
          >
            {timeFormat(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
