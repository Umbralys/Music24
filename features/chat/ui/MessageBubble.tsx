import Image from 'next/image';
import { Message, EraTag, MessageVoteInfo, EraBadge } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  voteInfo?: MessageVoteInfo;
  authorBadges?: EraBadge[];
  onUpvote?: () => void;
  isAuthenticated?: boolean;
}

const eraColors: Record<EraTag, string> = {
  '80s': 'bg-pink-500/20 text-pink-400',
  '90s': 'bg-yellow-500/20 text-yellow-400',
  '00s': 'bg-gray-500/20 text-gray-300',
};

const badgeColors: Record<EraTag, string> = {
  '80s': 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  '90s': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  '00s': 'bg-gray-500/15 text-gray-300 border-gray-500/30',
};

export function MessageBubble({ message, isCurrentUser, voteInfo, authorBadges, onUpvote, isAuthenticated }: MessageBubbleProps) {
  const timeFormat = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const authorEra = message.author?.favorite_era;
  const displayName = message.author?.display_name || message.author?.username || 'Unknown';
  const avatarUrl = message.author?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`w-full rounded-lg transition-colors duration-200 animate-in fade-in duration-300 hover:bg-zinc-900/40`}
    >
      <div className="flex gap-3 p-4">
        {/* Left column: Avatar + Vote */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {/* Avatar */}
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="rounded-full bg-zinc-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-xs font-medium text-zinc-400">{initial}</span>
            </div>
          )}

          {/* Vote button (below avatar, only for others when authenticated) */}
          {!isCurrentUser && isAuthenticated && (
            <div className="flex flex-col items-center">
              {voteInfo?.has_voted ? (
                <div className="flex flex-col items-center text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 2a.75.75 0 01.65.378l2.8 4.889h5.3a.75.75 0 01.416 1.372l-4.284 2.89 1.636 5.037a.75.75 0 01-1.153.838L10 13.93l-5.365 3.474a.75.75 0 01-1.153-.838l1.636-5.037-4.284-2.89A.75.75 0 011.25 7.267h5.3l2.8-4.889A.75.75 0 0110 2z" />
                  </svg>
                  {(voteInfo?.vote_count || 0) > 0 && (
                    <span className="text-[10px] font-medium">{voteInfo.vote_count}</span>
                  )}
                </div>
              ) : (
                <button
                  onClick={onUpvote}
                  className="flex flex-col items-center text-zinc-600 hover:text-zinc-300 transition-colors"
                  aria-label="Upvote"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 2a.75.75 0 01.65.378l2.8 4.889h5.3a.75.75 0 01.416 1.372l-4.284 2.89 1.636 5.037a.75.75 0 01-1.153.838L10 13.93l-5.365 3.474a.75.75 0 01-1.153-.838l1.636-5.037-4.284-2.89A.75.75 0 011.25 7.267h5.3l2.8-4.889A.75.75 0 0110 2z" />
                  </svg>
                  {(voteInfo?.vote_count || 0) > 0 && (
                    <span className="text-[10px] font-medium">{voteInfo?.vote_count}</span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right column: Header + Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-zinc-200">
              {displayName}
            </span>
            {isCurrentUser && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">
                You
              </span>
            )}
            {authorEra && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${eraColors[authorEra]}`}>
                {authorEra}
              </span>
            )}
            {authorBadges && authorBadges.length > 0 && authorBadges.map((badge) => (
              <span
                key={badge.era}
                className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${badge.badge_name === 'Newcomer' ? 'bg-zinc-600/30 text-white border-zinc-500/40' : badgeColors[badge.era]}`}
                title={`${badge.era}: ${badge.vote_count} votes`}
              >
                {badge.badge_name}
              </span>
            ))}
            <span className="text-[10px] text-zinc-600 ml-auto select-none">
              {timeFormat(message.created_at)}
            </span>
          </div>

          {/* Message content */}
          <p className="text-sm text-zinc-300 mt-1.5 leading-relaxed break-words">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
