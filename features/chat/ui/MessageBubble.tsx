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

  return (
    <div
      className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 group animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>

        {/* Username + badges (others) */}
        {!isCurrentUser && (
          <div className="flex items-center gap-1.5 mb-1 ml-3 flex-wrap">
            <span className="text-[10px] font-medium text-zinc-500 tracking-wide">
              {message.author?.display_name || message.author?.username || 'Unknown'}
            </span>
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
          </div>
        )}

        {/* Era + badges (current user — no username) */}
        {isCurrentUser && (authorEra || (authorBadges && authorBadges.length > 0)) && (
          <div className="flex items-center gap-1.5 mb-1 mr-3 flex-wrap justify-end">
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

        {/* Vote Button (below bubble, only for others' messages when authenticated) */}
        {!isCurrentUser && isAuthenticated && (
          <div className="flex items-center gap-1.5 ml-3 mt-0.5">
            {voteInfo?.has_voted ? (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M10 2a.75.75 0 01.65.378l2.8 4.889h5.3a.75.75 0 01.416 1.372l-4.284 2.89 1.636 5.037a.75.75 0 01-1.153.838L10 13.93l-5.365 3.474a.75.75 0 01-1.153-.838l1.636-5.037-4.284-2.89A.75.75 0 011.25 7.267h5.3l2.8-4.889A.75.75 0 0110 2z" />
                </svg>
                {(voteInfo?.vote_count || 0) > 0 && (
                  <span>{voteInfo.vote_count}</span>
                )}
              </span>
            ) : (
              <button
                onClick={onUpvote}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition-all bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300"
                aria-label="Upvote"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M10 2a.75.75 0 01.65.378l2.8 4.889h5.3a.75.75 0 01.416 1.372l-4.284 2.89 1.636 5.037a.75.75 0 01-1.153.838L10 13.93l-5.365 3.474a.75.75 0 01-1.153-.838l1.636-5.037-4.284-2.89A.75.75 0 011.25 7.267h5.3l2.8-4.889A.75.75 0 0110 2z" />
                </svg>
                {(voteInfo?.vote_count || 0) > 0 && (
                  <span>{voteInfo?.vote_count}</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
