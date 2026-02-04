import { ReactNode } from 'react';

interface ChatContainerProps {
  header: ReactNode;
  messages: ReactNode;
  input: ReactNode;
}

export function ChatContainer({ header, messages, input }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] relative bg-black/20 rounded-xl overflow-hidden border border-zinc-800/50">
      {/* Header with blur */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 px-4 py-3">
        {header}
      </div>

      {/* Messages Container - added top padding for header and bottom padding for scrolling space */}
      <div className="flex-1 overflow-y-auto pt-20 pb-4 px-4 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages}
        </div>
      </div>

      {/* Gradient Fade Overlay for bottom scrolling */}
      <div className="h-8 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none sticky bottom-[72px] z-10" />

      {/* Floating Input Area */}
      <div className="sticky bottom-0 bg-zinc-950 p-4 pt-2 z-20">
        {input}
      </div>
    </div>
  );
}
