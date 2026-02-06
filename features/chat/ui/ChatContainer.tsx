import { ReactNode } from 'react';

interface ChatContainerProps {
  header: ReactNode;
  messages: ReactNode;
  input: ReactNode;
}

export function ChatContainer({ header, messages, input }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Header with blur */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[var(--background)]/90 backdrop-blur-md px-4 py-3 border-b border-zinc-800/50">
        {header}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pt-20 pb-24 px-4 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages}
        </div>
      </div>

      {/* Floating Input Area - z-[60] to cover MobileNav, pb-4 for safe spacing */}
      <div className="fixed bottom-0 left-0 right-0 md:sticky bg-[var(--background)] p-4 pb-4 z-[60] border-t border-zinc-800/50 md:border-none">
        {input}
      </div>
    </div>
  );
}
