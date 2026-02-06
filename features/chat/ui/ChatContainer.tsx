import { ReactNode } from 'react';

interface ChatContainerProps {
  header: ReactNode;
  messages: ReactNode;
  input: ReactNode;
}

export function ChatContainer({ header, messages, input }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] md:h-[calc(100dvh-6rem)] relative overflow-hidden">
      {/* Header with blur */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[var(--background)]/90 backdrop-blur-md px-4 py-3">
        {header}
      </div>

      {/* Messages Container - added top padding for header and bottom padding for scrolling space */}
      <div className="flex-1 overflow-y-auto pt-20 pb-4 px-4 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages}
        </div>
      </div>

      {/* Gradient Fade Overlay for bottom scrolling */}
      <div className="h-8 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none sticky bottom-[72px] z-10" />

      {/* Floating Input Area */}
      <div className="sticky bottom-0 bg-[var(--background)] p-4 pt-2 z-20">
        {input}
      </div>
    </div>
  );
}
